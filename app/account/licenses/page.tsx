import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserLicenses } from '@/lib/db/licenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';
import { LicensesListClient } from './licenses-list-client';

export const metadata = {
  title: 'My Licenses | LogBloga',
  description: 'View and manage your licenses',
};

export default async function LicensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/licenses');
  }

  // Fetch user's licenses
  const licenses = await getUserLicenses(user.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Licenses</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your product licenses
          </p>
        </div>

        {licenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No licenses yet</CardTitle>
              <CardDescription className="text-center">
                You don't have any licenses yet. Purchase a product to receive a license key.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <LicensesListClient licenses={licenses} />
        )}
      </div>
    </main>
  );
}
