'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/resources/types';
import { cn } from '@/lib/utils';
import { Download, FileText, Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ToolCardProps {
  tool: Tool;
  className?: string;
  showDownload?: boolean;
}

export function ToolCard({ tool, className, showDownload = true }: ToolCardProps) {
  const { isAuthenticated } = useAuth();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = () => {
    return tool.type === 'tool' ? Wrench : FileText;
  };

  const TypeIcon = getTypeIcon();

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 flex flex-col h-full', className)}>
      <CardHeader className="pb-4">
        {tool.previewImage && (
          <Link href={`/resources/tools/${tool.slug}`} className="block relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-4">
            <Image
              src={tool.previewImage}
              alt={tool.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {tool.category}
          </Badge>
          <Badge 
            variant={tool.type === 'tool' ? 'default' : 'secondary'} 
            className="text-xs flex items-center gap-1"
          >
            <TypeIcon className="h-3 w-3" />
            {tool.type === 'tool' ? 'Tool' : 'Template'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Link href={`/resources/tools/${tool.slug}`}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {tool.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {tool.description}
        </p>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">File:</span>
            <span>{tool.fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Size:</span>
            <span>{formatFileSize(tool.fileSize)}</span>
          </div>
          {tool.downloadCount !== undefined && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Downloads:</span>
              <span>{tool.downloadCount.toLocaleString()}</span>
            </div>
          )}
        </div>
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tool.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {showDownload && (
          <Link href={`/resources/tools/${tool.slug}`} className="w-full">
            <Button 
              className="w-full" 
              variant={isAuthenticated ? 'default' : 'outline'}
              disabled={!isAuthenticated && tool.requiresAuth}
            >
              <Download className="h-4 w-4 mr-2" />
              {isAuthenticated || !tool.requiresAuth ? 'Download' : 'Sign In to Download'}
            </Button>
          </Link>
        )}
        <Link href={`/resources/tools/${tool.slug}`} className="w-full">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary group-hover:underline">
            View Details
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
