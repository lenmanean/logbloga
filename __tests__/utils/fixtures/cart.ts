import type { CartItemWithProduct } from '@/lib/db/cart';
import { createTestProduct } from './products';

/**
 * Create a test cart item
 */
export function createTestCartItem(
  overrides?: Partial<CartItemWithProduct>
): CartItemWithProduct {
  const product = overrides?.product || createTestProduct();
  
  return {
    id: '00000000-0000-0000-0000-000000000020',
    user_id: '00000000-0000-0000-0000-000000000001',
    product_id: product.id,
    variant_id: null,
    quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product,
    ...overrides,
  } as CartItemWithProduct;
}

/**
 * Create multiple test cart items
 */
export function createTestCartItems(count: number = 2): CartItemWithProduct[] {
  return Array.from({ length: count }, (_, i) =>
    createTestCartItem({
      id: `00000000-0000-0000-0000-${String(i + 20).padStart(12, '0')}`,
      quantity: i + 1,
    })
  );
}
