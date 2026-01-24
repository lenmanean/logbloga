'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
  packageInfo?: {
    packageSlug: string;
    packageName: string;
    packageValue: number;
  } | null;
}

export function ProductCard({ product, className, packageInfo }: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 flex flex-col', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabels[product.category]}
          </Badge>
          {product.featured && (
            <Badge className="bg-red-500 text-white border-0">
              Featured
            </Badge>
          )}
        </div>
        <div className="mt-4 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
          <div className="text-4xl opacity-20">📦</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors flex-1">
            {product.title}
          </h3>
          {packageInfo && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <Package className="h-3 w-3 mr-1" />
              In Package
            </Badge>
          )}
        </div>
        {packageInfo && (
          <Link 
            href={`/ai-to-usd/packages/${packageInfo.packageSlug}`}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            Included in {packageInfo.packageName} Package
          </Link>
        )}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {product.duration && (
            <Badge variant="outline" className="text-xs">
              {product.duration}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {packageInfo && (
            <div className="text-xs text-muted-foreground">
              Package value: <span className="line-through">${packageInfo.packageValue.toFixed(2)}</span>
            </div>
          )}
          {!packageInfo && product.originalPrice && (
            <div className="text-xs text-muted-foreground">
              Save ${((product.originalPrice as number) - (product.price as number)).toFixed(2)}
            </div>
          )}
        </div>
        {packageInfo ? (
          <Link href={`/ai-to-usd/packages/${packageInfo.packageSlug}`} className="w-full">
            <Button className="w-full rounded-full" variant="default">
              View Package
            </Button>
          </Link>
        ) : (
          <div className="w-full">
            <Button className="w-full rounded-full" variant="outline" disabled>
              Available in Package Only
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}



