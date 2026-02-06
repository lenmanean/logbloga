/**
 * Cache implementation using in-memory store
 * Used for API response and database query caching (e.g. products, blog).
 */

import type { CacheEntry, CacheOptions } from './types';
import inMemoryCache from './in-memory-cache';

/**
 * Generate cache key
 */
function generateCacheKey(key: string, prefix = 'cache'): string {
  return `${prefix}:${key}`;
}

/**
 * Get value from cache
 */
export async function getCached<T>(key: string, prefix?: string): Promise<T | null> {
  const cacheKey = generateCacheKey(key, prefix);
  return inMemoryCache.get<T>(cacheKey);
}

/**
 * Set value in cache
 */
export async function setCached<T>(
  key: string,
  value: T,
  options: CacheOptions = {},
  prefix?: string
): Promise<void> {
  const cacheKey = generateCacheKey(key, prefix);
  await inMemoryCache.set(cacheKey, value, options);
}

/**
 * Delete value from cache
 */
export async function deleteCached(key: string, prefix?: string): Promise<void> {
  const cacheKey = generateCacheKey(key, prefix);
  await inMemoryCache.delete(cacheKey);
}

/**
 * Delete all entries with matching tag
 */
export async function deleteByTag(tag: string): Promise<void> {
  await inMemoryCache.deleteByTag(tag);
}

/**
 * Get or set cached value
 * If cache miss, calls fetcher and stores result
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {},
  prefix?: string
): Promise<T> {
  const cached = await getCached<T>(key, prefix);
  if (cached !== null) {
    return cached;
  }
  const value = await fetcher();
  await setCached(key, value, options, prefix);
  return value;
}

/**
 * Clear all cache entries for a prefix
 * In-memory cache: use deleteByTag for targeted invalidation.
 */
export async function clearCachePrefix(_prefix: string): Promise<void> {
  // In-memory cache does not expose key iteration; use tags for invalidation
}

/**
 * Check if cache is available
 */
export function isCacheAvailable(): boolean {
  return true;
}
