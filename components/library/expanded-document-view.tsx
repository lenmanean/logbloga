'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { parseHeadings, type TocEntry } from '@/lib/utils/markdown-toc';
import { cn } from '@/lib/utils';

interface ExpandedDocumentViewProps {
  productId: string;
  filename: string;
  title: string;
  onClose: () => void;
}

/**
 * Full-viewport overlay with left sidebar (TOC + search) and main document.
 * Fetches markdown once; smooth fade-in on open; closes immediately.
 */
export function ExpandedDocumentView({
  productId,
  filename,
  title,
  onClose,
}: ExpandedDocumentViewProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<TocEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch markdown once
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/library/${productId}/content?file=${encodeURIComponent(filename)}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        setContent(text);
        setHeadings(parseHeadings(text));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId, filename]);

  // Smooth enter animation only (opacity 0 -> 1, scale 0.98 -> 1)
  useEffect(() => {
    const t = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(t);
  }, []);

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

  const filteredHeadings = searchQuery.trim()
    ? headings.filter((h) => h.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : headings;

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view: ${title}`}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col bg-background',
        'transition-opacity transition-transform duration-200 ease-out',
        hasEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
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

      {/* Sidebar + main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: search + TOC */}
        <aside className="w-64 flex-shrink-0 border-r border-border flex flex-col bg-muted/30">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sections"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
                aria-label="Search table of contents"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-0.5">
              {loading ? (
                <p className="text-sm text-muted-foreground px-2 py-4">Loading…</p>
              ) : headings.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">No sections</p>
              ) : filteredHeadings.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">No matching sections</p>
              ) : (
                filteredHeadings.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => scrollToHeading(entry.id)}
                    className={cn(
                      'w-full text-left text-sm py-1.5 px-2 rounded-md truncate block',
                      'hover:bg-muted hover:text-foreground transition-colors',
                      entry.depth === 1 && 'font-medium pl-2',
                      entry.depth === 2 && 'pl-4',
                      entry.depth === 3 && 'pl-6',
                      entry.depth >= 4 && 'pl-8'
                    )}
                  >
                    {entry.text}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Main document */}
        <div className="flex-1 min-w-0 px-4 py-4 md:px-6 md:py-6 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto">
            {error ? (
              <p className="text-sm text-destructive py-8">{error}</p>
            ) : loading || content === null ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading document…</p>
              </div>
            ) : (
              <MarkdownViewer
                productId={productId}
                filename={filename}
                content={content}
                className="h-full"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
}
