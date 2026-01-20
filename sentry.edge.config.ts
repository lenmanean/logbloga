/**
 * Sentry edge runtime configuration
 * Tracks errors in Edge runtime (middleware, Edge API routes)
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console
  debug: false,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production' || !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  environment: process.env.NODE_ENV || 'development',
});
