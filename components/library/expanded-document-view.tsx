'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { cn } from '@/lib/utils';

interface ExpandedDocumentViewProps {
  productId: string;
  filename: string;
  title: string;
  onClose: () => void;
}

/**
 * Full-viewport overlay that expands the document over all page elements
 * (tabs, header, nav). Renders via portal with expansion animation.
 */
export function ExpandedDocumentView({
  productId,
  filename,
  title,
  onClose,
}: ExpandedDocumentViewProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view: ${title}`}
      data-state="open"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col bg-background',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'duration-200 ease-out'
      )}
    >
      {/* Toolbar: title + close */}
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-3 border-b border-border bg-background/95">
        <h2 className="text-lg font-semibold truncate pr-4">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close expanded view"
          className="shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Document content: fills remaining height */}
      <div className="flex-1 min-h-0 px-4 py-4 md:px-6 md:py-6 max-w-4xl mx-auto w-full">
        <MarkdownViewer
          productId={productId}
          filename={filename}
          className="h-full"
          height="100%"
        />
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
}
