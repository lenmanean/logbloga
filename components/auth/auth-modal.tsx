'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useOtpAuth } from '@/hooks/useOtpAuth';
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

export function AuthModal() {
  const { open, closeAuthModal, onAuthSuccess } = useAuthModal();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

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
        aria-describedby={otp.step === 'email' ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}
      >
        <DialogHeader>
          <DialogTitle id="auth-modal-title">
            {otp.step === 'email' ? (mode === 'signup' ? 'Create account' : 'Sign in') : 'Enter verification code'}
          </DialogTitle>
          <DialogDescription id={otp.step === 'email' ? 'auth-modal-email-desc' : 'auth-modal-otp-desc'}>
            {otp.step === 'email'
              ? mode === 'signup'
                ? 'Enter your email to get a one-time code'
                : 'Enter your email to receive a one-time sign-in code'
              : `We sent a code to ${otp.email}. Enter it below.`}
          </DialogDescription>
        </DialogHeader>

        {otp.error && (
          <div
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{otp.error}</p>
          </div>
        )}

        {otp.step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => { setMode('signin'); otp.setError(null); }}
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
                onClick={() => { setMode('signup'); otp.setError(null); }}
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
                value={otp.otpCode}
                onChange={(e) => otp.setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-widest h-14"
                disabled={otp.isVerifying}
                aria-describedby="auth-modal-otp-hint"
              />
              <p id="auth-modal-otp-hint" className="text-xs text-muted-foreground">
                Enter the 6- or 8-digit code from your email
              </p>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button type="submit" className="w-full" disabled={otp.isVerifying || (otp.otpCode.length !== 6 && otp.otpCode.length !== 8)}>
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
                onClick={() => { otp.setStep('email'); otp.setError(null); otp.setOtpCode(''); }}
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
