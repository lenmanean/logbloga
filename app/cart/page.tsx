import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { CartClient } from '@/components/cart/cart-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shopping Cart | Logbloga',
  description: 'Review your cart items and proceed to checkout',
};

export default function CartPage() {
  return <CartClient />;
}

