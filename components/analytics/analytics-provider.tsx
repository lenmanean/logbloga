'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, trackPageView } from '@/lib/analytics/client';
import { useEffect } from 'react';

/**
 * Internal analytics component that uses useSearchParams
 */
function AnalyticsInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics on mount
    initAnalytics();
  }, []);

  useEffect(() => {
    // Track page view on route change
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);
  
  return null;
}

/**
 * Analytics Provider Component
 * Wrapped in Suspense to handle useSearchParams
 */
export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInternal />
    </Suspense>
  );
}
