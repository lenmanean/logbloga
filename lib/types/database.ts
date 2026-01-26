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
  // Fields added in migration 000027
  levels?: any; // JSONB - Level-based content structure
};
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ProductRecommendation = Database['public']['Tables']['product_recommendations']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

// Product category type
export type ProductCategory = 'web-apps' | 'social-media' | 'agency' | 'freelancing';

// Order status type
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';


// Review status type
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Package Level Structure (migration 000027)
export interface PackageLevelContent {
  file: string;
  type: string;
  description: string;
  platform?: string; // For platform guides
  name?: string; // For creative frameworks and templates
}

export interface PackageLevel {
  level: 1 | 2 | 3;
  timeInvestment: string; // "2-3 Weeks"
  expectedProfit: string; // "$500-$1,500/month"
  platformCosts: string; // "$0-50/month"
  implementationPlan: PackageLevelContent;
  platformGuides: PackageLevelContent[];
  creativeFrameworks: PackageLevelContent[];
  templates: PackageLevelContent[];
}

export interface PackageLevels {
  level1?: PackageLevel;
  level2?: PackageLevel;
  level3?: PackageLevel;
}

export interface ExtendedProduct {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  featured: boolean | null;
  duration: string | null;
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
  // Note: DOER coupon fields are already part of the base Order type from Supabase
  // No need to redeclare them here as they would conflict with the base type
}

// Re-export ProductWithPurchaseDate from access.ts for consistency
export type { ProductWithPurchaseDate } from '@/lib/db/access';

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

// Contact Submission types (migration 000036)
// Based on Supabase generated types with stricter constraints
export type ContactSubmissionRow = Database['public']['Tables']['contact_submissions']['Row'];
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];
export type ContactSubmissionUpdate = Database['public']['Tables']['contact_submissions']['Update'];

// Enhanced type with stricter status constraint
export interface ContactSubmission extends Omit<ContactSubmissionRow, 'status' | 'spam_score' | 'metadata' | 'created_at' | 'updated_at'> {
  status: 'pending' | 'read' | 'replied' | 'archived';
  spam_score: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

