import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  await requireAuth();
  // Redirect to Library as the default account page
  redirect('/account/library');
}
