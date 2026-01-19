'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { WishlistItemWithProduct } from '@/lib/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingBag } from 'lucide-react';
import { WishlistGrid } from '@/components/wishlist/wishlist-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin?redirect=/account/wishlist');
        return;
      }

      try {
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishlist();
  }, [router]);

  const handleRemoveItem = async (itemId: string) => {
    const item = wishlist.find(i => i.id === itemId);
    if (!item) return;

    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.product_id }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter(i => i.id !== itemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-2">
            Save products you love and add them to your cart when you're ready
          </p>
        </div>

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">Your wishlist is empty</CardTitle>
              <CardDescription className="text-center mb-6">
                Start adding products to your wishlist to save them for later.
              </CardDescription>
              <Link href="/ai-to-usd">
                <Button>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <WishlistGrid items={wishlist} onItemRemove={handleRemoveItem} />
        )}
      </div>
    </main>
  );
}

