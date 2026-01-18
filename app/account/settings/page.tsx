import { requireAuth } from '@/lib/auth/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChangePasswordForm } from '@/components/account/change-password-form';
import { ChangeEmailForm } from '@/components/account/change-email-form';
import { DeleteAccountButton } from '@/components/account/delete-account-button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Account Settings | LogBloga',
  description: 'Manage your account settings',
};

export default async function SettingsPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account security and preferences
          </p>
        </div>

        <div className="space-y-6">
          <ChangePasswordForm />
          
          <ChangeEmailForm />

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. This action cannot be undone.
                  All your data, orders, and licenses will be permanently deleted.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <DeleteAccountButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

