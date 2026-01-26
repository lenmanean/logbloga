/**
 * Package-Product Relationship Database Operations
 * 
 * DEPRECATED: This module is no longer used in customer-facing code.
 * Individual products and package-product relationships have been removed from the storefront.
 * This file is retained for potential migration/cleanup purposes only.
 * 
 * All functions in this module are deprecated and should not be used in new code.
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

export interface PackageProduct {
  id: string;
  product_id: string;
  package_id: string;
  package_value: number | null;
  display_order: number;
  product?: Product;
}

export interface PackageWithProducts {
  package: Product;
  includedProducts: Array<{
    product: Product;
    package_value: number;
    display_order: number;
  }>;
  totalPackageValue: number;
}

/**
 * Get all products included in a package
 */
export async function getPackageProducts(packageId: string): Promise<PackageProduct[]> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('package_products')
    .select(`
      *,
      product:products!product_id(*)
    `)
    .eq('package_id', packageId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching package products:', error);
    throw new Error(`Failed to fetch package products: ${error.message}`);
  }

  return ((data || []) as any[]).map((item: any) => {
    const rawProduct = item.product as SupabaseProduct;
    return {
      id: item.id,
      product_id: item.product_id,
      package_id: item.package_id,
      package_value: item.package_value ? parseFloat(String(item.package_value)) : null,
      display_order: item.display_order || 0,
      product: rawProduct ? toProduct(rawProduct) : undefined,
    };
  });
}

/**
 * Get all products included in a package by slug
 */
export async function getPackageProductsBySlug(packageSlug: string): Promise<PackageProduct[]> {
  const supabase = await createClient();
  
  // First get the package ID
  const { data: packageData, error: packageError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', packageSlug)
    .single();

  if (packageError || !packageData) {
    throw new Error(`Package not found: ${packageSlug}`);
  }

  return getPackageProducts(packageData.id);
}

/**
 * Get the package that contains a specific product
 */
export async function getProductPackage(productId: string): Promise<Product | null> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('package_products')
    .select(`
      package:products!package_id(*)
    `)
    .eq('product_id', productId)
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Product not in any package
    }
    console.error('Error fetching product package:', error);
    throw new Error(`Failed to fetch product package: ${error.message}`);
  }

  const rawPackage = (data as any)?.package as SupabaseProduct;
  return rawPackage ? toProduct(rawPackage) : null;
}

/**
 * Get the package that contains a specific product by slug
 */
export async function getProductPackageBySlug(productSlug: string): Promise<Product | null> {
  const supabase = await createClient();
  
  // First get the product ID
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .single();

  if (productError || !productData) {
    return null;
  }

  return getProductPackage(productData.id);
}

/**
 * Calculate total package value (sum of included product package values)
 */
export async function calculatePackageValue(packageId: string): Promise<number> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('package_products')
    .select('package_value')
    .eq('package_id', packageId);

  if (error) {
    console.error('Error calculating package value:', error);
    throw new Error(`Failed to calculate package value: ${error.message}`);
  }

  const totalValue = ((data || []) as any[]).reduce((sum: number, item: any) => {
    const value = item.package_value ? parseFloat(String(item.package_value)) : 0;
    return sum + value;
  }, 0);

  return totalValue;
}

/**
 * Get package with all included products and calculated values
 */
export async function getPackageWithIncludedProducts(
  packageId: string
): Promise<PackageWithProducts | null> {
  const supabase = await createClient();
  
  // Get package
  const { data: packageData, error: packageError } = await supabase
    .from('products')
    .select('*')
    .eq('id', packageId)
    .single();

  if (packageError || !packageData) {
    return null;
  }

  // Get included products
  const includedProducts = await getPackageProducts(packageId);
  
  // Calculate total package value
  const totalPackageValue = await calculatePackageValue(packageId);

  return {
    package: toProduct(packageData),
    includedProducts: includedProducts
      .filter(pp => pp.product !== undefined)
      .map(pp => ({
        product: pp.product!,
        package_value: pp.package_value || 0,
        display_order: pp.display_order,
      })),
    totalPackageValue,
  };
}

/**
 * Get package with included products by slug
 */
export async function getPackageWithIncludedProductsBySlug(
  packageSlug: string
): Promise<PackageWithProducts | null> {
  const supabase = await createClient();
  
  const { data: packageData, error: packageError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', packageSlug)
    .single();

  if (packageError || !packageData) {
    return null;
  }

  return getPackageWithIncludedProducts(packageData.id);
}

/**
 * Get all products a user has access to (direct purchases + via packages)
 */
export async function getUserPurchasedProducts(userId: string): Promise<Product[]> {
  const supabase = await createClient();
  
  // First, get all completed order IDs for this user
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (ordersError || !ordersData) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  const orderIds = ordersData.map(order => order.id);

  if (orderIds.length === 0) {
    return [];
  }

  // Get all products user directly purchased
  const { data: directProducts, error: directError } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product:products!product_id(*)
    `)
    .in('order_id', orderIds);

  if (directError) {
    console.error('Error fetching direct products:', directError);
  }

  // Get all packages user purchased
  const { data: packages, error: packagesError } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product:products!product_id(*)
    `)
    .in('order_id', orderIds)
    .eq('product.product_type', 'package');

  if (packagesError) {
    console.error('Error fetching packages:', packagesError);
  }

  // Get all products included in purchased packages
  const packageIds = ((packages || []) as any[])
    .map((p: any) => p.product_id)
    .filter((id): id is string => id !== null);

  let includedProducts: Product[] = [];
  
  if (packageIds.length > 0) {
    const { data: ppData, error: ppError } = await (supabase as any)
      .from('package_products')
      .select(`
        product_id,
        product:products!product_id(*)
      `)
      .in('package_id', packageIds);

    if (!ppError && ppData) {
      includedProducts = (ppData as any[])
        .map((pp: any) => {
          const rawProduct = pp.product as SupabaseProduct;
          return rawProduct ? toProduct(rawProduct) : null;
        })
        .filter((p): p is Product => p !== null);
    }
  }

  // Combine direct products and included products, remove duplicates
  const directProductsList = ((directProducts || []) as any[])
    .map((p: any) => {
      const rawProduct = p.product as SupabaseProduct;
      return rawProduct ? toProduct(rawProduct) : null;
    })
    .filter((p): p is Product => p !== null);

  const allProducts = [...directProductsList, ...includedProducts];
  
  // Remove duplicates by product ID
  const uniqueProducts = Array.from(
    new Map(allProducts.map(p => [p.id, p])).values()
  );

  return uniqueProducts;
}
