import { describe, it, expect } from 'vitest';
import { passwordSchema } from '@/lib/security/validation';

describe('Authentication Security', () => {
  describe('Password Strength Requirements', () => {
    it('should enforce minimum length', () => {
      const result = passwordSchema.safeParse('Short1!');
      expect(result.success).toBe(false);
    });

    it('should require uppercase letter', () => {
      const result = passwordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
    });

    it('should require lowercase letter', () => {
      const result = passwordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
    });

    it('should require number', () => {
      const result = passwordSchema.safeParse('Password!');
      expect(result.success).toBe(false);
    });

    it('should require special character', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
    });

    it('should accept strong password', () => {
      const result = passwordSchema.safeParse('Password123!');
      expect(result.success).toBe(true);
    });
  });
});
