/**
 * Sentry server-side configuration
 * Tracks errors and performance on the server
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production' || !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Filter out common false positives
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        // Filter out common database connection errors during development
        if (
          message.includes('ECONNREFUSED') ||
          message.includes('Connection refused')
        ) {
          return null;
        }
      }
    }
    return event;
  },
  
  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Set user context from server request
  initialScope: {
    tags: {
      environment: process.env.NODE_ENV || 'development',
    },
  },
});
