/**
 * Saved addresses database operations
 * Provides functions to manage user saved addresses
 */

import { createClient } from '@/lib/supabase/server';

export type AddressType = 'billing' | 'shipping' | 'both';

export interface SavedAddress {
  id: string;
  user_id: string;
  type: AddressType;
  label: string | null;
  full_name: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  phone: string | null;
  is_default_billing: boolean;
  is_default_shipping: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  type: AddressType;
  label?: string;
  full_name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  is_default_billing?: boolean;
  is_default_shipping?: boolean;
}

/**
 * Get all saved addresses for a user
 */
export async function getUserAddresses(userId: string): Promise<SavedAddress[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('saved_addresses' as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw new Error(`Failed to fetch addresses: ${error.message}`);
  }

  return (data || []) as unknown as SavedAddress[];
}

/**
 * Get default address for a specific type
 */
export async function getDefaultAddress(
  userId: string,
  type: 'billing' | 'shipping'
): Promise<SavedAddress | null> {
  const supabase = await createClient();

  const field = type === 'billing' ? 'is_default_billing' : 'is_default_shipping';

  const { data, error } = await supabase
    .from('saved_addresses' as any)
    .select('*')
    .eq('user_id', userId)
    .eq(field, true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching default address:', error);
    throw new Error(`Failed to fetch default address: ${error.message}`);
  }

  return data as unknown as SavedAddress | null;
}

/**
 * Create a new saved address
 */
export async function createAddress(
  userId: string,
  addressData: CreateAddressData
): Promise<SavedAddress> {
  const supabase = await createClient();

  // If setting as default, unset other defaults of the same type
  if (addressData.is_default_billing) {
    await supabase
      .from('saved_addresses' as any)
      .update({ is_default_billing: false })
      .eq('user_id', userId)
      .eq('is_default_billing', true);
  }

  if (addressData.is_default_shipping) {
    await supabase
      .from('saved_addresses' as any)
      .update({ is_default_shipping: false })
      .eq('user_id', userId)
      .eq('is_default_shipping', true);
  }

  const { data, error } = await supabase
    .from('saved_addresses' as any)
    .insert({
      user_id: userId,
      ...addressData,
      country: addressData.country || 'US',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    throw new Error(`Failed to create address: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create address: No data returned');
  }

  return data as unknown as SavedAddress;
}

/**
 * Update an existing address
 */
export async function updateAddress(
  addressId: string,
  userId: string,
  updates: Partial<CreateAddressData>
): Promise<SavedAddress> {
  const supabase = await createClient();

  // If setting as default, unset other defaults of the same type
  if (updates.is_default_billing) {
    await supabase
      .from('saved_addresses' as any)
      .update({ is_default_billing: false })
      .eq('user_id', userId)
      .eq('is_default_billing', true)
      .neq('id', addressId);
  }

  if (updates.is_default_shipping) {
    await supabase
      .from('saved_addresses' as any)
      .update({ is_default_shipping: false })
      .eq('user_id', userId)
      .eq('is_default_shipping', true)
      .neq('id', addressId);
  }

  const { data, error } = await supabase
    .from('saved_addresses' as any)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', addressId)
    .eq('user_id', userId) // Ensure user owns the address
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw new Error(`Failed to update address: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update address: No data returned');
  }

  return data as unknown as SavedAddress;
}

/**
 * Delete an address
 */
export async function deleteAddress(
  addressId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('saved_addresses' as any)
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId); // Ensure user owns the address

  if (error) {
    console.error('Error deleting address:', error);
    throw new Error(`Failed to delete address: ${error.message}`);
  }
}

/**
 * Set default address for billing or shipping
 */
export async function setDefaultAddress(
  addressId: string,
  userId: string,
  type: 'billing' | 'shipping'
): Promise<SavedAddress> {
  const supabase = await createClient();

  const field = type === 'billing' ? 'is_default_billing' : 'is_default_shipping';

  // Unset other defaults of the same type
  await supabase
    .from('saved_addresses' as any)
    .update({ [field]: false })
    .eq('user_id', userId)
    .eq(field, true)
    .neq('id', addressId);

  // Set this address as default
  const { data, error } = await supabase
    .from('saved_addresses' as any)
    .update({
      [field]: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', addressId)
    .eq('user_id', userId) // Ensure user owns the address
    .select()
    .single();

  if (error) {
    console.error('Error setting default address:', error);
    throw new Error(`Failed to set default address: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to set default address: No data returned');
  }

  return data as unknown as SavedAddress;
}

