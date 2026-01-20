/**
 * Type mappers for converting Supabase database types to custom interface types
 * 
 * These mappers ensure type safety when converting between Supabase generated types
 * and custom interface types used throughout the application.
 */

import type { Database } from './supabase';
import type { Notification } from '@/lib/db/notifications-db';
import type { SavedAddress } from '@/lib/db/addresses';
import type { WishlistItem, WishlistItemWithProduct } from './database';
import type { Product } from './database';

// Type aliases for Supabase table rows
type SupabaseNotification = Database['public']['Tables']['notifications']['Row'];
type SupabaseSavedAddress = Database['public']['Tables']['saved_addresses']['Row'];
type SupabaseWishlistItem = Database['public']['Tables']['wishlist_items']['Row'];

/**
 * Map Supabase notification row to Notification interface
 * Handles type conversions and ensures all required fields are present
 */
export function mapSupabaseNotification(
  supabaseNotification: SupabaseNotification
): Notification {
  return {
    id: supabaseNotification.id,
    user_id: supabaseNotification.user_id,
    type: supabaseNotification.type as Notification['type'],
    title: supabaseNotification.title,
    message: supabaseNotification.message,
    link: supabaseNotification.link,
    metadata: (supabaseNotification.metadata as Record<string, any>) || {},
    read: supabaseNotification.read ?? false, // Handle null as false
    created_at: supabaseNotification.created_at || new Date().toISOString(),
  };
}

/**
 * Map Supabase saved address row to SavedAddress interface
 * Handles field name differences and type conversions
 */
export function mapSupabaseAddress(
  supabaseAddress: SupabaseSavedAddress
): SavedAddress {
  return {
    id: supabaseAddress.id,
    user_id: supabaseAddress.user_id,
    type: supabaseAddress.type as SavedAddress['type'],
    label: supabaseAddress.label,
    full_name: supabaseAddress.full_name,
    street: supabaseAddress.street,
    city: supabaseAddress.city,
    state: supabaseAddress.state,
    zip_code: supabaseAddress.zip_code,
    country: supabaseAddress.country,
    phone: supabaseAddress.phone,
    is_default_billing: supabaseAddress.is_default_billing ?? false,
    is_default_shipping: supabaseAddress.is_default_shipping ?? false,
    created_at: supabaseAddress.created_at || new Date().toISOString(),
    updated_at: supabaseAddress.updated_at || new Date().toISOString(),
  };
}

/**
 * Map Supabase wishlist item row to WishlistItem interface
 */
export function mapSupabaseWishlistItem(
  supabaseWishlistItem: SupabaseWishlistItem
): WishlistItem {
  return {
    id: supabaseWishlistItem.id,
    user_id: supabaseWishlistItem.user_id,
    product_id: supabaseWishlistItem.product_id,
    created_at: supabaseWishlistItem.created_at || new Date().toISOString(),
  };
}

/**
 * Map Supabase wishlist item with product relation to WishlistItemWithProduct interface
 * Handles the joined product data from Supabase queries
 */
export function mapSupabaseWishlistItemWithProduct(
  supabaseWishlistItem: SupabaseWishlistItem & { product?: any }
): WishlistItemWithProduct {
  const wishlistItem = mapSupabaseWishlistItem(supabaseWishlistItem);
  
  // Ensure product is required for WishlistItemWithProduct
  if (!supabaseWishlistItem.product) {
    throw new Error('Product is required for WishlistItemWithProduct');
  }
  
  return {
    ...wishlistItem,
    product: supabaseWishlistItem.product as Product,
  };
}

/**
 * Map array of Supabase notifications to Notification array
 */
export function mapSupabaseNotifications(
  supabaseNotifications: SupabaseNotification[]
): Notification[] {
  return supabaseNotifications.map(mapSupabaseNotification);
}

/**
 * Map array of Supabase saved addresses to SavedAddress array
 */
export function mapSupabaseAddresses(
  supabaseAddresses: SupabaseSavedAddress[]
): SavedAddress[] {
  return supabaseAddresses.map(mapSupabaseAddress);
}

/**
 * Map array of Supabase wishlist items to WishlistItem array
 */
export function mapSupabaseWishlistItems(
  supabaseWishlistItems: SupabaseWishlistItem[]
): WishlistItem[] {
  return supabaseWishlistItems.map(mapSupabaseWishlistItem);
}
