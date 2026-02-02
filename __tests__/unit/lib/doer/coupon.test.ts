import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateCouponFormat,
  getDoerPackageId,
  generateDoerSignature,
} from '@/lib/doer/coupon';

/**
 * Doer API expects HMAC-SHA256 signature as 64-character hex string.
 * Example from Doer: a3a30539661e00c4d1b98ebade8700ed173931f4793acf6b10c9f90c8cc83cc9
 */
const DOER_SIGNATURE_HEX_LENGTH = 64;
const DOER_SIGNATURE_HEX_REGEX = /^[a-f0-9]{64}$/;

describe('Doer Coupon', () => {
  describe('validateCouponFormat', () => {
    it('accepts valid alphanumeric with hyphens (e.g. DOER6M-ABC123)', () => {
      expect(validateCouponFormat('DOER6M-ABC123')).toBe(true);
      expect(validateCouponFormat('DOER6M-abc123-7x9k2m')).toBe(true);
    });

    it('accepts plain alphanumeric', () => {
      expect(validateCouponFormat('abc123')).toBe(true);
      expect(validateCouponFormat('ABC123XYZ')).toBe(true);
    });

    it('rejects empty or whitespace', () => {
      expect(validateCouponFormat('')).toBe(false);
      expect(validateCouponFormat('   ')).toBe(false);
      expect(validateCouponFormat(null)).toBe(false);
      expect(validateCouponFormat(undefined)).toBe(false);
    });

    it('rejects too short', () => {
      expect(validateCouponFormat('abc')).toBe(false);
      expect(validateCouponFormat('12345')).toBe(false);
    });

    it('rejects too long', () => {
      expect(validateCouponFormat('a'.repeat(65))).toBe(false);
    });

    it('rejects invalid characters (XSS/special)', () => {
      expect(validateCouponFormat('<script>alert(1)</script>')).toBe(false);
      expect(validateCouponFormat('code with spaces')).toBe(false);
      expect(validateCouponFormat('code_with_underscore')).toBe(false);
      expect(validateCouponFormat('code.dots')).toBe(false);
    });
  });

  describe('getDoerPackageId', () => {
    it('maps slugs to Doer packageIds', () => {
      expect(getDoerPackageId('agency')).toBe('agency');
      expect(getDoerPackageId('social-media')).toBe('social-media');
      expect(getDoerPackageId('web-apps')).toBe('web-apps');
      expect(getDoerPackageId('freelancing')).toBe('freelancing');
      expect(getDoerPackageId('master-bundle')).toBe('master-bundle');
    });

    it('is case-insensitive', () => {
      expect(getDoerPackageId('AGENCY')).toBe('agency');
      expect(getDoerPackageId('Master-Bundle')).toBe('master-bundle');
    });

    it('returns null for invalid slugs', () => {
      expect(getDoerPackageId('unknown')).toBe(null);
      expect(getDoerPackageId('')).toBe(null);
      expect(getDoerPackageId(null)).toBe(null);
    });
  });

  describe('generateDoerSignature', () => {
    beforeEach(() => {
      vi.stubEnv('LOGBLOGA_PARTNER_SECRET', 'test-partner-secret');
    });

    it('returns 64-character hex string (Doer expected format)', () => {
      const sig = generateDoerSignature(
        'user@example.com',
        'order-uuid-123',
        'agency'
      );
      expect(sig).toHaveLength(DOER_SIGNATURE_HEX_LENGTH);
      expect(sig).toMatch(DOER_SIGNATURE_HEX_REGEX);
    });

    it('is deterministic for same inputs', () => {
      const a = generateDoerSignature('a@b.com', 'ord-1', 'web-apps');
      const b = generateDoerSignature('a@b.com', 'ord-1', 'web-apps');
      expect(a).toBe(b);
    });

    it('differs when payload differs', () => {
      const s1 = generateDoerSignature('a@b.com', 'ord-1', 'agency');
      const s2 = generateDoerSignature('a@b.com', 'ord-2', 'agency');
      const s3 = generateDoerSignature('x@y.com', 'ord-1', 'agency');
      expect(s1).not.toBe(s2);
      expect(s1).not.toBe(s3);
    });

    it('throws when LOGBLOGA_PARTNER_SECRET is not set', () => {
      vi.stubEnv('LOGBLOGA_PARTNER_SECRET', '');
      expect(() =>
        generateDoerSignature('a@b.com', 'ord-1', 'agency')
      ).toThrow('LOGBLOGA_PARTNER_SECRET is not configured');
    });
  });
});
