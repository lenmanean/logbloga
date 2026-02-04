'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { sanitizeUrl } from '@/lib/security/sanitization';
export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Renders a single chat message.
 * Assistant messages support Markdown with safe link handling (internal links only).
 */
export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
          data-testid="chat-message-user"
        >
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start" data-testid="chat-message-assistant">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border bg-muted/50 px-4 py-2.5">
        <div className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                if (!href) return <span {...props}>{children}</span>;
                const isInternal =
                  href.startsWith('/') && !href.startsWith('//');
                if (isInternal) {
                  return (
                    <Link href={href} {...props}>
                      {children}
                    </Link>
                  );
                }
                const safeHref = sanitizeUrl(href);
                return (
                  <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
