import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CheckoutProvider } from '@/contexts/checkout-context';
import { CheckoutContent } from './checkout-content';
import { getProductBySlug } from '@/lib/db/products';
import { hasProductAccessBySlug } from '@/lib/db/access';

export const metadata = {
  title: 'Checkout | Logbloga',
  description: 'Complete your purchase',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/checkout');
  }

  const masterBundle = await getProductBySlug('master-bundle');
  const hasMasterBundle = await hasProductAccessBySlug(user.id, 'master-bundle');
  const showMasterBundleUpsell = !!masterBundle && !hasMasterBundle;
  const masterBundleProps = masterBundle
    ? {
        title: masterBundle.title ?? 'Master Bundle',
        price: typeof masterBundle.price === 'number'
          ? masterBundle.price
          : parseFloat(String(masterBundle.price ?? 0)),
        package_image: masterBundle.package_image ?? null,
      }
    : null;

  return (
    <CheckoutProvider>
      <CheckoutContent
        showMasterBundleUpsell={showMasterBundleUpsell}
        masterBundle={masterBundleProps}
      />
    </CheckoutProvider>
  );
}
