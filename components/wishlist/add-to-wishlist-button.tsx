'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AddToWishlistButtonProps {
  productId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onToggle?: (isInWishlist: boolean) => void;
}

export function AddToWishlistButton({
  productId,
  variant = 'outline',
  size = 'default',
  className,
  onToggle,
}: AddToWishlistButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    async function checkWishlistStatus() {
      if (!isAuthenticated || !user || !productId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/wishlist/check?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.isInWishlist || false);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkWishlistStatus();
  }, [isAuthenticated, user, productId]);

  const handleToggle = async () => {
    if (!isAuthenticated || !user) {
      // Redirect to sign in
      window.location.href = `/auth/signin?redirect=${window.location.pathname}`;
      return;
    }

    setIsToggling(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(false);
          onToggle?.(false);
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          onToggle?.(true);
        } else {
          throw new Error('Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Optionally show error toast
    } finally {
      setIsToggling(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show button if not authenticated
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading || isToggling}
      className={cn(className)}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          isInWishlist && 'fill-red-500 text-red-500'
        )}
      />
      <span className="ml-2">
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </span>
    </Button>
  );
}

