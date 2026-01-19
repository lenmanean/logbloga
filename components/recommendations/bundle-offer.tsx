'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Sparkles } from 'lucide-react';
import { ProductSuggestions, type ProductSuggestion } from './product-suggestions';
import type { Product } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface BundleOfferProps {
  productId: string;
  title?: string;
  limit?: number;
  className?: string;
}

export function BundleOffer({
  productId,
  title = 'Complete Your Collection',
  limit = 3,
  className,
}: BundleOfferProps) {
  const [recommendations, setRecommendations] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savings, setSavings] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBundleRecommendations() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/recommendations/${productId}?type=cross-sell&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch bundle recommendations');
        }

        const data = await response.json();
        const suggestions: ProductSuggestion[] = (data.recommendations || []).map((r: any) => ({
          product: r.product,
          score: r.score,
          source: r.source,
          type: r.type,
        }));

        setRecommendations(suggestions);

        // Calculate potential savings if we have recommendations
        if (suggestions.length > 0) {
          // This is a simplified calculation - in a real scenario,
          // you'd have bundle pricing defined in the database
          const totalPrice = suggestions.reduce((sum, s) => {
            const price = typeof s.product.price === 'number'
              ? s.product.price
              : parseFloat(String(s.product.price || 0));
            return sum + price;
          }, 0);
          // Assume 10% discount for bundles
          const bundleDiscount = totalPrice * 0.1;
          setSavings(bundleDiscount);
        }
      } catch (error) {
        console.error('Error fetching bundle recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchBundleRecommendations();
    }
  }, [productId, limit]);

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={cn('border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {savings && savings > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              Save ${Math.round(savings).toLocaleString()}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Bundle these products together and save! Perfect complements to enhance your learning journey.
        </p>
      </CardHeader>
      <CardContent>
        <ProductSuggestions
          products={recommendations}
          layout="grid"
          limit={limit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

