/**
 * Coupon database operations
 * Provides type-safe functions for validating and applying coupons
 */

import { createClient } from '@/lib/supabase/server';
import type { Coupon } from '@/lib/types/database';
import { applyCoupon, type CouponDiscount } from '@/lib/coupons/utils';

export interface CouponValidationResult {
  valid: boolean;
  coupon: Coupon | null;
  error?: string;
}

// Re-export for backward compatibility
export type { CouponDiscount };

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

// Re-export applyCoupon for backward compatibility
// The actual implementation is in lib/coupons/utils.ts (client-safe)
export { applyCoupon };

