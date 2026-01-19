'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  productId: string;
  filename: string;
  label?: string;
}

export function DownloadButton({ productId, filename, label = 'Download' }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const url = `/api/library/${productId}/download?file=${encodeURIComponent(filename)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to download file');
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          downloadFilename = filenameMatch[1];
        }
      }

      // Create blob and download
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
      console.error('Error downloading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to download file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            {label}
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
