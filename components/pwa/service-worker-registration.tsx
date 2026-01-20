'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa/service-worker';

/**
 * Service Worker Registration Component
 * Registers service worker in production only
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return null; // This component doesn't render anything
}
