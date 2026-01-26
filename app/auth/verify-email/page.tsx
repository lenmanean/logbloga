import { EmailVerification } from '@/components/auth/email-verification';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Verify Email | Logbloga',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <EmailVerification />
    </main>
  );
}

