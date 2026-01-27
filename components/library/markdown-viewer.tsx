'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createRoot, Root } from 'react-dom/client';

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

interface CodeBlock {
  code: string;
  language: string;
  index: number;
}

export function MarkdownViewer({ productId, filename, className }: MarkdownViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isDark, setIsDark] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRefs = useRef<Map<number, Root>>(new Map());

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDarkMode = document.documentElement.classList.contains('dark') ||
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isDarkMode);
      }
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', checkDarkMode);

      return () => {
        observer.disconnect();
        mediaQuery.removeEventListener('change', checkDarkMode);
      };
    }
  }, []);

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

  // Extract code blocks and replace with placeholders
  useEffect(() => {
    if (!content || !contentRef.current) return;

    const blocks: CodeBlock[] = [];
    let blockIndex = 0;

    // Configure marked with custom renderer
    const renderer = new marked.Renderer();
    
    renderer.code = (code: string, language?: string) => {
      const lang = language || 'text';
      const placeholder = `<div class="syntax-highlight-placeholder" data-index="${blockIndex}"></div>`;
      blocks.push({ code, language: lang, index: blockIndex });
      blockIndex++;
      return placeholder;
    };

    renderer.blockquote = (quote: string) => {
      return `<blockquote class="enhanced-blockquote">${quote}</blockquote>`;
    };

    renderer.table = (header: string, body: string) => {
      return `<div class="table-wrapper"><table class="enhanced-table"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    };

    let html: string;
    try {
      html = marked.parse(content, { 
        renderer,
        async: false,
        breaks: true,
        gfm: true,
      }) as string;
    } catch {
      html = '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG as any);
    
    if (contentRef.current) {
      contentRef.current.innerHTML = sanitized;
      setCodeBlocks(blocks);
    }
  }, [content]);

  // Render syntax highlighter components for code blocks
  useEffect(() => {
    if (!contentRef.current || codeBlocks.length === 0) return;

    // Clean up previous roots
    rootRefs.current.forEach((root) => {
      try {
        root.unmount();
      } catch (e) {
        // Ignore unmount errors
      }
    });
    rootRefs.current.clear();

    const placeholders = contentRef.current.querySelectorAll('.syntax-highlight-placeholder');
    
    placeholders.forEach((placeholder, idx) => {
      const block = codeBlocks[idx];
      if (!block) return;

      const container = document.createElement('div');
      container.className = 'syntax-highlighter-container my-4 rounded-lg overflow-hidden';
      placeholder.replaceWith(container);

      const root = createRoot(container);
      rootRefs.current.set(block.index, root);

      root.render(
        <SyntaxHighlighter
          language={block.language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          PreTag="div"
        >
          {block.code}
        </SyntaxHighlighter>
      );
    });

    return () => {
      rootRefs.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // Ignore unmount errors
        }
      });
      rootRefs.current.clear();
    };
  }, [codeBlocks, isDark]);

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

  return (
    <ScrollArea className={cn('w-full', className)} style={{ maxHeight: '600px' }}>
      <div className="pr-4">
        <div
          ref={contentRef}
          className={cn(
            'prose prose-lg dark:prose-invert max-w-none',
            'prose-headings:font-bold prose-headings:text-foreground',
            'prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6 prose-h1:border-b prose-h1:border-border prose-h1:pb-2',
            'prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5 prose-h2:font-semibold',
            'prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-h3:font-semibold',
            'prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-3',
            'prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4',
            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium',
            'prose-strong:text-foreground prose-strong:font-semibold',
            'prose-code:text-primary prose-code:bg-muted/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
            'prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-4',
            'prose-pre code:bg-transparent prose-pre code:text-foreground prose-pre code:p-0',
            'prose-img:rounded-lg prose-img:shadow-md prose-img:my-4',
            'prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:italic',
            'prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-6',
            'prose-ol:my-4 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-6',
            'prose-li:my-1 prose-li:leading-relaxed',
            'prose-hr:my-6 prose-hr:border-border',
            'prose-table:w-full prose-table:my-4',
            'prose-thead:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-border',
            'prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border',
            'prose-tbody tr:nth-child(even):bg-muted/30',
            '[&_.enhanced-blockquote]:border-l-4 [&_.enhanced-blockquote]:border-l-primary [&_.enhanced-blockquote]:bg-muted/50 [&_.enhanced-blockquote]:pl-4 [&_.enhanced-blockquote]:py-2 [&_.enhanced-blockquote]:my-4 [&_.enhanced-blockquote]:italic',
            '[&_.table-wrapper]:overflow-x-auto [&_.table-wrapper]:my-4',
            '[&_.enhanced-table]:w-full [&_.enhanced-table]:border-collapse [&_.enhanced-table_th]:px-4 [&_.enhanced-table_th]:py-2 [&_.enhanced-table_th]:bg-muted [&_.enhanced-table_th]:font-semibold [&_.enhanced-table_th]:border [&_.enhanced-table_th]:border-border',
            '[&_.enhanced-table_td]:px-4 [&_.enhanced-table_td]:py-2 [&_.enhanced-table_td]:border [&_.enhanced-table_td]:border-border',
            '[&_.enhanced-table_tr:nth-child(even)]:bg-muted/30',
          )}
        />
      </div>
    </ScrollArea>
  );
}
