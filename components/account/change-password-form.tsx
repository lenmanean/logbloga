'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const newPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const addPasswordSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

type AddPasswordFormData = z.infer<typeof addPasswordSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordFormProps {
  hasPassword: boolean;
}

export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addForm = useForm<AddPasswordFormData>({
    resolver: zodResolver(addPasswordSchema),
  });

  const changeForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmitAdd = async (data: AddPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'add', newPassword: data.newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(getAuthErrorMessage(new Error(result.error || 'Failed to add password')));
        return;
      }
      setSuccess(true);
      addForm.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitChange = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'change',
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(getAuthErrorMessage(new Error(result.error || 'Failed to change password')));
        return;
      }
      setSuccess(true);
      changeForm.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordHint = 'Must be at least 8 characters with uppercase, lowercase, and a number';

  if (hasPassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password.</CardDescription>
        </CardHeader>
        <form onSubmit={changeForm.handleSubmit(onSubmitChange)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                Password updated successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                {...changeForm.register('currentPassword')}
                aria-invalid={!!changeForm.formState.errors.currentPassword}
              />
              {changeForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {changeForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...changeForm.register('newPassword')}
                aria-invalid={!!changeForm.formState.errors.newPassword}
              />
              {changeForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {changeForm.formState.errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{passwordHint}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...changeForm.register('confirmPassword')}
                aria-invalid={!!changeForm.formState.errors.confirmPassword}
              />
              {changeForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {changeForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Add a password to sign in with email and password.</CardDescription>
      </CardHeader>
      <form onSubmit={addForm.handleSubmit(onSubmitAdd)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              Password added successfully!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...addForm.register('newPassword')}
              aria-invalid={!!addForm.formState.errors.newPassword}
            />
            {addForm.formState.errors.newPassword && (
              <p className="text-sm text-destructive" role="alert">
                {addForm.formState.errors.newPassword.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{passwordHint}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...addForm.register('confirmPassword')}
              aria-invalid={!!addForm.formState.errors.confirmPassword}
            />
            {addForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive" role="alert">
                {addForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Add password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
