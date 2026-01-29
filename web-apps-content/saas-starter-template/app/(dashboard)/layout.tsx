import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Welcome, {user.email}
        </span>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/dashboard/subscribe" className="text-sm text-gray-600 hover:text-gray-900">
            Subscribe
          </Link>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
