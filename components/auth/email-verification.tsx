'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function EmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const supabase = createClient();

  // Check verification status
  useEffect(() => {
    const checkVerification = async () => {
      if (!user) return;

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.email_confirmed_at) {
        setIsVerified(true);
        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    };

    checkVerification();
    
    // Poll for verification status every 5 seconds
    const interval = setInterval(checkVerification, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (resendError) {
        setError(getAuthErrorMessage(resendError));
      } else {
        setSuccess(true);
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
          We've sent a verification link to {user?.email || 'your email'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <p>Verification email sent! Please check your inbox.</p>
          </div>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>To complete your registration, please check your email and click the verification link.</p>
          <p>If you don't see the email, check your spam folder.</p>
        </div>

        {user?.email && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm font-medium">Email sent to:</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResendEmail}
          disabled={isResending || !user?.email}
        >
          {isResending ? 'Sending...' : 'Resend Verification Email'}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={refreshSession}
        >
          Check Verification Status
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

