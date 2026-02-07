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

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional().or(z.literal('')),
});

const changeEmailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

interface ProfileFormProps {
  initialData?: {
    fullName?: string | null;
  };
  onSuccess?: () => void;
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const { user, updateUser } = useAuth();

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

  const emailForm = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: user?.email || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (user?.email) {
      emailForm.reset({
        newEmail: user.email,
      });
    }
  }, [user?.email]);

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

  const onSubmitEmail = async (data: ChangeEmailFormData) => {
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      const response = await fetch('/api/account/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail: data.newEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setEmailError(getAuthErrorMessage(new Error(result.error || 'Failed to change email')));
        setEmailLoading(false);
        return;
      }

      setEmailSuccess(true);
      setEmailLoading(false);

      setTimeout(() => {
        setEmailSuccess(false);
        emailForm.reset({ newEmail: user?.email || '' });
      }, 5000);
    } catch (err) {
      setEmailError('An unexpected error occurred. Please try again.');
      setEmailLoading(false);
    }
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
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
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

      <CardContent className="pt-0 border-t">
        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
          {emailError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {emailError}
            </div>
          )}

          {emailSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              Verification email sent! Please check your new email address to confirm the change.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email</Label>
            <Input
              id="newEmail"
              type="email"
              placeholder="new@example.com"
              {...emailForm.register('newEmail')}
              aria-invalid={emailForm.formState.errors.newEmail ? 'true' : 'false'}
            />
            {emailForm.formState.errors.newEmail && (
              <p className="text-sm text-destructive" role="alert">
                {emailForm.formState.errors.newEmail.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              You&apos;ll receive a verification email at the new address to confirm the change.
            </p>
          </div>
          <Button
            type="submit"
            variant="secondary"
            disabled={emailLoading || !emailForm.formState.isDirty}
          >
            {emailLoading ? 'Sending verification...' : 'Change Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
