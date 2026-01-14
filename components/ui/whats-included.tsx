'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageProduct } from '@/lib/products';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsIncludedProps {
  package: PackageProduct;
  className?: string;
}

export function WhatsIncluded({ package: pkg, className }: WhatsIncludedProps) {
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [expandedResources, setExpandedResources] = useState<Record<number, boolean>>({});

  const toggleModule = (index: number) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleResource = (index: number) => {
    setExpandedResources(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Modules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Course Modules</CardTitle>
          <p className="text-muted-foreground">
            {pkg.contentHours} of comprehensive video training
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
                    <Badge variant="outline" className="text-xs">
                      {module.hours}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <div className="ml-4">
                  {expandedModules[index] ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>
              {expandedModules[index] && (
                <div className="px-4 pb-4 space-y-2 border-t bg-accent/30">
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

      {/* Resources Section */}
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
              {expandedResources[index] && (
                <div className="px-4 pb-4 space-y-2 border-t bg-accent/30">
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

      {/* Bonus Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bonus Assets</CardTitle>
          <p className="text-muted-foreground">
            Additional value included with your package
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.bonusAssets.map((asset, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{asset}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

