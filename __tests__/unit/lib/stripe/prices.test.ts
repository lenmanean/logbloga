import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  SELLABLE_SLUGS,
  SLUG_TO_STRIPE_PRICE_ENV,
  getStripePriceIdBySlug,
  getStripePriceEnvKeys,
} from '@/lib/stripe/prices';

describe('lib/stripe/prices', () => {
  const savedEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of getStripePriceEnvKeys()) {
      savedEnv[key] = process.env[key];
    }
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value !== undefined) process.env[key] = value;
      else delete process.env[key];
    }
  });

  describe('SELLABLE_SLUGS', () => {
    it('includes all five sellable packages', () => {
      expect(SELLABLE_SLUGS).toContain('agency');
      expect(SELLABLE_SLUGS).toContain('social-media');
      expect(SELLABLE_SLUGS).toContain('web-apps');
      expect(SELLABLE_SLUGS).toContain('freelancing');
      expect(SELLABLE_SLUGS).toContain('master-bundle');
      expect(SELLABLE_SLUGS).toHaveLength(5);
    });
  });

  describe('SLUG_TO_STRIPE_PRICE_ENV', () => {
    it('maps each sellable slug to an env key', () => {
      expect(SLUG_TO_STRIPE_PRICE_ENV['agency']).toBe('STRIPE_PRICE_AGENCY');
      expect(SLUG_TO_STRIPE_PRICE_ENV['social-media']).toBe('STRIPE_PRICE_SOCIAL_MEDIA');
      expect(SLUG_TO_STRIPE_PRICE_ENV['web-apps']).toBe('STRIPE_PRICE_WEB_APPS');
      expect(SLUG_TO_STRIPE_PRICE_ENV['freelancing']).toBe('STRIPE_PRICE_FREELANCING');
      expect(SLUG_TO_STRIPE_PRICE_ENV['master-bundle']).toBe('STRIPE_PRICE_MASTER_BUNDLE');
    });
  });

  describe('getStripePriceIdBySlug', () => {
    it('returns env value when set and valid (starts with price_)', () => {
      process.env.STRIPE_PRICE_MASTER_BUNDLE = 'price_1abc123';
      expect(getStripePriceIdBySlug('master-bundle')).toBe('price_1abc123');
    });

    it('returns null when slug is null or undefined', () => {
      expect(getStripePriceIdBySlug(null)).toBe(null);
      expect(getStripePriceIdBySlug(undefined)).toBe(null);
    });

    it('returns null when slug is empty string', () => {
      expect(getStripePriceIdBySlug('')).toBe(null);
    });

    it('returns null when env is unset', () => {
      delete process.env.STRIPE_PRICE_MASTER_BUNDLE;
      expect(getStripePriceIdBySlug('master-bundle')).toBe(null);
    });

    it('returns null when env value does not start with price_', () => {
      process.env.STRIPE_PRICE_MASTER_BUNDLE = 'prod_xyz';
      expect(getStripePriceIdBySlug('master-bundle')).toBe(null);
    });

    it('returns null when env value is empty string', () => {
      process.env.STRIPE_PRICE_MASTER_BUNDLE = '';
      expect(getStripePriceIdBySlug('master-bundle')).toBe(null);
    });

    it('normalizes slug to lowercase', () => {
      process.env.STRIPE_PRICE_AGENCY = 'price_agency1';
      expect(getStripePriceIdBySlug('AGENCY')).toBe('price_agency1');
    });

    it('trims slug and env value', () => {
      process.env.STRIPE_PRICE_MASTER_BUNDLE = '  price_1x  ';
      expect(getStripePriceIdBySlug('  master-bundle  ')).toBe('price_1x');
    });

    it('returns null for unknown slug', () => {
      expect(getStripePriceIdBySlug('unknown-product')).toBe(null);
    });
  });

  describe('getStripePriceEnvKeys', () => {
    it('returns five env keys', () => {
      const keys = getStripePriceEnvKeys();
      expect(keys).toHaveLength(5);
      expect(keys).toContain('STRIPE_PRICE_AGENCY');
      expect(keys).toContain('STRIPE_PRICE_SOCIAL_MEDIA');
      expect(keys).toContain('STRIPE_PRICE_WEB_APPS');
      expect(keys).toContain('STRIPE_PRICE_FREELANCING');
      expect(keys).toContain('STRIPE_PRICE_MASTER_BUNDLE');
    });
  });
});
