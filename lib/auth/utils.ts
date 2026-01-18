/**
 * Authentication utility functions for API routes
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Require authentication for API routes
 * Throws an error if user is not authenticated (will be caught by Next.js error handling)
 */
export async function requireAuth() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Create a redirect error that middleware/Next.js can handle
    const error = new Error('Unauthorized');
    (error as any).status = 401;
    (error as any).redirect = '/auth/signin';
    throw error;
  }

  return user;
}
