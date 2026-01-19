'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface UpsellBannerProps {
  productId: string;
  className?: string;
}

export function UpsellBanner({ productId, className }: UpsellBannerProps) {
  const [upsell, setUpsell] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUpsell() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/recommendations/${productId}?type=upsell&limit=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch upsell recommendation');
        }

        const data = await response.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setUpsell(data.recommendations[0].product);
        }
      } catch (error) {
        console.error('Error fetching upsell recommendation:', error);
        setUpsell(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchUpsell();
    }
  }, [productId]);

  if (isLoading || !upsell) {
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

  const productSlug = upsell.slug || upsell.id;

  return (
    <Card className={cn('border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/20">
              <Image
                src={getProductImage(upsell)}
                alt={getProductTitle(upsell)}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge className="bg-primary text-primary-foreground">Premium Upgrade</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">{getProductTitle(upsell)}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {upsell.description || 'Upgrade to unlock premium features and exclusive content.'}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div>
                <span className="text-2xl font-bold">${getProductPrice(upsell).toLocaleString()}</span>
              </div>
              <Link href={`/ai-to-usd/packages/${productSlug}`}>
                <Button className="gap-2">
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

