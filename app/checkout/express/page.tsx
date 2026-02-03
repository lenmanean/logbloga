import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ExpressCheckoutContent } from './express-checkout-content';

export const metadata = {
  title: 'Quick checkout | Logbloga',
  description: 'Complete your purchase',
};

interface PageProps {
  searchParams: Promise<{ productId?: string; title?: string }>;
}

export default async function ExpressCheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const productId = typeof params.productId === 'string' ? params.productId.trim() : undefined;
  const productTitle = typeof params.title === 'string' ? decodeURIComponent(params.title).trim() : 'Item';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/signin?redirect=${encodeURIComponent(`/checkout/express?productId=${productId ?? ''}&title=${encodeURIComponent(productTitle)}`)}`);
  }

  if (!productId) {
    redirect('/ai-to-usd');
  }

  return (
    <ExpressCheckoutContent
      productId={productId}
      productTitle={productTitle || 'Item'}
    />
  );
}
