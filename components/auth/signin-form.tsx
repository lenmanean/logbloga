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
import { cn } from '@/lib/utils';
import { Loader2, Mail } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

type SignInMethod = 'password' | 'otp';

function SignInFormContent() {
  const [method, setMethod] = useState<SignInMethod>('password');
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          {method === 'password'
            ? 'Enter your credentials to access your account'
            : 'Use a one-time code sent to your email'}
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-2">
        <div className="flex rounded-lg border border-border p-1" role="tablist" aria-label="Sign in method">
          <button
            type="button"
            role="tab"
            aria-selected={method === 'password'}
            onClick={() => {
              setMethod('password');
              setError(null);
              otp.setError(null);
            }}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              method === 'password'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Password
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={method === 'otp'}
            onClick={() => {
              setMethod('otp');
              setError(null);
              otp.setError(null);
            }}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              method === 'otp'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            One-time code
          </button>
        </div>
      </div>

      {(error || otp.error) && (
        <div className="mx-6 mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
          {method === 'password' ? error : otp.error}
        </div>
      )}

      {method === 'password' ? (
        <form onSubmit={handleSubmit(onSubmitPassword)}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
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
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                {...register('rememberMe')}
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
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      ) : otp.step === 'email' ? (
        <form onSubmit={handleSendOtp}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="otp-email">Email</Label>
              <Input
                id="otp-email"
                type="email"
                placeholder="you@example.com"
                value={otp.email}
                onChange={(e) => otp.setEmail(e.target.value)}
                autoComplete="email"
                required
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
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      ) : (
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
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-widest h-14"
                disabled={otp.isVerifying}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6- or 8-digit code sent to {otp.email}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={otp.isVerifying || (otp.otpCode.length !== 6 && otp.otpCode.length !== 8)}
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
              onClick={() => {
                otp.setStep('email');
                otp.setError(null);
                otp.setOtpCode('');
              }}
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
            <CardDescription>Enter your credentials to access your account</CardDescription>
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
