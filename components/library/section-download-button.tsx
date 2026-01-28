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
      console.log('Initiating PDF download:', { url, filename, productId });
      
      const response = await fetch(url);

      if (!response.ok) {
        let errorMessage = 'Failed to generate PDF.';
        try {
          const data = await response.json();
          errorMessage = typeof data?.error === 'string' ? data.error : errorMessage;
          console.error('PDF API error:', { status: response.status, error: data });
        } catch (parseError) {
          // If response is not JSON, use status-based message
          if (response.status === 403) {
            errorMessage = 'You do not have access to this file.';
          } else if (response.status === 404) {
            errorMessage = 'File not found.';
          } else if (response.status === 500) {
            errorMessage = 'Server error while generating PDF.';
          }
          console.error('PDF API error (non-JSON):', { status: response.status, parseError });
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error('Unexpected content type:', contentType);
        throw new Error('Server returned invalid content type. Expected PDF.');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename.replace(/\.(md|markdown)$/i, '.pdf');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (match) downloadFilename = match[1].trim();
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty PDF file.');
      }

      console.log('PDF generated successfully, initiating download:', { 
        size: blob.size, 
        filename: downloadFilename 
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      console.log('PDF download initiated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF.';
      console.error('PDF download error:', err);
      setError(errorMessage);
      // Keep error visible for a bit longer
      setTimeout(() => setError(null), 10000);
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Download button clicked:', file.file);
            handleDownload(file.file);
          }}
          disabled={isDownloading}
          variant={variant}
          size={size}
          className={cn('flex-shrink-0', className)}
          type="button"
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
        {error && (
          <p className="text-xs text-destructive font-medium" role="alert">
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
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Download menu item clicked:', file.file);
                  handleDownload(file.file);
                }}
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
      {error && (
        <p className="text-xs text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
