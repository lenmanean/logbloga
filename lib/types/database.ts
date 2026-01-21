/**
 * Database type helpers and utilities
 * 
 * This file provides additional type utilities for database operations
 * beyond what's generated in supabase.ts
 */

import type { Database } from './supabase';

// Helper types for common table rows
export type Product = Database['public']['Tables']['products']['Row'] & {
  // Fields added in migration 000020
  product_type?: 'package' | 'individual' | 'tool' | 'template' | 'strategy' | 'course' | null;
  version_year?: number | null;
  is_current_version?: boolean | null;
  included_products?: any; // JSONB
  package_value?: number | null;
};
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type License = Database['public']['Tables']['licenses']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ProductRecommendation = Database['public']['Tables']['product_recommendations']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

// Product category type
export type ProductCategory = 'web-apps' | 'social-media' | 'agency' | 'freelancing';

// Product difficulty type
export type ProductDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Order status type
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

// License status type
export type LicenseStatus = 'active' | 'inactive' | 'revoked';

// Review status type
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Extended Product type with JSON fields parsed
export interface PackageModule {
  title: string;
  description: string;
  hours: string;
  items: string[];
}

export interface PackageResource {
  category: string;
  items: string[];
}

export interface ExtendedProduct {
  // All Product fields but with proper types
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  featured: boolean | null;
  difficulty: string | null;
  duration: string | null;
  // Extended fields
  modules: PackageModule[];
  resources: PackageResource[];
  bonusAssets: string[];
  images: string[];
}

// Database query result types
export interface ProductWithRelations extends Product {
  // Future: Add relations like reviews, variants, etc.
}

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export interface OrderWithItems extends Order {
  items?: Array<{
    id: string;
    product_id: string | null;
    product_name: string;
    product_sku?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  // Doer coupon fields (added in migration 000020)
  doer_coupon_code?: string | null;
  doer_coupon_generated_at?: string | null;
  doer_coupon_expires_at?: string | null;
  doer_coupon_used?: boolean | null;
  doer_coupon_used_at?: string | null;
  doer_user_id?: string | null;
}

export interface LicenseWithProduct extends License {
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

// Database operation result types
export interface DatabaseResult<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaginatedBlogResult extends PaginatedResult<BlogPost> {}

