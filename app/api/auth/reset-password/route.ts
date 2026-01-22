import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/utils';

/**
 * Server-side password reset handler
 * POST /api/auth/reset-password
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const appUrl = getAppUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password?token=reset_token`,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

