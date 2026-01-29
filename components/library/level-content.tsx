'use client';

import { useState } from 'react';
import { BookOpen, Settings, Lightbulb, FileText, Check, Rocket, Wrench, Calendar, X, Maximize2 } from 'lucide-react';
import type { LevelContent } from '@/lib/data/package-level-content';
import {
  isHostedContent,
  getFileTypeIcon,
  formatFileName,
  filterMarkdownFiles,
  type LevelComponent,
} from '@/lib/utils/content';
import { ContentSection } from '@/components/library/content-section';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { DownloadButton } from '@/components/library/download-button';
import { SectionDownloadButton } from '@/components/library/section-download-button';
import { ProgressStepper } from '@/components/library/progress-stepper';
import { ExpandedDocumentView } from '@/components/library/expanded-document-view';
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
  const [isExpandedViewOpen, setIsExpandedViewOpen] = useState(false);
  const {
    implementationPlan,
    platformGuides,
    creativeFrameworks,
    templates,
    launchMarketing = [],
    troubleshooting = [],
    planning = [],
  } = levelData;
  const levelProgress = progress[`level${level}` as keyof ProgressMap];
  const isImplementationPlanExpanded =
    level === 1 && isExpandedViewOpen && isHostedContent(implementationPlan.type);

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

  const handleUnmarkComplete = async (component: LevelComponent) => {
    if (isMarkingComplete) return;
    setIsMarkingComplete(component);

    try {
      const response = await fetch(`/api/library/${productId}/progress`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, component }),
      });

      if (!response.ok) {
        throw new Error('Failed to unmark as complete');
      }

      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error('Error unmarking component as complete:', error);
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <SectionDownloadButton
                productId={productId}
                files={[implementationPlan]}
                sectionTitle="Implementation Plan"
                level={level}
              />
              {!levelProgress.implementation_plan ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('implementation_plan')}
                  disabled={isMarkingComplete === 'implementation_plan'}
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
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('implementation_plan')}
                  disabled={isMarkingComplete === 'implementation_plan'}
                >
                  {isMarkingComplete === 'implementation_plan' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
              )}
              {level === 1 && isHostedContent(implementationPlan.type) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpandedViewOpen(true)}
                  aria-label="Expand document view"
                  title="Expanded view"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {isHostedContent(implementationPlan.type) ? (
            // When expanded overlay is open, don't mount the inline viewer to avoid duplicate IDs and two scrollbars
            isImplementationPlanExpanded ? (
              <p className="mt-4 text-sm text-muted-foreground">Viewing in expanded mode.</p>
            ) : (
              <MarkdownViewer
                productId={productId}
                filename={implementationPlan.file}
                className="mt-4"
              />
            )
          ) : (
            <DownloadButton
              productId={productId}
              filename={implementationPlan.file}
              label={`Download ${formatFileName(implementationPlan.file)}`}
            />
          )}
          {isImplementationPlanExpanded && (
            <ExpandedDocumentView
              productId={productId}
              filename={implementationPlan.file}
              title="Implementation Plan"
              onClose={() => setIsExpandedViewOpen(false)}
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
            <div className="flex items-center justify-end gap-2">
              <SectionDownloadButton
                productId={productId}
                files={filterMarkdownFiles(platformGuides)}
                sectionTitle="Platform Setup Guides"
                level={level}
              />
              {!levelProgress.platform_guides ? (
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
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('platform_guides')}
                  disabled={isMarkingComplete === 'platform_guides'}
                >
                  {isMarkingComplete === 'platform_guides' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
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
            <div className="flex items-center justify-end gap-2">
              <SectionDownloadButton
                productId={productId}
                files={filterMarkdownFiles(creativeFrameworks)}
                sectionTitle="Creative Decision Frameworks"
                level={level}
              />
              {!levelProgress.creative_frameworks ? (
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
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('creative_frameworks')}
                  disabled={isMarkingComplete === 'creative_frameworks'}
                >
                  {isMarkingComplete === 'creative_frameworks' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
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

      {/* Launch & Marketing */}
      {launchMarketing.length > 0 && (
        <ContentSection
          id="section-launch-marketing"
          title="Launch & Marketing"
          description="Guides for launching your product and basic marketing"
          icon={Rocket}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <SectionDownloadButton
                productId={productId}
                files={filterMarkdownFiles(launchMarketing)}
                sectionTitle="Launch & Marketing"
                level={level}
              />
              {!levelProgress.launch_marketing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('launch_marketing')}
                  disabled={isMarkingComplete === 'launch_marketing'}
                >
                  {isMarkingComplete === 'launch_marketing' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('launch_marketing')}
                  disabled={isMarkingComplete === 'launch_marketing'}
                >
                  {isMarkingComplete === 'launch_marketing' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
            {launchMarketing.map((item, idx) => {
              const hosted = isHostedContent(item.type);
              const Icon = getFileTypeIcon(item.type);
              const label = item.name || formatFileName(item.file);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={item.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={item.file}
                      label={`Download ${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}

      {/* Troubleshooting */}
      {troubleshooting.length > 0 && (
        <ContentSection
          id="section-troubleshooting"
          title="Troubleshooting"
          description="Common issues and solutions"
          icon={Wrench}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              {troubleshooting.length > 0 && (
                <SectionDownloadButton
                  productId={productId}
                  files={filterMarkdownFiles(troubleshooting)}
                  sectionTitle="Troubleshooting"
                  level={level}
                />
              )}
              {!levelProgress.troubleshooting ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('troubleshooting')}
                  disabled={isMarkingComplete === 'troubleshooting'}
                >
                  {isMarkingComplete === 'troubleshooting' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('troubleshooting')}
                  disabled={isMarkingComplete === 'troubleshooting'}
                >
                  {isMarkingComplete === 'troubleshooting' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
            {troubleshooting.map((item, idx) => {
              const hosted = isHostedContent(item.type);
              const Icon = getFileTypeIcon(item.type);
              const label = item.name || formatFileName(item.file);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={item.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={item.file}
                      label={`Download ${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}

      {/* Time & Budget Planning */}
      {planning.length > 0 && (
        <ContentSection
          id="section-planning"
          title="Time & Budget Planning"
          description="Time investment and budget planning resources"
          icon={Calendar}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <SectionDownloadButton
                productId={productId}
                files={filterMarkdownFiles(planning)}
                sectionTitle="Time & Budget Planning"
                level={level}
              />
              {!levelProgress.planning ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkComplete('planning')}
                  disabled={isMarkingComplete === 'planning'}
                >
                  {isMarkingComplete === 'planning' ? (
                    'Marking...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('planning')}
                  disabled={isMarkingComplete === 'planning'}
                >
                  {isMarkingComplete === 'planning' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
            {planning.map((item, idx) => {
              const hosted = isHostedContent(item.type);
              const Icon = getFileTypeIcon(item.type);
              const label = item.name || formatFileName(item.file);
              return (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={item.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={item.file}
                      label={`Download ${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}

      {/* Templates & Checklists */}
      {templates.length > 0 && (
        <ContentSection
          id="section-templates"
          title="Templates & Checklists"
          description="Ready-to-use templates, checklists, and resources"
          icon={FileText}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <SectionDownloadButton
                productId={productId}
                files={filterMarkdownFiles(templates)}
                sectionTitle="Templates & Checklists"
                level={level}
              />
              {!levelProgress.templates ? (
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
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmarkComplete('templates')}
                  disabled={isMarkingComplete === 'templates'}
                >
                  {isMarkingComplete === 'templates' ? (
                    'Unmarking...'
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unmark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
            {templates.map((t, idx) => {
              const hosted = isHostedContent(t.type);
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
                  {hosted ? (
                    <MarkdownViewer
                      productId={productId}
                      filename={t.file}
                      className="mt-2"
                    />
                  ) : (
                    <DownloadButton
                      productId={productId}
                      filename={t.file}
                      label={`Download ${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}
    </div>
  );
}
