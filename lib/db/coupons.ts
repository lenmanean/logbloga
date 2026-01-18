/**
 * Coupon database operations
 * Provides type-safe functions for validating and applying coupons
 */

import { createClient } from '@/lib/supabase/server';
import type { Coupon } from '@/lib/types/database';

export interface CouponValidationResult {
  valid: boolean;
  coupon: Coupon | null;
  error?: string;
}

export interface CouponDiscount {
  discountAmount: number;
  finalTotal: number;
}

/**
 * Validate a coupon code
 * Checks if the coupon exists, is active, within validity dates, and meets all requirements
 */
export async function validateCoupon(
  code: string,
  cartTotal: number,
  productIds?: string[]
): Promise<CouponValidationResult> {
  const supabase = await createClient();

  // Normalize code to uppercase
  const normalizedCode = code.trim().toUpperCase();

  // Fetch coupon by code
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', normalizedCode)
    .single();

  if (error || !coupon) {
    return {
      valid: false,
      coupon: null,
      error: 'Invalid coupon code',
    };
  }

  // Check if coupon is active
  if (!coupon.active) {
    return {
      valid: false,
      coupon,
      error: 'This coupon is no longer active',
    };
  }

  // Check validity dates
  const now = new Date();
  
  if (coupon.valid_from) {
    const validFrom = new Date(coupon.valid_from);
    if (now < validFrom) {
      return {
        valid: false,
        coupon,
        error: 'This coupon is not yet valid',
      };
    }
  }

  if (coupon.valid_until) {
    const validUntil = new Date(coupon.valid_until);
    if (now > validUntil) {
      return {
        valid: false,
        coupon,
        error: 'This coupon has expired',
      };
    }
  }

  // Check minimum purchase requirement
  if (coupon.minimum_purchase && cartTotal < coupon.minimum_purchase) {
    return {
      valid: false,
      coupon,
      error: `Minimum purchase of $${coupon.minimum_purchase.toFixed(2)} required`,
    };
  }

  // Check usage limit
  if (coupon.usage_limit !== null && coupon.usage_count !== null) {
    if (coupon.usage_count >= coupon.usage_limit) {
      return {
        valid: false,
        coupon,
        error: 'This coupon has reached its usage limit',
      };
    }
  }

  // Check product restrictions (applies_to)
  if (coupon.applies_to && Array.isArray(coupon.applies_to) && coupon.applies_to.length > 0) {
    if (!productIds || productIds.length === 0) {
      return {
        valid: false,
        coupon,
        error: 'This coupon cannot be applied to your cart',
      };
    }

    // Check if at least one product in cart matches the coupon's applies_to list
    const appliesToProductIds = coupon.applies_to as string[];
    const hasMatchingProduct = productIds.some(id => appliesToProductIds.includes(id));

    if (!hasMatchingProduct) {
      return {
        valid: false,
        coupon,
        error: 'This coupon cannot be applied to the items in your cart',
      };
    }
  }

  return {
    valid: true,
    coupon,
  };
}

/**
 * Apply coupon discount to cart total
 * Calculates discount amount based on coupon type (percentage or fixed_amount)
 */
export function applyCoupon(coupon: Coupon, cartTotal: number): CouponDiscount {
  let discountAmount = 0;

  if (coupon.type === 'percentage') {
    // Percentage discount
    discountAmount = (cartTotal * coupon.value) / 100;

    // Apply maximum discount limit if specified
    if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
      discountAmount = coupon.maximum_discount;
    }
  } else if (coupon.type === 'fixed_amount') {
    // Fixed amount discount
    discountAmount = coupon.value;

    // Don't discount more than the cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }
  }

  // Ensure discount is not negative
  discountAmount = Math.max(0, discountAmount);

  // Round to 2 decimal places
  discountAmount = Math.round(discountAmount * 100) / 100;

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    discountAmount,
    finalTotal: Math.round(finalTotal * 100) / 100,
  };
}

