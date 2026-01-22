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
      // Log the actual error for debugging
      console.error('Signup error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        fullError: error,
      });
      
      // If user already exists, check if we can resend verification
      if (error.message.toLowerCase().includes('already registered') || 
          error.message.toLowerCase().includes('already exists') ||
          error.message.toLowerCase().includes('user already registered') ||
          error.message.toLowerCase().includes('email address is already registered')) {
        // Try to resend verification email for existing unverified user
        try {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
          });
          
          if (!resendError) {
            return NextResponse.json(
              { 
                error: 'An account with this email already exists. We\'ve sent a new verification code to your email.',
                requiresVerification: true,
              },
              { status: 400 }
            );
          }
        } catch (resendErr) {
          console.error('Error resending verification:', resendErr);
          // If resend fails, continue with original error
        }
      }
      
      // Return the error with proper status code
      // If it's a 500 from Supabase, return 500; otherwise 400
      const statusCode = error.status === 500 ? 500 : 400;
      return NextResponse.json(
        { error: error.message },
        { status: statusCode }
      );
    }

    // Send welcome email after successful signup (non-blocking, fire-and-forget)
    // Use setTimeout to ensure this doesn't block the response
    if (data.user) {
      setTimeout(async () => {
        try {
          await sendWelcomeEmail(data.user!.id, {
            user: {
              email: data.user!.email || email,
              name: fullName || null,
            },
          });
        } catch (error) {
          console.error('Error sending welcome email (non-blocking):', error);
          // Don't fail signup if welcome email fails - this is fire-and-forget
        }
      }, 0);
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
    // Log the full error for debugging
    console.error('Unexpected signup error:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        // Include original error in development
        ...(process.env.NODE_ENV === 'development' && { 
          details: error instanceof Error ? error.stack : String(error) 
        }),
      },
      { status: 500 }
    );
  }
}

