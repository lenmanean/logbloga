'use client';

import { PackageProduct } from '@/lib/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Headphones, Infinity, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsIncludedProps {
  package: PackageProduct;
  className?: string;
}

const INCLUDED_ITEMS = [
  {
    icon: MessageCircle,
    title: 'Official Logbloga chat assistant',
    description: 'Highly intelligent, context-aware assistant for this package and your library.',
  },
  {
    icon: Headphones,
    title: 'Priority support',
    description: 'Faster responses and dedicated help for implementation and product questions.',
  },
  {
    icon: Infinity,
    title: 'Lifetime access',
    description: 'Full access to all package content and future updates.',
  },
  {
    icon: Gift,
    title: 'Bonus: 6 months DOER Pro',
    description: '6 months of DOER Pro coupon included with your purchase.',
  },
] as const;

/**
 * Single panel listing what's included with every package purchase:
 * chat assistant, priority support, lifetime access, DOER Pro coupon.
 * Used on package product pages only (bundle page uses its own What's Included).
 */
export function WhatsIncluded({ package: _pkg, className }: WhatsIncludedProps) {
  return (
    <div className={cn(className)}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">What&apos;s Included</CardTitle>
          <p className="text-sm text-muted-foreground">
            Every package includes the following benefits and access.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INCLUDED_ITEMS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-muted/20"
              >
                <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base">{title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
