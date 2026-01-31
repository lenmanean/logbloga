/**
 * Common types for database operations
 */

export interface DbError {
  message: string;
  code?: string;
  details?: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ProductQueryOptions extends QueryOptions {
  category?: string;
  featured?: boolean;
  active?: boolean;
  search?: string;
  productType?: 'package' | 'individual';
  /** When set, only return products with these types (e.g. package, bundle for storefront) */
  productTypes?: ('package' | 'bundle')[];
}

