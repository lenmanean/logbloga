/**
 * Cart utility functions
 * Helper functions for cart calculations, localStorage operations, and cart merging
 */

import type { CartItem, CartItemWithProduct, Product } from '@/lib/types/database';

export interface GuestCartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
}

const GUEST_CART_KEY = 'guest_cart';
const MAX_GUEST_CART_SIZE = 20;

/**
 * Calculate cart subtotal from items
 */
export function calculateCartTotal(items: CartItemWithProduct[]): number {
  return items.reduce((total, item) => {
    const price = typeof item.product?.price === 'number' 
      ? item.product.price 
      : parseFloat(String(item.product?.price || 0));
    return total + (price * (item.quantity || 0));
  }, 0);
}

/**
 * Calculate total item count (sum of quantities)
 */
export function calculateCartItemCount(items: CartItemWithProduct[]): number {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

/**
 * Format cart items for localStorage storage (guest cart)
 */
export function formatCartForStorage(items: Array<{ productId: string; quantity: number; variantId?: string }>): string {
  const guestCart: GuestCart = {
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      variantId: item.variantId,
      addedAt: new Date().toISOString(),
    })),
  };
  return JSON.stringify(guestCart);
}

/**
 * Parse stored cart from localStorage
 */
export function parseStoredCart(data: string | null): GuestCart {
  if (!data) {
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(data) as GuestCart;
    
    // Validate structure
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] };
    }

    // Validate and sanitize items
    const validItems = parsed.items
      .filter((item): item is GuestCartItem => {
        return (
          typeof item.productId === 'string' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0 &&
          item.quantity <= 10 &&
          (!item.variantId || typeof item.variantId === 'string')
        );
      })
      .slice(0, MAX_GUEST_CART_SIZE); // Limit cart size

    return { items: validItems };
  } catch (error) {
    console.error('Error parsing stored cart:', error);
    return { items: [] };
  }
}

/**
 * Get guest cart from localStorage
 */
export function getGuestCart(): GuestCart {
  if (typeof window === 'undefined') {
    return { items: [] };
  }

  const stored = localStorage.getItem(GUEST_CART_KEY);
  return parseStoredCart(stored);
}

/**
 * Save guest cart to localStorage
 */
export function saveGuestCart(cart: GuestCart): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Limit cart size
  const limitedCart: GuestCart = {
    items: cart.items.slice(0, MAX_GUEST_CART_SIZE),
  };

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(limitedCart));
}

/**
 * Clear guest cart from localStorage
 */
export function clearGuestCart(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(GUEST_CART_KEY);
}

/**
 * Merge cart items (for syncing guest cart to database)
 * Combines quantities if same product + variant exists
 */
export function mergeCartItems(
  existing: Array<{ id: string; product_id: string; variant_id: string | null; quantity: number }>,
  newItems: GuestCartItem[]
): Array<{ productId: string; quantity: number; variantId?: string; isUpdate: boolean; existingCartItemId?: string }> {
  const mergeResult: Array<{ productId: string; quantity: number; variantId?: string; isUpdate: boolean; existingCartItemId?: string }> = [];

  for (const newItem of newItems) {
    const variantId = newItem.variantId || null;
    const existingItem = existing.find(
      item => item.product_id === newItem.productId && item.variant_id === variantId
    );

    if (existingItem) {
      // Merge quantities (add together, max 10)
      const mergedQuantity = Math.min((existingItem.quantity || 0) + newItem.quantity, 10);
      mergeResult.push({
        productId: newItem.productId,
        quantity: mergedQuantity,
        variantId: newItem.variantId,
        isUpdate: true,
        existingCartItemId: existingItem.id,
      });
    } else {
      // New item to add
      mergeResult.push({
        productId: newItem.productId,
        quantity: newItem.quantity,
        variantId: newItem.variantId,
        isUpdate: false,
      });
    }
  }

  return mergeResult;
}

/**
 * Validate cart item before adding
 */
export function validateCartItem(product: Product | null, quantity: number): { valid: boolean; error?: string } {
  if (!product) {
    return { valid: false, error: 'Product not found' };
  }

  if (!product.active) {
    return { valid: false, error: 'Product is no longer available' };
  }

  if (quantity <= 0) {
    return { valid: false, error: 'Quantity must be greater than 0' };
  }

  if (quantity > 10) {
    return { valid: false, error: 'Maximum quantity is 10 per item' };
  }

  return { valid: true };
}

