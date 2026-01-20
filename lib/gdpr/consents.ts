/**
 * GDPR consent management utilities
 * Handles consent tracking for marketing, analytics, and data processing
 */

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export type ConsentType = 'marketing' | 'analytics' | 'data_processing' | 'third_party_sharing';

export interface Consent {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  granted_at: string;
  revoked_at: string | null;
  metadata?: Record<string, any>;
}

/**
 * Grant consent for a specific type
 */
export async function grantConsent(
  userId: string,
  consentType: ConsentType,
  metadata?: Record<string, any>
): Promise<void> {
  const supabase = await createServiceRoleClient();

  // Check if consent already exists
  const { data: existing } = await supabase
    .from('consents')
    .select('id, granted')
    .eq('user_id', userId)
    .eq('consent_type', consentType)
    .single();

  if (existing) {
    // Update existing consent
    const { error } = await supabase
      .from('consents')
      .update({
        granted: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        metadata: metadata || {},
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating consent:', error);
      throw new Error(`Failed to grant consent: ${error.message}`);
    }
  } else {
    // Create new consent
    const { error } = await supabase
      .from('consents')
      .insert({
        user_id: userId,
        consent_type: consentType,
        granted: true,
        granted_at: new Date().toISOString(),
        metadata: metadata || {},
      });

    if (error) {
      console.error('Error creating consent:', error);
      throw new Error(`Failed to grant consent: ${error.message}`);
    }
  }
}

/**
 * Revoke consent for a specific type
 */
export async function revokeConsent(
  userId: string,
  consentType: ConsentType
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from('consents')
    .update({
      granted: false,
      revoked_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('consent_type', consentType);

  if (error) {
    console.error('Error revoking consent:', error);
    throw new Error(`Failed to revoke consent: ${error.message}`);
  }
}

/**
 * Check if user has granted consent for a specific type
 */
export async function hasConsent(
  userId: string,
  consentType: ConsentType
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('consents')
    .select('granted')
    .eq('user_id', userId)
    .eq('consent_type', consentType)
    .eq('granted', true)
    .is('revoked_at', null)
    .single();

  if (error || !data) {
    return false;
  }

  return data.granted;
}

/**
 * Get all consents for a user
 */
export async function getUserConsents(userId: string): Promise<Consent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('consents')
    .select('*')
    .eq('user_id', userId)
    .order('granted_at', { ascending: false });

  if (error) {
    console.error('Error fetching consents:', error);
    throw new Error(`Failed to fetch consents: ${error.message}`);
  }

  return (data || []) as Consent[];
}

/**
 * Get consent history for a user
 */
export async function getConsentHistory(
  userId: string,
  consentType?: ConsentType
): Promise<Consent[]> {
  const supabase = await createClient();

  let query = supabase
    .from('consents')
    .select('*')
    .eq('user_id', userId);

  if (consentType) {
    query = query.eq('consent_type', consentType);
  }

  const { data, error } = await query.order('granted_at', { ascending: false });

  if (error) {
    console.error('Error fetching consent history:', error);
    throw new Error(`Failed to fetch consent history: ${error.message}`);
  }

  return (data || []) as Consent[];
}
