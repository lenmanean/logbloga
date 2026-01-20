/**
 * Cache header utilities for API routes
 * Provides functions to set appropriate cache headers based on data type
 */

import { NextResponse } from 'next/server';

export interface CacheHeaderOptions {
  maxAge?: number; // Maximum age in seconds
  sMaxAge?: number; // Shared max age (for CDN/proxy)
  isPrivate?: boolean; // Private cache (browser-only)
  mustRevalidate?: boolean; // Must revalidate before serving stale content
  noCache?: boolean; // Don't cache
  noStore?: boolean; // Don't store
  staleWhileRevalidate?: number; // Serve stale while revalidating (in seconds)
}

/**
 * Set Cache-Control headers on response
 */
export function setCacheHeaders(
  response: NextResponse,
  options: CacheHeaderOptions = {}
): NextResponse {
  const {
    maxAge = 0,
    sMaxAge,
    isPrivate = false,
    mustRevalidate = false,
    noCache = false,
    noStore = false,
    staleWhileRevalidate,
  } = options;

  const directives: string[] = [];

  if (noStore) {
    directives.push('no-store');
  } else if (noCache) {
    directives.push('no-cache');
  } else {
    if (isPrivate) {
      directives.push('private');
    } else {
      directives.push('public');
    }

    if (maxAge > 0) {
      directives.push(`max-age=${maxAge}`);
    }

    if (sMaxAge !== undefined) {
      directives.push(`s-maxage=${sMaxAge}`);
    } else if (maxAge > 0 && !isPrivate) {
      // Default s-maxage to maxAge for public caches
      directives.push(`s-maxage=${maxAge}`);
    }

    if (mustRevalidate) {
      directives.push('must-revalidate');
    }

    if (staleWhileRevalidate) {
      directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    }
  }

  response.headers.set('Cache-Control', directives.join(', '));

  // Set ETag support (optional - can be implemented later)
  // response.headers.set('ETag', generateETag(data));

  return response;
}

/**
 * Cache header presets for common use cases
 */
export const cachePresets = {
  /**
   * No caching - for user-specific or sensitive data
   */
  noCache: (): CacheHeaderOptions => ({
    noCache: true,
    mustRevalidate: true,
  }),

  /**
   * No store - for sensitive data that must never be cached
   */
  noStore: (): CacheHeaderOptions => ({
    noStore: true,
  }),

  /**
   * Short cache - for frequently changing data (1-5 minutes)
   */
  shortCache: (maxAge: number = 60): CacheHeaderOptions => ({
    maxAge,
    isPrivate: false,
    staleWhileRevalidate: maxAge * 2,
  }),

  /**
   * Medium cache - for moderately changing data (5-15 minutes)
   */
  mediumCache: (maxAge: number = 300): CacheHeaderOptions => ({
    maxAge,
    isPrivate: false,
    staleWhileRevalidate: maxAge,
  }),

  /**
   * Long cache - for stable data (15+ minutes)
   */
  longCache: (maxAge: number = 900): CacheHeaderOptions => ({
    maxAge,
    isPrivate: false,
    staleWhileRevalidate: maxAge / 2,
  }),

  /**
   * Private cache - for user-specific data
   */
  privateCache: (maxAge: number = 60): CacheHeaderOptions => ({
    maxAge,
    isPrivate: true,
  }),

  /**
   * Product cache - for product listings (10 minutes)
   */
  productCache: (): CacheHeaderOptions => ({
    maxAge: 600,
    isPrivate: false,
    staleWhileRevalidate: 300,
  }),

  /**
   * Static cache - for rarely changing data (1 hour)
   */
  staticCache: (): CacheHeaderOptions => ({
    maxAge: 3600,
    isPrivate: false,
    staleWhileRevalidate: 1800,
  }),
};

/**
 * Create cached response with appropriate headers
 */
export function cachedResponse<T>(
  data: T,
  options: CacheHeaderOptions = {},
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return setCacheHeaders(response, options);
}
