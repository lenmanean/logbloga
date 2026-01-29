import { redirect } from 'next/navigation';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { getCurrentTenant } from '@/lib/tenant';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let tenant = await getCurrentTenant();
  if (!tenant) {
    const admin = await createServiceRoleClient();
    const slug = `org-${user.id.slice(0, 8)}`;
    const { data: org } = await admin
      .from('organizations')
      .insert({ name: 'My Organization', slug })
      .select('id')
      .single();
    if (org) {
      await admin.from('organization_members').insert({
        user_id: user.id,
        organization_id: org.id,
        role: 'owner',
      });
    }
    tenant = await getCurrentTenant();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {tenant ? `Organization: ${tenant.name}` : 'No organization'}
        </span>
        <span className="text-sm text-gray-500">{user.email}</span>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
