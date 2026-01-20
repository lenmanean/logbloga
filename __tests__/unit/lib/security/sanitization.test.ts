import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  sanitizeHtml,
  sanitizeUrl,
  validateFileUpload,
  sanitizeJson,
  removeControlCharacters,
  sanitizeText,
} from '@/lib/security/sanitization';

describe('Sanitization', () => {
  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('<script>');
    });

    it('should remove event handlers', () => {
      const html = '<div onclick="alert(1)">Click</div>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('onclick');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('should allow https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
    });

    it('should block javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    });

    it('should block data: URLs with text/html', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    });

    it('should return # for invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBe('#');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate valid image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid MIME type', () => {
      const file = new File([''], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should reject oversized file', () => {
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should reject invalid extension', () => {
      const file = new File([''], 'test.exe', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('extension not allowed');
    });

    it('should reject filename with invalid characters', () => {
      const file = new File([''], 'test<>file.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });
  });

  describe('sanitizeJson', () => {
    it('should sanitize string values', () => {
      const obj = { name: '<script>alert(1)</script>' };
      const sanitized = sanitizeJson(obj);
      expect(sanitized.name).not.toContain('<script>');
    });

    it('should sanitize nested objects', () => {
      const obj = { user: { name: '<script>alert(1)</script>' } };
      const sanitized = sanitizeJson(obj);
      expect(sanitized.user.name).not.toContain('<script>');
    });

    it('should sanitize arrays', () => {
      const obj = ['<script>alert(1)</script>', 'safe'];
      const sanitized = sanitizeJson(obj);
      expect(sanitized[0]).not.toContain('<script>');
      expect(sanitized[1]).toBe('safe');
    });
  });

  describe('removeControlCharacters', () => {
    it('should remove null bytes', () => {
      expect(removeControlCharacters('test\x00string')).toBe('teststring');
    });

    it('should remove control characters', () => {
      expect(removeControlCharacters('test\x1Fstring')).toBe('teststring');
    });
  });

  describe('sanitizeText', () => {
    it('should trim and remove control characters', () => {
      expect(sanitizeText('  test\x00string  ')).toBe('teststring');
    });
  });
});
