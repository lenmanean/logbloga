'use client';

import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
    'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr',
    'div', 'span',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class'],
  ALLOW_DATA_ATTR: false,
} as const;

interface MarkdownViewerProps {
  productId: string;
  filename: string;
  className?: string;
}

export function MarkdownViewer({ productId, filename, className }: MarkdownViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/library/${productId}/content?file=${encodeURIComponent(filename)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load content (${res.status})`);
        }
        const text = await res.text();
        if (cancelled) return;
        setContent(text);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load content');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchContent();
    return () => { cancelled = true; };
  }, [productId, filename]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}>
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!content) return null;

  let html: string;
  try {
    html = marked.parse(content, { async: false }) as string;
  } catch {
    html = '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG as any);

  return (
    <div
      className={cn(
        'prose prose-lg dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-p:text-foreground/90 prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-muted prose-pre:border prose-pre:overflow-x-auto',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-blockquote:border-l-primary prose-blockquote:bg-muted/50',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
