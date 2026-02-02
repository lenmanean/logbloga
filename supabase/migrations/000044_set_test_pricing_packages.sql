-- Migration: Set package prices to $0.01 for testing (display consistency with Stripe)
-- Applies to: web-apps, social-media, agency, freelancing, master-bundle
-- Revert by running a follow-up migration that restores original prices when testing is done.

UPDATE products
SET
  price = 0.01,
  original_price = 0.01
WHERE slug IN (
  'web-apps',
  'social-media',
  'agency',
  'freelancing',
  'master-bundle'
);
