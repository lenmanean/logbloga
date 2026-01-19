/**
 * Account statistics database operations
 * Provides functions to calculate user account statistics
 */

import { createClient } from '@/lib/supabase/server';
import { getUserOrders } from './orders';
import { getUserLicenses } from './licenses';
import { getWishlistCount } from './wishlist';
import { getUserProfile } from './profiles';

export interface AccountStatistics {
  totalOrders: number;
  totalSpent: number;
  activeLicenses: number;
  wishlistItems: number;
  accountAge: number; // Days since account creation
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'order' | 'license' | 'wishlist' | 'profile';
  title: string;
  description: string;
  date: string;
  link?: string;
}

/**
 * Get comprehensive account statistics for a user
 */
export async function getAccountStatistics(userId: string): Promise<AccountStatistics> {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [orders, licenses, wishlistCount, profile] = await Promise.all([
    getUserOrders(userId),
    getUserLicenses(userId),
    getWishlistCount(userId),
    getUserProfile(userId),
  ]);

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => {
    const total = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    return sum + total;
  }, 0);

  // Count active licenses
  const activeLicenses = licenses.filter((license) => license.status === 'active').length;

  // Calculate account age
  const accountCreatedAt = profile?.created_at || new Date().toISOString();
  const accountAge = Math.floor(
    (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Build recent activity feed
  const recentActivity: ActivityItem[] = [];

  // Add recent orders (last 5)
  orders.slice(0, 5).forEach((order) => {
    recentActivity.push({
      type: 'order',
      title: `Order #${order.order_number}`,
      description: `Order placed - $${typeof order.total_amount === 'number' ? order.total_amount : parseFloat(String(order.total_amount || 0))}`,
      date: order.created_at || new Date().toISOString(),
      link: `/account/orders/${order.id}`,
    });
  });

  // Add recent licenses (last 5)
  licenses
    .filter((license) => license.status === 'active')
    .slice(0, 5)
    .forEach((license) => {
      const productName = license.product?.title || license.product?.name || 'Product';
      recentActivity.push({
        type: 'license',
        title: `License activated: ${productName}`,
        description: 'You now have access to this product',
        date: license.access_granted_at || license.created_at || new Date().toISOString(),
        link: license.product_id ? `/account/library/${license.product_id}` : undefined,
      });
    });

  // Sort activity by date (most recent first)
  recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Limit to last 10 activities
  const limitedActivity = recentActivity.slice(0, 10);

  return {
    totalOrders: orders.length,
    totalSpent,
    activeLicenses,
    wishlistItems: wishlistCount,
    accountAge,
    recentActivity: limitedActivity,
  };
}

/**
 * Get account statistics summary (lightweight version)
 */
export async function getAccountStatisticsSummary(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  activeLicenses: number;
  wishlistItems: number;
}> {
  const supabase = await createClient();

  // Fetch counts in parallel
  const [orders, licenses, wishlistCount] = await Promise.all([
    getUserOrders(userId),
    getUserLicenses(userId),
    getWishlistCount(userId),
  ]);

  const totalSpent = orders.reduce((sum, order) => {
    const total = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    return sum + total;
  }, 0);

  const activeLicenses = licenses.filter((license) => license.status === 'active').length;

  return {
    totalOrders: orders.length,
    totalSpent,
    activeLicenses,
    wishlistItems: wishlistCount,
  };
}

