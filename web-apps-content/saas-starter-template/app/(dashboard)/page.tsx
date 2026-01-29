import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, plan_id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">
        You are logged in as {user?.email}.
      </p>
      {subscription?.status === 'active' ? (
        <p className="text-green-600 mb-4">
          You have an active subscription (plan: {subscription.plan_id ?? 'default'}).
        </p>
      ) : (
        <p className="text-gray-600 mb-4">
          You don&apos;t have an active subscription yet.
        </p>
      )}
      <Link
        href="/dashboard/subscribe"
        className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
      >
        {subscription?.status === 'active' ? 'Manage subscription' : 'Subscribe'}
      </Link>
    </div>
  );
}
