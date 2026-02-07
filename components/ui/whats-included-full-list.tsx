'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageProduct, PackageLevel } from '@/lib/products';
import { getLevelContent } from '@/lib/data/package-level-content';
import { getLevelTitle } from '@/lib/data/package-level-titles';
import type { LevelContent } from '@/lib/data/package-level-content';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Rocket,
  Wrench,
  Calendar,
  FileText,
  FileSpreadsheet,
  File,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsIncludedFullListProps {
  package?: PackageProduct;
  includedPackages?: { slug: string; title: string }[];
  className?: string;
}

function formatFileNameToDisplayName(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  const withSpaces = withoutExt.replace(/[-_]/g, ' ');
  return withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getFileTypeIcon(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type === 'pdf') return FileText;
  if (type.includes('xlsx') || type.includes('excel') || type.includes('sheet')) return FileSpreadsheet;
  if (type.includes('docx') || type.includes('word') || type.includes('doc')) return FileText;
  if (type.includes('zip') || type.includes('archive')) return Download;
  if (type.includes('md') || type.includes('markdown')) return FileText;
  return File;
}

function getFileTypeBadgeVariant(fileType: string): 'default' | 'secondary' | 'outline' {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return 'default';
  if (type.includes('xlsx') || type.includes('excel')) return 'secondary';
  if (type.includes('docx') || type.includes('word')) return 'outline';
  if (type.includes('zip')) return 'secondary';
  return 'outline';
}

function LevelContentBlock({
  levelTitle,
  content,
  compact,
}: {
  levelTitle: string;
  content: LevelContent;
  compact?: boolean;
}) {
  const FileIcon = getFileTypeIcon(content.implementationPlan?.type ?? 'md');
  return (
    <div className={cn('space-y-3', compact && 'space-y-2')}>
      <h4 className="font-semibold text-sm border-b pb-1">{levelTitle}</h4>

      {content.implementationPlan && (
        <div className="flex items-center gap-2 flex-wrap">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">{formatFileNameToDisplayName(content.implementationPlan.file)}</span>
          <Badge variant={getFileTypeBadgeVariant(content.implementationPlan.type)} className="text-xs">
            {content.implementationPlan.type.toUpperCase()}
          </Badge>
        </div>
      )}

      {content.platformGuides?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Platform Setup Guides</p>
          <ul className="space-y-0.5">
            {content.platformGuides.map((g, i) => {
              const Icon = getFileTypeIcon(g.type);
              return (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  {formatFileNameToDisplayName(g.file)}
                  {g.platform && (
                    <Badge variant="outline" className="text-xs">
                      {g.platform}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {content.creativeFrameworks?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Creative Decision Frameworks</p>
          <ul className="space-y-0.5">
            {content.creativeFrameworks.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                {f.name || formatFileNameToDisplayName(f.file)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.launchMarketing?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Launch & Marketing</p>
          <ul className="space-y-0.5">
            {content.launchMarketing.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Rocket className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                {item.name || formatFileNameToDisplayName(item.file)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.troubleshooting?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Troubleshooting</p>
          <ul className="space-y-0.5">
            {content.troubleshooting.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Wrench className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                {item.name || formatFileNameToDisplayName(item.file)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.planning?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Time & Budget Planning</p>
          <ul className="space-y-0.5">
            {content.planning.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                {item.name || formatFileNameToDisplayName(item.file)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.templates?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Templates & Checklists</p>
          <ul className="space-y-0.5">
            {content.templates.map((t, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                {t.name || t.file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function WhatsIncludedFullList({
  package: pkg,
  includedPackages,
  className,
}: WhatsIncludedFullListProps) {
  const [expanded, setExpanded] = useState(false);

  const hasPackage = pkg && (pkg.levels?.level1 || pkg.levels?.level2 || pkg.levels?.level3);
  const hasBundle = includedPackages && includedPackages.length > 0;
  if (!hasPackage && !hasBundle) return null;

  const packageTitleBySlug: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    agency: 'Agency',
    freelancing: 'Freelancing',
  };

  const buildSinglePackageSections = () => {
    if (!pkg?.levels) return null;
    const levels: Array<{ key: string; level: PackageLevel }> = [];
    if (pkg.levels.level1) levels.push({ key: 'level1', level: pkg.levels.level1 });
    if (pkg.levels.level2) levels.push({ key: 'level2', level: pkg.levels.level2 });
    if (pkg.levels.level3) levels.push({ key: 'level3', level: pkg.levels.level3 });
    return levels.map(({ key, level }) => {
      const content = getLevelContent(pkg.slug, level.level, level);
      if (!content) return null;
      const title = getLevelTitle(pkg.slug, level.level);
      return (
        <div key={key} className="border rounded-lg p-3 bg-muted/20 space-y-2">
          <LevelContentBlock levelTitle={`Level ${level.level} – ${title}`} content={content} compact />
        </div>
      );
    });
  };

  const buildBundleSections = () => {
    if (!includedPackages) return null;
    return includedPackages.map(({ slug, title }) => {
      const packageTitle = packageTitleBySlug[slug] ?? title;
      const level1 = getLevelContent(slug, 1);
      const level2 = getLevelContent(slug, 2);
      const level3 = getLevelContent(slug, 3);
      const levelList = [
        [1, level1],
        [2, level2],
        [3, level3],
      ] as const;
      return (
        <div key={slug} className="space-y-3">
          <h3 className="font-semibold text-base border-b pb-2">{packageTitle}</h3>
          {levelList.map(([levelNum, content]) => {
            if (!content) return null;
            const levelTitle = `Level ${levelNum} – ${getLevelTitle(slug, levelNum)}`;
            return (
              <div key={levelNum} className="border rounded-lg p-3 bg-muted/20">
                <LevelContentBlock levelTitle={levelTitle} content={content} compact />
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={cn('mt-4', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setExpanded((e) => !e)}
        className="gap-2"
      >
        {expanded ? 'Hide full list' : 'Show full list'}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {expanded && (
        <div
          className="mt-3 max-h-[480px] overflow-y-auto rounded-md border border-border/60 bg-muted/10 p-4 space-y-4"
          style={{ scrollbarGutter: 'stable' }}
        >
          {pkg ? buildSinglePackageSections() : buildBundleSections()}
        </div>
      )}
    </div>
  );
}
