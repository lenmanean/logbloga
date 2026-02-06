'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useOtpAuth } from '@/hooks/useOtpAuth';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';

const emailOnlySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type EmailOnlyFormData = z.infer<typeof emailOnlySchema>;
type SignInFormData = z.infer<typeof signInSchema>;

type AuthMethod = 'password' | 'otp';
type SignInPhase = 'email' | 'password' | 'otp';

function SignInFormContent() {
  const [phase, setPhase] = useState<SignInPhase>('email');
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/account/profile';

  const otp = useOtpAuth({
    onSuccess: () => {
      router.push(redirectTo);
      router.refresh();
    },
  });

  const emailForm = useForm<EmailOnlyFormData>({
    resolver: zodResolver(emailOnlySchema),
  });

  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const handleContinue = async (data: EmailOnlyFormData) => {
    setError(null);
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/auth-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      const method: AuthMethod = json.authMethod === 'password' ? 'password' : 'otp';
      setAuthMethod(method);

      if (method === 'password') {
        passwordForm.setValue('email', data.email);
        passwordForm.setValue('password', '');
        setPhase('password');
      } else {
        otp.setEmail(data.email);
        otp.setError(null);
        await otp.sendOtp();
        setPhase('otp');
      }
    } catch {
      setError('Could not determine sign-in method. Try again.');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const onSubmitPassword = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(data.email, data.password);

      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        setIsLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    otp.setError(null);
    await otp.sendOtp();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await otp.verifyOtp(otp.otpCode);
  };

  const backToEmail = () => {
    setPhase('email');
    setAuthMethod(null);
    setError(null);
    otp.setError(null);
    otp.setStep('email');
    otp.setOtpCode('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          {phase === 'email'
            ? 'Enter your email to continue'
            : phase === 'password'
              ? 'Enter your password'
              : otp.step === 'otp'
                ? `Enter the 8-digit code sent to ${otp.email}`
                : 'Use a one-time code sent to your email'}
        </CardDescription>
      </CardHeader>

      {(error || otp.error) && (
        <div className="mx-6 mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
          {phase === 'otp' ? otp.error : error}
        </div>
      )}

      {phase === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleContinue)}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...emailForm.register('email')}
                aria-invalid={emailForm.formState.errors.email ? 'true' : 'false'}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isCheckingAuth}>
              {isCheckingAuth ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Continue...
                </>
              ) : (
                'Continue'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      )}

      {phase === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="password-email">Email</Label>
              <Input
                id="password-email"
                type="email"
                value={passwordForm.watch('email')}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...passwordForm.register('password')}
                aria-invalid={passwordForm.formState.errors.password ? 'true' : 'false'}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                {...passwordForm.register('rememberMe')}
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <button
              type="button"
              onClick={backToEmail}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Use a different email
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      )}

      {phase === 'otp' && otp.step === 'email' && (
        <form onSubmit={handleSendOtp}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="otp-email">Email</Label>
              <Input
                id="otp-email"
                type="email"
                value={otp.email}
                readOnly
                className="bg-muted"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={otp.isSending}>
              {otp.isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send one-time code
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={backToEmail}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Use a different email
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      )}

      {phase === 'otp' && otp.step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="otp-code">Verification code</Label>
              <Input
                id="otp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={otp.otpCode}
                onChange={(e) => otp.setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="00000000"
                className="text-center text-2xl font-mono tracking-widest h-14"
                disabled={otp.isVerifying}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 8-digit code sent to {otp.email}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={otp.isVerifying || otp.otpCode.length !== 8}
            >
              {otp.isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={otp.resend}
              disabled={otp.isSending || otp.resendCooldown > 0}
            >
              {otp.resendCooldown > 0
                ? `Resend code in ${otp.resendCooldown}s`
                : otp.isSending
                  ? 'Sending...'
                  : 'Resend code'}
            </Button>
            <button
              type="button"
              onClick={backToEmail}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Use a different email
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export function SignInForm() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded-md" />
              <div className="h-10 bg-muted animate-pulse rounded-md" />
            </div>
          </CardContent>
        </Card>
      }
    >
      <SignInFormContent />
    </Suspense>
  );
}
