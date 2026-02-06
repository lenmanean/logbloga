import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasProductAccess } from '@/lib/db/access';
import { getProductById } from '@/lib/db/products';
import { trackProductView } from '@/lib/db/recently-viewed';
import { parsePackageLevels } from '@/lib/db/package-levels';
import { getLevelContent } from '@/lib/data/package-level-content';
import Link from 'next/link';
import { Suspense } from 'react';
import { LibraryPackageTabs } from './library-package-tabs';

export const metadata = {
  title: 'Product Access | Logbloga',
  description: 'Access your purchased digital product',
};

interface ProductAccessPageProps {
  params: Promise<{ 'product-id': string }>;
}

export default async function ProductAccessPage({ params }: ProductAccessPageProps) {
  const { 'product-id': productId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/library/' + productId);
  }

  const product = await getProductById(productId);
  if (!product) notFound();

  if (product.slug === 'master-bundle') {
    redirect('/account/library');
  }

  const hasAccess = await hasProductAccess(user.id, productId);
  if (!hasAccess) {
    redirect(`/ai-to-usd/packages/${product.slug || product.id}`);
  }

  try {
    await trackProductView(user.id, productId);
  } catch (e) {
    console.error('Error tracking product view:', e);
  }

  const slug = (product.slug || product.category || '') as string;
  const parsedLevels = parsePackageLevels(product);

  const level1Data = getLevelContent(slug, 1, parsedLevels?.level1) ?? null;
  const level2Data = getLevelContent(slug, 2, parsedLevels?.level2) ?? null;
  const level3Data = getLevelContent(slug, 3, parsedLevels?.level3) ?? null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <Link
            href="/account/library"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Library
          </Link>
        </div>

        <Suspense fallback={<div className="animate-pulse h-10 bg-muted rounded w-full max-w-2xl" />}>
          <LibraryPackageTabs
            product={product}
            level1Data={level1Data}
            level2Data={level2Data}
            level3Data={level3Data}
          />
        </Suspense>
      </div>
    </main>
  );
}
