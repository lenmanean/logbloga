import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export type AuthMethod = 'password' | 'otp';

/**
 * POST /api/auth/auth-method
 * Returns { authMethod: 'password' | 'otp' } for the given email.
 * Used by sign-in UI to show password field or "Send one-time code" without user enumeration.
 * Unknown or invalid emails return 'otp'.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase.rpc('get_auth_method', {
      user_email: email,
    });

    if (error) {
      console.error('get_auth_method RPC error:', error);
      return NextResponse.json(
        { authMethod: 'otp' as AuthMethod },
        { status: 200 }
      );
    }

    const authMethod: AuthMethod =
      data === 'password' ? 'password' : 'otp';

    return NextResponse.json({ authMethod }, { status: 200 });
  } catch (error) {
    console.error('Auth method API error:', error);
    return NextResponse.json(
      { authMethod: 'otp' as AuthMethod },
      { status: 200 }
    );
  }
}
