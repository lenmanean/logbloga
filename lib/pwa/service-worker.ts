/**
 * Service Worker utilities
 * Provides functions to register and manage service worker
 */

/**
 * Register service worker
 * Should be called from client-side code
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return; // Not available in SSR or browser doesn't support SW
  }

  if (process.env.NODE_ENV !== 'production') {
    return; // Only register in production
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

/**
 * Unregister service worker
 * Useful for development or debugging
 */
export function unregisterServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}
