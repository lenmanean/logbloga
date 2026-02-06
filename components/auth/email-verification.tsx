'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function EmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const supabase = createClient();

  // Get email from user, URL params, or localStorage
  useEffect(() => {
    // First, try to get from user object
    if (user?.email) {
      setEmail(user.email);
      return;
    }

    // Try to get from URL params (if passed from signup)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      // Store in localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_verification_email', emailParam);
      }
      return;
    }

    // Try to get from localStorage (fallback)
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('pending_verification_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [user, searchParams]);

  // Check verification status
  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.email_confirmed_at) {
        setIsVerified(true);
        // Clear stored email
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pending_verification_email');
        }
        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push('/auth/signin?verified=true');
        }, 2000);
      }
    };

    checkVerification();
    
    // Poll for verification status every 5 seconds
    const interval = setInterval(checkVerification, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 8) {
      setError('Please enter the 8-digit verification code');
      return;
    }

    const emailToUse = email || user?.email;
    if (!emailToUse) {
      setError('Email address is required. Please try signing up again.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: emailToUse,
        token: otpCode,
        type: 'signup',
      });

      if (verifyError) {
        setError(getAuthErrorMessage(verifyError));
      } else {
        setIsVerified(true);
        // Clear stored email
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pending_verification_email');
        }
        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push('/auth/signin?verified=true');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    const emailToUse = email || user?.email;
    if (!emailToUse) {
      setError('Email address is required. Please try signing up again.');
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        // No emailRedirectTo - Supabase will send OTP code automatically
      });

      if (resendError) {
        setError(getAuthErrorMessage(resendError));
      } else {
        setSuccess(true);
        setOtpCode(''); // Clear OTP input
        // Store email in case user refreshes
        if (typeof window !== 'undefined') {
          localStorage.setItem('pending_verification_email', emailToUse);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Email Verified!
          </CardTitle>
          <CardDescription>Your email has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Redirecting you to sign in...
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Verify Your Email
        </CardTitle>
        <CardDescription>
          We've sent a verification code to {email || user?.email || 'your email'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <p>Verification code sent! Please check your inbox.</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Enter Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="00000000"
              className="text-center text-2xl font-mono tracking-widest h-14"
              disabled={isVerifying}
            />
            <p className="text-xs text-muted-foreground">
              Enter the 8-digit code sent to your email
            </p>
          </div>

          {(email || user?.email) && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Email sent to:</p>
              <p className="text-sm text-muted-foreground">{email || (user ? user.email : null)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4">
        <Button
          className="w-full"
          onClick={handleVerifyOtp}
          disabled={isVerifying || !otpCode || otpCode.length !== 8}
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResendEmail}
          disabled={isResending || (!email && !user?.email)}
        >
          {isResending ? 'Sending...' : 'Resend Code'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

