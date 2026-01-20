/**
 * API performance monitoring utilities
 * Tracks API endpoint performance and adds timing headers
 */

import { NextResponse } from 'next/server';

const SLOW_API_THRESHOLD_MS = 1000; // 1 second threshold for slow API endpoints

interface APIMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: number;
  error?: string;
}

/**
 * Track API performance
 * Wraps an API route handler and tracks its performance
 */
export async function trackAPIPerformance(
  endpoint: string,
  method: string,
  handler: () => Promise<Response>
): Promise<Response> {
  const start = Date.now();

  try {
    const response = await handler();
    const duration = Date.now() - start;

    // Add performance headers
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    clonedResponse.headers.set('X-Response-Time', `${duration}ms`);

    // Log slow API endpoints
    if (duration > SLOW_API_THRESHOLD_MS) {
      console.warn(`[Slow API] ${method} ${endpoint} took ${duration}ms`, {
        endpoint,
        method,
        duration,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      });

      // Send to monitoring service (Sentry, etc.)
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureMessage(`Slow API endpoint: ${method} ${endpoint}`, {
          level: 'warning',
          tags: {
            type: 'slow_api',
            endpoint,
            method,
            duration_ms: duration,
            status_code: response.status,
          },
        });
      }
    }

    // Log all API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[API] ${method} ${endpoint} - ${response.status} - ${duration}ms`);
    }

    return clonedResponse;
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log API errors
    console.error(`[API Error] ${method} ${endpoint} failed after ${duration}ms:`, errorMessage);

    // Send to monitoring service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const Sentry = await import('@sentry/nextjs');
      Sentry.captureException(error, {
        tags: {
          type: 'api_error',
          endpoint,
          method,
          duration_ms: duration,
        },
      });
    }

    throw error;
  }
}

/**
 * Track API metrics (for aggregation/monitoring)
 */
export function trackAPIMetrics(metrics: APIMetrics): void {
  // In the future, this could send metrics to monitoring services
  // For now, just log it
  if (process.env.NODE_ENV === 'development') {
    console.debug('[API Metrics]', metrics);
  }
}
