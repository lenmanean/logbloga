import { sanitizeHtml } from '@/lib/security/xss';
import { marked } from 'marked';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cn } from '@/lib/utils';

interface BlogContentProps {
  content: string;
  mdxFilePath?: string | null;
  className?: string;
}

/**
 * Blog content renderer (Server Component)
 * Supports both HTML and Markdown formats
 * Sanitizes all content for XSS protection
 */
export async function BlogContent({ content, mdxFilePath, className }: BlogContentProps) {
  let htmlContent = '';

  try {
    // If mdx_file_path exists, try to load and render markdown from file
    if (mdxFilePath) {
      try {
        // Try to read from public directory or content directory
        // Adjust path based on your file structure
        const filePath = join(process.cwd(), 'public', 'content', mdxFilePath);
        const fileContent = await readFile(filePath, 'utf-8');
        htmlContent = fileContent;
      } catch (error) {
        // If file reading fails, fall back to content field
        console.warn('Could not load MDX file, using content field:', error);
        htmlContent = content;
      }
    } else {
      // Use content field directly
      htmlContent = content;
    }

    // Check if content is markdown (starts with # or contains markdown syntax)
    const isMarkdown = /^#+\s|^\*\s|^-\s|^```|^`/.test(htmlContent.trim()) || 
                      htmlContent.includes('\n##') || 
                      htmlContent.includes('\n**') ||
                      htmlContent.includes('\n* ');

    if (isMarkdown) {
      // Render markdown to HTML
      const markdownHtml = await marked.parse(htmlContent);
      htmlContent = markdownHtml as string;
    }

    // Sanitize HTML content
    const sanitized = sanitizeHtml(htmlContent, {
      allowedTags: [
        'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
        'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr',
        'div', 'span'
      ],
      allowedAttributes: {
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        code: ['class'],
        pre: ['class'],
        div: ['class'],
        span: ['class'],
      },
    });

    return (
      <div
        className={cn(
          'prose prose-lg dark:prose-invert max-w-none',
          'prose-headings:font-bold prose-headings:text-foreground',
          'prose-p:text-foreground/90 prose-p:leading-relaxed',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-muted prose-pre:border',
          'prose-img:rounded-lg prose-img:shadow-md',
          'prose-blockquote:border-l-primary prose-blockquote:bg-muted/50',
          className
        )}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  } catch (error) {
    console.error('Error rendering blog content:', error);
    // Fallback: sanitize and display content as-is
    const fallbackContent = sanitizeHtml(content);
    return (
      <div
        className={cn(
          'prose prose-lg dark:prose-invert max-w-none',
          className
        )}
        dangerouslySetInnerHTML={{ __html: fallbackContent }}
      />
    );
  }
}
