/**
 * Redis cache implementation using Upstash Redis
 * Provides caching layer for API responses and database queries
 */

import { Redis } from '@upstash/redis';
import type { CacheEntry, CacheOptions } from './types';
import inMemoryCache from './in-memory-cache';

let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 */
function getRedisClient(): Redis | null {
  // Check if Redis is configured
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
}

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
  const redis = getRedisClient();

  if (redis) {
    try {
      const value = await redis.get<T>(cacheKey);
      return value;
    } catch (error) {
      console.error('Redis get error:', error);
      // Fallback to in-memory cache
      return inMemoryCache.get<T>(cacheKey);
    }
  }

  // Fallback to in-memory cache if Redis not available
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
  const ttl = options.ttl || 300; // Default 5 minutes
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.set(cacheKey, value, { ex: ttl });
      
      // Store tags if provided
      if (options.tags && options.tags.length > 0) {
        const tagKey = `tag:${options.tags.join(':')}`;
        await redis.sadd(tagKey, cacheKey);
        await redis.expire(tagKey, ttl);
      }
    } catch (error) {
      console.error('Redis set error:', error);
      // Fallback to in-memory cache
      await inMemoryCache.set(cacheKey, value, options);
    }
  } else {
    // Fallback to in-memory cache if Redis not available
    await inMemoryCache.set(cacheKey, value, options);
  }
}

/**
 * Delete value from cache
 */
export async function deleteCached(key: string, prefix?: string): Promise<void> {
  const cacheKey = generateCacheKey(key, prefix);
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.del(cacheKey);
    } catch (error) {
      console.error('Redis delete error:', error);
      // Fallback to in-memory cache
      await inMemoryCache.delete(cacheKey);
    }
  } else {
    await inMemoryCache.delete(cacheKey);
  }
}

/**
 * Delete all entries with matching tag
 */
export async function deleteByTag(tag: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const tagKey = `tag:${tag}`;
      const keys = await redis.smembers<string[]>(tagKey);
      
      if (keys && keys.length > 0) {
        await redis.del(...keys);
        await redis.del(tagKey);
      }
    } catch (error) {
      console.error('Redis delete by tag error:', error);
      // Fallback to in-memory cache
      await inMemoryCache.deleteByTag(tag);
    }
  } else {
    await inMemoryCache.deleteByTag(tag);
  }
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
  // Try to get from cache first
  const cached = await getCached<T>(key, prefix);
  
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch data
  const value = await fetcher();
  
  // Store in cache
  await setCached(key, value, options, prefix);
  
  return value;
}

/**
 * Clear all cache entries for a prefix
 */
export async function clearCachePrefix(prefix: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const pattern = generateCacheKey('*', prefix);
      // Note: Upstash Redis doesn't support KEYS pattern, need to track keys manually
      // For now, we'll use tags or individual key deletion
      console.warn('Cache prefix clearing not fully implemented for Redis - use tags instead');
    } catch (error) {
      console.error('Redis clear prefix error:', error);
    }
  }
}

/**
 * Check if cache is available (Redis or in-memory)
 */
export function isCacheAvailable(): boolean {
  const redis = getRedisClient();
  return redis !== null || true; // In-memory cache is always available
}
