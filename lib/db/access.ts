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
 * Returns true if user has a completed order for the product directly,
 * or if user has a bundle that includes the product.
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

  const orderIds = orders.map((o) => o.id);

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

  if (directPurchase) return true;

  // Check bundle expansion: user may have purchased a bundle that includes this product
  const { data: bundleItems, error: bundleError } = await supabase
    .from('order_items')
    .select('product:products!product_id(id, product_type, included_products)')
    .in('order_id', orderIds);

  if (bundleError || !bundleItems) return false;

  const PACKAGE_SLUG_ALLOWLIST = new Set(['web-apps', 'social-media', 'agency', 'freelancing']);
  const slugsToResolve = new Set<string>();
  for (const item of bundleItems) {
    const product = item.product as { product_type?: string; included_products?: string[] } | null;
    if (!product || product.product_type !== 'bundle') continue;
    const slugs = product.included_products;
    if (Array.isArray(slugs)) {
      slugs.forEach((s) => {
        if (typeof s === 'string' && PACKAGE_SLUG_ALLOWLIST.has(s)) slugsToResolve.add(s);
      });
    }
  }

  if (slugsToResolve.size === 0) return false;

  const { data: resolvedProducts } = await supabase
    .from('products')
    .select('id')
    .in('slug', Array.from(slugsToResolve));

  const includedIds = new Set((resolvedProducts || []).map((p) => p.id));
  return includedIds.has(productId);
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
 * Expands bundles into their included packages (library shows individual packages, not the bundle)
 */
export async function getUserProductAccess(userId: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (ordersError || !orders || orders.length === 0) return [];
  const orderIds = orders.map((o) => o.id);

  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, product:products!product_id(*)')
    .in('order_id', orderIds);

  if (itemsError || !orderItems) return [];

  const products: Product[] = [];
  const productIds = new Set<string>();

  for (const item of orderItems) {
    if (!item.product_id) continue;
    const rawProduct = item.product as SupabaseProduct;
    if (!rawProduct) continue;

    if ((rawProduct.product_type as string) === 'bundle') {
      const slugs = rawProduct.included_products as string[] | null;
      if (!Array.isArray(slugs) || slugs.length === 0) continue;
      const PACKAGE_SLUG_ALLOWLIST = ['web-apps', 'social-media', 'agency', 'freelancing'];
      const validSlugs = slugs.filter((s) => typeof s === 'string' && PACKAGE_SLUG_ALLOWLIST.includes(s));
      if (validSlugs.length === 0) continue;
      const { data: included } = await supabase
        .from('products')
        .select('*')
        .in('slug', validSlugs)
        .eq('product_type', 'package');
      for (const p of included || []) {
        const prod = toProduct(p as SupabaseProduct);
        if (!productIds.has(prod.id)) {
          products.push(prod);
          productIds.add(prod.id);
        }
      }
    } else {
      const product = toProduct(rawProduct);
      if (!productIds.has(product.id)) {
        products.push(product);
        productIds.add(product.id);
      }
    }
  }

  return products;
}

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing'] as const;

/**
 * Returns true if the user has purchased at least one package (or the master bundle).
 * Used to gate the chat assistant.
 */
export async function userHasAnyPackageAccess(userId: string): Promise<boolean> {
  const products = await getUserProductAccess(userId);
  return products.length > 0;
}

/**
 * Returns the list of package slugs the user has access to (from direct package purchase or bundle).
 * Used to scope RAG retrieval to owned packages only.
 */
export async function getOwnedPackageSlugs(userId: string): Promise<string[]> {
  const products = await getUserProductAccess(userId);
  const slugs = new Set<string>();
  for (const p of products) {
    const slug = (p as { slug?: string }).slug;
    if (slug && PACKAGE_SLUGS.includes(slug as (typeof PACKAGE_SLUGS)[number])) {
      slugs.add(slug);
    }
    if ((p as { product_type?: string }).product_type === 'bundle') {
      PACKAGE_SLUGS.forEach((s) => slugs.add(s));
    }
  }
  return Array.from(slugs);
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
    const orderInfo = orderMap.get(item.order_id);
    if (!orderInfo) continue;

    const rawProduct = item.product as SupabaseProduct & { product_type?: string; included_products?: string[] };

    if (rawProduct?.product_type === 'bundle') {
      const slugs = rawProduct.included_products as string[] | null;
      if (!Array.isArray(slugs) || slugs.length === 0) continue;
      const PACKAGE_SLUG_ALLOWLIST = ['web-apps', 'social-media', 'agency', 'freelancing'];
      const validSlugs = slugs.filter((s) => typeof s === 'string' && PACKAGE_SLUG_ALLOWLIST.includes(s));
      if (validSlugs.length === 0) continue;
      const { data: included } = await supabase
        .from('products')
        .select('*')
        .in('slug', validSlugs)
        .eq('product_type', 'package');
      for (const p of included || []) {
        const product = toProduct(p as SupabaseProduct);
        const existing = productMap.get(product.id);
        if (!existing) {
          productMap.set(product.id, {
            ...product,
            purchasedDate: orderInfo.date,
            orderId: orderInfo.orderId,
          });
        } else {
          const existingDate = new Date(existing.purchasedDate);
          const newDate = new Date(orderInfo.date);
          if (newDate < existingDate) {
            existing.purchasedDate = orderInfo.date;
            existing.orderId = orderInfo.orderId;
          }
        }
      }
    } else {
      const product = item.product as Product;
      const existing = productMap.get(product.id);
      if (!existing) {
        productMap.set(product.id, {
          ...product,
          purchasedDate: orderInfo.date,
          orderId: orderInfo.orderId,
        });
      } else {
        const existingDate = new Date(existing.purchasedDate);
        const newDate = new Date(orderInfo.date);
        if (newDate < existingDate) {
          existing.purchasedDate = orderInfo.date;
          existing.orderId = orderInfo.orderId;
        }
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
 * Check if an order contains a package or bundle product
 */
export async function orderContainsPackage(orderId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from('order_items')
    .select('product:products!product_id(product_type)')
    .eq('order_id', orderId);

  if (error || !items) {
    if (error?.code === 'PGRST116') return false;
    console.error('Error checking order for package:', error);
    return false;
  }

  return items.some((item) => {
    const p = item.product as { product_type?: string } | null;
    return p?.product_type === 'package' || p?.product_type === 'bundle';
  });
}

