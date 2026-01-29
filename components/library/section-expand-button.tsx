'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Maximize2 } from 'lucide-react';
import { formatFileName, filterMarkdownFiles } from '@/lib/utils/content';
import type { LevelComponent } from '@/lib/utils/content';
import { cn } from '@/lib/utils';

interface SectionExpandButtonProps {
  productId: string;
  files: Array<{ file: string; type: string; name?: string }>;
  sectionTitle: string;
  sectionId: LevelComponent;
  slug: string;
  onExpand: (filename: string, title: string) => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function SectionExpandButton({
  files,
  sectionId,
  slug,
  onExpand,
  variant = 'outline',
  size = 'sm',
  className,
}: SectionExpandButtonProps) {
  if (slug !== 'web-apps') return null;

  const markdownFiles = filterMarkdownFiles(files);
  if (markdownFiles.length === 0) return null;

  if (markdownFiles.length === 1) {
    const file = markdownFiles[0];
    const title = file.name || formatFileName(file.file);
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => onExpand(file.file, title)}
        aria-label="Expand document view"
        title="Expanded view"
        className={cn('flex-shrink-0', className)}
        type="button"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('flex-shrink-0', className)}
          aria-label="Expand document"
          title="Expanded view"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {markdownFiles.map((file) => {
          const title = file.name || formatFileName(file.file);
          return (
            <DropdownMenuItem
              key={file.file}
              onClick={() => onExpand(file.file, title)}
              className="cursor-pointer"
            >
              {title}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
