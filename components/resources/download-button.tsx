'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { Tool } from '@/lib/resources/types';
import { useAuth } from '@/hooks/useAuth';

interface DownloadButtonProps {
  tool: Tool;
}

export function DownloadButton({ tool }: DownloadButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=' + encodeURIComponent(`/resources/tools/${tool.slug}`));
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/resources/download/${tool.slug}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin?redirect=' + encodeURIComponent(`/resources/tools/${tool.slug}`));
          return;
        }
        throw new Error('Download failed');
      }

      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = tool.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Download' : 'Sign In to Download'}
        </>
      )}
    </Button>
  );
}
