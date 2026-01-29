'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownViewer } from '@/components/library/markdown-viewer';
import { buildTocTree, type TocEntry, type TocNode } from '@/lib/utils/markdown-toc';
import { cn } from '@/lib/utils';

/** Normalize query, split into words; require every word (length >= 2) to appear in heading (case-insensitive). */
function headingMatchesSearch(headingText: string, query: string): boolean {
  const normalized = query.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!normalized) return true;
  const words = normalized.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return true;
  const text = headingText.toLowerCase();
  return words.every((word) => text.includes(word));
}

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const documentScrollRef = useRef<HTMLDivElement>(null);

  const handleHeadingsParsed = useCallback((entries: TocEntry[]) => {
    setHeadings(entries);
  }, []);

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
        setHeadings([]);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId, filename]);

  // Default: top-level nodes expanded when headings load
  useEffect(() => {
    if (headings.length === 0) return;
    const tree = buildTocTree(headings);
    const rootIds = tree.map((n) => n.entry.id);
    setExpandedIds(new Set(rootIds));
  }, [headings]);

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

  const trimmedQuery = searchQuery.trim();
  const filteredHeadings = trimmedQuery
    ? headings.filter((h) => headingMatchesSearch(h.text, searchQuery))
    : headings;

  const tocTree = buildTocTree(headings);
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollToHeading = (id: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      const container = documentScrollRef.current;
      if (!el || !container || !container.contains(el)) return;
      const scrollMargin = 16;
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const top = Math.max(
        0,
        container.scrollTop + elRect.top - containerRect.top - scrollMargin
      );
      container.scrollTo({ top, behavior: 'smooth' });
    });
  };

  function TocTreeRow({
    node,
    depth,
  }: {
    node: TocNode;
    depth: number;
  }) {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(node.entry.id);
    const pl = depth === 0 ? 2 : 2 + depth * 8;

    return (
      <div className="space-y-0.5 overflow-hidden" style={{ minWidth: 0, maxWidth: '100%' }}>
        <div className="flex items-center gap-0.5 rounded-md group overflow-hidden" style={{ minWidth: 0 }}>
          {hasChildren ? (
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => toggleExpanded(node.entry.id)}
              className={cn(
                'shrink-0 p-0.5 rounded hover:bg-muted text-muted-foreground',
                'flex items-center justify-center'
              )}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5 shrink-0 flex-shrink-0" aria-hidden />
          )}
          <button
            type="button"
            onClick={() => scrollToHeading(node.entry.id)}
            className={cn(
              'flex-1 min-w-0 text-left text-sm py-1.5 pr-2 rounded-md overflow-hidden text-ellipsis whitespace-nowrap',
              'hover:bg-muted hover:text-foreground transition-colors',
              depth === 0 && 'font-medium'
            )}
            style={{ paddingLeft: hasChildren ? 0 : pl, maxWidth: '100%' }}
          >
            {node.entry.text}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="border-l border-border/50 ml-2.5 pl-0.5 overflow-hidden" style={{ minWidth: 0, maxWidth: '100%' }}>
            {node.children.map((child) => (
              <TocTreeRow key={child.entry.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

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
        {/* Left sidebar: search + TOC — fixed width so text cannot overflow */}
        <aside
          className="flex-shrink-0 border-r border-border flex flex-col bg-muted/30 overflow-hidden"
          style={{ width: 256 }}
        >
          <div className="p-2 border-b border-border flex-shrink-0 overflow-hidden" style={{ width: 256 }}>
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
          <ScrollArea className="flex-1 min-h-0 overflow-hidden" style={{ width: 256 }}>
            <div className="p-2 space-y-0.5 overflow-hidden" style={{ width: 256, boxSizing: 'border-box' }}>
              {loading ? (
                <p className="text-sm text-muted-foreground px-2 py-4">Loading…</p>
              ) : headings.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">No sections</p>
              ) : trimmedQuery && filteredHeadings.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">No results found.</p>
              ) : trimmedQuery ? (
                filteredHeadings.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => scrollToHeading(entry.id)}
                    className={cn(
                      'w-full text-left text-sm py-1.5 px-2 rounded-md block overflow-hidden text-ellipsis whitespace-nowrap max-w-full',
                      'hover:bg-muted hover:text-foreground transition-colors',
                      entry.depth === 1 && 'font-medium pl-2',
                      entry.depth === 2 && 'pl-4',
                      entry.depth === 3 && 'pl-6',
                      entry.depth >= 4 && 'pl-8'
                    )}
                    style={{ minWidth: 0 }}
                  >
                    {entry.text}
                  </button>
                ))
              ) : (
                tocTree.map((node) => (
                  <TocTreeRow key={node.entry.id} node={node} depth={0} />
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Main document — plain overflow div with ref so we can scroll it directly */}
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
                onHeadingsParsed={handleHeadingsParsed}
                scrollContainerRef={documentScrollRef}
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
