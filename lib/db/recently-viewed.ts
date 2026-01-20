/**
 * Recently viewed products database operations
 * Provides functions for tracking and retrieving recently viewed products
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types/database';
import { getProductById } from './products';

export interface RecentlyViewedProduct {
  id: string;
  user_id: string | null;
  product_id: string;
  session_id: string | null;
  viewed_at: string;
  created_at: string;
}

/**
 * Track a product view
 * Creates or updates a recently viewed entry
 * 
 * @param userId - User ID if authenticated, null for guests
 * @param productId - Product ID that was viewed
 * @param sessionId - Session ID for guest users
 */
export async function trackProductView(
  userId: string | null,
  productId: string,
  sessionId?: string
): Promise<void> {
  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId must be provided');
  }

  const supabase = await createServiceRoleClient();

  // Verify product exists
  const product = await getProductById(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  // Prepare insert data
  const insertData: any = {
    product_id: productId,
  };

  if (userId) {
    insertData.user_id = userId;
  } else if (sessionId) {
    insertData.session_id = sessionId;
  }

  // Insert (trigger will update viewed_at if duplicate exists)
  const { error } = await supabase
    .from('recently_viewed_products' as any)
    .insert(insertData);

  if (error) {
    // If it's a unique constraint violation, the trigger should have handled it
    // But we'll log it anyway
    if (error.code === '23505') {
      // Unique constraint violation - trigger should have updated, but log it
      console.warn('Duplicate recently viewed entry (should have been handled by trigger):', error);
      return;
    }
    console.error('Error tracking product view:', error);
    throw new Error(`Failed to track product view: ${error.message}`);
  }
}

/**
 * Get recently viewed products for a user
 * 
 * @param userId - User ID
 * @param limit - Maximum number of products to return (default: 10)
 * @returns Array of products sorted by most recently viewed
 */
export async function getRecentlyViewed(
  userId: string,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createClient();

  // Fetch recently viewed entries
  const { data: recentlyViewed, error } = await supabase
    .from('recently_viewed_products' as any)
    .select('product_id')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recently viewed products:', error);
    throw new Error(`Failed to fetch recently viewed products: ${error.message}`);
  }

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return [];
  }

  // Fetch product details for each recently viewed product
  const productIds = (recentlyViewed as any[]).map((entry: any) => entry.product_id);
  const products: Product[] = [];

  for (const productId of productIds) {
    try {
      const product = await getProductById(productId);
      if (product && product.active) {
        products.push(product);
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      // Continue with other products even if one fails
    }
  }

  return products;
}

/**
 * Get recently viewed products for a guest session
 * 
 * @param sessionId - Session ID
 * @param limit - Maximum number of products to return (default: 10)
 * @returns Array of products sorted by most recently viewed
 */
export async function getRecentlyViewedBySession(
  sessionId: string,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createServiceRoleClient();

  // Fetch recently viewed entries
  const { data: recentlyViewed, error } = await supabase
    .from('recently_viewed_products' as any)
    .select('product_id')
    .eq('session_id', sessionId)
    .order('viewed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recently viewed products by session:', error);
    throw new Error(`Failed to fetch recently viewed products: ${error.message}`);
  }

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return [];
  }

  // Fetch product details for each recently viewed product
  const productIds = (recentlyViewed as any[]).map((entry: any) => entry.product_id);
  const products: Product[] = [];

  for (const productId of productIds) {
    try {
      const product = await getProductById(productId);
      if (product && product.active) {
        products.push(product);
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      // Continue with other products even if one fails
    }
  }

  return products;
}

/**
 * Clean up old recently viewed entries
 * Keeps only the most recent N entries per user/session
 * 
 * @param userId - User ID (optional, if provided, cleans up for user)
 * @param sessionId - Session ID (optional, if provided, cleans up for session)
 * @param keepCount - Number of recent entries to keep (default: 50)
 */
export async function cleanupOldRecentlyViewed(
  userId?: string,
  sessionId?: string,
  keepCount: number = 50
): Promise<void> {
  const supabase = await createServiceRoleClient();

  if (userId) {
    // Get IDs of entries to keep
    const { data: keepEntries } = await supabase
      .from('recently_viewed_products' as any)
      .select('id')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(keepCount);

    if (keepEntries && keepEntries.length > 0) {
      const keepIds = (keepEntries as any[]).map((e: any) => e.id);

      // Delete entries not in the keep list
      const { error } = await supabase
        .from('recently_viewed_products' as any)
        .delete()
        .eq('user_id', userId)
        .not('id', 'in', `(${keepIds.join(',')})`);

      if (error) {
        console.error('Error cleaning up recently viewed for user:', error);
      }
    }
  } else if (sessionId) {
    // Get IDs of entries to keep
    const { data: keepEntries } = await supabase
      .from('recently_viewed_products' as any)
      .select('id')
      .eq('session_id', sessionId)
      .order('viewed_at', { ascending: false })
      .limit(keepCount);

    if (keepEntries && keepEntries.length > 0) {
      const keepIds = (keepEntries as any[]).map((e: any) => e.id);

      // Delete entries not in the keep list
      const { error } = await supabase
        .from('recently_viewed_products' as any)
        .delete()
        .eq('session_id', sessionId)
        .not('id', 'in', `(${keepIds.join(',')})`);

      if (error) {
        console.error('Error cleaning up recently viewed for session:', error);
      }
    }
  }
}
