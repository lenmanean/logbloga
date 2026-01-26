/**
 * Access Control Database Operations
 * Order-based access control for digital products
 * 
 * This is the primary and only access control system. Product access is determined
 * by completed orders. Users have lifetime access to products they've purchased.
 */

import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types/database';
import type { Database } from '@/lib/types/supabase';

type SupabaseProduct = Database['public']['Tables']['products']['Row'];

/**
 * Convert Supabase product row to our Product type with proper type constraints
 */
function toProduct(row: SupabaseProduct): Product {
  return {
    ...row,
    product_type: (row.product_type as Product['product_type']) ?? null,
  };
}

/**
 * Check if user has access to a specific product
 * Returns true if user has a completed order for the product directly
 */
export async function hasProductAccess(
  userId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createClient();
  
  // Get all completed orders for the user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (ordersError || !orders || orders.length === 0) {
    return false;
  }

  const orderIds = orders.map(o => o.id);

  // Check direct purchase
  const { data: directPurchase, error: directError } = await supabase
    .from('order_items')
    .select('id')
    .eq('product_id', productId)
    .in('order_id', orderIds)
    .limit(1)
    .single();

  if (directError && directError.code !== 'PGRST116') {
    console.error('Error checking direct purchase:', directError);
  }

  return !!directPurchase;
}

/**
 * Check if user has access to a product by slug
 */
export async function hasProductAccessBySlug(
  userId: string,
  productSlug: string
): Promise<boolean> {
  const supabase = await createClient();
  
  // Get product ID from slug
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .single();

  if (productError || !product) {
    return false;
  }

  return hasProductAccess(userId, product.id);
}

/**
 * Get all products user has access to
 */
export async function getUserProductAccess(userId: string): Promise<Product[]> {
  const supabase = await createClient();
  
  // Get all completed orders for user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (ordersError || !orders || orders.length === 0) {
    return [];
  }

  const orderIds = orders.map(o => o.id);

  // Get all products from order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product:products!product_id(*)
    `)
    .in('order_id', orderIds);

  if (itemsError || !orderItems) {
    return [];
  }

  const products: Product[] = [];
  const productIds = new Set<string>();

  for (const item of orderItems) {
    if (!item.product_id) continue;

    const rawProduct = item.product as SupabaseProduct;
    if (!rawProduct) continue;
    
    const product = toProduct(rawProduct);
    
    // Add direct product (packages only)
    if (!productIds.has(product.id)) {
      products.push(product);
      productIds.add(product.id);
    }
  }

  return products;
}

/**
 * Product with purchase information for library display
 */
export interface ProductWithPurchaseDate extends Product {
  purchasedDate: string; // ISO date string from order
  orderId: string; // Order ID for reference
  lastAccessedDate?: string; // ISO date string from recently_viewed_products, optional if never accessed
}

/**
 * Get all products user has access to with purchase dates
 * Returns products with the date they were purchased (from order creation)
 */
export async function getUserProductAccessWithDates(userId: string): Promise<ProductWithPurchaseDate[]> {
  const supabase = await createClient();
  
  // Get all completed orders for user with creation dates
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, created_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (ordersError || !orders || orders.length === 0) {
    return [];
  }

  const orderIds = orders.map(o => o.id);
  const orderMap = new Map<string, { date: string; orderId: string }>();
  orders.forEach(order => {
    if (order.id && order.created_at) {
      orderMap.set(order.id, { date: order.created_at, orderId: order.id });
    }
  });

  // Get all products from order items with order information
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      product_id,
      order_id,
      product:products!product_id(*)
    `)
    .in('order_id', orderIds);

  if (itemsError || !orderItems) {
    return [];
  }

  const products: ProductWithPurchaseDate[] = [];
  const productMap = new Map<string, ProductWithPurchaseDate>();

  for (const item of orderItems) {
    if (!item.product_id || !item.order_id) continue;

    const product = item.product as Product;
    const orderInfo = orderMap.get(item.order_id);
    if (!orderInfo) continue;

    // Use the earliest purchase date if product appears in multiple orders
    const existing = productMap.get(product.id);
    if (!existing) {
      productMap.set(product.id, {
        ...product,
        purchasedDate: orderInfo.date,
        orderId: orderInfo.orderId,
      });
    } else {
      // Keep the earliest purchase date
      const existingDate = new Date(existing.purchasedDate);
      const newDate = new Date(orderInfo.date);
      if (newDate < existingDate) {
        existing.purchasedDate = orderInfo.date;
        existing.orderId = orderInfo.orderId;
      }
    }
  }

  // Fetch last accessed dates from recently_viewed_products
  const productIds = Array.from(productMap.keys());
  if (productIds.length > 0) {
    const { data: recentlyViewed, error: rvError } = await supabase
      .from('recently_viewed_products')
      .select('product_id, viewed_at')
      .eq('user_id', userId)
      .in('product_id', productIds);

    if (!rvError && recentlyViewed) {
      // Create a map of product_id -> most recent viewed_at
      const lastAccessedMap = new Map<string, string>();
      for (const entry of recentlyViewed) {
        const existing = lastAccessedMap.get(entry.product_id);
        if (!existing || new Date(entry.viewed_at) > new Date(existing)) {
          lastAccessedMap.set(entry.product_id, entry.viewed_at);
        }
      }

      // Add last accessed dates to products
      for (const product of productMap.values()) {
        const lastAccessed = lastAccessedMap.get(product.id);
        if (lastAccessed) {
          product.lastAccessedDate = lastAccessed;
        }
      }
    }
  }

  return Array.from(productMap.values());
}

/**
 * Check if user has access to a package
 */
export async function checkPackageAccess(
  userId: string,
  packageId: string
): Promise<boolean> {
  return hasProductAccess(userId, packageId);
}

/**
 * Check if an order contains a package product
 */
export async function orderContainsPackage(orderId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product:products!product_id(product_type)
    `)
    .eq('order_id', orderId)
    .eq('product.product_type', 'package')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false; // No package in order
    }
    console.error('Error checking order for package:', error);
    return false;
  }

  return !!data;
}

