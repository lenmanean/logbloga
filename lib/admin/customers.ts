/**
 * Admin customer management functions
 * Provides admin-specific customer operations using service role client
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types/database';
import { getUserOrders } from '@/lib/db/orders';
import { getUserProductAccess } from '@/lib/db/access';

export interface AdminCustomerFilters {
  search?: string; // Email or name
  role?: 'user' | 'admin';
}

/**
 * Get all customers (admin only)
 */
export async function getAllCustomers(filters?: AdminCustomerFilters): Promise<Profile[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('profiles')
    .select('*');

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.search) {
    query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }

  return data || [];
}

/**
 * Get customer by ID with full details (admin)
 */
export async function getCustomerByIdAdmin(userId: string): Promise<Profile | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching customer:', error);
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }

  return data;
}

/**
 * Get customer statistics
 */
export async function getCustomerStats(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  purchasedProducts: number;
}> {
  const [orders, products] = await Promise.all([
    getUserOrders(userId),
    getUserProductAccess(userId),
  ]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => {
    const amount = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    return sum + amount;
  }, 0);
  const purchasedProducts = products.length;

  return {
    totalOrders,
    totalSpent,
    purchasedProducts,
  };
}

/**
 * Update customer profile (admin)
 */
export async function updateCustomerAdmin(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer:', error);
    throw new Error(`Failed to update customer: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update customer: No data returned');
  }

  return data;
}

