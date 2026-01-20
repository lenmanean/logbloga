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
 * 
 * **Note:** This function is not applicable for Supabase-managed connections.
 * Supabase manages connection pooling at the platform level, and connection pool
 * metrics are not exposed through the Supabase client API.
 * 
 * **When to implement:**
 * - If migrating to direct PostgreSQL connections (not recommended for Supabase projects)
 * - If using a connection pooling library like `pg-pool` for direct database access
 * - For custom connection pool monitoring in non-Supabase environments
 * 
 * **Current behavior:**
 * Returns zero values as Supabase connection pooling is handled transparently by the platform.
 * Connection limits and pool management are configured in the Supabase dashboard.
 * 
 * **Supabase connection management:**
 * - Connections are automatically managed by Supabase
 * - Connection limits are set per project tier
 * - No manual pool configuration needed
 * - Connection pooling is optimized by Supabase infrastructure
 * 
 * @returns Connection pool metrics (currently returns zeros for Supabase-managed connections)
 */
export async function getConnectionPoolMetrics(): Promise<{
  active: number;
  idle: number;
  waiting: number;
  total: number;
}> {
  // Supabase manages connection pooling at the platform level
  // Connection pool metrics are not available through the Supabase client API
  // This function returns zeros to indicate metrics are not available
  // 
  // For direct PostgreSQL connections, you would implement this using:
  // - pg-pool library: pool.totalCount, pool.idleCount, pool.waitingCount
  // - Custom connection pool monitoring
  // - Database system tables (pg_stat_activity, pg_stat_database)
  
  return {
    active: 0,
    idle: 0,
    waiting: 0,
    total: 0,
  };
}
