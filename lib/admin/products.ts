/**
 * Admin product management functions
 * Provides admin-specific product operations using service role client
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types/database';

export interface AdminProductFilters {
  category?: string;
  active?: boolean;
  featured?: boolean;
  search?: string;
}

/**
 * Get all products including inactive (admin only)
 */
export async function getAllProductsAdmin(filters?: AdminProductFilters): Promise<Product[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('products')
    .select('*');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active);
  }

  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data || [];
}

/**
 * Get product by ID including inactive (admin)
 */
export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data;
}

/**
 * Create product (admin)
 */
export async function createProductAdmin(productData: Partial<Product>): Promise<Product> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create product: No data returned');
  }

  return data;
}

/**
 * Update product (admin)
 */
export async function updateProductAdmin(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update product: No data returned');
  }

  return data;
}

/**
 * Delete product (admin)
 * Note: This is a soft delete (sets active = false) to preserve order history
 */
export async function deleteProductAdmin(id: string): Promise<void> {
  const supabase = await createServiceRoleClient();

  // Soft delete by setting active = false
  const { error } = await supabase
    .from('products')
    .update({
      active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

