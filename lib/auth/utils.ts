import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/hooks/useAuth';

/**
 * Get current user in server components
 * Returns null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name,
    image: user.user_metadata?.avatar_url,
    ...user.user_metadata,
  };
}

/**
 * Require authentication in server components
 * Redirects to sign in if not authenticated
 * Returns the authenticated user
 */
export async function requireAuth(redirectTo?: string): Promise<User> {
  const user = await getServerUser();

  if (!user) {
    const signInUrl = '/auth/signin';
    if (redirectTo) {
      redirect(`${signInUrl}?redirect=${encodeURIComponent(redirectTo)}`);
    } else {
      redirect(signInUrl);
    }
  }

  return user;
}

/**
 * Check if user is authenticated in server context
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return !!user;
}

/**
 * Redirect to sign in page with optional return URL
 */
export function redirectToSignIn(returnUrl?: string) {
  const signInUrl = '/auth/signin';
  if (returnUrl) {
    redirect(`${signInUrl}?redirect=${encodeURIComponent(returnUrl)}`);
  } else {
    redirect(signInUrl);
  }
}

/**
 * Get Supabase user in server components
 * Returns null if not authenticated
 */
export async function getServerSupabaseUser(): Promise<SupabaseUser | null> {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

