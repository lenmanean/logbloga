'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface TopProduct {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
}

interface TopProductsProps {
  products: TopProduct[];
  isLoading?: boolean;
  limit?: number;
}

export function TopProducts({ products, isLoading = false, limit = 5 }: TopProductsProps) {
  const displayProducts = products.slice(0, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Products</CardTitle>
        <Link href="/admin/products">
          <Button variant="link" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {displayProducts.length > 0 ? (
          <div className="space-y-4">
            {displayProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <Link
                      href={`/admin/products/${product.productId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {product.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} {product.sales === 1 ? 'sale' : 'sales'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">No product data available</p>
        )}
      </CardContent>
    </Card>
  );
}

