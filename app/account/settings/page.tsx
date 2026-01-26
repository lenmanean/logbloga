import { requireAuth } from '@/lib/auth/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangeEmailForm } from '@/components/account/change-email-form';
import { NotificationPreferencesForm } from '@/components/account/notification-preferences-form';
import { DeleteAccountButton } from '@/components/account/delete-account-button';
import { getNotificationPreferences } from '@/lib/db/notifications';
import { Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Account Settings | Logbloga',
  description: 'Manage your account settings',
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const notificationPreferences = await getNotificationPreferences(user.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-6">
          <ChangeEmailForm />

          <NotificationPreferencesForm initialPreferences={notificationPreferences} />

          <Card>
            <CardHeader>
              <CardTitle>Language Preferences</CardTitle>
              <CardDescription>
                Choose your preferred language for the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-4 mb-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>To be implemented:</strong> Language preference functionality is not yet connected. 
                    This will allow users to select their preferred language for the application interface.
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Language</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  disabled
                >
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Language selection will be saved to your account preferences once implemented.
                </p>
              </div>
            </CardContent>
          </Card>

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
                  All your data, orders, and purchased products will be permanently deleted.
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

