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
      'launch_marketing',
      'troubleshooting',
      'planning',
      'templates',
    ];

    return (
      <div
        className={cn('w-full', className)}
        role="progressbar"
        aria-label={`Level ${level} progress`}
        data-product-id={productId}
      >
        <div className="relative w-full py-4">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-muted-foreground/30" />
          
          {/* Progress line (fills based on completed sections) */}
          {(() => {
            // Find the last completed section index
            let lastCompletedIndex = -1;
            components.forEach((component, index) => {
              if (levelProgress[component]) {
                lastCompletedIndex = index;
              }
            });
            
            if (lastCompletedIndex < 0) return null;
            
            // Calculate progress: fill line up to the center of the last completed node
            // Each section takes up equal space, progress fills to the center of completed sections
            const totalSections = components.length;
            const sectionWidth = 100 / totalSections;
            
            // Progress goes to the center of the last completed node
            // If all sections are complete, fill to 100%
            let progressPercent: number;
            if (lastCompletedIndex === totalSections - 1) {
              progressPercent = 100;
            } else {
              // Progress to the center of the last completed node
              progressPercent = ((lastCompletedIndex + 1) * sectionWidth) + (sectionWidth / 2);
            }
            
            return (
              <div
                className="absolute top-8 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            );
          })()}
          
          {/* Nodes */}
          <div className="relative flex items-start justify-between w-full">
            {components.map((component, index) => {
              const isCompleted = levelProgress[component];
              const sectionId = `section-${component.replace(/_/g, '-')}`;
              const label = LEVEL_COMPONENT_LABELS[component];
              const shortLabel = label.split(' ')[0];

              return (
                <div
                  key={component}
                  className="flex flex-col items-center flex-1 min-w-0 max-w-[120px]"
                >
                  <button
                    onClick={() => {
                      const element = document.getElementById(sectionId);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn(
                      'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground hover:border-primary/50',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                    aria-label={`${label} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 fill-current" />
                    )}
                  </button>
                  <span
                    className={cn(
                      'mt-2 text-[10px] font-medium text-center leading-tight break-words px-1',
                      isCompleted ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    )}
                    title={label}
                  >
                    {shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Overview variant: 3 levels with 7 components each
  const levels: Array<{ level: 1 | 2 | 3; title: string }> = [
    { level: 1, title: getLevelTitle(slug, 1) },
    { level: 2, title: getLevelTitle(slug, 2) },
    { level: 3, title: getLevelTitle(slug, 3) },
  ];

  const components: LevelComponent[] = [
    'implementation_plan',
    'platform_guides',
    'creative_frameworks',
    'launch_marketing',
    'troubleshooting',
    'planning',
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
