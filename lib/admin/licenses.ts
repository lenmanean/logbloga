/**
 * Admin license management functions
 * Provides admin-specific license operations using service role client
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { License, LicenseStatus } from '@/lib/types/database';
import { generateUniqueLicenseKey } from '@/lib/licenses/generator';

export interface AdminLicenseFilters {
  status?: LicenseStatus;
  productId?: string;
  userId?: string;
  search?: string; // License key, order number, or customer email
}

/**
 * Get all licenses (admin only)
 */
export async function getAllLicenses(filters?: AdminLicenseFilters): Promise<License[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('licenses')
    .select(`
      *,
      product:products(id, title, slug),
      user:profiles(id, email, full_name)
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.search) {
    // Search by license key, order number, or user email
    query = query.or(`license_key.ilike.%${filters.search}%,order_id.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching licenses:', error);
    throw new Error(`Failed to fetch licenses: ${error.message}`);
  }

  return (data || []) as unknown as License[];
}

/**
 * Update license status (admin)
 */
export async function updateLicenseStatus(
  licenseId: string,
  status: LicenseStatus
): Promise<License> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('licenses')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', licenseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating license:', error);
    throw new Error(`Failed to update license: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update license: No data returned');
  }

  return data as unknown as License;
}

/**
 * Regenerate license key (admin)
 */
export async function regenerateLicenseKey(licenseId: string): Promise<License> {
  const supabase = await createServiceRoleClient();

  // Generate new unique key
  const newKey = generateUniqueLicenseKey();

  // Check if key already exists (unlikely but possible)
  const { data: existing } = await supabase
    .from('licenses')
    .select('id')
    .eq('license_key', newKey)
    .single();

  if (existing) {
    // Retry with new key (recursive, but with limit)
    return regenerateLicenseKey(licenseId);
  }

  const { data, error } = await supabase
    .from('licenses')
    .update({
      license_key: newKey,
      updated_at: new Date().toISOString(),
    })
    .eq('id', licenseId)
    .select()
    .single();

  if (error) {
    console.error('Error regenerating license key:', error);
    throw new Error(`Failed to regenerate license key: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to regenerate license key: No data returned');
  }

  return data as unknown as License;
}

/**
 * Revoke license (admin)
 */
export async function revokeLicense(licenseId: string): Promise<void> {
  await updateLicenseStatus(licenseId, 'revoked');
}

