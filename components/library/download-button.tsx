'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getFileTypeIcon } from '@/lib/utils/content';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  productId: string;
  filename: string;
  label?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

function extFromFilename(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

export function DownloadButton({
  productId,
  filename,
  label = 'Download',
  variant = 'default',
  size = 'default',
  className,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileType = extFromFilename(filename);
  const FileIcon = getFileTypeIcon(fileType);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const url = `/api/library/${productId}/download?file=${encodeURIComponent(filename)}`;
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
                : 'Failed to download file.';
        throw new Error(msg);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename;
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
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        variant={variant}
        size={size}
        className={cn('w-full', className)}
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <FileIcon className="h-4 w-4 mr-2" />
            {label}
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
