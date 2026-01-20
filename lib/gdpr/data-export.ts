/**
 * GDPR data export utilities
 * Provides functions to export all user data in JSON format
 */

import { createServiceRoleClient } from '@/lib/supabase/server';

/**
 * Export all user data for GDPR compliance
 */
export async function exportUserData(userId: string): Promise<Record<string, any>> {
  const supabase = await createServiceRoleClient();

  // Export all user-related data
  const [
    profileData,
    ordersData,
    licensesData,
    cartData,
    addressesData,
    notificationsData,
    wishlistData,
    reviewsData,
    auditLogsData,
    cookieConsentsData,
    consentsData,
  ] = await Promise.all([
    // Profile
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),
    
    // Orders
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Licenses
    supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Cart items
    supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId),
    
    // Addresses
    (supabase as any)
      .from('addresses')
      .select('*')
      .eq('user_id', userId),
    
    // Notifications
    (supabase as any)
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Wishlist
    (supabase as any)
      .from('wishlist')
      .select('*')
      .eq('user_id', userId),
    
    // Reviews
    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Audit logs
    (supabase as any)
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Cookie consents
    (supabase as any)
      .from('cookie_consents')
      .select('*')
      .eq('user_id', userId)
      .single(),
    
    // Consents
    (supabase as any)
      .from('consents')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false }),
  ]);

  // Get user auth data (if accessible)
  let authData = null;
  try {
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (user) {
      authData = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        // Don't export sensitive data like password hashes
      };
    }
  } catch (error) {
    console.error('Error fetching auth data:', error);
    // Continue without auth data
  }

  // Compile export data
  const exportData = {
    export_metadata: {
      export_date: new Date().toISOString(),
      user_id: userId,
      format_version: '1.0',
    },
    profile: profileData.data || null,
    auth: authData,
    orders: ordersData.data || [],
    licenses: licensesData.data || [],
    cart_items: cartData.data || [],
    addresses: addressesData.data || [],
    notifications: notificationsData.data || [],
    wishlist: wishlistData.data || [],
    reviews: reviewsData.data || [],
    audit_logs: auditLogsData.data || [],
    cookie_consents: cookieConsentsData.data || null,
    consents: consentsData.data || [],
  };

  return exportData;
}

/**
 * Format export data as JSON string
 */
export function formatExportData(data: Record<string, any>): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get export filename
 */
export function getExportFilename(userId: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `logbloga-data-export-${userId.substring(0, 8)}-${date}.json`;
}
