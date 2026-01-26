import { SignInForm } from '@/components/auth/signin-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign In | Logbloga',
  description: 'Sign in to your Logbloga account',
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignInForm />
    </main>
  );
}

