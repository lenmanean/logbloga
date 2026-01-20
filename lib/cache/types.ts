/**
 * Cache type definitions
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags?: string[];
}
