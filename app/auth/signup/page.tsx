import { SignUpForm } from '@/components/auth/signup-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign Up | Logbloga',
  description: 'Create a new Logbloga account',
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignUpForm />
    </main>
  );
}

