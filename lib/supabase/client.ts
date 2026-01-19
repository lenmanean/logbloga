'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types/supabase';

/**
 * Supabase client for browser/client-side usage
 * Uses cookies for session management
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

