/**
 * Order database operations
 * 
 * NOTE: This file contains stubs for future implementation.
 * Order functionality will be implemented in Phase 6.
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/types/database';

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

