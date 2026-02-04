'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StarRatingStars } from '@/components/ui/reviews-section';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const REVIEWS_PAGE_SIZE = 10;
const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 2000;
const MAX_DISPLAY_NAME_LENGTH = 100;

export interface ReviewItem {
  id: string;
  rating: number;
  content: string | null;
  title: string | null;
  reviewer_display_name: string | null;
  created_at: string | null;
}

interface ProductReviewsSectionProps {
  productId: string;
  initialReviews?: ReviewItem[];
  className?: string;
}

export function ProductReviewsSection({
  productId,
  initialReviews = [],
  className,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [offset, setOffset] = useState(initialReviews.length);
  const [hasMore, setHasMore] = useState(initialReviews.length >= REVIEWS_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const fetchPage = useCallback(
    async (off: number, append: boolean) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/${productId}/reviews?limit=${REVIEWS_PAGE_SIZE}&offset=${off}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const list = (data.reviews || []) as ReviewItem[];
        if (append) {
          setReviews((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newOnes = list.filter((r) => !ids.has(r.id));
            return [...prev, ...newOnes];
          });
        } else {
          setReviews(list);
        }
        setHasMore(list.length >= REVIEWS_PAGE_SIZE);
        setOffset(off + list.length);
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    if (initialReviews.length > 0 && reviews.length === initialReviews.length && offset === initialReviews.length) {
      setHasMore(initialReviews.length >= REVIEWS_PAGE_SIZE);
    }
  }, [initialReviews.length, reviews.length, offset]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth - scrollLeft - clientWidth < 200) {
      fetchPage(offset, true);
    }
  }, [loading, hasMore, offset, fetchPage]);

  return (
    <section className={cn('space-y-6', className)} aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-semibold">
        Reviews
      </h2>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarGutter: 'stable' }}
        role="list"
        aria-label="Customer reviews"
      >
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="min-w-[280px] max-w-[340px] shrink-0 snap-start flex flex-col"
            role="listitem"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {review.reviewer_display_name?.trim() || 'Anonymous'}
                  </p>
                  <StarRatingStars rating={review.rating} size="sm" className="mt-0.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {review.content || ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
        </div>
      )}

      {isAuthenticated && (
        <ProductReviewForm
          productId={productId}
          onSubmitted={() => fetchPage(0, false)}
        />
      )}
    </section>
  );
}

interface ProductReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

function ProductReviewForm({ productId, onSubmitted }: ProductReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [displayName, setDisplayName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submit = async () => {
    if (rating < 1 || rating > 5) {
      setMessage({ type: 'error', text: 'Please select a star rating.' });
      return;
    }
    const trimmedContent = content.trim();
    if (trimmedContent.length < MIN_CONTENT_LENGTH) {
      setMessage({ type: 'error', text: `Review must be at least ${MIN_CONTENT_LENGTH} characters.` });
      return;
    }
    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setMessage({ type: 'error', text: `Review must be no more than ${MAX_CONTENT_LENGTH} characters.` });
      return;
    }
    const trimmedName = displayName.trim();
    if (trimmedName.length > 0 && trimmedName.length < 2) {
      setMessage({ type: 'error', text: 'Display name must be at least 2 characters if provided.' });
      return;
    }
    if (trimmedName.length > MAX_DISPLAY_NAME_LENGTH) {
      setMessage({ type: 'error', text: `Display name must be no more than ${MAX_DISPLAY_NAME_LENGTH} characters.` });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          reviewer_display_name: trimmedName || null,
          content: trimmedContent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setMessage({ type: 'error', text: "You've already submitted a review for this product." });
        return;
      }
      if (!res.ok) {
        setMessage({ type: 'error', text: (data.error as string) || 'Failed to submit review.' });
        return;
      }
      setMessage({ type: 'success', text: 'Thank you! Your review has been submitted and is pending approval.' });
      setRating(0);
      setDisplayName('');
      setContent('');
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Rating</Label>
          <div className="flex gap-0.5 mt-1" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={`${value} star${value === 1 ? '' : 's'}`}
                aria-pressed={rating === value}
              >
                <Star
                  className={cn(
                    'h-5 w-5',
                    rating >= value ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {rating > 0 ? `${rating} star${rating === 1 ? '' : 's'}` : 'Select rating'}
          </p>
        </div>
        <div>
          <Label htmlFor="review-display-name">Display name (optional)</Label>
          <Input
            id="review-display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))}
            placeholder="How you'll appear next to your review"
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="review-content">Your review</Label>
          <Textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
            placeholder="Share your experience with this package (at least 10 characters)"
            rows={4}
            maxLength={MAX_CONTENT_LENGTH}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {content.length} / {MAX_CONTENT_LENGTH}
          </p>
        </div>
        {message && (
          <p
            className={cn(
              'text-sm',
              message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-destructive'
            )}
            role="alert"
          >
            {message.text}
          </p>
        )}
        <Button onClick={submit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit review'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
