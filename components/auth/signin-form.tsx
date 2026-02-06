'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useOtpAuth } from '@/hooks/useOtpAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

type AuthMethod = 'password' | 'otp' | 'not_found';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInFormContent() {
  const [email, setEmail] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/account/profile';

  const debouncedEmail = useDebounce(email.trim(), 450);
  const emailLooksValid = EMAIL_REGEX.test(debouncedEmail);

  const otp = useOtpAuth({
    onSuccess: () => {
      router.push(redirectTo);
      router.refresh();
    },
  });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Debounced auth-method lookup
  useEffect(() => {
    if (!emailLooksValid || debouncedEmail === '') {
      setAuthMethod(null);
      setIsCheckingAuth(false);
      return;
    }

    let cancelled = false;
    setIsCheckingAuth(true);

    fetch('/api/auth/auth-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: debouncedEmail }),
    })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        if (cancelled) return;
        const method: AuthMethod =
          json.authMethod === 'password' ? 'password' : json.authMethod === 'not_found' ? 'not_found' : 'otp';
        setAuthMethod(method);
      })
      .catch(() => {
        if (!cancelled) setAuthMethod('otp');
      })
      .finally(() => {
        if (!cancelled) setIsCheckingAuth(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedEmail, emailLooksValid]);

  // Sync form email with local email state
  useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === 'email' && value.email !== undefined) {
        setEmail(value.email);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const isOtpCodeStep = otp.step === 'otp';

  const handleSubmitCredentials = async (data: SignInFormData) => {
    setError(null);

    if (authMethod === 'not_found') {
      setError('No account found with that email. Please sign up or check the address.');
      return;
    }

    if (authMethod === 'otp') {
      otp.setEmail(data.email);
      otp.setError(null);
      await otp.sendOtp();
      return;
    }

    if (authMethod === 'password') {
      const pwd = data.password?.trim();
      if (!pwd) {
        form.setError('password', { message: 'Password is required' });
        return;
      }
      setIsLoading(true);
      try {
        const { error: signInError } = await signIn(data.email, pwd);
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
      return;
    }

    setError('Please wait while we look up your account.');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await otp.verifyOtp(otp.otpCode);
  };

  const backToCredentials = () => {
    otp.setStep('email');
    otp.setError(null);
    otp.setOtpCode('');
    setError(null);
  };

  const primaryButtonLabel =
    authMethod === 'otp' ? 'Sign in with one-time code' : 'Sign in';
  const primaryDisabled =
    isCheckingAuth || isLoading || !emailLooksValid || (authMethod === 'password' && !form.watch('password'));

  if (isOtpCodeStep) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter the 8-digit code sent to {otp.email}
          </CardDescription>
        </CardHeader>

        {otp.error && (
          <div className="mx-6 mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
            {otp.error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <CardContent className="space-y-4 pt-0 pb-6">
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
          <CardFooter className="flex flex-col gap-4 pt-4">
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
              onClick={backToCredentials}
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
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password, or we&apos;ll send you a one-time code.
        </CardDescription>
      </CardHeader>

      {(error || otp.error) && (
        <div className="mx-6 mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
          {otp.error || error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmitCredentials)}>
        <CardContent className="space-y-4 pt-0 pb-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  form.setValue('email', e.target.value);
                  setError(null);
                }}
                className="pr-10"
                aria-invalid={!!form.formState.errors.email}
                autoComplete="email"
              />
              {isCheckingAuth && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-opacity"
                  aria-hidden
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div
            className={cn(
              'grid transition-all duration-200 ease-out',
              authMethod === 'otp'
                ? 'grid-rows-[0fr] opacity-0'
                : 'grid-rows-[1fr] opacity-100'
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4">
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
                    {...form.register('password')}
                    aria-invalid={!!form.formState.errors.password}
                    autoComplete="current-password"
                    className={authMethod === 'otp' ? 'pointer-events-none' : ''}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive" role="alert">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    {...form.register('rememberMe')}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={primaryDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : isCheckingAuth ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              primaryButtonLabel
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
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
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
