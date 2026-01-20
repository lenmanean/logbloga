import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  escapeHtmlAttribute,
  escapeJavaScript,
  escapeCss,
  sanitizeHtml,
} from '@/lib/security/xss';

describe('XSS Prevention', () => {
  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape ampersand', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("It's working")).toBe('It&#x27;s working');
    });
  });

  describe('escapeHtmlAttribute', () => {
    it('should escape HTML and spaces', () => {
      expect(escapeHtmlAttribute('<script>')).toBe('&lt;script&gt;');
    });
  });

  describe('escapeJavaScript', () => {
    it('should escape JavaScript special characters', () => {
      expect(escapeJavaScript("alert('xss')")).toBe("alert(\\'xss\\')");
    });

    it('should escape backslashes', () => {
      expect(escapeJavaScript('C:\\path')).toBe('C:\\\\path');
    });

    it('should escape newlines', () => {
      expect(escapeJavaScript('line1\nline2')).toBe('line1\\nline2');
    });
  });

  describe('escapeCss', () => {
    it('should escape CSS special characters', () => {
      expect(escapeCss('url("javascript:alert(1)")')).toContain('\\');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Hello</p>');
    });

    it('should remove event handlers', () => {
      const html = '<div onclick="alert(1)">Click me</div>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('onclick');
    });

    it('should remove javascript: protocol', () => {
      const html = '<a href="javascript:alert(1)">Link</a>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('javascript:');
    });
  });
});
