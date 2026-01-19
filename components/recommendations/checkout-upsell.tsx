'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types/database';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CheckoutUpsellProps {
  className?: string;
}

export function CheckoutUpsell({ className }: CheckoutUpsellProps) {
  const { items, addItem } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        const cartProductIds = items.map((item) => item.product_id);
        if (cartProductIds.length === 0) {
          setRecommendations([]);
          return;
        }

        // Fetch recommendations for the first product in cart
        // In a full implementation, we'd have a dedicated checkout recommendations endpoint
        const firstProductId = cartProductIds[0];
        const response = await fetch(
          `/api/recommendations/${firstProductId}?type=cross-sell&limit=3&exclude=${cartProductIds.join(',')}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations?.map((r: any) => r.product) || []);
      } catch (error) {
        console.error('Error fetching checkout recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [items.map((i) => i.product_id).join(',')]);

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await addItem(productId, 1);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  const getProductImage = (product: Product): string => {
    if (product.package_image) return product.package_image;
    const images = product.images as string[] | null;
    if (images && images.length > 0) return images[0];
    if (product.image_url) return product.image_url;
    return '/placeholder-product.png';
  };

  const getProductTitle = (product: Product): string => {
    return product.title || product.name || 'Untitled Product';
  };

  const getProductPrice = (product: Product): number => {
    return typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  };

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Complete Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Customers who bought items in your cart also purchased:
        </p>
        <div className="space-y-3">
          {recommendations.map((product) => {
            const productSlug = product.slug || product.id;
            const isAdding = addingToCart === product.id;

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                  <Image
                    src={getProductImage(product)}
                    alt={getProductTitle(product)}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/ai-to-usd/packages/${productSlug}`}
                    className="font-medium hover:text-primary transition-colors block truncate"
                  >
                    {getProductTitle(product)}
                  </Link>
                  <p className="text-sm font-semibold text-primary">
                    ${getProductPrice(product).toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isAdding}
                  className="flex-shrink-0"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

