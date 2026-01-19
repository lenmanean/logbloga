/**
 * Admin order management functions
 * Provides admin-specific order operations using service role client
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { Order, OrderWithItems } from '@/lib/types/database';
import { createNotification } from '@/lib/db/notifications-db';

export interface AdminOrderFilters {
  status?: Order['status'];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string; // Order number or customer email
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(filters?: AdminOrderFilters): Promise<Order[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('orders')
    .select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  if (filters?.search) {
    query = query.or(`order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data || [];
}

/**
 * Get order with items (admin)
 */
export async function getAdminOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
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
    items: (orderItems || []).map(item => ({
      id: item.id,
      product_id: item.product_id || '',
      product_name: item.product_name || '',
      product_sku: item.product_sku || null,
      quantity: item.quantity,
      unit_price: typeof item.unit_price === 'number' ? item.unit_price : parseFloat(String(item.unit_price || 0)),
      total_price: typeof item.total_price === 'number' ? item.total_price : parseFloat(String(item.total_price || item.price || 0)),
    })),
  };
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  const supabase = await createServiceRoleClient();

  // Get order before update to check user_id and previous status
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('user_id, order_number, status')
    .eq('id', orderId)
    .single();

  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update order status: No data returned');
  }

  // Create notification for status change (non-blocking)
  if (existingOrder?.user_id && existingOrder.status !== status) {
    try {
      await createNotification({
        user_id: existingOrder.user_id,
        type: 'order_status_update',
        title: 'Order Status Updated',
        message: `Your order #${existingOrder.order_number || 'N/A'} status has been updated to ${status}.`,
        link: `/account/orders/${orderId}`,
        metadata: { orderId, previousStatus: existingOrder.status, newStatus: status },
      });
    } catch (error) {
      console.error('Error creating order status update notification:', error);
    }
  }

  return data;
}

/**
 * Get order statistics
 */
export async function getOrderStatistics(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  totalRevenue: number;
  averageOrderValue: number;
}> {
  const supabase = await createServiceRoleClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('status, total_amount');

  if (error) {
    console.error('Error fetching order statistics:', error);
    throw new Error(`Failed to fetch order statistics: ${error.message}`);
  }

  const total = orders?.length || 0;
  const byStatus: Record<string, number> = {};
  let totalRevenue = 0;

  orders?.forEach((order) => {
    const status = order.status || 'unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;

    const amount = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    totalRevenue += amount;
  });

  const averageOrderValue = total > 0 ? totalRevenue / total : 0;

  return {
    total,
    byStatus,
    totalRevenue,
    averageOrderValue,
  };
}

