'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types/database';

interface PackageIncludedProductsProps {
  includedProducts: Array<{
    product: Product;
    package_value: number;
    display_order: number;
  }>;
  totalPackageValue: number;
  packagePrice: number;
  packageSlug: string;
}

export function PackageIncludedProducts({
  includedProducts,
  totalPackageValue,
  packagePrice,
  packageSlug,
}: PackageIncludedProductsProps) {
  const savings = totalPackageValue - packagePrice;
  const savingsPercentage = totalPackageValue > 0 
    ? Math.round((savings / totalPackageValue) * 100)
    : 0;
  const hasSavings = savings > 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Included Products</CardTitle>
          </div>
          {hasSavings && (
            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 text-base px-3 py-1">
              Best Value
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Individual Value</p>
            <p className="text-3xl font-bold">
              ${totalPackageValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex-1" />
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Price</p>
            <p className="text-3xl font-bold text-primary">
              ${packagePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        {savings > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  You Save ${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  That's {savingsPercentage}% off individual product prices!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            This package includes all of the following individual products:
          </p>
          {includedProducts.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {item.product.title || item.product.name}
                  </span>
                  {item.product.featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                {item.product.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {item.product.description}
                  </p>
                )}
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm text-muted-foreground line-through">
                  ${((item.product.price as number) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="font-semibold text-primary">
                  ${item.package_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Package Value
                </p>
              </div>
            </div>
          ))}
          {hasSavings && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> Individual products are included in this package. 
                Purchasing the package saves you ${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                compared to the individual product values.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
