/**
 * Blog-specific types for database operations
 */

import type { QueryOptions } from '../types';

export interface BlogQueryOptions extends QueryOptions {
  published?: boolean; // Default: true for public, false for admin
  tags?: string[];
  search?: string;
  author?: string;
}
