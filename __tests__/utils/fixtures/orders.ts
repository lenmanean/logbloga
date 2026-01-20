import type { Order, OrderItem } from '@/lib/types/database';
import { createTestProduct } from './products';

/**
 * Create a test order
 */
export function createTestOrder(overrides?: Partial<Order>): Order {
  return {
    id: '00000000-0000-0000-0000-000000000030',
    user_id: '00000000-0000-0000-0000-000000000001',
    order_number: 'ORD-20240101-000001',
    status: 'completed',
    total_amount: 99.99,
    subtotal: 99.99,
    tax_amount: 0,
    discount_amount: 0,
    currency: 'USD',
    stripe_payment_intent_id: 'pi_test_123',
    stripe_checkout_session_id: 'cs_test_123',
    customer_email: 'test@example.com',
    customer_name: 'Test User',
    billing_address: null,
    shipping_address: null,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  } as Order;
}

/**
 * Create a test order item
 */
export function createTestOrderItem(overrides?: Partial<OrderItem>): OrderItem {
  const product = createTestProduct();
  
  return {
    id: '00000000-0000-0000-0000-000000000040',
    order_id: '00000000-0000-0000-0000-000000000030',
    product_id: product.id,
    variant_id: null,
    product_name: product.title,
    product_sku: null,
    quantity: 1,
    unit_price: product.price,
    total_price: product.price,
    created_at: new Date().toISOString(),
    ...overrides,
  } as OrderItem;
}
