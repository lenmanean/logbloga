/**
 * XSS prevention utilities
 * Provides functions to escape and sanitize content to prevent XSS attacks
 */

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (m) => map[m]);
}

/**
 * Escape HTML attributes
 */
export function escapeHtmlAttribute(text: string): string {
  return escapeHtml(text).replace(/\s/g, '&#32;');
}

/**
 * Escape JavaScript code
 */
export function escapeJavaScript(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escape CSS
 */
export function escapeCss(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, (m) => {
    const code = m.charCodeAt(0);
    return `\\${code.toString(16)} `;
  });
}

/**
 * Sanitize HTML content using DOMPurify
 * For server-side use (Node.js environment)
 */
export function sanitizeHtml(html: string, options?: {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}): string {
  // Create a JSDOM window for server-side DOMPurify
  const window = new JSDOM('').window;
  const purify = DOMPurify(window as any);

  const defaultConfig = {
    ALLOWED_TAGS: options?.allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
      'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: options?.allowedAttributes
      ? Object.values(options.allowedAttributes).flat()
      : ['href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: false,
  };

  // Merge custom options
  if (options?.allowedAttributes) {
    defaultConfig.ALLOWED_ATTR = Object.values(options.allowedAttributes).flat();
  }

  return purify.sanitize(html, defaultConfig);
}

/**
 * Sanitize URL to prevent XSS
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    
    // Additional check for javascript: protocol (shouldn't happen with URL constructor)
    const urlLower = parsed.href.toLowerCase();
    if (urlLower.startsWith('javascript:') || urlLower.startsWith('data:text/html')) {
      return '#';
    }
    
    return parsed.href;
  } catch {
    // Invalid URL, return safe default
    return '#';
  }
}

/**
 * Validate and sanitize user input for database storage
 */
export function sanitizeForDatabase(text: string): string {
  // Remove null bytes
  let sanitized = text.replace(/\0/g, '');
  
  // Remove control characters except newline, tab, carriage return
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize user input for display in React (escapes HTML)
 * React already escapes by default, but this is useful for dangerouslySetInnerHTML scenarios
 */
export function sanitizeForReact(text: string): string {
  return escapeHtml(text);
}

/**
 * Create a safe HTML string from user input
 */
export function createSafeHtml(text: string): string {
  // Escape all HTML entities
  return escapeHtml(text);
}

/**
 * Check if a string contains potentially dangerous content
 */
export function containsDangerousContent(text: string): boolean {
  // Check for script tags
  if (/<script/i.test(text)) {
    return true;
  }
  
  // Check for event handlers
  if (/\s*on\w+\s*=/i.test(text)) {
    return true;
  }
  
  // Check for javascript: protocol
  if (/javascript:/i.test(text)) {
    return true;
  }
  
  // Check for data: URLs with HTML content
  if (/data:text\/html/i.test(text)) {
    return true;
  }
  
  // Check for iframe tags
  if (/<iframe/i.test(text)) {
    return true;
  }
  
  return false;
}

/**
 * Remove potentially dangerous content from string
 */
export function removeDangerousContent(text: string): string {
  let cleaned = text;
  
  // Remove script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');
  
  // Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, '');
  
  // Remove data: URLs with HTML
  cleaned = cleaned.replace(/data:text\/html[^"'\s]*/gi, '');
  
  // Remove iframe tags
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  return cleaned;
}
