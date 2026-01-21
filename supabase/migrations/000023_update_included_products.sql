-- Migration: Update Product JSONB Fields
-- Populates included_products JSONB field in packages table with product slugs

-- Update Web Apps Package included_products
UPDATE products
SET included_products = '["ai-ecommerce-builder", "saas-dashboard-template", "api-integration-platform"]'::jsonb
WHERE slug = 'web-apps';

-- Update Social Media Package included_products
UPDATE products
SET included_products = '["social-content-generator", "instagram-automation", "tiktok-strategy"]'::jsonb
WHERE slug = 'social-media';

-- Update Agency Package included_products
UPDATE products
SET included_products = '["client-management-system", "agency-proposal-generator", "team-collaboration-tool"]'::jsonb
WHERE slug = 'agency';

-- Update Freelancing Package included_products
UPDATE products
SET included_products = '["freelancer-portfolio", "freelance-invoice-system", "client-communication-system"]'::jsonb
WHERE slug = 'freelancing';

-- Verify included_products were set
DO $$
DECLARE
  web_apps_products JSONB;
  social_media_products JSONB;
  agency_products JSONB;
  freelancing_products JSONB;
BEGIN
  SELECT included_products INTO web_apps_products FROM products WHERE slug = 'web-apps';
  SELECT included_products INTO social_media_products FROM products WHERE slug = 'social-media';
  SELECT included_products INTO agency_products FROM products WHERE slug = 'agency';
  SELECT included_products INTO freelancing_products FROM products WHERE slug = 'freelancing';
  
  RAISE NOTICE 'Web Apps Package included products: %', web_apps_products;
  RAISE NOTICE 'Social Media Package included products: %', social_media_products;
  RAISE NOTICE 'Agency Package included products: %', agency_products;
  RAISE NOTICE 'Freelancing Package included products: %', freelancing_products;
END $$;
