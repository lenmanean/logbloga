'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageProduct } from '@/lib/products';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PackageLevelsContent } from './package-levels-content';

interface WhatsIncludedProps {
  package: PackageProduct;
  className?: string;
}

/**
 * WhatsIncluded Component
 * 
 * Supports both new level-based structure and legacy modules/resources structure.
 * - If package has levels data, uses PackageLevelsContent component
 * - Otherwise, falls back to legacy modules/resources display for backward compatibility
 * 
 * @deprecated Legacy modules/resources structure. New packages should use levels structure.
 */
export function WhatsIncluded({ package: pkg, className }: WhatsIncludedProps) {
  // Check if package has new level-based structure
  const hasLevels = pkg.levels && (
    pkg.levels.level1 || 
    pkg.levels.level2 || 
    pkg.levels.level3
  );

  // Use new component if levels exist
  if (hasLevels) {
    return <PackageLevelsContent package={pkg} className={className} />;
  }

  // Fallback to legacy structure for backward compatibility
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [expandedResources, setExpandedResources] = useState<Record<number, boolean>>({});

  const toggleModule = (index: number) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleResource = (index: number) => {
    setExpandedResources(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Legacy display - only show if modules or resources exist
  const hasLegacyContent = (pkg.modules && pkg.modules.length > 0) || 
                          (pkg.resources && pkg.resources.length > 0);

  if (!hasLegacyContent) {
    return null;
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Legacy Modules Section */}
      {pkg.modules && pkg.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Course Modules</CardTitle>
            <p className="text-muted-foreground">
              {pkg.contentHours || 'Comprehensive'} video training
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pkg.modules.map((module, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(index)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      {module.hours && (
                        <Badge variant="outline" className="text-xs">
                          {module.hours}
                        </Badge>
                      )}
                    </div>
                    {module.description && (
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {expandedModules[index] ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedModules[index] && module.items && module.items.length > 0 && (
                  <div className="px-4 pb-4 space-y-2 border-t bg-muted/50">
                    {module.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2 pt-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Legacy Resources Section */}
      {pkg.resources && pkg.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Resources & Templates</CardTitle>
            <p className="text-muted-foreground">
              Production-ready templates, tools, and guides included
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pkg.resources.map((resource, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleResource(index)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors text-left"
                >
                  <h3 className="text-lg font-semibold">{resource.category}</h3>
                  <div className="ml-4">
                    {expandedResources[index] ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedResources[index] && resource.items && resource.items.length > 0 && (
                  <div className="px-4 pb-4 space-y-2 border-t bg-muted/50">
                    {resource.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2 pt-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

