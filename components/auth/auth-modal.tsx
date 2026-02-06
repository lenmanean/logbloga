'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuthModal } from '@/contexts/auth-modal-context';
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

const RESEND_COOLDOWN_SEC = 60;

type Step = 'email' | 'otp';

export function AuthModal() {
  const { open, closeAuthModal, onAuthSuccess } = useAuthModal();
  const [step, setStep] = useState<Step>('email');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const resetForm = useCallback(() => {
    setStep('email');
    setEmail('');
    setFullName('');
    setTermsAccepted(false);
    setOtpCode('');
    setError(null);
    setResendCooldown(0);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetForm();
        closeAuthModal();
      }
    },
    [closeAuthModal, resetForm]
  );

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }
    if (mode === 'signup' && !termsAccepted) {
      setError('Please accept the terms of service and privacy policy');
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          fullName: mode === 'signup' && fullName.trim() ? fullName.trim() : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(getAuthErrorMessage(new Error(data.error || 'Failed to send code')));
        return;
      }
      setStep('otp');
      setOtpCode('');
      setResendCooldown(RESEND_COOLDOWN_SEC);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(getAuthErrorMessage(new Error(data.error || 'Failed to send code')));
        return;
      }
      setOtpCode('');
      setResendCooldown(RESEND_COOLDOWN_SEC);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.replace(/\D/g, '');
    if (code.length !== 6 && code.length !== 8) {
      setError('Please enter a valid 6- or 8-digit code');
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }
    setError(null);
    setIsVerifying(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: code,
        type: 'email',
      });
      if (verifyError) {
        setError(getAuthErrorMessage(verifyError));
        return;
      }
      onAuthSuccess();
      resetForm();
      handleOpenChange(false);
    } finally {
      setIsVerifying(false);
    }
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
        aria-describedby={step === 'email' ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}
      >
        <DialogHeader>
          <DialogTitle id="auth-modal-title">
            {step === 'email' ? (mode === 'signup' ? 'Create account' : 'Sign in') : 'Enter verification code'}
          </DialogTitle>
          <DialogDescription id={step === 'email' ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}>
            {step === 'email'
              ? mode === 'signup'
                ? 'Enter your email to get a one-time code'
                : 'Enter your email to receive a one-time sign-in code'
              : `We sent a code to ${email}. Enter it below.`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
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
                onClick={() => { setMode('signup'); setError(null); }}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                autoComplete="email"
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="flex items-start gap-2">
                <input
                  id="auth-modal-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border"
                  aria-describedby="auth-modal-terms-desc"
                />
                <Label htmlFor="auth-modal-terms" className="text-sm font-normal" id="auth-modal-terms-desc">
                  I agree to the{' '}
                  <Link href="/legal/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? (
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
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-modal-otp">Verification code</Label>
              <Input
                id="auth-modal-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-widest h-14"
                disabled={isVerifying}
                aria-describedby="auth-modal-otp-hint"
              />
              <p id="auth-modal-otp-hint" className="text-xs text-muted-foreground">
                Enter the 6- or 8-digit code from your email
              </p>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button type="submit" className="w-full" disabled={isVerifying || (otpCode.length !== 6 && otpCode.length !== 8)}>
                {isVerifying ? (
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
                onClick={handleResend}
                disabled={isSending || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : isSending ? 'Sending…' : 'Resend code'}
              </Button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(null); setOtpCode(''); }}
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
