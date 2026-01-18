import { SignUpForm } from '@/components/auth/signup-form';

export const metadata = {
  title: 'Sign Up | LogBloga',
  description: 'Create a new LogBloga account',
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignUpForm />
    </main>
  );
}

