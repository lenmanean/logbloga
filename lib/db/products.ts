/**
 * Product database operations
 * Provides type-safe functions for querying products from Supabase
 */

import { createClient } from '@/lib/supabase/server';
import type { Product, ExtendedProduct } from '@/lib/types/database';
import type { ProductQueryOptions } from './types';
import { parsePackageLevels } from './package-levels';

/**
 * Get all active products
 */
export async function getAllProducts(options?: ProductQueryOptions): Promise<Product[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', options?.active ?? true);

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { 
      ascending: options.orderDirection !== 'desc' 
    });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all active products with caching
 * Uses Redis cache with 10-minute TTL
 */
export async function getAllProductsCached(options?: ProductQueryOptions): Promise<Product[]> {
  const { getCachedOrFetch } = await import('@/lib/cache/redis-cache');
  
  // Generate cache key from options
  const cacheKey = `products:${JSON.stringify(options || {})}`;
  
  return getCachedOrFetch(
    cacheKey,
    () => getAllProducts(options),
    {
      ttl: 600, // 10 minutes
      tags: ['products'],
    },
    'products'
  );
}

/**
 * Get a single product by slug
 * Includes levels field for level-based packages
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*') // Includes levels JSONB field
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  // Parse levels if present (for validation)
  if (data && data.levels) {
    const parsedLevels = parsePackageLevels(data);
    // Note: We keep the raw levels data in the product object
    // The parsing is done in components via parsePackageLevels helper
  }

  return data;
}

/**
 * Get a single product by slug with caching
 * Uses Redis cache with 15-minute TTL
 */
export async function getProductBySlugCached(slug: string): Promise<Product | null> {
  const { getCachedOrFetch } = await import('@/lib/cache/redis-cache');
  
  return getCachedOrFetch(
    `product:slug:${slug}`,
    () => getProductBySlug(slug),
    {
      ttl: 900, // 15 minutes
      tags: ['products', `product:${slug}`],
    },
    'products'
  );
}

/**
 * Get a single product by ID
 * Includes levels field for level-based packages
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*') // Includes levels JSONB field
    .eq('id', id)
    .eq('active', true)
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
 * Get products by category
 */
export async function getProductsByCategory(
  category: string, 
  options?: Omit<ProductQueryOptions, 'category'>
): Promise<Product[]> {
  return getAllProducts({ ...options, category });
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  return getAllProducts({ featured: true, limit });
}

/**
 * Get package products (products with modules/resources structure)
 * These are the main AI to USD packages
 */
export async function getPackageProducts(): Promise<ExtendedProduct[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .in('slug', ['web-apps', 'social-media', 'agency', 'freelancing'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching package products:', error);
    throw new Error(`Failed to fetch package products: ${error.message}`);
  }

  // Parse JSON fields
  return (data || []).map(product => ({
    ...product,
    modules: (product.modules as any) || [],
    resources: (product.resources as any) || [],
    bonusAssets: (product.bonus_assets as any) || [],
    images: (product.images as any) || [],
  })) as ExtendedProduct[];
}

/**
 * Search products
 */
export async function searchProducts(searchTerm: string, limit = 10): Promise<Product[]> {
  return getAllProducts({ search: searchTerm, limit });
}

/**
 * Convert database Product to frontend Product format
 * Handles nullable fields from database schema
 */
import type { Product as FrontendProduct } from '@/lib/products';

export function convertDbProductToFrontendProduct(dbProduct: Product): FrontendProduct {
  return {
    id: dbProduct.id,
    title: dbProduct.title || dbProduct.name || 'Untitled Product',
    description: dbProduct.description || '',
    category: (dbProduct.category || 'web-apps') as FrontendProduct['category'],
    price: typeof dbProduct.price === 'number' ? dbProduct.price : parseFloat(String(dbProduct.price || 0)),
    originalPrice: dbProduct.original_price ? (typeof dbProduct.original_price === 'number' ? dbProduct.original_price : parseFloat(String(dbProduct.original_price))) : undefined,
    featured: dbProduct.featured || false,
    image: dbProduct.package_image || (dbProduct.images as any)?.[0] || dbProduct.image_url || undefined,
    difficulty: dbProduct.difficulty as FrontendProduct['difficulty'] | undefined,
    duration: dbProduct.duration || undefined,
  };
}

