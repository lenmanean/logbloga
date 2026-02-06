'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/useAuth';
import { useOtpAuth } from '@/hooks/useOtpAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Mail, Loader2, AlertCircle } from 'lucide-react';

type AuthMethod = 'password' | 'otp' | 'not_found';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthModal() {
  const { open, closeAuthModal, onAuthSuccess } = useAuthModal();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const debouncedSignInEmail = useDebounce(signInEmail.trim(), 450);
  const signInEmailLooksValid = EMAIL_REGEX.test(debouncedSignInEmail);

  const otp = useOtpAuth({
    onSuccess: () => {
      onAuthSuccess();
      otp.reset();
      closeAuthModal();
    },
  });

  const resetForm = useCallback(() => {
    setMode('signup');
    setFullName('');
    setTermsAccepted(false);
    setSignInEmail('');
    setSignInPassword('');
    setAuthMethod(null);
    setSignInError(null);
    otp.reset();
  }, [otp.reset]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetForm();
        closeAuthModal();
      }
    },
    [closeAuthModal, resetForm]
  );

  const isOtpVerifyStep = otp.step === 'otp';
  const isSignUpEmailStep = mode === 'signup' && otp.step === 'email';
  const isSignInCredentialsStep = mode === 'signin' && !isOtpVerifyStep;

  // Debounced auth-method lookup for sign-in
  useEffect(() => {
    if (mode !== 'signin' || !signInEmailLooksValid || debouncedSignInEmail === '') {
      setAuthMethod(null);
      setIsCheckingAuth(false);
      return;
    }

    let cancelled = false;
    setIsCheckingAuth(true);

    fetch('/api/auth/auth-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: debouncedSignInEmail }),
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
  }, [mode, debouncedSignInEmail, signInEmailLooksValid]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    otp.setError(null);

    if (authMethod === 'not_found') {
      setSignInError('No account found with that email. Please sign up or check the address.');
      return;
    }

    if (authMethod === 'otp') {
      otp.setEmail(signInEmail.trim());
      await otp.sendOtp();
      return;
    }

    if (authMethod === 'password') {
      if (!signInPassword.trim()) {
        setSignInError('Please enter your password');
        return;
      }
      setIsPasswordLoading(true);
      try {
        const { error } = await signIn(signInEmail.trim(), signInPassword);
        if (error) {
          setSignInError(getAuthErrorMessage(error));
          setIsPasswordLoading(false);
          return;
        }
        onAuthSuccess();
        closeAuthModal();
      } catch {
        setSignInError('An unexpected error occurred.');
      } finally {
        setIsPasswordLoading(false);
      }
      return;
    }

    setSignInError('Please wait while we look up your account.');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    otp.setError(null);
    if (mode === 'signup' && !termsAccepted) {
      otp.setError('Please accept the terms of service and privacy policy');
      return;
    }
    await otp.sendOtp(
      mode === 'signup' && fullName.trim() ? { fullName: fullName.trim() } : undefined
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await otp.verifyOtp(otp.otpCode);
  };

  const signInBackToCredentials = () => {
    otp.setStep('email');
    otp.setError(null);
    otp.setOtpCode('');
    setSignInError(null);
  };

  const getTitle = () => {
    if (mode === 'signup') {
      return otp.step === 'email' ? 'Create account' : 'Enter verification code';
    }
    return isOtpVerifyStep ? 'Enter verification code' : 'Sign in';
  };

  const getDescription = () => {
    if (mode === 'signup') {
      return otp.step === 'email'
        ? 'Enter your email to get a one-time code'
        : `We sent a code to ${otp.email}. Enter it below.`;
    }
    return isOtpVerifyStep
      ? `We sent a code to ${otp.email}. Enter it below.`
      : 'Enter your email and password, or we\'ll send you a one-time code.';
  };

  const displayError = signInError || otp.error;
  const primarySignInLabel = authMethod === 'otp' ? 'Send one-time code' : 'Sign in';
  const primarySignInDisabled =
    isCheckingAuth ||
    isPasswordLoading ||
    !signInEmailLooksValid ||
    (authMethod === 'password' && !signInPassword.trim());

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          'duration-200 sm:max-w-md max-h-[90vh] overflow-y-auto',
          'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-top-2',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
        )}
        aria-describedby={isSignUpEmailStep || isSignInCredentialsStep ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}
      >
        <DialogHeader>
          <DialogTitle id="auth-modal-title">{getTitle()}</DialogTitle>
          <DialogDescription id={isSignUpEmailStep || isSignInCredentialsStep ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {displayError && (
          <div
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{displayError}</p>
          </div>
        )}

        {mode === 'signin' && isSignInCredentialsStep && (
          <form onSubmit={handleSignInSubmit} className="space-y-4 pb-4">
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthMethod(null);
                  setSignInError(null);
                  otp.setError(null);
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'bg-background text-foreground shadow'
                )}
                aria-pressed={true}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthMethod(null);
                  setSignInError(null);
                  otp.setError(null);
                  otp.setStep('email');
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={false}
              >
                Sign up
              </button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-modal-email">Email</Label>
              <div className="relative">
                <Input
                  id="auth-modal-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => {
                    setSignInEmail(e.target.value);
                    setSignInError(null);
                  }}
                  className="w-full pr-10"
                  autoComplete="email"
                  required
                />
                {isCheckingAuth && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                )}
              </div>
            </div>

            <div
              className={cn(
                'grid transition-all duration-200 ease-out',
                authMethod === 'otp' ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-2">
                  <Label htmlFor="auth-modal-password">Password</Label>
                  <Input
                    id="auth-modal-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    autoComplete="current-password"
                    className={cn('w-full', authMethod === 'otp' && 'pointer-events-none')}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full" disabled={primarySignInDisabled}>
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : isCheckingAuth ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  primarySignInLabel
                )}
              </Button>
              <div className="flex flex-col gap-2 items-center w-full text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={signInBackToCredentials}
                  className="hover:text-foreground underline"
                >
                  Use a different email
                </button>
                <p className="text-center">
                  Don&apos;t have an account?{' '}
                  <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthMethod(null);
                    setSignInError(null);
                    otp.setError(null);
                    otp.setStep('email');
                  }}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
            </DialogFooter>
          </form>
        )}

        {isSignUpEmailStep && (
          <form onSubmit={handleSendOtp} className="space-y-4 pb-4">
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthMethod(null);
                  otp.setError(null);
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={false}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthMethod(null);
                  otp.setError(null);
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'bg-background text-foreground shadow'
                )}
                aria-pressed={true}
              >
                Sign up
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-modal-fullname">Full name (optional)</Label>
              <Input
                id="auth-modal-fullname"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-modal-signup-email">Email</Label>
              <Input
                id="auth-modal-signup-email"
                type="email"
                placeholder="you@example.com"
                value={otp.email}
                onChange={(e) => otp.setEmail(e.target.value)}
                className="w-full"
                autoComplete="email"
                required
              />
            </div>

            <label
              htmlFor="auth-modal-terms"
              className="grid grid-cols-[auto_1fr] gap-2 items-start cursor-pointer"
            >
              <input
                id="auth-modal-terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
                aria-describedby="auth-modal-terms-desc"
              />
              <span id="auth-modal-terms-desc" className="text-sm text-foreground block min-w-0">
                I agree to the{' '}
                <Link href="/legal/terms" className="text-primary hover:underline whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="text-primary hover:underline whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <DialogFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full" disabled={otp.isSending}>
                {otp.isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending code…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Continue with email
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {isOtpVerifyStep && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="auth-modal-otp">Verification code</Label>
              <Input
                id="auth-modal-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={otp.otpCode}
                onChange={(e) => otp.setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="00000000"
                className="text-center text-2xl font-mono tracking-widest h-14"
                disabled={otp.isVerifying}
                aria-describedby="auth-modal-otp-hint"
              />
              <p id="auth-modal-otp-hint" className="text-xs text-muted-foreground">
                Enter the 8-digit code from your email
              </p>
            </div>

            <DialogFooter className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={otp.isVerifying || otp.otpCode.length !== 8}
              >
                {otp.isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
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
                {otp.resendCooldown > 0 ? `Resend code in ${otp.resendCooldown}s` : otp.isSending ? 'Sending…' : 'Resend code'}
              </Button>
              <button
                type="button"
                onClick={mode === 'signin' ? signInBackToCredentials : () => { otp.setStep('email'); otp.setError(null); otp.setOtpCode(''); }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Use a different email
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
