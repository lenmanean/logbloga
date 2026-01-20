/**
 * Sentry client-side configuration
 * Tracks errors and performance in the browser
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out common false positives
  beforeSend(event, hint) {
    // Filter out browser extension errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (
          message.includes('chrome-extension://') ||
          message.includes('moz-extension://') ||
          message.includes('safari-extension://')
        ) {
          return null; // Don't send these errors
        }
      }
    }
    return event;
  },
  
  // Set user context
  initialScope: {
    tags: {
      environment: process.env.NODE_ENV || 'development',
    },
  },
});
