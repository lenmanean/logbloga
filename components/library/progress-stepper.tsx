'use client';

import Link from 'next/link';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgressMap } from '@/lib/db/content-progress';
import { LEVEL_COMPONENT_LABELS, type LevelComponent } from '@/lib/utils/content';
import { getLevelTitle } from '@/lib/data/package-level-titles';

interface ProgressStepperProps {
  productId: string;
  slug: string;
  progress: ProgressMap;
  variant: 'overview' | 'level';
  level?: 1 | 2 | 3;
  className?: string;
}

export function ProgressStepper({
  productId,
  slug,
  progress,
  variant,
  level,
  className,
}: ProgressStepperProps) {
  if (variant === 'level' && level) {
    const levelProgress = progress[`level${level}` as keyof ProgressMap];
    const components: LevelComponent[] = [
      'implementation_plan',
      'platform_guides',
      'creative_frameworks',
      'templates',
    ];

    return (
      <div
        className={cn('w-full', className)}
        role="progressbar"
        aria-label={`Level ${level} progress`}
        data-product-id={productId}
      >
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {components.map((component, index) => {
            const isCompleted = levelProgress[component];
            const isLast = index === components.length - 1;
            const sectionId = `section-${component.replace(/_/g, '-')}`;

            return (
              <div key={component} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <button
                    onClick={() => {
                      const element = document.getElementById(sectionId);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground hover:border-primary/50',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                    aria-label={`${LEVEL_COMPONENT_LABELS[component]} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5 fill-current" />
                    )}
                  </button>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium text-center px-1',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {LEVEL_COMPONENT_LABELS[component].split(' ')[0]}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2 transition-colors min-w-[20px]',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Overview variant: 3 levels with 4 components each
  const levels: Array<{ level: 1 | 2 | 3; title: string }> = [
    { level: 1, title: getLevelTitle(slug, 1) },
    { level: 2, title: getLevelTitle(slug, 2) },
    { level: 3, title: getLevelTitle(slug, 3) },
  ];

  const components: LevelComponent[] = [
    'implementation_plan',
    'platform_guides',
    'creative_frameworks',
    'templates',
  ];

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-label="Package progress overview"
      data-product-id={productId}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2 overflow-x-auto pb-4">
        {levels.map(({ level: lvl, title }, levelIndex) => {
          const levelProgress = progress[`level${lvl}` as keyof ProgressMap];
          const completedCount = components.filter((c) => levelProgress[c]).length;
          const totalCount = components.length;
          const isLast = levelIndex === levels.length - 1;

          return (
            <div key={lvl} className="flex items-center flex-1 min-w-0">
              <Link
                href={`?tab=level${lvl}`}
                className="flex flex-col items-center flex-1 min-w-0 group"
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all',
                    completedCount === totalCount
                      ? 'bg-primary border-primary text-primary-foreground'
                      : completedCount > 0
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground',
                    'group-hover:border-primary/70'
                  )}
                  aria-label={`Level ${lvl}: ${title} - ${completedCount}/${totalCount} components completed`}
                >
                  {completedCount === totalCount ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold text-sm">{lvl}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center px-1 max-w-[100px]',
                    completedCount === totalCount
                      ? 'text-foreground'
                      : completedCount > 0
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  )}
                >
                  Level {lvl}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {completedCount}/{totalCount}
                </span>
              </Link>
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 md:h-12 md:w-0.5 flex-1 md:flex-none mx-2 md:mx-4 transition-colors min-w-[20px] md:min-w-0',
                    completedCount === totalCount ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
