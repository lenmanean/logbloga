import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Advanced SaaS Template</h1>
      <p className="text-gray-600 mb-6">
        Multi-tenant, AI integration, and third-party integration example.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
          Log in
        </Link>
        <Link href="/signup" className="px-4 py-2 border border-gray-900 rounded hover:bg-gray-100">
          Sign up
        </Link>
      </div>
    </main>
  );
}
