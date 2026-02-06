'use client';

import React, { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAuthErrorMessage } from '@/lib/auth/errors';

const RESEND_COOLDOWN_SEC = 60;

export type OtpStep = 'email' | 'otp';

export interface UseOtpAuthOptions {
  onSuccess: () => void;
}

export interface UseOtpAuthReturn {
  step: OtpStep;
  setStep: (step: OtpStep) => void;
  email: string;
  setEmail: (email: string) => void;
  otpCode: string;
  setOtpCode: (code: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isSending: boolean;
  isVerifying: boolean;
  resendCooldown: number;
  sendOtp: (additionalPayload?: { fullName?: string }) => Promise<void>;
  resend: () => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  reset: () => void;
}

function startCooldown(
  setResendCooldown: React.Dispatch<React.SetStateAction<number>>,
  seconds: number
): void {
  setResendCooldown(seconds);
  const interval = setInterval(() => {
    setResendCooldown((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}

/**
 * Shared OTP auth flow: send code via API, verify with Supabase, resend cooldown.
 * Used by auth modal (signin/signup) and sign-in page (signin only).
 */
export function useOtpAuth({ onSuccess }: UseOtpAuthOptions): UseOtpAuthReturn {
  const [step, setStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const reset = useCallback(() => {
    setStep('email');
    setEmail('');
    setOtpCode('');
    setError(null);
    setResendCooldown(0);
  }, []);

  const sendOtp = useCallback(
    async (additionalPayload?: { fullName?: string }) => {
      setError(null);
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError('Please enter your email address');
        return;
      }
      setIsSending(true);
      try {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            fullName: additionalPayload?.fullName,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(getAuthErrorMessage(new Error(data.error || 'Failed to send code')));
          return;
        }
        setStep('otp');
        setOtpCode('');
        startCooldown(setResendCooldown, RESEND_COOLDOWN_SEC);
      } finally {
        setIsSending(false);
      }
    },
    [email]
  );

  const resend = useCallback(async () => {
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
      startCooldown(setResendCooldown, RESEND_COOLDOWN_SEC);
    } finally {
      setIsSending(false);
    }
  }, [email, resendCooldown]);

  const verifyOtp = useCallback(
    async (code: string) => {
      const digits = code.replace(/\D/g, '');
      if (digits.length !== 6 && digits.length !== 8) {
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
          token: digits,
          type: 'email',
        });
        if (verifyError) {
          setError(getAuthErrorMessage(verifyError));
          return;
        }
        onSuccess();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, onSuccess]
  );

  return {
    step,
    setStep,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    error,
    setError,
    isSending,
    isVerifying,
    resendCooldown,
    sendOtp,
    resend,
    verifyOtp,
    reset,
  };
}
