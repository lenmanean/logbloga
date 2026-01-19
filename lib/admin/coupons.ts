/**
 * Admin coupon management functions
 * Provides admin-specific coupon operations using service role client
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { Coupon } from '@/lib/types/database';

export interface AdminCouponFilters {
  active?: boolean;
  type?: string; // 'percentage' | 'fixed_amount'
  search?: string;
}

/**
 * Get all coupons (admin only)
 */
export async function getAllCoupons(filters?: AdminCouponFilters): Promise<Coupon[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('coupons')
    .select('*');

  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.search) {
    query = query.ilike('code', `%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching coupons:', error);
    throw new Error(`Failed to fetch coupons: ${error.message}`);
  }

  return data || [];
}

/**
 * Get coupon by ID (admin)
 */
export async function getCouponByIdAdmin(id: string): Promise<Coupon | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching coupon:', error);
    throw new Error(`Failed to fetch coupon: ${error.message}`);
  }

  return data;
}

/**
 * Create coupon (admin)
 */
export async function createCouponAdmin(couponData: Partial<Coupon>): Promise<Coupon> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      ...couponData,
      code: couponData.code?.toUpperCase().trim(),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating coupon:', error);
    throw new Error(`Failed to create coupon: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create coupon: No data returned');
  }

  return data;
}

/**
 * Update coupon (admin)
 */
export async function updateCouponAdmin(
  id: string,
  updates: Partial<Coupon>
): Promise<Coupon> {
  const supabase = await createServiceRoleClient();

  const updateData: any = { ...updates };
  if (updates.code) {
    updateData.code = updates.code.toUpperCase().trim();
  }

  const { data, error } = await supabase
    .from('coupons')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating coupon:', error);
    throw new Error(`Failed to update coupon: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update coupon: No data returned');
  }

  return data;
}

/**
 * Delete coupon (admin)
 */
export async function deleteCouponAdmin(id: string): Promise<void> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting coupon:', error);
    throw new Error(`Failed to delete coupon: ${error.message}`);
  }
}

