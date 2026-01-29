'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50">
        {loading ? 'Signing in…' : 'Log in'}
      </button>
      <p className="text-sm text-gray-600 text-center">
        Don&apos;t have an account? <Link href="/signup" className="text-gray-900 underline">Sign up</Link>
      </p>
    </form>
  );
}
