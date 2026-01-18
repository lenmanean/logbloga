/**
 * Order database operations
 * 
 * NOTE: This file contains stubs for future implementation.
 * Order functionality will be implemented in Phase 6.
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/types/database';
import type { CartItemWithProduct } from './cart';
import type { OrderWithItems } from '@/lib/types/database';

type OrderStatus = Order['status'];

/**
 * Get user's orders
 * TODO: Implement in Phase 6
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data || [];
}

/**
 * Get order by ID
 * TODO: Implement in Phase 6
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}

/**
 * Get order with items by ID
 * Fetches order and associated order items
 */
export async function getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createServiceRoleClient();

  // Fetch order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching order:', orderError);
    throw new Error(`Failed to fetch order: ${orderError.message}`);
  }

  if (!order) {
    return null;
  }

  // Fetch order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw new Error(`Failed to fetch order items: ${itemsError.message}`);
  }

  return {
    ...order,
    items: orderItems || [],
  } as OrderWithItems;
}

/**
 * Get order by order number
 * TODO: Implement in Phase 6
 */
export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}

/**
 * Create a new order
 * TODO: Implement in Phase 6 - Use service role client for admin operations
 */
export async function createOrder(orderData: {
  userId?: string;
  customerEmail: string;
  customerName?: string;
  subtotal: number;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
}): Promise<Order> {
  const supabase = await createServiceRoleClient();
  
  // Generate order number
  const { data: orderNumberData, error: orderNumberError } = await supabase
    .rpc('generate_order_number');

  if (orderNumberError) {
    console.error('Error generating order number:', orderNumberError);
    throw new Error('Failed to generate order number');
  }

  const orderNumber = orderNumberData as string;

  // Build insert data - handle nullable user_id correctly
  // Note: user_id is required in Insert type, but may be null for guest orders
  // We'll use a workaround by casting to any for now, since the schema allows nullable user_id
  const insertData: any = {
    order_number: orderNumber,
    customer_email: orderData.customerEmail,
    subtotal: orderData.subtotal,
    total_amount: orderData.totalAmount,
    tax_amount: orderData.taxAmount || 0,
    discount_amount: orderData.discountAmount || 0,
    currency: orderData.currency || 'USD',
    status: 'pending',
  };
  
  // Only include user_id if provided
  if (orderData.userId) {
    insertData.user_id = orderData.userId;
  }
  
  // Only include customer_name if provided
  if (orderData.customerName) {
    insertData.customer_name = orderData.customerName;
  }

  const { data, error } = await supabase
    .from('orders')
    .insert(insertData as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
}

/**
 * Create order with items
 * Creates an order and all associated order items in a single transaction
 */
export interface CreateOrderData {
  userId: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  couponId?: string;
  currency?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null;
}

export async function createOrderWithItems(
  orderData: CreateOrderData,
  items: CartItemWithProduct[]
): Promise<OrderWithItems> {
  const supabase = await createServiceRoleClient();

  // Generate order number
  const { data: orderNumberData, error: orderNumberError } = await supabase
    .rpc('generate_order_number');

  if (orderNumberError) {
    console.error('Error generating order number:', orderNumberError);
    throw new Error('Failed to generate order number');
  }

  const orderNumber = orderNumberData as string;

  // Build order insert data
  const orderInsertData: any = {
    order_number: orderNumber,
    user_id: orderData.userId,
    customer_email: orderData.customerEmail,
    customer_name: orderData.customerName,
    subtotal: orderData.subtotal,
    total_amount: orderData.totalAmount,
    tax_amount: orderData.taxAmount || 0,
    discount_amount: orderData.discountAmount || 0,
    currency: orderData.currency || 'USD',
    status: 'pending',
  };

  // Add billing address if provided
  if (orderData.billingAddress) {
    orderInsertData.billing_address = orderData.billingAddress;
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderInsertData)
    .select()
    .single();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    throw new Error(`Failed to create order: ${orderError?.message || 'Unknown error'}`);
  }

  // Create order items
  const orderItemsData = items.map((item) => {
    const product = item.product;
    const productName = product?.title || 'Product';
    const unitPrice = typeof product?.price === 'number'
      ? product.price
      : parseFloat(String(product?.price || 0));
    const quantity = item.quantity || 0;
    const totalPrice = unitPrice * quantity;

    return {
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      product_name: productName,
      product_sku: product?.slug || null,
      quantity,
      price: unitPrice, // Required field in schema
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)
    .select();

  if (itemsError || !orderItems) {
    console.error('Error creating order items:', itemsError);
    // Note: Order was created but items failed - this is a partial failure
    // In production, you might want to delete the order or use a transaction
    throw new Error(`Failed to create order items: ${itemsError?.message || 'Unknown error'}`);
  }

  // Return order with items
  return {
    ...order,
    items: orderItems.map(item => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
  } as OrderWithItems;
}

/**
 * Update order status
 * TODO: Implement in Phase 6
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  const supabase = await createServiceRoleClient();
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return data;
}

/**
 * Update order with Stripe payment information
 * Used after successful payment processing
 */
export async function updateOrderWithPaymentInfo(
  orderId: string,
  paymentInfo: {
    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;
    status?: Order['status'];
  }
): Promise<Order> {
  const supabase = await createServiceRoleClient();

  const updateData: any = {};

  if (paymentInfo.stripeCheckoutSessionId) {
    updateData.stripe_checkout_session_id = paymentInfo.stripeCheckoutSessionId;
  }

  if (paymentInfo.stripePaymentIntentId) {
    updateData.stripe_payment_intent_id = paymentInfo.stripePaymentIntentId;
  }

  if (paymentInfo.status) {
    updateData.status = paymentInfo.status;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order with payment info:', error);
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return data;
}

/**
 * Get order by Stripe checkout session ID
 */
export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching order by session ID:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}

