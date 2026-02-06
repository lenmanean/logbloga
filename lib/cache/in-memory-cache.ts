/**
 * In-memory cache implementation
 * In-memory cache used for products, blog, and API response caching
 */

import type { CacheEntry, CacheOptions } from './types';

interface MemoryCache {
  [key: string]: CacheEntry<any>;
}

class InMemoryCache {
  private cache: MemoryCache = {};
  private maxSize = 1000; // Maximum number of entries

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache[key];

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || 300; // Default 5 minutes
    const expiresAt = Date.now() + ttl * 1000;

    // Remove oldest entry if cache is full
    if (Object.keys(this.cache).length >= this.maxSize) {
      const oldestKey = Object.keys(this.cache).sort(
        (a, b) => this.cache[a].expiresAt - this.cache[b].expiresAt
      )[0];
      delete this.cache[oldestKey];
    }

    this.cache[key] = {
      value,
      expiresAt,
      tags: options.tags,
    };
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    delete this.cache[key];
  }

  /**
   * Delete all entries with matching tags
   */
  async deleteByTag(tag: string): Promise<void> {
    Object.keys(this.cache).forEach((key) => {
      const entry = this.cache[key];
      if (entry.tags && entry.tags.includes(tag)) {
        delete this.cache[key];
      }
    });
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache = {};
  }

  /**
   * Get cache size
   */
  size(): number {
    return Object.keys(this.cache).length;
  }
}

// Singleton instance
const instance = new InMemoryCache();

export default instance;
