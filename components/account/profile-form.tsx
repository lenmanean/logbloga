'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional().or(z.literal('')),
});

const emailSchema = z.string().email('Please enter a valid email address');

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: {
    fullName?: string | null;
    email?: string | null;
  };
  onSuccess?: () => void;
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const { user, updateUser, refreshSession } = useAuth();

  const originalEmail = user?.email ?? initialData?.email ?? '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
    },
  });

  const emailEdited = emailValue.trim() !== '' && emailValue.trim() !== originalEmail;
  const emailValid = emailSchema.safeParse(emailValue.trim()).success;

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (user?.email) {
      setEmailValue(user.email);
    } else if (initialData?.email) {
      setEmailValue(initialData.email);
    }
  }, [user?.email, initialData?.email]);

  useEffect(() => {
    refreshSession();
    // Run on mount to ensure we have fresh user data (e.g. after email change confirmation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await updateUser({
        data: {
          full_name: data.fullName || undefined,
        },
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailValue.trim();
    if (!trimmed || trimmed === originalEmail) return;
    const parsed = emailSchema.safeParse(trimmed);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? 'Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      const response = await fetch('/api/account/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: parsed.data }),
      });

      const result = await response.json();

      if (!response.ok) {
        setEmailError(getAuthErrorMessage(new Error(result.error || 'Failed to change email')));
        setEmailLoading(false);
        return;
      }

      setEmailSuccess(true);
      setEmailLoading(false);

      setTimeout(() => setEmailSuccess(false), 5000);
    } catch (err) {
      setEmailError('An unexpected error occurred. Please try again.');
      setEmailLoading(false);
    }
  };

  const handleEmailCancel = () => {
    setEmailValue(originalEmail);
    setEmailError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="you@example.com"
              className={cn(emailError && 'border-destructive')}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
            />
            {emailError && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {emailError}
              </p>
            )}
            {emailSuccess && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                Verification email sent! Please check your new email address to confirm the change.
              </div>
            )}

            <div
              className={cn(
                'grid transition-all duration-200 ease-out',
                emailEdited ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Click the link in the verification email sent to your new address to confirm the change.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleEmailSubmit}
                      disabled={emailLoading || !emailValid}
                    >
                      {emailLoading ? 'Sending...' : 'Save email'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleEmailCancel}
                      disabled={emailLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              aria-invalid={errors.fullName ? 'true' : 'false'}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>
        </CardContent>
        {isDirty && (
          <CardFooter className="pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
