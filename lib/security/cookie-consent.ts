/**
 * Cookie consent utilities
 * Handles cookie consent management for GDPR compliance
 */

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookieConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Get cookie consent preferences for a user
 */
export async function getCookieConsent(userId?: string): Promise<CookieConsentPreferences | null> {
  if (!userId) {
    // For guests, check localStorage cookie (handled client-side)
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cookie_consents')
    .select('essential, analytics, marketing')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    essential: data.essential ?? true,
    analytics: data.analytics ?? false,
    marketing: data.marketing ?? false,
  };
}

/**
 * Save cookie consent preferences
 */
export async function saveCookieConsent(
  userId: string,
  preferences: CookieConsentPreferences
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from('cookie_consents')
    .upsert({
      user_id: userId,
      essential: preferences.essential ?? true,
      analytics: preferences.analytics ?? false,
      marketing: preferences.marketing ?? false,
      consent_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Error saving cookie consent:', error);
    throw new Error(`Failed to save cookie consent: ${error.message}`);
  }
}

/**
 * Get guest cookie consent from cookie
 */
export function getGuestCookieConsent(): CookieConsentPreferences | null {
  // This should be called client-side
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const consentCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookie_consent='));

    if (!consentCookie) {
      return null;
    }

    const value = consentCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded);

    return {
      essential: parsed.essential ?? true,
      analytics: parsed.analytics ?? false,
      marketing: parsed.marketing ?? false,
    };
  } catch {
    return null;
  }
}

/**
 * Set guest cookie consent in cookie
 */
export function setGuestCookieConsent(preferences: CookieConsentPreferences): void {
  // This should be called client-side
  if (typeof window === 'undefined') {
    return;
  }

  const cookieValue = JSON.stringify(preferences);
  const encoded = encodeURIComponent(cookieValue);
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  const isProduction = process.env.NODE_ENV === 'production';

  document.cookie = `cookie_consent=${encoded}; max-age=${maxAge}; path=/; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

/**
 * Check if a cookie category is consented
 */
export async function hasConsent(
  category: CookieCategory,
  userId?: string
): Promise<boolean> {
  const preferences = userId
    ? await getCookieConsent(userId)
    : getGuestCookieConsent();

  if (!preferences) {
    // No consent given, only allow essential
    return category === 'essential';
  }

  return preferences[category] ?? false;
}
