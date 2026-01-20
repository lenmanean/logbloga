'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Analytics Provider Component
 * Wraps the analytics hook for easy integration
 */
export default function AnalyticsProvider() {
  useAnalytics();
  return null; // This component doesn't render anything
}
