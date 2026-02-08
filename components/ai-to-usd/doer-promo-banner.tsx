'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export function DoerPromoBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3 md:px-6 md:py-4 mb-8',
        'backdrop-blur-md bg-emerald-500/15 dark:bg-emerald-500/10',
        'border border-emerald-500/30',
        'animate-green-glow',
        'flex flex-row items-center justify-center gap-3 sm:gap-4',
        className
      )}
    >
      <div className="flex justify-center shrink-0">
        <Image
          src="/usedoer_favicon.png"
          alt="DOER"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <p className="text-sm md:text-base text-center sm:text-left text-foreground font-medium">
        Limited time: 6-month DOER Pro coupon bonus with any package purchase
      </p>
    </div>
  );
}
