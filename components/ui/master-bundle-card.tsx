'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const goldCardClassName =
  'overflow-hidden border-2 border-amber-400/50 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-yellow-50/70 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-yellow-950/25 hover:shadow-xl hover:border-amber-500/60 dark:hover:border-amber-400/50 transition-all duration-300 animate-gold-glow';

interface MasterBundleCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Premium gold-styled card for Master Bundle CTAs (upsell, landing).
 * Gold border, gradient background, and subtle golden glow animation.
 */
export function MasterBundleCard({ href, children, className }: MasterBundleCardProps) {
  return (
    <Link href={href} className={cn('block', className)}>
      <Card className={cn('relative', goldCardClassName)}>
        <CardContent className="relative z-10 p-6 md:p-8 text-foreground">
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}
