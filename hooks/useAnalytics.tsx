'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, trackPageView } from '@/lib/analytics/client';

/**
 * Analytics hook
 * Tracks page views and initializes analytics on mount
 */
export function useAnalytics() {
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
}
