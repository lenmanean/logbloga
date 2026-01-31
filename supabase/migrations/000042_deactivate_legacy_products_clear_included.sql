-- Migration: Deactivate legacy individual products and clear package included_products
-- Individual products are not sold; packages use level-based file content.
-- Only the master-bundle uses included_products (package slugs).

-- 1. Deactivate the 12 individual products (set active = false)
-- These products exist in the database but are not sold on the storefront.
UPDATE products
SET active = false
WHERE slug IN (
  'ai-ecommerce-builder',
  'social-content-generator',
  'client-management-system',
  'freelancer-portfolio',
  'saas-dashboard-template',
  'instagram-automation',
  'agency-proposal-generator',
  'freelance-invoice-system',
  'api-integration-platform',
  'tiktok-strategy',
  'team-collaboration-tool',
  'client-communication-system'
);

-- 2. Clear included_products for the 4 packages (not the bundle)
-- Packages contain level-based file content; included_products is for bundles only.
-- Master-bundle keeps included_products = ["web-apps","social-media","agency","freelancing"]
UPDATE products
SET included_products = '[]'::jsonb
WHERE slug IN ('web-apps', 'social-media', 'agency', 'freelancing')
AND product_type = 'package';
