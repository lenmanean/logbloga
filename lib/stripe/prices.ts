/**
 * Stripe price IDs from environment variables (server-only).
 * Checkout uses these; do not use NEXT_PUBLIC_ or expose in client bundles.
 */

/** Canonical sellable product slugs that require a Stripe price (aligned with DOER packages). */
export const SELLABLE_SLUGS = [
  'agency',
  'social-media',
  'web-apps',
  'freelancing',
  'master-bundle',
] as const;

export type SellableSlug = (typeof SELLABLE_SLUGS)[number];

/** Map product slug to env var name. Hyphens in slug become underscores in env key. */
export const SLUG_TO_STRIPE_PRICE_ENV: Record<string, string> = {
  agency: 'STRIPE_PRICE_AGENCY',
  'social-media': 'STRIPE_PRICE_SOCIAL_MEDIA',
  'web-apps': 'STRIPE_PRICE_WEB_APPS',
  freelancing: 'STRIPE_PRICE_FREELANCING',
  'master-bundle': 'STRIPE_PRICE_MASTER_BUNDLE',
};

const STRIPE_PRICE_PREFIX = 'price_';

/**
 * Returns the Stripe price ID for a product slug from env, or null if unset/invalid.
 * Only returns a value when it is a non-empty string starting with "price_".
 */
export function getStripePriceIdBySlug(
  slug: string | null | undefined
): string | null {
  if (slug == null || typeof slug !== 'string') return null;
  const trimmed = slug.trim().toLowerCase();
  if (!trimmed) return null;
  const envKey = SLUG_TO_STRIPE_PRICE_ENV[trimmed];
  if (!envKey) return null;
  const value = process.env[envKey];
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized || !normalized.startsWith(STRIPE_PRICE_PREFIX)) return null;
  return normalized;
}

/**
 * Returns the list of env keys required for sellable slugs (for validation/docs).
 * Does not expose raw env values.
 */
export function getStripePriceEnvKeys(): string[] {
  return SELLABLE_SLUGS.map(
    (slug) => SLUG_TO_STRIPE_PRICE_ENV[slug]
  ).filter(Boolean);
}
