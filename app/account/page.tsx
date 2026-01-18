import { redirect } from 'next/navigation';

/**
 * Account dashboard - redirects to profile page
 */
export default function AccountPage() {
  redirect('/account/profile');
}

