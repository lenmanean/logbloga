-- Migration: Update Product Pricing & Metadata
-- Updates individual product prices with 40-50% markup and sets package metadata

-- Update individual product prices with markup (standalone prices)
-- These prices reflect 40-50% markup above package-equivalent values

-- Web Apps Category
UPDATE products 
SET 
  price = 499.00,
  original_price = 699.00
WHERE slug = 'ai-ecommerce-builder';

UPDATE products 
SET 
  price = 399.00,
  original_price = 549.00
WHERE slug = 'saas-dashboard-template';

UPDATE products 
SET 
  price = 599.00,
  original_price = 799.00
WHERE slug = 'api-integration-platform';

-- Social Media Category
UPDATE products 
SET 
  price = 249.00,
  original_price = 349.00
WHERE slug = 'social-content-generator';

UPDATE products 
SET 
  price = 299.00,
  original_price = 399.00
WHERE slug = 'instagram-automation';

UPDATE products 
SET 
  price = 299.00,
  original_price = 399.00
WHERE slug = 'tiktok-strategy';

-- Agency Category
UPDATE products 
SET 
  price = 699.00,
  original_price = 899.00
WHERE slug = 'client-management-system';

UPDATE products 
SET 
  price = 399.00,
  original_price = 549.00
WHERE slug = 'agency-proposal-generator';

UPDATE products 
SET 
  price = 799.00,
  original_price = 999.00
WHERE slug = 'team-collaboration-tool';

-- Freelancing Category
UPDATE products 
SET 
  price = 349.00,
  original_price = 499.00
WHERE slug = 'freelancer-portfolio';

UPDATE products 
SET 
  price = 199.00,
  original_price = 299.00
WHERE slug = 'freelance-invoice-system';

UPDATE products 
SET 
  price = 249.00,
  original_price = 349.00
WHERE slug = 'client-communication-system';

-- Set version_year to 2025 for all current products
UPDATE products 
SET version_year = 2025
WHERE version_year IS NULL;

-- Set is_current_version to TRUE for all current products
UPDATE products 
SET is_current_version = TRUE
WHERE is_current_version IS NULL;

-- Update product_type accurately
-- Packages are already set to 'package' by previous migration
-- Update individual products to specific types based on their nature

-- Tools (executable applications/codebases)
UPDATE products 
SET product_type = 'tool'
WHERE slug IN (
  'ai-ecommerce-builder',
  'saas-dashboard-template',
  'api-integration-platform',
  'client-management-system',
  'team-collaboration-tool',
  'freelancer-portfolio',
  'freelance-invoice-system',
  'client-communication-system'
);

-- Templates (ready-to-use files)
UPDATE products 
SET product_type = 'template'
WHERE slug IN (
  'social-content-generator',
  'agency-proposal-generator'
);

-- Strategy (guides/frameworks)
UPDATE products 
SET product_type = 'strategy'
WHERE slug IN (
  'instagram-automation',
  'tiktok-strategy'
);

-- Ensure all remaining individual products have a type
UPDATE products 
SET product_type = 'individual'
WHERE product_type IS NULL AND slug NOT IN ('web-apps', 'social-media', 'agency', 'freelancing');

-- Calculate and set package_value for packages (sum of included product package values)
-- Web Apps Package: 350 + 280 + 420 = 1050
UPDATE products 
SET package_value = 1050.00
WHERE slug = 'web-apps';

-- Social Media Package: 175 + 210 + 210 = 595
UPDATE products 
SET package_value = 595.00
WHERE slug = 'social-media';

-- Agency Package: 490 + 280 + 560 = 1330
UPDATE products 
SET package_value = 1330.00
WHERE slug = 'agency';

-- Freelancing Package: 245 + 140 + 175 = 560
UPDATE products 
SET package_value = 560.00
WHERE slug = 'freelancing';

-- Verify pricing updates
DO $$
DECLARE
  total_individual_value DECIMAL;
  package_price DECIMAL;
  savings DECIMAL;
  package_slug TEXT;
BEGIN
  -- Web Apps Package
  package_slug := 'web-apps';
  SELECT package_value INTO total_individual_value FROM products WHERE slug = package_slug;
  SELECT price INTO package_price FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  
  RAISE NOTICE 'Web Apps Package - Individual Value: %, Package Price: %, Savings: %',
    total_individual_value, package_price, savings;
    
  -- Social Media Package
  package_slug := 'social-media';
  SELECT package_value INTO total_individual_value FROM products WHERE slug = package_slug;
  SELECT price INTO package_price FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  
  RAISE NOTICE 'Social Media Package - Individual Value: %, Package Price: %, Savings: %',
    total_individual_value, package_price, savings;
    
  -- Agency Package
  package_slug := 'agency';
  SELECT package_value INTO total_individual_value FROM products WHERE slug = package_slug;
  SELECT price INTO package_price FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  
  RAISE NOTICE 'Agency Package - Individual Value: %, Package Price: %, Savings: %',
    total_individual_value, package_price, savings;
    
  -- Freelancing Package
  package_slug := 'freelancing';
  SELECT package_value INTO total_individual_value FROM products WHERE slug = package_slug;
  SELECT price INTO package_price FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  
  RAISE NOTICE 'Freelancing Package - Individual Value: %, Package Price: %, Savings: %',
    total_individual_value, package_price, savings;
END $$;
