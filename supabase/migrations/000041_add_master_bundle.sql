-- Migration: Add Master Bundle Product
-- Inserts the AI to USD Master Bundle which includes all four packages

-- Allow 'bundle' in product_type check constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;
ALTER TABLE products ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('package', 'bundle', 'individual', 'tool', 'template', 'strategy', 'course'));

INSERT INTO products (
  slug,
  name,
  title,
  description,
  tagline,
  product_type,
  price,
  original_price,
  package_value,
  package_image,
  included_products,
  content_hours,
  duration,
  active,
  featured,
  category,
  pricing_justification
) VALUES (
  'master-bundle',
  'Master Bundle',
  'AI to USD Master Bundle',
  'The Master Bundle includes full access to all four AI to USD packages: Web Apps, Social Media, Agency, and Freelancing. From building SaaS products and running social media services to scaling an agency and freelancing, you get 145+ hours of structured content, production-ready templates, and implementation guides. One purchase, every path.',
  'Complete AI monetization toolkit — all four packages in one.',
  'bundle',
  1897.00,
  2288.00,
  2288.00,
  '/package-master.png',
  '["web-apps","social-media","agency","freelancing"]'::jsonb,
  '145+ hours',
  'Self-paced',
  true,
  true,
  'web-apps',
  'Best value for serious monetizers: all four packages at 17% off combined retail. Combined value $2,288; bundle price $1,897. Includes Web Apps, Social Media, Agency, and Freelancing packages—everything you need to monetize AI across every path.'
);
