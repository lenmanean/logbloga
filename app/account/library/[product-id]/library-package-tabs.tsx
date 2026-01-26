'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageOverview } from '@/components/library/package-overview';
import { LevelContent } from '@/components/library/level-content';
import type { Product } from '@/lib/types/database';
import type { LevelContent as LevelContentType } from '@/lib/data/package-level-content';
import { cn } from '@/lib/utils';

type TabValue = 'overview' | 'level1' | 'level2' | 'level3';

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
  const tab = (searchParams.get('tab') as TabValue) || 'overview';
  const validTab: TabValue =
    tab === 'level1' || tab === 'level2' || tab === 'level3' ? tab : 'overview';

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'overview') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return (
    <Tabs
      value={validTab}
      onValueChange={setTab}
      className={cn('w-full', className)}
    >
      <TabsList className="flex w-full flex-wrap h-auto gap-1 p-1 bg-muted">
        <TabsTrigger value="overview" className="flex-1 min-w-[120px]">
          Overview
        </TabsTrigger>
        <TabsTrigger value="level1" className="flex-1 min-w-[120px]">
          Level 1
        </TabsTrigger>
        <TabsTrigger value="level2" className="flex-1 min-w-[120px]">
          Level 2
        </TabsTrigger>
        <TabsTrigger value="level3" className="flex-1 min-w-[120px]">
          Level 3
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <PackageOverview product={product} />
      </TabsContent>

      <TabsContent value="level1" className="mt-6">
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

      <TabsContent value="level2" className="mt-6">
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

      <TabsContent value="level3" className="mt-6">
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
    </Tabs>
  );
}
