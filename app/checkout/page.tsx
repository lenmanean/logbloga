import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CheckoutProvider } from '@/contexts/checkout-context';
import { CheckoutContent } from './checkout-content';

export const metadata = {
  title: 'Checkout | Logbloga',
  description: 'Complete your purchase',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Require authentication
  if (!user) {
    redirect('/auth/signin?redirect=/checkout');
  }

  // Do not redirect for empty cart on the server: it can use stale/cached data
  // and send users home after they just clicked "Proceed to Checkout". The client
  // (CheckoutContent) redirects when cart is empty after loading.
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
