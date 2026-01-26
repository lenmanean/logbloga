'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getLevelTitle } from '@/lib/data/package-level-titles';
import { ProgressStepper } from '@/components/library/progress-stepper';
import type { Product } from '@/lib/types/database';
import type { ProgressMap } from '@/lib/db/content-progress';
import { cn } from '@/lib/utils';

interface PackageOverviewProps {
  product: Product;
  progress: ProgressMap;
  className?: string;
}

export function PackageOverview({ product, progress, className }: PackageOverviewProps) {
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
      {/* Progress Stepper */}
      <div className="mb-6">
        <ProgressStepper
          productId={product.id}
          slug={slug}
          progress={progress}
          variant="overview"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Header Text + Level Links */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-3">
                <CardTitle className="text-2xl md:text-3xl">
                  {product.title || product.name || 'Package'}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {product.description || 'Digital product package'}
                </CardDescription>
              </div>
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
            </div>

            {/* Right Column: 3D Mockup Image */}
            {productImage && (
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted p-4">
                <Image
                  src={productImage}
                  alt={product.title || 'Package'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
