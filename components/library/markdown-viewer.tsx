'use client';

import React, { useState, useEffect, useRef, type MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { slugify, type TocEntry } from '@/lib/utils/markdown-toc';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Components } from 'react-markdown';

function flattenHeadingText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(flattenHeadingText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props?.children != null) return flattenHeadingText(props.children);
  }
  return String(node ?? '');
}

interface MarkdownViewerProps {
  productId: string;
  filename: string;
  className?: string;
  /** Height for the scroll area (e.g. '600px' or '100%' for full height in expanded view) */
  height?: string;
  /** When provided, use this content and do not fetch (e.g. from Expanded View) */
  content?: string | null;
  /** Called with heading entries (id, depth, text) after render so TOC can use exact DOM ids */
  onHeadingsParsed?: (entries: TocEntry[]) => void;
  /** When provided (e.g. expanded view), use a plain overflow div instead of ScrollArea so parent can scroll it reliably */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function MarkdownViewer({ productId, filename, className, height = '600px', content: contentProp, onHeadingsParsed, scrollContainerRef }: MarkdownViewerProps) {
  const [content, setContent] = useState<string | null>(contentProp ?? null);
  const [loading, setLoading] = useState(typeof contentProp !== 'string');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const headingIdsRef = useRef<Set<string>>(new Set());
  const headingEntriesRef = useRef<TocEntry[]>([]);
  const lastContentSentRef = useRef<string | null>(null);
  const prevContentRef = useRef<string | null>(null);
  if (content !== prevContentRef.current) {
    prevContentRef.current = content;
    headingIdsRef.current.clear();
    headingEntriesRef.current = [];
    lastContentSentRef.current = null;
  }
  headingEntriesRef.current = [];

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
    if (typeof contentProp === 'string') {
      setContent(contentProp);
      setLoading(false);
      setError(null);
      return;
    }
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
  }, [productId, filename, contentProp]);

  // When content is provided externally, keep it in sync
  useEffect(() => {
    if (typeof contentProp === 'string') setContent(contentProp);
  }, [contentProp]);

  // Report heading entries after render so expanded view TOC uses exact DOM ids
  useEffect(() => {
    if (content && onHeadingsParsed && lastContentSentRef.current !== content && headingEntriesRef.current.length > 0) {
      lastContentSentRef.current = content;
      onHeadingsParsed([...headingEntriesRef.current]);
      headingEntriesRef.current = [];
    }
  }, [content, onHeadingsParsed]);

  // Unique id for heading (matches parseHeadings in markdown-toc so TOC links work)
  const getHeadingId = (children: React.ReactNode): string => {
    const text = flattenHeadingText(children);
    let baseId = slugify(text);
    let id = baseId;
    let n = 1;
    while (headingIdsRef.current.has(id)) {
      n += 1;
      id = `${baseId}-${n}`;
    }
    headingIdsRef.current.add(id);
    return id;
  };

  // Custom components for enhanced styling
  const components: Components = {
    // Headings with id for TOC navigation; report to parent so TOC uses exact DOM ids
    h1: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 1, text });
      return (
        <h1 id={id} className="text-3xl font-bold mb-4 mt-6 pb-2 border-b border-border text-foreground scroll-mt-4">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 2, text });
      return (
        <h2 id={id} className="text-2xl font-semibold mb-3 mt-5 text-foreground scroll-mt-4">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 3, text });
      return (
        <h3 id={id} className="text-xl font-semibold mb-2 mt-4 text-foreground scroll-mt-4">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 4, text });
      return (
        <h4 id={id} className="text-lg font-semibold mb-2 mt-3 text-foreground scroll-mt-4">
          {children}
        </h4>
      );
    },
    h5: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 5, text });
      return (
        <h5 id={id} className="text-base font-semibold mb-2 mt-3 text-foreground scroll-mt-4">
          {children}
        </h5>
      );
    },
    h6: ({ children }) => {
      const text = flattenHeadingText(children);
      const id = getHeadingId(children);
      headingEntriesRef.current.push({ id, depth: 6, text });
      return (
        <h6 id={id} className="text-sm font-semibold mb-2 mt-2 text-foreground scroll-mt-4">
          {children}
        </h6>
      );
    },
    
    // Paragraphs with proper spacing
    p: ({ children }) => (
      <p className="text-foreground/90 leading-relaxed mb-4">
        {children}
      </p>
    ),
    
    // Lists with better spacing and indentation
    ul: ({ children }) => (
      <ul className="my-4 space-y-2 list-disc pl-6 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 space-y-2 list-decimal pl-6 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="my-1 leading-relaxed">
        {children}
      </li>
    ),
    
    // Code blocks with syntax highlighting
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      
      if (language) {
        // Code block with syntax highlighting
        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language={language}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              PreTag="div"
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      // Inline code
      return (
        <code className="text-primary bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    
    // Blockquotes with enhanced styling
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-l-primary bg-muted/50 pl-4 py-2 my-4 italic text-foreground/80">
        {children}
      </blockquote>
    ),
    
    // Links with hover effects and security
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      // Check if this is a relative markdown file link (e.g., web-apps-level-1-ai-prompts.md)
      const isRelativeMarkdownLink = href && !isExternal && /\.(md|markdown)$/i.test(href);
      
      const handleClick = (e: MouseEvent) => {
        if (isRelativeMarkdownLink) {
          e.preventDefault();
          // Try to scroll to templates section first (where AI prompts file is),
          // then planning section as fallback
          const templatesSection = document.getElementById('section-templates');
          const planningSection = document.getElementById('section-planning');
          const targetSection = templatesSection || planningSection;
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
      
      return (
        <a 
          href={href} 
          onClick={handleClick}
          className="text-primary no-underline hover:underline font-medium cursor-pointer"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
    
    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="text-foreground/90 italic">
        {children}
      </em>
    ),
    
    // Horizontal rules
    hr: () => (
      <hr className="my-6 border-border" />
    ),
    
    // Tables with enhanced styling
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="[&_tr:nth-child(even)]:bg-muted/30">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold border border-border bg-muted">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 border border-border">
        {children}
      </td>
    ),
    
    // Images
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-md my-4 max-w-full h-auto"
      />
    ),
    
    // Task lists (from remark-gfm)
    input: ({ checked, ...props }) => {
      if (props.type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked || false}
            disabled
            className="mr-2 accent-primary"
            {...props}
          />
        );
      }
      return <input {...props} />;
    },
  };

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

  const inner = (
    <div className="pr-4">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );

  if (scrollContainerRef) {
    return (
      <div
        ref={scrollContainerRef}
        data-document-scroll
        className={cn('w-full overflow-y-auto overflow-x-hidden min-h-0', className)}
        style={{ height }}
      >
        {inner}
      </div>
    );
  }

  return (
    <ScrollArea className={cn('w-full', className)} style={{ height }}>
      {inner}
    </ScrollArea>
  );
}
