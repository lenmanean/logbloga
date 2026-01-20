/**
 * Next.js instrumentation file
 * Automatically loads when the Next.js server starts
 * Required for Sentry to instrument server-side code
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only import Sentry on Node.js runtime
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Import Sentry for Edge runtime (middleware, Edge API routes)
    await import('./sentry.edge.config');
  }
}
