'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown with the same interactive stack as the library viewer:
 * ReactMarkdown, remark-gfm, Prism for code blocks. Used for package preview and shared content.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return;
      setIsDark(
        document.documentElement.classList.contains('dark') ||
          window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', check);
    return () => {
      observer.disconnect();
      mq.removeEventListener('change', check);
    };
  }, []);

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 mt-6 pb-2 border-b border-border text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 space-y-2 list-disc pl-6 text-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 space-y-2 list-decimal pl-6 text-foreground">{children}</ol>
    ),
    li: ({ children }) => <li className="my-1 leading-relaxed">{children}</li>,
    code: ({ className: codeClassName, children, ...props }) => {
      const match = /language-(\w+)/.exec(codeClassName || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      if (language) {
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
      return (
        <code
          className="text-primary bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-l-primary bg-muted/50 pl-4 py-2 my-4 italic text-foreground/80">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary no-underline hover:underline font-medium"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
    em: ({ children }) => <em className="text-foreground/90 italic">{children}</em>,
    hr: () => <hr className="my-6 border-border" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
    tbody: ({ children }) => <tbody className="[&_tr:nth-child(even)]:bg-muted/30">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold border border-border bg-muted">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="px-4 py-2 border border-border">{children}</td>,
  };

  return (
    <div className={cn('prose prose-lg dark:prose-invert max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
