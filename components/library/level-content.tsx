'use client';

import { useState } from 'react';
import { BookOpen, Settings, Lightbulb, FileText, Check } from 'lucide-react';
import type { LevelContent } from '@/lib/data/package-level-content';
import {
  isHostedContent,
  getFileTypeIcon,
  formatFileName,
  type LevelComponent,
} from '@/lib/utils/content';
import { ContentSection } from '@/components/library/content-section';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { DownloadButton } from '@/components/library/download-button';
import { ProgressStepper } from '@/components/library/progress-stepper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProgressMap } from '@/lib/db/content-progress';

interface LevelContentProps {
  productId: string;
  level: 1 | 2 | 3;
  levelData: LevelContent;
  progress: ProgressMap;
  slug: string;
  onProgressUpdate?: () => void;
  className?: string;
}

export function LevelContent({
  productId,
  level,
  levelData,
  progress,
  slug,
  onProgressUpdate,
  className,
}: LevelContentProps) {
  const [isMarkingComplete, setIsMarkingComplete] = useState<string | null>(null);
  const { implementationPlan, platformGuides, creativeFrameworks, templates } = levelData;
  const levelProgress = progress[`level${level}` as keyof ProgressMap];

  const handleMarkComplete = async (component: LevelComponent) => {
    if (isMarkingComplete) return;
    setIsMarkingComplete(component);

    try {
      const response = await fetch(`/api/library/${productId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, component }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as complete');
      }

      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error('Error marking component as complete:', error);
    } finally {
      setIsMarkingComplete(null);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Level Progress Bar */}
      <div className="mb-6">
        <ProgressStepper
          productId={productId}
          slug={slug}
          progress={progress}
          variant="level"
          level={level}
        />
      </div>

      {/* Implementation Plan */}
      <ContentSection
        id="section-implementation-plan"
        title="Implementation Plan"
        description="Step-by-step roadmap to guide your implementation"
        icon={BookOpen}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">
                  {formatFileName(implementationPlan.file)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {implementationPlan.type.toUpperCase()}
                </Badge>
              </div>
              {implementationPlan.description && (
                <p className="text-sm text-muted-foreground">
                  {implementationPlan.description}
                </p>
              )}
            </div>
            {!levelProgress.implementation_plan && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkComplete('implementation_plan')}
                disabled={isMarkingComplete === 'implementation_plan'}
                className="flex-shrink-0"
              >
                {isMarkingComplete === 'implementation_plan' ? (
                  'Marking...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Mark Complete
                  </>
                )}
              </Button>
            )}
            {levelProgress.implementation_plan && (
              <div className="flex items-center gap-1 text-sm text-primary flex-shrink-0">
                <Check className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
          {isHostedContent(implementationPlan.type) ? (
            <MarkdownViewer
              productId={productId}
              filename={implementationPlan.file}
              className="mt-4"
            />
          ) : (
            <DownloadButton
              productId={productId}
              filename={implementationPlan.file}
              label={`Download ${formatFileName(implementationPlan.file)}`}
            />
          )}
        </div>
      </ContentSection>

      {/* Platform Setup Guides */}
      {platformGuides.length > 0 && (
        <ContentSection
          id="section-platform-guides"
          title="Platform Setup Guides"
          description="Step-by-step instructions for setting up and configuring platforms"
          icon={Settings}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              {!levelProgress.platform_guides && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('platform_guides')}
                  disabled={isMarkingComplete === 'platform_guides'}
                >
                  {isMarkingComplete === 'platform_guides' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
              {levelProgress.platform_guides && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            {platformGuides.map((guide, idx) => {
              const hosted = isHostedContent(guide.type);
              const Icon = getFileTypeIcon(guide.type);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatFileName(guide.file)}
                    </span>
                    {guide.platform && (
                      <Badge variant="outline" className="text-xs">
                        {guide.platform}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {guide.type.toUpperCase()}
                    </Badge>
                  </div>
                  {guide.description && (
                    <p className="text-xs text-muted-foreground">
                      {guide.description}
                    </p>
                  )}
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={guide.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={guide.file}
                      label={`Download ${formatFileName(guide.file)}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}

      {/* Creative Decision Frameworks */}
      {creativeFrameworks.length > 0 && (
        <ContentSection
          id="section-creative-frameworks"
          title="Creative Decision Frameworks"
          description="Guided exercises to help you make creative decisions (niche, branding, ideas, etc.)"
          icon={Lightbulb}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              {!levelProgress.creative_frameworks && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('creative_frameworks')}
                  disabled={isMarkingComplete === 'creative_frameworks'}
                >
                  {isMarkingComplete === 'creative_frameworks' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
              {levelProgress.creative_frameworks && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            {creativeFrameworks.map((fw, idx) => {
              const hosted = isHostedContent(fw.type);
              const Icon = getFileTypeIcon(fw.type);
              const label = fw.name || formatFileName(fw.file);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {fw.type.toUpperCase()}
                    </Badge>
                  </div>
                  {fw.description && (
                    <p className="text-xs text-muted-foreground">
                      {fw.description}
                    </p>
                  )}
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={fw.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={fw.file}
                      label={`Download ${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}

      {/* Templates & Checklists (always downloadable) */}
      {templates.length > 0 && (
        <ContentSection
          id="section-templates"
          title="Templates & Checklists"
          description="Ready-to-use templates, checklists, and resources"
          icon={FileText}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              {!levelProgress.templates && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('templates')}
                  disabled={isMarkingComplete === 'templates'}
                >
                  {isMarkingComplete === 'templates' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
              {levelProgress.templates && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            {templates.map((t, idx) => {
              const Icon = getFileTypeIcon(t.type);
              const label = t.name || formatFileName(t.file);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {t.type.toUpperCase()}
                    </Badge>
                  </div>
                  {t.description && (
                    <p className="text-xs text-muted-foreground">
                      {t.description}
                    </p>
                  )}
                  <DownloadButton
                    productId={productId}
                    filename={t.file}
                    label={`Download ${label}`}
                  />
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}
    </div>
  );
}
