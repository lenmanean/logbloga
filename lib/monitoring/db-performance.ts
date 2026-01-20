/**
 * Database performance monitoring utilities
 * Tracks query performance and detects slow queries
 */

const SLOW_QUERY_THRESHOLD_MS = 500; // 500ms threshold for slow queries

interface QueryMetrics {
  queryName: string;
  duration: number;
  timestamp: number;
  error?: string;
}

/**
 * Track query performance
 * Wraps a database query and tracks its execution time
 */
export async function withPerformanceTracking<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - start;

    // Log slow queries
    if (duration > SLOW_QUERY_THRESHOLD_MS) {
      console.warn(`[Slow Query] ${queryName} took ${duration}ms`, {
        queryName,
        duration,
        timestamp: new Date().toISOString(),
      });

      // Send to monitoring service (Sentry, etc.)
      if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureMessage(`Slow query detected: ${queryName}`, {
          level: 'warning',
          tags: {
            type: 'slow_query',
            query_name: queryName,
            duration_ms: duration,
          },
        });
      }
    }

    // Log all queries in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Query] ${queryName} took ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log query errors
    console.error(`[Query Error] ${queryName} failed after ${duration}ms:`, errorMessage);

    // Send to monitoring service
    if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const Sentry = await import('@sentry/nextjs');
      Sentry.captureException(error, {
        tags: {
          type: 'query_error',
          query_name: queryName,
          duration_ms: duration,
        },
      });
    }

    throw error;
  }
}

/**
 * Track query metrics (for aggregation/monitoring)
 * Can be extended to send metrics to monitoring services
 */
export function trackQueryMetrics(metrics: QueryMetrics): void {
  // In the future, this could send metrics to:
  // - DataDog
  // - New Relic
  // - Custom monitoring dashboard
  // - Prometheus
  // For now, just log it
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Query Metrics]', metrics);
  }
}

/**
 * Get database connection pool metrics
 * Placeholder for future implementation with connection pooling library
 */
export async function getConnectionPoolMetrics(): Promise<{
  active: number;
  idle: number;
  waiting: number;
  total: number;
}> {
  // This would integrate with your database connection pool
  // For Supabase, connections are managed by the platform
  // But you could implement this for direct PostgreSQL connections
  return {
    active: 0,
    idle: 0,
    waiting: 0,
    total: 0,
  };
}
