'use client';

import { PackageProduct } from '@/lib/products';
import { cn } from '@/lib/utils';
import { PackageLevelsContent } from './package-levels-content';

interface WhatsIncludedProps {
  package: PackageProduct;
  className?: string;
}

/** Displays package content using level-based structure (Level 1–3). */
export function WhatsIncluded({ package: pkg, className }: WhatsIncludedProps) {
  const hasLevels = pkg.levels && (
    pkg.levels.level1 ||
    pkg.levels.level2 ||
    pkg.levels.level3
  );

  if (!hasLevels) {
    return null;
  }

  return <PackageLevelsContent package={pkg} className={className} />;
}
