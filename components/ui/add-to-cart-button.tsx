'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check, Download } from 'lucide-react';
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
  bypassPayment?: boolean; // Development mode: grant immediate access
}

export function AddToCartButton({
  productId,
  price,
  quantity = 1,
  variantId,
  className,
  size = 'lg',
  redirectToCart = false,
  bypassPayment = false,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const handleGrantAccess = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const response = await fetch(`/api/packages/${productId}/grant-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to grant access');
      }

      setIsSuccess(true);
      
      // Redirect to library after 1 second
      setTimeout(() => {
        router.push(`/account/library/${productId}`);
      }, 1000);
    } catch (error) {
      console.error('Error granting access:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to grant access';
      setError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await addItem(productId, quantity, variantId);
      setIsSuccess(true);
      
      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);

      // Redirect home if requested (user can open cart panel from header)
      if (redirectToCart) {
        router.push('/');
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

  // Use grant access flow if bypassPayment is enabled
  const handleClick = bypassPayment ? handleGrantAccess : handleAddToCart;

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
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
            {bypassPayment ? 'Granting Access...' : 'Adding...'}
          </>
        ) : isSuccess ? (
          <>
            <Check className="h-5 w-5" />
            {bypassPayment ? 'Access Granted!' : 'Added!'}
          </>
        ) : (
          <>
            {bypassPayment ? (
              <>
                <Download className="h-5 w-5" />
                Get Access Now
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart - ${price.toLocaleString()}
              </>
            )}
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-destructive text-center">
          {error}
        </p>
      )}
      {bypassPayment && (
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Development mode: Immediate access granted
        </p>
      )}
    </div>
  );
}

