/**
 * Checkout calculation utilities
 * Functions for calculating order totals, discounts, and taxes
 */

import type { CartItemWithProduct } from '@/lib/db/cart';
import type { Coupon } from '@/lib/types/database';
import { calculateCartTotal } from '@/lib/cart/utils';

export interface OrderTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartItemWithProduct[]): number {
  return calculateCartTotal(items);
}

/**
 * Calculate discount amount from coupon
 * Note: This is a helper that uses the coupon's applyCoupon function logic
 * For actual discount calculation with coupon, use the coupon's applyCoupon function
 */
export function calculateDiscount(subtotal: number, coupon?: Coupon | null): number {
  if (!coupon) {
    return 0;
  }

  let discountAmount = 0;

  if (coupon.type === 'percentage') {
    // Percentage discount
    discountAmount = (subtotal * coupon.value) / 100;

    // Apply maximum discount limit if specified
    if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
      discountAmount = coupon.maximum_discount;
    }
  } else if (coupon.type === 'fixed_amount') {
    // Fixed amount discount
    discountAmount = coupon.value;

    // Don't discount more than the subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }
  }

  // Ensure discount is not negative
  discountAmount = Math.max(0, discountAmount);

  // Round to 2 decimal places
  return Math.round(discountAmount * 100) / 100;
}

/**
 * Calculate tax amount
 * For digital products, tax is typically 0, but this can be extended
 * for different tax rules (by location, product type, etc.)
 */
export function calculateTax(subtotal: number, discountAmount: number): number {
  // For digital products, no tax is applied by default
  // This can be extended to calculate tax based on:
  // - Customer location (state/country)
  // - Product type
  // - Tax rules
  
  // Calculate tax on the discounted amount
  const taxableAmount = subtotal - discountAmount;
  
  // Return 0 for now (digital products)
  return 0;
}

/**
 * Calculate final total
 */
export function calculateTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number
): number {
  const total = subtotal - discountAmount + taxAmount;
  
  // Ensure total is not negative
  const finalTotal = Math.max(0, total);
  
  // Round to 2 decimal places
  return Math.round(finalTotal * 100) / 100;
}

/**
 * Calculate comprehensive order totals
 * This is the main function to use for checkout calculations
 */
export function calculateOrderTotals(
  items: CartItemWithProduct[],
  coupon?: Coupon | null
): OrderTotals {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, coupon);
  const taxAmount = calculateTax(subtotal, discountAmount);
  const total = calculateTotal(subtotal, discountAmount, taxAmount);

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

