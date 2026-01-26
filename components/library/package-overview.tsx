'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { getLevelTitle } from '@/lib/data/package-level-titles';
import type { Product } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface PackageOverviewProps {
  product: Product;
  className?: string;
}

export function PackageOverview({ product, className }: PackageOverviewProps) {
  const pathname = usePathname();
  const slug = (product.slug || product.category || '') as string;

  const level1Title = getLevelTitle(slug, 1);
  const level2Title = getLevelTitle(slug, 2);
  const level3Title = getLevelTitle(slug, 3);

  const images = product.images as string[] | null | undefined;
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const productImage = product.package_image || firstImage || '/placeholder-product.png';

  const tabUrl = (tab: string) => `${pathname}?tab=${tab}`;

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {product.title || product.name || 'Package'}
          </CardTitle>
          <CardDescription className="mt-2">
            {product.description || 'Digital product package'}
          </CardDescription>
        </CardHeader>
        {productImage && (
          <CardContent>
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <Image
                src={productImage}
                alt={product.title || 'Package'}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {product.category && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Category</p>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">What's Included</CardTitle>
          </div>
          <CardDescription>
            Three implementation levels with guides, frameworks, and templates. Use the tabs above
            or the links below to jump to each level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Link
              href={tabUrl('level1')}
              className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">Level 1: {level1Title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href={tabUrl('level2')}
              className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">Level 2: {level2Title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href={tabUrl('level3')}
              className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">Level 3: {level3Title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Lifetime access</p>
              <p className="text-sm text-muted-foreground">
                You have full access to all levels, including implementation plans, platform setup
                guides, creative frameworks, and templates. Hosted content can be read in-browser;
                other files are available to download.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
