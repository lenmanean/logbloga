'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Testimonial {
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  displayName?: string;
  avatarImage?: string;
  caseStudyLink?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
  className?: string;
}

export function TestimonialCard({ testimonial, delay = 0, className }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = testimonial.text.length > 150;

  return (
    <Card
      className={cn(
        'bg-card border rounded-lg p-4 md:p-5 flex flex-col gap-3',
        className
      )}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 rounded-full bg-muted">
            {testimonial.avatarImage ? (
              <AvatarImage src={testimonial.avatarImage} alt={testimonial.name} />
            ) : null}
            <AvatarFallback className="text-sm font-medium text-foreground">
              {testimonial.initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm">{testimonial.displayName ?? testimonial.name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <p
        className={cn(
          'text-sm text-foreground leading-relaxed',
          !expanded && needsExpand && 'line-clamp-4'
        )}
      >
        {testimonial.text}
      </p>
      {needsExpand && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline text-left"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      {testimonial.caseStudyLink && (
        <Link
          href={testimonial.caseStudyLink}
          className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
        >
          View case study -&gt;
        </Link>
      )}
    </Card>
  );
}
