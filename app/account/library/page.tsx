import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProductAccessWithDates } from '@/lib/db/access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { LibraryClient } from './library-client';
import type { ProductWithPurchaseDate } from '@/lib/db/access';

export const metadata = {
  title: 'My Library | LogBloga',
  description: 'Access your purchased digital products',
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/library');
  }

  // Fetch user's products with purchase dates from completed orders
  const libraryProducts = await getUserProductAccessWithDates(user.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground mt-2">
            Access your purchased digital products
          </p>
        </div>

        {libraryProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No products yet</CardTitle>
              <CardDescription className="text-center">
                You haven't purchased any products yet. Start shopping to build your library.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <LibraryClient products={libraryProducts} />
        )}
      </div>
    </main>
  );
}
