import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';

export type MockTableOverrides = Record<
  string,
  { data?: any; error?: any }
>;

/**
 * Create a mock Supabase client
 * @param tableOverrides - Optional map of table name -> { data, error } for .single() / .maybeSingle() / .then()
 */
export function createMockSupabaseClient(
  tableOverrides?: MockTableOverrides
): Partial<SupabaseClient> {
  const mockData: Record<string, any> = {};
  const mockError: Record<string, any> = {};
  if (tableOverrides) {
    for (const [table, v] of Object.entries(tableOverrides)) {
      if (v.data !== undefined) mockData[table] = v.data;
      if (v.error !== undefined) mockError[table] = v.error;
    }
  }

  const createMockQuery = (table: string) => {
    return {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockData[table] || null,
        error: mockError[table] || null,
      }),
      maybeSingle: vi.fn().mockResolvedValue({
        data: mockData[table] || null,
        error: mockError[table] || null,
      }),
      then: vi.fn().mockResolvedValue({
        data: mockData[table] || [],
        error: mockError[table] || null,
      }),
    };
  };

  return {
    from: vi.fn((table: string) => createMockQuery(table)),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signUp: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      signInWithOtp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      verifyOtp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
    } as any,
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
        createSignedUrl: vi.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/file' },
          error: null,
        }),
      }),
    } as any,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any;
}

/**
 * Set mock data for a table
 */
export function setMockData(table: string, data: any) {
  // This would be used in tests to set expected return values
  // Implementation depends on how the mock is structured
}

/**
 * Set mock error for a table
 */
export function setMockError(table: string, error: any) {
  // This would be used in tests to simulate errors
}
