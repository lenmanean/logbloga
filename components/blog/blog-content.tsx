import React from 'react';
import { readFile } from 'fs/promises';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { MermaidDiagram } from './mermaid-diagram';
import type { Components } from 'react-markdown';

interface BlogContentProps {
  content?: string | null;
  mdxFilePath?: string | null;
  className?: string;
}

const blogComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-12 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-16 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-10 text-lg font-semibold text-foreground md:text-xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-5 leading-relaxed text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc space-y-2 pl-6 text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ className: codeClassName, children, ...props }) => {
    const match = /language-(\w+)/.exec(codeClassName || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    if (language === 'mermaid') {
      return (
        <div data-mermaid-block="true">
          <MermaidDiagram code={codeString} />
        </div>
      );
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    const child = React.Children.only(children);
    const props = React.isValidElement(child) ? (child.props as Record<string, unknown>) : {};
    const isMermaid = props['data-mermaid-block'] !== undefined;
    const inner = props.children;
    if (isMermaid && inner) return <>{inner}</>;
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
        {children}
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-4 border-l-primary bg-muted/50 py-2 pl-6 not-italic text-foreground/90">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary no-underline hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground/90">{children}</em>
  ),
  hr: () => <div className="my-16" aria-hidden />,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="mx-auto rounded-lg shadow-md"
    />
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="[&_tr:nth-child(even)]:bg-muted/30">{children}</tbody>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="border border-border bg-muted px-4 py-3 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-3">{children}</td>
  ),
};

/**
 * Blog content renderer (Server Component)
 * Uses react-markdown with remark-gfm for tables, Mermaid diagrams, and custom styling.
 */
export async function BlogContent({ content, mdxFilePath, className }: BlogContentProps) {
  let markdownContent = '';

  try {
    if (mdxFilePath) {
      try {
        const filePath = join(process.cwd(), 'public', 'content', mdxFilePath);
        const fileContent = await readFile(filePath, 'utf-8');
        markdownContent = fileContent;
      } catch (error) {
        console.warn('Could not load MDX file, using content field:', error);
        markdownContent = content || '';
      }
    } else {
      markdownContent = content || '';
    }

    return (
      <div className={cn('prose prose-lg dark:prose-invert max-w-none text-left', className)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogComponents}>
          {markdownContent}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog content:', error);
    return (
      <div className={cn('prose prose-lg dark:prose-invert max-w-none text-left', className)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogComponents}>
          {content || ''}
        </ReactMarkdown>
      </div>
    );
  }
}
