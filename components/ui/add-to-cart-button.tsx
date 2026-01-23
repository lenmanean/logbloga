'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';

interface AddToCartButtonProps {
  productId: string;
  price: number;
  quantity?: number;
  variantId?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  redirectToCart?: boolean; // Default: false
}

export function AddToCartButton({
  productId,
  price,
  quantity = 1,
  variantId,
  className,
  size = 'lg',
  redirectToCart = false,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await addItem(productId, quantity, variantId);
      setIsSuccess(true);
      
      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);

      // Redirect to cart if requested
      if (redirectToCart) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      setError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isSuccess}
        size={size}
        className={cn(
          'bg-red-500 hover:bg-red-600 text-white font-semibold touch-manipulation',
          isSuccess && 'bg-green-500 hover:bg-green-600',
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Adding...
          </>
        ) : isSuccess ? (
          <>
            <Check className="h-5 w-5" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart - ${price.toLocaleString()}
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}

