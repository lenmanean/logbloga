'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AdPlacementProps {
  zone: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
  adUnitId?: string;
}

/**
 * Google AdSense ad placement component
 * Respects cookie consent and environment settings
 */
export function AdPlacement({ zone, className, adUnitId }: AdPlacementProps) {
  const [showAds, setShowAds] = useState(false);
  const [adsenseEnabled, setAdsenseEnabled] = useState(false);

  useEffect(() => {
    // Check if AdSense is enabled
    const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
    setAdsenseEnabled(enabled);

    if (!enabled) {
      return;
    }

    // Check cookie consent for analytics/marketing cookies
    // This is a simplified check - adjust based on your cookie consent implementation
    const checkCookieConsent = () => {
      // Check if user has consented to marketing/analytics cookies
      // Adjust this based on your actual cookie consent implementation
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        try {
          const parsed = JSON.parse(consent);
          return parsed.marketing === true || parsed.analytics === true;
        } catch {
          return false;
        }
      }
      return false;
    };

    const hasConsent = checkCookieConsent();
    setShowAds(enabled && hasConsent);
  }, []);

  // Get ad unit ID from props or environment
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const unitId = adUnitId || process.env[`NEXT_PUBLIC_ADSENSE_UNIT_${zone.toUpperCase()}`];

  if (!adsenseEnabled || !showAds || !clientId) {
    return null;
  }

  // Generate unique ad slot ID
  const adSlotId = `adsense-${zone}-${Date.now()}`;

  return (
    <div className={cn('ad-placement', `ad-zone-${zone}`, className)}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={unitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={adSlotId}>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
