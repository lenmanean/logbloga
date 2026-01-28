'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Loader2, ChevronDown } from 'lucide-react';
import { formatFileName } from '@/lib/utils/content';
import { cn } from '@/lib/utils';

interface SectionDownloadButtonProps {
  productId: string;
  files: Array<{ file: string; name?: string; type: string }>;
  sectionTitle: string;
  level: 1 | 2 | 3;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function SectionDownloadButton({
  productId,
  files,
  sectionTitle,
  level,
  variant = 'outline',
  size = 'sm',
  className,
}: SectionDownloadButtonProps) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter to only markdown files
  const markdownFiles = files.filter((file) => {
    const ext = file.file.split('.').pop()?.toLowerCase();
    return ext === 'md' || ext === 'markdown';
  });

  if (markdownFiles.length === 0) {
    return null;
  }

  const handleDownload = async (filename: string) => {
    setDownloadingFile(filename);
    setError(null);

    try {
      const url = `/api/library/${productId}/pdf?file=${encodeURIComponent(filename)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : response.status === 403
              ? 'You do not have access to this file.'
              : response.status === 404
                ? 'File not found.'
                : 'Failed to generate PDF.';
        throw new Error(msg);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename.replace(/\.(md|markdown)$/i, '.pdf');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (match) downloadFilename = match[1].trim();
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('PDF download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download PDF.');
    } finally {
      setDownloadingFile(null);
    }
  };

  // Single file: show simple button
  if (markdownFiles.length === 1) {
    const file = markdownFiles[0];
    const isDownloading = downloadingFile === file.file;
    const displayName = file.name || formatFileName(file.file);

    return (
      <div className="space-y-1">
        <Button
          onClick={() => handleDownload(file.file)}
          disabled={isDownloading}
          variant={variant}
          size={size}
          className={cn('flex-shrink-0', className)}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </>
          )}
        </Button>
        {error && downloadingFile === file.file && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Multiple files: show dropdown
  return (
    <div className="space-y-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={downloadingFile !== null}
            className={cn('flex-shrink-0', className)}
          >
            {downloadingFile ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {markdownFiles.map((file) => {
            const displayName = file.name || formatFileName(file.file);
            const isDownloading = downloadingFile === file.file;

            return (
              <DropdownMenuItem
                key={file.file}
                onClick={() => handleDownload(file.file)}
                disabled={isDownloading}
                className="cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  displayName
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && downloadingFile && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
