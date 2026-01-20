import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateCartTotal,
  calculateCartItemCount,
  formatCartForStorage,
  parseStoredCart,
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
  mergeCartItems,
  validateCartItem,
} from '@/lib/cart/utils';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';
import { createTestProduct } from '@/__tests__/utils/fixtures/products';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Cart Utils', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('calculateCartTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateCartTotal([])).toBe(0);
    });

    it('should calculate total for single item', () => {
      const item = createTestCartItem({ quantity: 1 });
      item.product.price = 99.99;
      expect(calculateCartTotal([item])).toBe(99.99);
    });

    it('should calculate total for multiple items', () => {
      const item1 = createTestCartItem({ quantity: 2 });
      item1.product.price = 50;
      const item2 = createTestCartItem({ quantity: 1 });
      item2.product.price = 30;
      expect(calculateCartTotal([item1, item2])).toBe(130);
    });

    it('should handle string prices', () => {
      const item = createTestCartItem({ quantity: 1 });
      item.product.price = '99.99' as any;
      expect(calculateCartTotal([item])).toBe(99.99);
    });
  });

  describe('calculateCartItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateCartItemCount([])).toBe(0);
    });

    it('should count single item', () => {
      const item = createTestCartItem({ quantity: 1 });
      expect(calculateCartItemCount([item])).toBe(1);
    });

    it('should sum quantities for multiple items', () => {
      const item1 = createTestCartItem({ quantity: 2 });
      const item2 = createTestCartItem({ quantity: 3 });
      expect(calculateCartItemCount([item1, item2])).toBe(5);
    });
  });

  describe('formatCartForStorage', () => {
    it('should format cart items for storage', () => {
      const items = [
        { productId: 'prod1', quantity: 1 },
        { productId: 'prod2', quantity: 2, variantId: 'var1' },
      ];
      const formatted = formatCartForStorage(items);
      const parsed = JSON.parse(formatted);
      
      expect(parsed.items).toHaveLength(2);
      expect(parsed.items[0].productId).toBe('prod1');
      expect(parsed.items[0].quantity).toBe(1);
      expect(parsed.items[1].variantId).toBe('var1');
    });
  });

  describe('parseStoredCart', () => {
    it('should return empty cart for null input', () => {
      expect(parseStoredCart(null)).toEqual({ items: [] });
    });

    it('should parse valid cart data', () => {
      const cart = {
        items: [
          { productId: 'prod1', quantity: 1, addedAt: new Date().toISOString() },
        ],
      };
      const parsed = parseStoredCart(JSON.stringify(cart));
      expect(parsed.items).toHaveLength(1);
    });

    it('should filter invalid items', () => {
      const cart = {
        items: [
          { productId: 'prod1', quantity: 1, addedAt: new Date().toISOString() },
          { productId: 'prod2', quantity: 0 }, // Invalid: quantity 0
          { productId: 'prod3', quantity: 11 }, // Invalid: quantity > 10
          { quantity: 1 }, // Invalid: missing productId
        ],
      };
      const parsed = parseStoredCart(JSON.stringify(cart));
      expect(parsed.items).toHaveLength(1);
    });

    it('should limit cart size to MAX_GUEST_CART_SIZE', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({
        productId: `prod${i}`,
        quantity: 1,
        addedAt: new Date().toISOString(),
      }));
      const cart = { items };
      const parsed = parseStoredCart(JSON.stringify(cart));
      expect(parsed.items).toHaveLength(20); // MAX_GUEST_CART_SIZE
    });

    it('should return empty cart for invalid JSON', () => {
      expect(parseStoredCart('invalid json')).toEqual({ items: [] });
    });
  });

  describe('getGuestCart', () => {
    it('should return empty cart when localStorage is empty', () => {
      expect(getGuestCart()).toEqual({ items: [] });
    });

    it('should retrieve cart from localStorage', () => {
      const cart = {
        items: [
          { productId: 'prod1', quantity: 1, addedAt: new Date().toISOString() },
        ],
      };
      localStorageMock.setItem('guest_cart', JSON.stringify(cart));
      expect(getGuestCart().items).toHaveLength(1);
    });
  });

  describe('saveGuestCart', () => {
    it('should save cart to localStorage', () => {
      const cart = {
        items: [
          { productId: 'prod1', quantity: 1, addedAt: new Date().toISOString() },
        ],
      };
      saveGuestCart(cart);
      const stored = localStorageMock.getItem('guest_cart');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).items).toHaveLength(1);
    });

    it('should limit cart size when saving', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({
        productId: `prod${i}`,
        quantity: 1,
        addedAt: new Date().toISOString(),
      }));
      const cart = { items };
      saveGuestCart(cart);
      const stored = localStorageMock.getItem('guest_cart');
      expect(JSON.parse(stored!).items).toHaveLength(20);
    });
  });

  describe('clearGuestCart', () => {
    it('should remove cart from localStorage', () => {
      const cart = {
        items: [
          { productId: 'prod1', quantity: 1, addedAt: new Date().toISOString() },
        ],
      };
      saveGuestCart(cart);
      clearGuestCart();
      expect(localStorageMock.getItem('guest_cart')).toBeNull();
    });
  });

  describe('mergeCartItems', () => {
    it('should add new items that do not exist', () => {
      const existing: any[] = [];
      const newItems = [
        { productId: 'prod1', quantity: 1 },
      ];
      const merged = mergeCartItems(existing, newItems);
      expect(merged).toHaveLength(1);
      expect(merged[0].isUpdate).toBe(false);
    });

    it('should merge quantities for existing items', () => {
      const existing = [
        { id: 'cart1', product_id: 'prod1', variant_id: null, quantity: 2 },
      ];
      const newItems = [
        { productId: 'prod1', quantity: 3 },
      ];
      const merged = mergeCartItems(existing, newItems);
      expect(merged).toHaveLength(1);
      expect(merged[0].isUpdate).toBe(true);
      expect(merged[0].quantity).toBe(5);
      expect(merged[0].existingCartItemId).toBe('cart1');
    });

    it('should cap merged quantity at 10', () => {
      const existing = [
        { id: 'cart1', product_id: 'prod1', variant_id: null, quantity: 8 },
      ];
      const newItems = [
        { productId: 'prod1', quantity: 5 },
      ];
      const merged = mergeCartItems(existing, newItems);
      expect(merged[0].quantity).toBe(10);
    });

    it('should handle variant matching', () => {
      const existing = [
        { id: 'cart1', product_id: 'prod1', variant_id: 'var1', quantity: 1 },
      ];
      const newItems = [
        { productId: 'prod1', quantity: 2, variantId: 'var1' },
      ];
      const merged = mergeCartItems(existing, newItems);
      expect(merged[0].isUpdate).toBe(true);
    });
  });

  describe('validateCartItem', () => {
    it('should validate valid cart item', () => {
      const product = createTestProduct({ active: true });
      expect(validateCartItem(product, 1)).toEqual({ valid: true });
    });

    it('should reject null product', () => {
      expect(validateCartItem(null, 1)).toEqual({
        valid: false,
        error: 'Product not found',
      });
    });

    it('should reject inactive product', () => {
      const product = createTestProduct({ active: false });
      expect(validateCartItem(product, 1)).toEqual({
        valid: false,
        error: 'Product is no longer available',
      });
    });

    it('should reject zero quantity', () => {
      const product = createTestProduct({ active: true });
      expect(validateCartItem(product, 0)).toEqual({
        valid: false,
        error: 'Quantity must be greater than 0',
      });
    });

    it('should reject negative quantity', () => {
      const product = createTestProduct({ active: true });
      expect(validateCartItem(product, -1)).toEqual({
        valid: false,
        error: 'Quantity must be greater than 0',
      });
    });

    it('should reject quantity greater than 10', () => {
      const product = createTestProduct({ active: true });
      expect(validateCartItem(product, 11)).toEqual({
        valid: false,
        error: 'Maximum quantity is 10 per item',
      });
    });
  });
});
