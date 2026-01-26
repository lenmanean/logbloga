'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: ContentSectionProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className={cn(Icon && 'pl-8')}>{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
