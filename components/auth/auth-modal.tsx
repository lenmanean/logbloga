'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/useAuth';
import { useOtpAuth } from '@/hooks/useOtpAuth';
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

type AuthMethod = 'password' | 'otp';
type SignInPhase = 'email' | 'password' | 'otp';

export function AuthModal() {
  const { open, closeAuthModal, onAuthSuccess } = useAuthModal();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signInPhase, setSignInPhase] = useState<SignInPhase>('email');
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { signIn } = useAuth();

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
    setSignInPhase('email');
    setAuthMethod(null);
    setPassword('');
    setPasswordError(null);
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

  const isEmailStep = mode === 'signup' ? otp.step === 'email' : signInPhase === 'email';
  const isSignInPasswordStep = mode === 'signin' && signInPhase === 'password';
  const isSignInOtpStep = mode === 'signin' && signInPhase === 'otp';
  const isOtpVerifyStep = otp.step === 'otp';

  const handleContinueSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    otp.setError(null);
    const email = otp.email.trim();
    if (!email) {
      otp.setError('Please enter your email address');
      return;
    }
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/auth-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      const method: AuthMethod = json.authMethod === 'password' ? 'password' : 'otp';
      setAuthMethod(method);

      if (method === 'password') {
        setSignInPhase('password');
        setPassword('');
        setPasswordError(null);
      } else {
        await otp.sendOtp();
        setSignInPhase('otp');
      }
    } catch {
      otp.setError('Could not determine sign-in method. Try again.');
    } finally {
      setIsCheckingAuth(false);
    }
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

  const handleSignInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    const email = otp.email.trim();
    if (!email || !password) {
      setPasswordError('Please enter your password');
      return;
    }
    setIsPasswordLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setPasswordError(getAuthErrorMessage(error));
        setIsPasswordLoading(false);
        return;
      }
      onAuthSuccess();
      closeAuthModal();
    } catch {
      setPasswordError('An unexpected error occurred.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await otp.verifyOtp(otp.otpCode);
  };

  const signInBackToEmail = () => {
    setSignInPhase('email');
    setAuthMethod(null);
    otp.setError(null);
    otp.setStep('email');
    otp.setOtpCode('');
  };

  const getTitle = () => {
    if (mode === 'signup') {
      return otp.step === 'email' ? 'Create account' : 'Enter verification code';
    }
    if (signInPhase === 'email') return 'Sign in';
    if (signInPhase === 'password') return 'Sign in';
    return 'Enter verification code';
  };

  const getDescription = () => {
    if (mode === 'signup') {
      return otp.step === 'email'
        ? 'Enter your email to get a one-time code'
        : `We sent a code to ${otp.email}. Enter it below.`;
    }
    if (signInPhase === 'email') return 'Enter your email to continue';
    if (signInPhase === 'password') return 'Enter your password';
    return `We sent a code to ${otp.email}. Enter it below.`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          'duration-200 sm:max-w-md',
          'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-top-2',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
        )}
        aria-describedby={isEmailStep ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}
      >
        <DialogHeader>
          <DialogTitle id="auth-modal-title">{getTitle()}</DialogTitle>
          <DialogDescription id={isEmailStep ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {(otp.error || passwordError) && (
          <div
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{mode === 'signin' && signInPhase === 'password' ? passwordError : otp.error}</p>
          </div>
        )}

        {mode === 'signin' && signInPhase === 'password' && (
          <form onSubmit={handleSignInWithPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-modal-email-readonly">Email</Label>
              <Input
                id="auth-modal-email-readonly"
                type="email"
                value={otp.email}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-modal-password">Password</Label>
              <Input
                id="auth-modal-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" className="w-full" disabled={isPasswordLoading}>
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
              <button
                type="button"
                onClick={signInBackToEmail}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Use a different email
              </button>
            </DialogFooter>
          </form>
        )}

        {isEmailStep && !isSignInPasswordStep && (
          <form
            onSubmit={mode === 'signin' ? handleContinueSignIn : handleSendOtp}
            className="space-y-4"
          >
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setSignInPhase('email');
                  setAuthMethod(null);
                  otp.setError(null);
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  mode === 'signin'
                    ? 'bg-background text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === 'signin'}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignInPhase('email');
                  setAuthMethod(null);
                  otp.setError(null);
                }}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  mode === 'signup'
                    ? 'bg-background text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === 'signup'}
              >
                Sign up
              </button>
            </div>

            {mode === 'signup' && (
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
            )}

            <div className="space-y-2">
              <Label htmlFor="auth-modal-email">Email</Label>
              <Input
                id="auth-modal-email"
                type="email"
                placeholder="you@example.com"
                value={otp.email}
                onChange={(e) => otp.setEmail(e.target.value)}
                className="w-full"
                autoComplete="email"
                required
              />
            </div>

            {mode === 'signup' && (
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
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="submit"
                className="w-full"
                disabled={mode === 'signin' ? isCheckingAuth : otp.isSending}
              >
                {mode === 'signin' && isCheckingAuth ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Continue…
                  </>
                ) : mode === 'signup' && otp.isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending code…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    {mode === 'signin' ? 'Continue' : 'Continue with email'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {((mode === 'signup' && isOtpVerifyStep) || (isSignInOtpStep && isOtpVerifyStep)) && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
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

            <DialogFooter className="flex-col gap-2 sm:flex-col">
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
                onClick={mode === 'signin' ? signInBackToEmail : () => { otp.setStep('email'); otp.setError(null); otp.setOtpCode(''); }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Use a different email
              </button>
            </DialogFooter>
          </form>
        )}

        {mode === 'signin' && signInPhase === 'otp' && otp.step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-modal-otp-email">Email</Label>
              <Input
                id="auth-modal-otp-email"
                type="email"
                value={otp.email}
                readOnly
                className="bg-muted"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" className="w-full" disabled={otp.isSending}>
                {otp.isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending code…
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
                onClick={signInBackToEmail}
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
