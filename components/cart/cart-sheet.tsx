'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from '@/components/cart/cart-item';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const CHECKOUT_STORAGE_KEY = 'checkout_state';

interface CartSheetProps {
  /** Controlled open state (e.g. for mobile menu to open the sheet) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger element for desktop (cart icon button) */
  trigger: React.ReactNode;
}

export function CartSheet({ open, onOpenChange, trigger }: CartSheetProps) {
  const { items, total, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/checkout');
      onOpenChange?.(false);
      return;
    }
    try {
      const state = {
        currentStep: 2,
        customerInfo: null,
        appliedCoupon: null,
        orderTotals: { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0 },
        termsAccepted: false,
      };
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
    router.push('/checkout');
    onOpenChange?.(false);
  };

  const subtotal = total;
  const tax = 0;
  const finalTotal = subtotal + tax;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-5 py-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link href="/ai-to-usd" onClick={() => onOpenChange?.(false)}>
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-4 px-5 py-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="space-y-4 px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Tax (if any) is calculated at payment.
                </p>
              </div>
              <Button
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              <Link href="/ai-to-usd" className="block" onClick={() => onOpenChange?.(false)}>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
