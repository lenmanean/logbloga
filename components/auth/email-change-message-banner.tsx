'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';

/**
 * Shows a banner when user lands after clicking the first email-change confirmation link.
 * Supabase requires confirmation from BOTH old and new email when double_confirm_changes is enabled.
 */
export function EmailChangeMessageBanner() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || '';

  const isEmailChangePartialConfirm =
    message.includes('Confirmation link accepted') && message.includes('other email');

  if (!isEmailChangePartialConfirm) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/20 p-4">
          <Mail className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              One more step to complete your email change
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              You&apos;ve confirmed from one email. To finish the change, check your <strong>other</strong> email
              address (the one you didn&apos;t use for this link) and click the confirmation link there. Once both
              are confirmed, you can sign in with your new email.{' '}
              <Link href="/auth/signin" className="underline font-medium hover:no-underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
