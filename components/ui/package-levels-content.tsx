'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageProduct, PackageLevels, PackageLevel } from '@/lib/products';
import { ChevronDown, ChevronUp, Check, FileText, FileSpreadsheet, File, Download, BookOpen, Lightbulb, Settings, Clock, DollarSign, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getLevelContent } from '@/lib/data/package-level-content';
import { getLevelTitle } from '@/lib/data/package-level-titles';

interface PackageLevelsContentProps {
  package: PackageProduct;
  className?: string;
}

// File type icon mapping
const getFileTypeIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type === 'pdf') return FileText;
  if (type.includes('xlsx') || type.includes('excel') || type.includes('sheet')) return FileSpreadsheet;
  if (type.includes('docx') || type.includes('word') || type.includes('doc')) return FileText;
  if (type.includes('zip') || type.includes('archive')) return Download;
  if (type.includes('md') || type.includes('markdown')) return FileText;
  return File;
};

// File type badge color
const getFileTypeBadgeVariant = (fileType: string): 'default' | 'secondary' | 'outline' => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return 'default';
  if (type.includes('xlsx') || type.includes('excel')) return 'secondary';
  if (type.includes('docx') || type.includes('word')) return 'outline';
  if (type.includes('zip')) return 'secondary';
  return 'outline';
};

export function PackageLevelsContent({ package: pkg, className }: PackageLevelsContentProps) {
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    level1: true, // Default to first level expanded
  });

  const toggleLevel = (levelKey: string) => {
    setExpandedLevels(prev => ({ ...prev, [levelKey]: !prev[levelKey] }));
  };

  if (!pkg.levels || (!pkg.levels.level1 && !pkg.levels.level2 && !pkg.levels.level3)) {
    return null;
  }

  const levels: Array<{ key: string; level: PackageLevel }> = [];
  if (pkg.levels.level1) levels.push({ key: 'level1', level: pkg.levels.level1 });
  if (pkg.levels.level2) levels.push({ key: 'level2', level: pkg.levels.level2 });
  if (pkg.levels.level3) levels.push({ key: 'level3', level: pkg.levels.level3 });

  return (
    <div className={cn('space-y-6', className)}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">What's Included</h2>
        <p className="text-muted-foreground">
          Choose your implementation level based on your goals, timeline, and budget. Each level includes comprehensive guides, frameworks, and templates.
        </p>
      </div>

      {levels.map(({ key, level }) => {
        const isExpanded = expandedLevels[key];
        
        // Get enriched content (merges database data with static content)
        const enrichedContent = getLevelContent(pkg.slug, level.level, level);
        
        // Use enriched content if available, otherwise database level (both have required aiLeverage)
        const displayLevel = enrichedContent ? {
          ...level,
          aiLeverage: enrichedContent.aiLeverage ?? level.aiLeverage,
          implementationPlan: enrichedContent.implementationPlan,
          platformGuides: enrichedContent.platformGuides,
          creativeFrameworks: enrichedContent.creativeFrameworks,
          templates: enrichedContent.templates,
        } : level;
        
        const FileIcon = getFileTypeIcon(displayLevel.implementationPlan.type);

        return (
          <Card key={key} className="overflow-hidden">
            <CardHeader>
              <button
                onClick={() => toggleLevel(key)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="default" className="text-lg px-4 py-1.5">
                    Level {level.level}
                  </Badge>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{getLevelTitle(pkg.slug, level.level)}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{level.timeInvestment}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>{level.expectedProfit}*</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-4 w-4" />
                        <span>{level.platformCosts}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-6 pt-0">
                {/* AI Leverage Section */}
                <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">
                        AI Leverage
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                        {displayLevel.aiLeverage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Implementation Plan */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Implementation Plan</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Step-by-step roadmap to guide your implementation
                      </p>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{displayLevel.implementationPlan.file}</span>
                        <Badge variant={getFileTypeBadgeVariant(displayLevel.implementationPlan.type)} className="text-xs">
                          {displayLevel.implementationPlan.type.toUpperCase()}
                        </Badge>
                      </div>
                      {displayLevel.implementationPlan.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {displayLevel.implementationPlan.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Platform Setup Guides */}
                {displayLevel.platformGuides.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Platform Setup Guides</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Step-by-step instructions for setting up and configuring platforms
                        </p>
                        <div className="space-y-2">
                          {displayLevel.platformGuides.map((guide, index) => {
                            const GuideIcon = getFileTypeIcon(guide.type);
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                                <GuideIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium truncate">{guide.file}</span>
                                    {guide.platform && (
                                      <Badge variant="outline" className="text-xs">
                                        {guide.platform}
                                      </Badge>
                                    )}
                                    <Badge variant={getFileTypeBadgeVariant(guide.type)} className="text-xs">
                                      {guide.type.toUpperCase()}
                                    </Badge>
                                  </div>
                                  {guide.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{guide.description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Creative Decision Frameworks */}
                {displayLevel.creativeFrameworks.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Creative Decision Frameworks</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Guided exercises to help you make creative decisions (niche, branding, ideas, etc.)
                        </p>
                        <div className="space-y-2">
                          {displayLevel.creativeFrameworks.map((framework, index) => {
                            const FrameworkIcon = getFileTypeIcon(framework.type);
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                                <FrameworkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium truncate">
                                      {framework.name || framework.file}
                                    </span>
                                    <Badge variant={getFileTypeBadgeVariant(framework.type)} className="text-xs">
                                      {framework.type.toUpperCase()}
                                    </Badge>
                                  </div>
                                  {framework.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{framework.description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Templates & Checklists */}
                {displayLevel.templates.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Templates & Checklists</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Ready-to-use templates, checklists, and resources
                        </p>
                        <div className="space-y-2">
                          {displayLevel.templates.map((template, index) => {
                            const TemplateIcon = getFileTypeIcon(template.type);
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                                <TemplateIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium truncate">
                                      {template.name || template.file}
                                    </span>
                                    <Badge variant={getFileTypeBadgeVariant(template.type)} className="text-xs">
                                      {template.type.toUpperCase()}
                                    </Badge>
                                  </div>
                                  {template.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Earnings Disclaimer */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 py-0">
        <CardContent className="px-6 py-4 flex items-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <sup>*</sup> <strong>Expected Revenue Disclaimer:</strong> Expected revenue figures are illustrative only and not a guarantee. Results depend on your skills, effort, and adherence to the plan. Results may vary. See our{' '}
            <Link 
              href="/legal/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              Terms of Service
            </Link>
            {' '}for complete details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
