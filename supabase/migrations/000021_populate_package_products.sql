-- Migration: Populate Package-Product Relationships
-- Links individual products to their respective packages in package_products junction table

-- First, ensure we have all the products referenced by their slugs
-- Web Apps Package relationships
INSERT INTO package_products (package_id, product_id, package_value, display_order)
SELECT 
  pkg.id AS package_id,
  prod.id AS product_id,
  CASE prod.slug
    WHEN 'ai-ecommerce-builder' THEN 350.00
    WHEN 'saas-dashboard-template' THEN 280.00
    WHEN 'api-integration-platform' THEN 420.00
    ELSE NULL
  END AS package_value,
  CASE prod.slug
    WHEN 'ai-ecommerce-builder' THEN 1
    WHEN 'saas-dashboard-template' THEN 2
    WHEN 'api-integration-platform' THEN 3
    ELSE 0
  END AS display_order
FROM products pkg
CROSS JOIN products prod
WHERE pkg.slug = 'web-apps'
  AND prod.slug IN ('ai-ecommerce-builder', 'saas-dashboard-template', 'api-integration-platform')
ON CONFLICT (package_id, product_id) DO NOTHING;

-- Social Media Package relationships
INSERT INTO package_products (package_id, product_id, package_value, display_order)
SELECT 
  pkg.id AS package_id,
  prod.id AS product_id,
  CASE prod.slug
    WHEN 'social-content-generator' THEN 175.00
    WHEN 'instagram-automation' THEN 210.00
    WHEN 'tiktok-strategy' THEN 210.00
    ELSE NULL
  END AS package_value,
  CASE prod.slug
    WHEN 'social-content-generator' THEN 1
    WHEN 'instagram-automation' THEN 2
    WHEN 'tiktok-strategy' THEN 3
    ELSE 0
  END AS display_order
FROM products pkg
CROSS JOIN products prod
WHERE pkg.slug = 'social-media'
  AND prod.slug IN ('social-content-generator', 'instagram-automation', 'tiktok-strategy')
ON CONFLICT (package_id, product_id) DO NOTHING;

-- Agency Package relationships
INSERT INTO package_products (package_id, product_id, package_value, display_order)
SELECT 
  pkg.id AS package_id,
  prod.id AS product_id,
  CASE prod.slug
    WHEN 'client-management-system' THEN 490.00
    WHEN 'agency-proposal-generator' THEN 280.00
    WHEN 'team-collaboration-tool' THEN 560.00
    ELSE NULL
  END AS package_value,
  CASE prod.slug
    WHEN 'client-management-system' THEN 1
    WHEN 'agency-proposal-generator' THEN 2
    WHEN 'team-collaboration-tool' THEN 3
    ELSE 0
  END AS display_order
FROM products pkg
CROSS JOIN products prod
WHERE pkg.slug = 'agency'
  AND prod.slug IN ('client-management-system', 'agency-proposal-generator', 'team-collaboration-tool')
ON CONFLICT (package_id, product_id) DO NOTHING;

-- Freelancing Package relationships
INSERT INTO package_products (package_id, product_id, package_value, display_order)
SELECT 
  pkg.id AS package_id,
  prod.id AS product_id,
  CASE prod.slug
    WHEN 'freelancer-portfolio' THEN 245.00
    WHEN 'freelance-invoice-system' THEN 140.00
    WHEN 'client-communication-system' THEN 175.00
    ELSE NULL
  END AS package_value,
  CASE prod.slug
    WHEN 'freelancer-portfolio' THEN 1
    WHEN 'freelance-invoice-system' THEN 2
    WHEN 'client-communication-system' THEN 3
    ELSE 0
  END AS display_order
FROM products pkg
CROSS JOIN products prod
WHERE pkg.slug = 'freelancing'
  AND prod.slug IN ('freelancer-portfolio', 'freelance-invoice-system', 'client-communication-system')
ON CONFLICT (package_id, product_id) DO NOTHING;

-- Verify the relationships were created
DO $$
DECLARE
  web_apps_count INTEGER;
  social_media_count INTEGER;
  agency_count INTEGER;
  freelancing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO web_apps_count
  FROM package_products pp
  JOIN products p ON pp.package_id = p.id
  WHERE p.slug = 'web-apps';
  
  SELECT COUNT(*) INTO social_media_count
  FROM package_products pp
  JOIN products p ON pp.package_id = p.id
  WHERE p.slug = 'social-media';
  
  SELECT COUNT(*) INTO agency_count
  FROM package_products pp
  JOIN products p ON pp.package_id = p.id
  WHERE p.slug = 'agency';
  
  SELECT COUNT(*) INTO freelancing_count
  FROM package_products pp
  JOIN products p ON pp.package_id = p.id
  WHERE p.slug = 'freelancing';
  
  RAISE NOTICE 'Package products created: Web Apps: %, Social Media: %, Agency: %, Freelancing: %',
    web_apps_count, social_media_count, agency_count, freelancing_count;
END $$;
