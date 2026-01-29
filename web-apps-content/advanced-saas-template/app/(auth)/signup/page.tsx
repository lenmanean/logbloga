import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignupForm from './signup-form';

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Sign up</h1>
      <SignupForm />
    </div>
  );
}
