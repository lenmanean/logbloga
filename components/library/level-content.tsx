'use client';

import { Sparkles, BookOpen, Settings, Lightbulb, FileText } from 'lucide-react';
import type { LevelContent } from '@/lib/data/package-level-content';
import {
  isHostedContent,
  getFileTypeIcon,
  formatFileName,
} from '@/lib/utils/content';
import { ContentSection } from '@/components/library/content-section';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { DownloadButton } from '@/components/library/download-button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LevelContentProps {
  productId: string;
  level: 1 | 2 | 3;
  levelData: LevelContent;
  className?: string;
}

export function LevelContent({ productId, level, levelData, className }: LevelContentProps) {
  const { aiLeverage, implementationPlan, platformGuides, creativeFrameworks, templates } =
    levelData;

  return (
    <div className={cn('space-y-6', className)}>
      {/* AI Leverage */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
              AI Leverage
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {aiLeverage}
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Plan */}
      <ContentSection
        title="Implementation Plan"
        description="Step-by-step roadmap to guide your implementation"
        icon={BookOpen}
      >
        <div className="space-y-3">
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
          title="Platform Setup Guides"
          description="Step-by-step instructions for setting up and configuring platforms"
          icon={Settings}
        >
          <div className="space-y-4">
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
          title="Creative Decision Frameworks"
          description="Guided exercises to help you make creative decisions (niche, branding, ideas, etc.)"
          icon={Lightbulb}
        >
          <div className="space-y-4">
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
          title="Templates & Checklists"
          description="Ready-to-use templates, checklists, and resources"
          icon={FileText}
        >
          <div className="space-y-4">
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
