/**
 * Coupon calculation utilities
 * Pure functions for calculating discounts (client-safe)
 */

import type { Coupon } from '@/lib/types/database';

export interface CouponDiscount {
  discountAmount: number;
  finalTotal: number;
}

/**
 * Apply coupon discount to cart total
 * Calculates discount amount based on coupon type (percentage or fixed_amount)
 * This is a pure function that can be used in both client and server components
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
