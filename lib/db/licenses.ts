/**
 * License database operations
 * Provides type-safe functions for managing licenses
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { License, LicenseStatus, LicenseWithProduct } from '@/lib/types/database';
import { generateUniqueLicenseKey, validateLicenseKeyFormat } from '@/lib/licenses/generator';
import { getOrderWithItems } from './orders';

/**
 * Generate a unique license key that doesn't exist in the database
 * Retries if duplicate is found (collision handling)
 * 
 * @returns Unique license key string
 */
async function generateLicenseKey(): Promise<string> {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    const licenseKey = generateUniqueLicenseKey();
    const supabase = await createServiceRoleClient();

    // Check if key already exists
    const { data, error } = await supabase
      .from('licenses')
      .select('license_key')
      .eq('license_key', licenseKey)
      .single();

    if (error && error.code === 'PGRST116') {
      // Key doesn't exist, it's unique
      return licenseKey;
    }

    if (data) {
      // Key exists, generate a new one
      retries++;
      continue;
    }

    // If we get here, there was an unexpected error
    throw new Error(`Failed to generate unique license key: ${error?.message || 'Unknown error'}`);
  }

  throw new Error('Failed to generate unique license key after maximum retries');
}

/**
 * Create a single license
 * 
 * @param orderId Order ID
 * @param userId User ID
 * @param productId Product ID
 * @returns Created license
 */
export async function createLicense(
  orderId: string,
  userId: string,
  productId: string
): Promise<License> {
  const supabase = await createServiceRoleClient();

  // Generate unique license key
  const licenseKey = await generateLicenseKey();

  // Verify product exists (allow inactive products for license creation)
  // Use service role client directly since getProductById filters by active=true
  const supabaseForProduct = await createServiceRoleClient();
  const { data: productData, error: productError } = await supabaseForProduct
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError || !productData) {
    throw new Error(`Product not found: ${productId}`);
  }

  // Create license
  const { data, error } = await supabase
    .from('licenses')
    .insert({
      order_id: orderId,
      user_id: userId,
      product_id: productId,
      license_key: licenseKey,
      status: 'active',
      lifetime_access: true,
      access_granted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating license:', error);
    throw new Error(`Failed to create license: ${error.message}`);
  }

  if (!data) {
    throw new Error('License creation returned no data');
  }

  return data;
}

/**
 * Create licenses for all items in a completed order
 * Generates one license per product in the order (handles quantity per item)
 * 
 * @param orderId Order ID
 * @returns Array of created licenses
 */
export async function createLicensesForOrder(orderId: string): Promise<License[]> {
  const order = await getOrderWithItems(orderId);

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (!order.items || order.items.length === 0) {
    console.warn(`Order ${orderId} has no items, skipping license generation`);
    return [];
  }

  if (!order.user_id) {
    throw new Error(`Order ${orderId} has no user_id`);
  }

  const licenses: License[] = [];

  // Create a license for each product in the order
  // If quantity > 1, we still create one license (license grants access to product)
  const uniqueProducts = new Set<string>();
  
  for (const item of order.items) {
    if (!item.product_id) {
      console.warn(`Order item ${item.id} has no product_id, skipping`);
      continue;
    }

    // Check if we've already created a license for this product in this order
    // (in case of duplicate items, we create one license per product)
    const productKey = `${orderId}-${item.product_id}`;
    if (uniqueProducts.has(productKey)) {
      continue;
    }

    uniqueProducts.add(productKey);

    try {
      const license = await createLicense(orderId, order.user_id, item.product_id);
      licenses.push(license);
    } catch (error) {
      console.error(`Error creating license for product ${item.product_id}:`, error);
      // Continue with other products even if one fails
    }
  }

  return licenses;
}

/**
 * Get all licenses for a user with product information
 * 
 * @param userId User ID
 * @returns Array of licenses with product data
 */
export async function getUserLicenses(userId: string): Promise<LicenseWithProduct[]> {
  const supabase = await createClient();

  const { data: licenses, error } = await supabase
    .from('licenses')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user licenses:', error);
    throw new Error(`Failed to fetch licenses: ${error.message}`);
  }

  return (licenses || []).map(license => ({
    ...license,
    product: license.product || undefined,
  })) as LicenseWithProduct[];
}

/**
 * Get license by license key
 * Used for license validation
 * 
 * @param licenseKey License key string
 * @returns License or null if not found
 */
export async function getLicenseByKey(licenseKey: string): Promise<License | null> {
  const supabase = await createServiceRoleClient();

  // Validate format first
  if (!validateLicenseKeyFormat(licenseKey)) {
    return null;
  }

  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // License not found
    }
    console.error('Error fetching license by key:', error);
    throw new Error(`Failed to fetch license: ${error.message}`);
  }

  return data;
}

/**
 * Get license by ID with product information
 * 
 * @param licenseId License ID
 * @returns License with product data or null
 */
export async function getLicenseById(licenseId: string): Promise<LicenseWithProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('licenses')
    .select(`
      *,
      product:products(*)
    `)
    .eq('id', licenseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching license by ID:', error);
    throw new Error(`Failed to fetch license: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    product: data.product || undefined,
  } as LicenseWithProduct;
}

/**
 * Update license status
 * 
 * @param licenseId License ID
 * @param status New status
 * @returns Updated license
 */
export async function updateLicenseStatus(
  licenseId: string,
  status: LicenseStatus
): Promise<License> {
  const supabase = await createClient();

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Set activated_at if activating
  if (status === 'active') {
    updateData.activated_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('licenses')
    .update(updateData)
    .eq('id', licenseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating license status:', error);
    throw new Error(`Failed to update license status: ${error.message}`);
  }

  if (!data) {
    throw new Error('License update returned no data');
  }

  return data;
}

/**
 * Get user's licenses for a specific product
 * 
 * @param userId User ID
 * @param productId Product ID
 * @returns Array of licenses for the product
 */
export async function getUserProductLicenses(
  userId: string,
  productId: string
): Promise<License[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user product licenses:', error);
    throw new Error(`Failed to fetch licenses: ${error.message}`);
  }

  return data || [];
}

/**
 * Check if user has active license for a product
 * 
 * @param userId User ID
 * @param productId Product ID
 * @returns true if user has active license, false otherwise
 */
export async function userHasActiveLicense(
  userId: string,
  productId: string
): Promise<boolean> {
  const licenses = await getUserProductLicenses(userId, productId);
  
  if (licenses.length === 0) {
    return false;
  }

  // Check if any license is active and not expired
  const now = new Date();
  return licenses.some(license => {
    if (license.status !== 'active') {
      return false;
    }

    // Check expiration if not lifetime access
    if (!license.lifetime_access && license.expires_at) {
      const expiresAt = new Date(license.expires_at);
      return expiresAt > now;
    }

    return true;
  });
}
