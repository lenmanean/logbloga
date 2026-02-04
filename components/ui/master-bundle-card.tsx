'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SPARKLE_COUNT = 8;
const SPARKLE_POSITIONS: { top: string; left: string; delay: number }[] = [
  { top: '10%', left: '8%', delay: 0 },
  { top: '15%', left: '85%', delay: 0.1 },
  { top: '50%', left: '5%', delay: 0.2 },
  { top: '55%', left: '92%', delay: 0.15 },
  { top: '85%', left: '12%', delay: 0.25 },
  { top: '88%', left: '88%', delay: 0.05 },
  { top: '35%', left: '78%', delay: 0.18 },
  { top: '72%', left: '22%', delay: 0.12 },
];

function MasterBundleSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none" aria-hidden>
      {SPARKLE_POSITIONS.slice(0, SPARKLE_COUNT).map((pos, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400/90 dark:bg-amber-300/90 animate-sparkle-fade"
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: `${pos.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const goldCardClassName =
  'overflow-hidden border-2 border-amber-400/50 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-yellow-50/70 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-yellow-950/25 hover:shadow-xl hover:border-amber-500/60 dark:hover:border-amber-400/50 transition-all duration-300 animate-gold-glow';

interface MasterBundleCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Premium gold-styled card for Master Bundle CTAs (upsell, landing).
 * Renders sparkles on mount and a subtle golden glow animation.
 */
export function MasterBundleCard({ href, children, className }: MasterBundleCardProps) {
  return (
    <Link href={href} className={cn('block', className)}>
      <Card className={cn('relative', goldCardClassName)}>
        <MasterBundleSparkles />
        <CardContent className="relative z-10 p-6 md:p-8 text-foreground">
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}
