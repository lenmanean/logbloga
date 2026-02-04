'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Renders 1–5 stars for a single review (integer rating). Same visual style as ReviewsSection. */
export function StarRatingStars({ rating, className, size = 'default' }: { rating: number; className?: string; size?: 'default' | 'sm' }) {
  const fullStars = Math.min(5, Math.max(0, Math.floor(rating)));
  const emptyStars = 5 - fullStars;
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${fullStars} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className={cn(sizeClass, 'fill-yellow-400 text-yellow-400')} />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className={cn(sizeClass, 'fill-gray-300 text-gray-300')} />
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export function ReviewsSection({ rating, reviewCount, className }: ReviewsSectionProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative h-5 w-5">
            <Star className="absolute h-5 w-5 fill-gray-300 text-gray-300" />
            <div className="absolute h-5 w-2.5 overflow-hidden">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 fill-gray-300 text-gray-300" />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
      </span>
    </div>
  );
}



