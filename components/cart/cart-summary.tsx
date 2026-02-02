'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';

export function CartSummary() {
  const { items, total, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return null;
  }

  const subtotal = total;
  const tax = 0; // Digital products - no tax for now
  const finalTotal = subtotal + tax;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">${tax.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Tax (if any) is calculated at payment.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={handleCheckout}
          disabled={isLoading || items.length === 0}
          className="w-full"
          size="lg"
        >
          Proceed to Checkout
        </Button>
        <Link href="/ai-to-usd" className="w-full">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

