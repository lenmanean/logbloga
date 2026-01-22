import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/senders';

/**
 * Server-side signup handler
 * POST /api/auth/signup
 */
export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : {},
        // No emailRedirectTo - Supabase will send OTP code automatically
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Send welcome email after successful signup (non-blocking)
    if (data.user) {
      try {
        await sendWelcomeEmail(data.user.id, {
          user: {
            email: data.user.email || email,
            name: fullName || null,
          },
        });
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't fail signup if welcome email fails
      }
    }

    return NextResponse.json(
      { 
        user: data.user,
        session: data.session,
        message: 'Please check your email for a verification code',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

