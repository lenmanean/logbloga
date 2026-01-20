import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      // twMerge removes px-2 and keeps px-4, py-1 remains
      expect(result).toContain('px-4');
      expect(result).toContain('py-1');
      expect(result).not.toContain('px-2');
    });

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });
  });
});
