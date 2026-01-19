'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function WishlistBadge() {
  const { isAuthenticated, user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistCount() {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/wishlist/count');
        if (response.ok) {
          const data = await response.json();
          setCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching wishlist count:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishlistCount();

    // Refresh count periodically
    const interval = setInterval(fetchWishlistCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  if (!isAuthenticated || isLoading || count === null || count === 0) {
    return null;
  }

  return (
    <Link href="/account/wishlist">
      <Badge
        variant="secondary"
        className="relative cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Heart className="h-3 w-3 mr-1" />
        {count > 99 ? '99+' : count}
      </Badge>
    </Link>
  );
}

