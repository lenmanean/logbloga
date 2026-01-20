import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  calculateOrderTotals,
} from '@/lib/checkout/calculations';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';
import type { Coupon } from '@/lib/types/database';

describe('Checkout Calculations', () => {
  describe('calculateSubtotal', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should calculate subtotal for single item', () => {
      const item = createTestCartItem({ quantity: 1 });
      item.product.price = 99.99;
      expect(calculateSubtotal([item])).toBe(99.99);
    });

    it('should calculate subtotal for multiple items', () => {
      const item1 = createTestCartItem({ quantity: 2 });
      item1.product.price = 50;
      const item2 = createTestCartItem({ quantity: 1 });
      item2.product.price = 30;
      expect(calculateSubtotal([item1, item2])).toBe(130);
    });

    it('should handle items with quantity 0', () => {
      const item = createTestCartItem({ quantity: 0 });
      item.product.price = 99.99;
      expect(calculateSubtotal([item])).toBe(0);
    });
  });

  describe('calculateDiscount', () => {
    it('should return 0 when no coupon provided', () => {
      expect(calculateDiscount(100)).toBe(0);
      expect(calculateDiscount(100, null)).toBe(0);
      expect(calculateDiscount(100, undefined)).toBe(0);
    });

    it('should calculate percentage discount', () => {
      const coupon: Coupon = {
        id: 'test',
        code: 'TEST10',
        type: 'percentage',
        value: 10,
        minimum_purchase: null,
        maximum_discount: null,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };
      expect(calculateDiscount(100, coupon)).toBe(10);
    });

    it('should apply maximum discount limit for percentage', () => {
      const coupon: Coupon = {
        id: 'test',
        code: 'TEST50',
        type: 'percentage',
        value: 50,
        minimum_purchase: null,
        maximum_discount: 20,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };
      // 50% of 100 = 50, but max is 20
      expect(calculateDiscount(100, coupon)).toBe(20);
    });

    it('should calculate fixed amount discount', () => {
      const coupon: Coupon = {
        id: 'test',
        code: 'SAVE20',
        type: 'fixed_amount',
        value: 20,
        minimum_purchase: null,
        maximum_discount: null,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };
      expect(calculateDiscount(100, coupon)).toBe(20);
    });

    it('should not discount more than subtotal for fixed amount', () => {
      const coupon: Coupon = {
        id: 'test',
        code: 'SAVE200',
        type: 'fixed_amount',
        value: 200,
        minimum_purchase: null,
        maximum_discount: null,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };
      // Discount is 200 but subtotal is only 100
      expect(calculateDiscount(100, coupon)).toBe(100);
    });

    it('should round discount to 2 decimal places', () => {
      const coupon: Coupon = {
        id: 'test',
        code: 'TEST33',
        type: 'percentage',
        value: 33.333,
        minimum_purchase: null,
        maximum_discount: null,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };
      const discount = calculateDiscount(100, coupon);
      expect(discount).toBeCloseTo(33.33, 2);
    });
  });

  describe('calculateTax', () => {
    it('should return 0 for digital products', () => {
      expect(calculateTax(100, 0)).toBe(0);
      expect(calculateTax(100, 10)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      expect(calculateTotal(100, 10, 0)).toBe(90);
    });

    it('should handle zero subtotal', () => {
      expect(calculateTotal(0, 0, 0)).toBe(0);
    });

    it('should not return negative total', () => {
      // If discount is more than subtotal, total should be 0
      expect(calculateTotal(50, 100, 0)).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const total = calculateTotal(99.999, 10, 0);
      // 99.999 - 10 = 89.999, rounded to 2 decimals = 90.00
      expect(total).toBe(90);
    });
  });

  describe('calculateOrderTotals', () => {
    it('should calculate complete order totals', () => {
      const item1 = createTestCartItem({ quantity: 1 });
      item1.product.price = 50;
      const item2 = createTestCartItem({ quantity: 2 });
      item2.product.price = 25;

      const coupon: Coupon = {
        id: 'test',
        code: 'SAVE10',
        type: 'fixed_amount',
        value: 10,
        minimum_purchase: null,
        maximum_discount: null,
        valid_from: null,
        valid_until: null,
        usage_limit: null,
        usage_count: 0,
        active: true,
        applies_to: null,
        created_at: new Date().toISOString(),
      };

      const totals = calculateOrderTotals([item1, item2], coupon);

      expect(totals.subtotal).toBe(100); // 50 + (25 * 2)
      expect(totals.discountAmount).toBe(10);
      expect(totals.taxAmount).toBe(0);
      expect(totals.total).toBe(90);
    });

    it('should handle order without coupon', () => {
      const item = createTestCartItem({ quantity: 1 });
      item.product.price = 99.99;

      const totals = calculateOrderTotals([item]);

      expect(totals.subtotal).toBe(99.99);
      expect(totals.discountAmount).toBe(0);
      expect(totals.taxAmount).toBe(0);
      expect(totals.total).toBe(99.99);
    });
  });
});
