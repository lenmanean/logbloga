'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageOverview } from '@/components/library/package-overview';
import { LevelContent } from '@/components/library/level-content';
import type { Product } from '@/lib/types/database';
import type { LevelContent as LevelContentType } from '@/lib/data/package-level-content';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type TabValue = 'overview' | 'level1' | 'level2' | 'level3';

const TAB_TRIGGER_CLASS =
  'flex-1 min-w-[120px] transition-all duration-200 ease-out ' +
  'hover:bg-background/70 hover:text-foreground ' +
  'data-[state=inactive]:hover:scale-[1.02] ' +
  'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ' +
  'rounded-md';

interface LibraryPackageTabsProps {
  product: Product;
  level1Data: LevelContentType | null;
  level2Data: LevelContentType | null;
  level3Data: LevelContentType | null;
  className?: string;
}

export function LibraryPackageTabs({
  product,
  level1Data,
  level2Data,
  level3Data,
  className,
}: LibraryPackageTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const tab = (searchParams.get('tab') as TabValue) || 'overview';
  const validTab: TabValue =
    tab === 'level1' || tab === 'level2' || tab === 'level3' ? tab : 'overview';

  const setTab = useCallback(
    (value: string) => {
      if (value === validTab) return;
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      setIsTransitioning(true);
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'overview') {
        params.delete('tab');
      } else {
        params.set('tab', value);
      }
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
      transitionTimeoutRef.current = setTimeout(() => {
        transitionTimeoutRef.current = null;
        setIsTransitioning(false);
      }, 400);
    },
    [validTab, searchParams, router, pathname]
  );

  return (
    <Tabs
      value={validTab}
      onValueChange={setTab}
      className={cn('w-full', className)}
    >
      <TabsList className="flex w-full flex-wrap h-auto gap-1.5 p-1.5 rounded-lg bg-muted">
        <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="level1" className={TAB_TRIGGER_CLASS}>
          Level 1
        </TabsTrigger>
        <TabsTrigger value="level2" className={TAB_TRIGGER_CLASS}>
          Level 2
        </TabsTrigger>
        <TabsTrigger value="level3" className={TAB_TRIGGER_CLASS}>
          Level 3
        </TabsTrigger>
      </TabsList>

      <div className="relative min-h-[280px] mt-6">
        {isTransitioning && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 animate-fade-in"
            role="status"
            aria-live="polite"
            aria-label="Loading tab content"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Loading…
            </p>
          </div>
        )}

        <TabsContent value="overview" className="mt-0 data-[state=inactive]:hidden">
          <PackageOverview product={product} />
        </TabsContent>

        <TabsContent value="level1" className="mt-0 data-[state=inactive]:hidden">
          {level1Data ? (
            <LevelContent
              productId={product.id}
              level={1}
              levelData={level1Data}
            />
          ) : (
            <p className="text-muted-foreground">Level 1 content is not available.</p>
          )}
        </TabsContent>

        <TabsContent value="level2" className="mt-0 data-[state=inactive]:hidden">
          {level2Data ? (
            <LevelContent
              productId={product.id}
              level={2}
              levelData={level2Data}
            />
          ) : (
            <p className="text-muted-foreground">Level 2 content is not available.</p>
          )}
        </TabsContent>

        <TabsContent value="level3" className="mt-0 data-[state=inactive]:hidden">
          {level3Data ? (
            <LevelContent
              productId={product.id}
              level={3}
              levelData={level3Data}
            />
          ) : (
            <p className="text-muted-foreground">Level 3 content is not available.</p>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
