import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeHtml } from '@/lib/security/xss';
import { sanitizeUrl } from '@/lib/security/sanitization';

describe('XSS Protection', () => {
  describe('HTML Escaping', () => {
    it('should escape script tags', () => {
      const malicious = '<script>alert("xss")</script>';
      const escaped = escapeHtml(malicious);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should escape event handlers', () => {
      const malicious = '<div onclick="alert(1)">Click</div>';
      const sanitized = sanitizeHtml(malicious);
      expect(sanitized).not.toContain('onclick');
    });
  });

  describe('URL Sanitization', () => {
    it('should block javascript: protocol', () => {
      const malicious = 'javascript:alert(1)';
      const sanitized = sanitizeUrl(malicious);
      expect(sanitized).toBe('#');
    });

    it('should allow http URLs', () => {
      const safe = 'http://example.com';
      const sanitized = sanitizeUrl(safe);
      expect(sanitized).toBe('http://example.com/');
    });

    it('should allow https URLs', () => {
      const safe = 'https://example.com';
      const sanitized = sanitizeUrl(safe);
      expect(sanitized).toBe('https://example.com/');
    });
  });
});
