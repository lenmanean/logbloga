'use client';

import { useCart } from '@/contexts/cart-context';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';
import { Loader2 } from 'lucide-react';

export function CartClient() {
  const { items, isLoading } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">
              Review your cart items
            </p>
          </div>
          <EmptyCart />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </main>
  );
}

