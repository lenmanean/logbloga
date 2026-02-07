import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getHasPassword } from '@/lib/auth/has-password';
import { getUserProfile } from '@/lib/db/profiles';
import { Shield } from 'lucide-react';

/**
 * Server component: shows a banner when signed-in user has no password set.
 * Renders nothing if not signed in or if user has a password.
 * Uses profile email (synced from auth) to avoid stale session email after email change.
 */
export async function PasswordNotice() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return null;
  }

  const profile = await getUserProfile(user.id);
  const email = profile?.email ?? user.email ?? '';
  if (!email) {
    return null;
  }

  const hasPassword = await getHasPassword(email);
  if (hasPassword) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-3 items-center">
          <Shield className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Add a password to secure your account.{' '}
            <Link
              href="/account/profile#password"
              className="underline font-medium hover:no-underline"
            >
              Add password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
