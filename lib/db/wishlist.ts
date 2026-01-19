/**
 * Wishlist database operations
 * Provides functions to manage user wishlist items
 */

import { createClient } from '@/lib/supabase/server';
import type { WishlistItem, WishlistItemWithProduct, Product } from '@/lib/types/database';

/**
 * Get user's wishlist with product data
 */
export async function getUserWishlist(userId: string): Promise<WishlistItemWithProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wishlist_items' as any)
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist:', error);
    throw new Error(`Failed to fetch wishlist: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Filter out items without products and map to typed structure
  return ((data as any[]) || [])
    .filter((item: any) => item.product)
    .map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      created_at: item.created_at,
      product: item.product as Product,
    })) as unknown as WishlistItemWithProduct[];
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(
  userId: string,
  productId: string
): Promise<WishlistItem> {
  const supabase = await createClient();

  // Check if already in wishlist
  const existing = await isInWishlist(userId, productId);
  if (existing) {
    throw new Error('Product is already in wishlist');
  }

  const { data, error } = await supabase
    .from('wishlist_items' as any)
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error(`Failed to add to wishlist: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to add to wishlist: No data returned');
  }

  return data as unknown as WishlistItem;
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('wishlist_items' as any)
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing from wishlist:', error);
    throw new Error(`Failed to remove from wishlist: ${error.message}`);
  }
}

/**
 * Check if product is in user's wishlist
 */
export async function isInWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wishlist_items' as any)
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return false;
    }
    console.error('Error checking wishlist:', error);
    throw new Error(`Failed to check wishlist: ${error.message}`);
  }

  return !!data;
}

/**
 * Get wishlist items count
 */
export async function getWishlistCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('wishlist_items' as any)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting wishlist count:', error);
    throw new Error(`Failed to get wishlist count: ${error.message}`);
  }

  return count || 0;
}

/**
 * Remove wishlist item by ID
 */
export async function removeWishlistItemById(
  userId: string,
  wishlistItemId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('wishlist_items' as any)
    .delete()
    .eq('id', wishlistItemId)
    .eq('user_id', userId); // Ensure user owns the item

  if (error) {
    console.error('Error removing wishlist item:', error);
    throw new Error(`Failed to remove wishlist item: ${error.message}`);
  }
}

