'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CookieConsentPreferences } from '@/lib/security/cookie-consent';

export interface CookieConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  loaded: boolean;
}

/**
 * Hook for managing cookie consent on the client side
 */
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookieConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
    loaded: false,
  });

  // Load preferences from cookie/localStorage
  useEffect(() => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem('cookie_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          essential: parsed.essential ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
          loaded: true,
        });
        return;
      }

      // Check cookie as fallback
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('cookie_consent='));

      if (cookie) {
        const value = cookie.split('=')[1];
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        setPreferences({
          essential: parsed.essential ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
          loaded: true, // Required so requiresConsent becomes false after load
        });
      } else {
        setPreferences((prev) => ({ ...prev, loaded: true }));
      }
    } catch {
      setPreferences((prev) => ({ ...prev, loaded: true }));
    }
  }, []);

  // Save preferences
  const savePreferences = useCallback(
    async (newPreferences: CookieConsentPreferences) => {
      // Update state
      setPreferences((prev) => ({
        ...prev,
        ...newPreferences,
        loaded: true,
      }));

      // Save to localStorage
      localStorage.setItem('cookie_consent', JSON.stringify(newPreferences));

      // Save to cookie
      const cookieValue = JSON.stringify(newPreferences);
      const encoded = encodeURIComponent(cookieValue);
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      const isProduction = process.env.NODE_ENV === 'production';
      document.cookie = `cookie_consent=${encoded}; max-age=${maxAge}; path=/; SameSite=Strict${isProduction ? '; Secure' : ''}`;

      // Save to database if authenticated
      try {
        const response = await fetch('/api/cookie-consent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPreferences),
        });

        if (!response.ok) {
          console.error('Failed to save cookie consent to database');
        }
      } catch (error) {
        console.error('Error saving cookie consent:', error);
        // Don't throw - continue even if database save fails
      }

      // Load analytics/marketing scripts if consented
      if (newPreferences.analytics) {
        // Load analytics script (replace with your actual analytics)
        // Example: loadAnalyticsScript();
      }

      if (newPreferences.marketing) {
        // Load marketing scripts (replace with your actual marketing scripts)
        // Example: loadMarketingScripts();
      }
    },
    []
  );

  // Accept all cookies
  const acceptAll = useCallback(() => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  }, [savePreferences]);

  // Reject all except essential
  const rejectAll = useCallback(() => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  }, [savePreferences]);

  // Check if consent is required (no preferences saved)
  const requiresConsent = !preferences.loaded || (
    preferences.loaded &&
    typeof preferences.analytics === 'undefined' &&
    typeof preferences.marketing === 'undefined'
  );

  return {
    preferences,
    savePreferences,
    acceptAll,
    rejectAll,
    requiresConsent,
  };
}
