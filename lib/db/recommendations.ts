/**
 * Recommendation database operations
 * Provides functions to fetch product recommendations from the database
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { Product, ProductRecommendation } from '@/lib/types/database';
import { getProductById } from './products';

export type RecommendationType = 'upsell' | 'cross-sell' | 'related';

/**
 * Get recommendations for a specific product from the product_recommendations table
 */
export async function getRecommendationsByProduct(
  productId: string,
  type?: RecommendationType,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('product_recommendations')
    .select('recommended_product_id, priority, recommendation_type')
    .eq('product_id', productId)
    .eq('active', true);

  if (type) {
    query = query.eq('recommendation_type', type);
  }

  query = query.order('priority', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: recommendations, error } = await query;

  if (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error(`Failed to fetch recommendations: ${error.message}`);
  }

  if (!recommendations || recommendations.length === 0) {
    return [];
  }

  // Fetch the actual product details for each recommended product
  const productIds = recommendations.map((rec) => rec.recommended_product_id);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('active', true);

  if (productsError) {
    console.error('Error fetching recommended products:', productsError);
    throw new Error(`Failed to fetch recommended products: ${productsError.message}`);
  }

  // Sort products by priority from recommendations
  const productMap = new Map(products?.map((p) => [p.id, p]) || []);
  const sortedProducts = recommendations
    .map((rec) => productMap.get(rec.recommended_product_id))
    .filter((p): p is Product => p !== undefined);

  return sortedProducts;
}

/**
 * Get products in the same category, excluding the specified product
 */
export async function getRecommendationsByCategory(
  category: string,
  excludeProductId?: string,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (excludeProductId) {
    query = query.neq('id', excludeProductId);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products by category:', error);
    throw new Error(`Failed to fetch products by category: ${error.message}`);
  }

  return data || [];
}

/**
 * Get products frequently bought together with the specified product
 * Analyzes order_items to find products commonly purchased together
 */
export async function getFrequentlyBoughtTogether(
  productId: string,
  limit: number = 5
): Promise<Product[]> {
  const supabase = await createServiceRoleClient();

  // Find orders that contain this product
  const { data: ordersWithProduct, error: ordersError } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', productId);

  if (ordersError) {
    console.error('Error fetching orders with product:', ordersError);
    throw new Error(`Failed to fetch orders: ${ordersError.message}`);
  }

  if (!ordersWithProduct || ordersWithProduct.length === 0) {
    return [];
  }

  const orderIds = [...new Set(ordersWithProduct.map((item) => item.order_id))];

  // Find other products in those same orders
  const { data: relatedItems, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id')
    .in('order_id', orderIds)
    .neq('product_id', productId);

  if (itemsError) {
    console.error('Error fetching related order items:', itemsError);
    throw new Error(`Failed to fetch related items: ${itemsError.message}`);
  }

  if (!relatedItems || relatedItems.length === 0) {
    return [];
  }

  // Count frequency of each product
  const productCounts = new Map<string, number>();
  relatedItems.forEach((item) => {
    const count = productCounts.get(item.product_id) || 0;
    productCounts.set(item.product_id, count + 1);
  });

  // Sort by frequency and get top products
  const sortedProducts = Array.from(productCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => productId);

  // Fetch product details
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', sortedProducts)
    .eq('active', true);

  if (productsError) {
    console.error('Error fetching frequently bought together products:', productsError);
    throw new Error(`Failed to fetch products: ${productsError.message}`);
  }

  // Maintain order from sortedProducts
  const productMap = new Map(products?.map((p) => [p.id, p]) || []);
  return sortedProducts
    .map((id) => productMap.get(id))
    .filter((p): p is Product => p !== undefined);
}

/**
 * Get popular/featured products
 */
export async function getPopularProducts(
  category?: string,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching popular products:', error);
    throw new Error(`Failed to fetch popular products: ${error.message}`);
  }

  return data || [];
}

/**
 * Get recently viewed products for a user
 * Returns products the user has recently viewed, sorted by most recent
 */
export async function getRecentlyViewed(
  userId: string,
  limit: number = 10
): Promise<Product[]> {
  const { getRecentlyViewed: getRecentlyViewedProducts } = await import('./recently-viewed');
  return getRecentlyViewedProducts(userId, limit);
}

/**
 * Get recommendation metadata for a product
 */
export async function getRecommendationMetadata(
  productId: string,
  recommendedProductId: string
): Promise<ProductRecommendation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_recommendations')
    .select('*')
    .eq('product_id', productId)
    .eq('recommended_product_id', recommendedProductId)
    .eq('active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching recommendation metadata:', error);
    throw new Error(`Failed to fetch recommendation metadata: ${error.message}`);
  }

  return data;
}

