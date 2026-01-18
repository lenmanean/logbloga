import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserCartItems } from '@/lib/db/cart';
import { CheckoutProvider } from '@/contexts/checkout-context';
import { CheckoutContent } from './checkout-content';

export const metadata = {
  title: 'Checkout | LogBloga',
  description: 'Complete your purchase',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Require authentication
  if (!user) {
    redirect('/auth/signin?redirect=/checkout');
  }

  // Check if cart has items
  const cartItems = await getUserCartItems(user.id);
  
  if (cartItems.length === 0) {
    redirect('/cart');
  }

  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
