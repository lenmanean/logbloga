/**
 * Server-only: determine if a user has a password set (vs OTP/magic link only).
 * Uses get_auth_method RPC which reads auth.users; requires service role.
 */

import { createServiceRoleClient } from '@/lib/supabase/server';

export async function getHasPassword(userEmail: string): Promise<boolean> {
  if (!userEmail?.trim()) {
    return false;
  }

  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase.rpc('get_auth_method', {
      user_email: userEmail.trim(),
    });

    if (error) {
      return false;
    }

    return data === 'password';
  } catch {
    return false;
  }
}
