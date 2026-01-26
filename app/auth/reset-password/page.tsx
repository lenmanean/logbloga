import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Reset Password | Logbloga',
  description: 'Reset your Logbloga account password',
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <ResetPasswordForm />
    </main>
  );
}

