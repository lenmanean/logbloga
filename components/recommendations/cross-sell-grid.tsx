'use client';

import { useState, useEffect } from 'react';
import { ProductSuggestions, type ProductSuggestion } from './product-suggestions';
import type { Product } from '@/lib/types/database';

interface CrossSellGridProps {
  productId: string;
  title?: string;
  limit?: number;
  excludeProductIds?: string[];
  className?: string;
}

export function CrossSellGrid({
  productId,
  title = 'You May Also Like',
  limit = 4,
  excludeProductIds = [],
  className,
}: CrossSellGridProps) {
  const [recommendations, setRecommendations] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        const excludeParam = excludeProductIds.length > 0 ? excludeProductIds.join(',') : '';
        const response = await fetch(
          `/api/recommendations/${productId}?type=cross-sell,related&limit=${limit + excludeProductIds.length}${excludeParam ? `&exclude=${excludeParam}` : ''}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        const suggestions: ProductSuggestion[] = (data.recommendations || []).map((r: any) => ({
          product: r.product,
          score: r.score,
          source: r.source,
          type: r.type,
        }));

        setRecommendations(suggestions);
      } catch (error) {
        console.error('Error fetching cross-sell recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchRecommendations();
    }
  }, [productId, limit, excludeProductIds.join(',')]);

  if (!isLoading && recommendations.length === 0) {
    return null;
  }

  return (
    <ProductSuggestions
      products={recommendations}
      title={title}
      layout="grid"
      limit={limit}
      className={className}
      isLoading={isLoading}
    />
  );
}

