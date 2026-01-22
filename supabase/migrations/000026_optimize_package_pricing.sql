-- Migration: Optimize Package Pricing for Meta Ads
-- Updates package prices to optimized pricing for cold traffic conversion
-- Targets: $397-$797 range with 29-40% savings for strong value proposition

-- Web Apps Package: $1,050 value → $697 price (33% savings)
-- Optimized for mid-tier package, under $700 psychological barrier
UPDATE products 
SET 
  price = 697.00,
  original_price = 1049.00
WHERE slug = 'web-apps';

-- Social Media Package: $595 value → $397 price (33% savings)
-- Strong conversion rate price point for lower-value package
UPDATE products 
SET 
  price = 397.00,
  original_price = 595.00
WHERE slug = 'social-media';

-- Agency Package: $1,330 value → $797 price (40% savings)
-- High-value package, kept under $800 for better conversion
UPDATE products 
SET 
  price = 797.00,
  original_price = 1330.00
WHERE slug = 'agency';

-- Freelancing Package: $560 value → $397 price (29% savings)
-- Matches Social Media pricing for consistency
UPDATE products 
SET 
  price = 397.00,
  original_price = 560.00
WHERE slug = 'freelancing';

-- Verify pricing updates and validate package price < package_value
DO $$
DECLARE
  total_individual_value DECIMAL;
  package_price DECIMAL;
  savings DECIMAL;
  savings_percentage DECIMAL;
  package_slug TEXT;
  package_title TEXT;
BEGIN
  -- Web Apps Package
  package_slug := 'web-apps';
  SELECT package_value, price, title INTO total_individual_value, package_price, package_title 
  FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  savings_percentage := ROUND((savings / total_individual_value) * 100, 1);
  
  IF package_price >= total_individual_value THEN
    RAISE EXCEPTION 'Package price validation failed for %: price (%) >= package_value (%)', 
      package_title, package_price, total_individual_value;
  END IF;
  
  RAISE NOTICE 'Web Apps Package - Individual Value: %, Package Price: %, Savings: %, Percentage: %',
    total_individual_value, package_price, savings, savings_percentage || '%';
    
  -- Social Media Package
  package_slug := 'social-media';
  SELECT package_value, price, title INTO total_individual_value, package_price, package_title 
  FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  savings_percentage := ROUND((savings / total_individual_value) * 100, 1);
  
  IF package_price >= total_individual_value THEN
    RAISE EXCEPTION 'Package price validation failed for %: price (%) >= package_value (%)', 
      package_title, package_price, total_individual_value;
  END IF;
  
  RAISE NOTICE 'Social Media Package - Individual Value: %, Package Price: %, Savings: %, Percentage: %',
    total_individual_value, package_price, savings, savings_percentage || '%';
    
  -- Agency Package
  package_slug := 'agency';
  SELECT package_value, price, title INTO total_individual_value, package_price, package_title 
  FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  savings_percentage := ROUND((savings / total_individual_value) * 100, 1);
  
  IF package_price >= total_individual_value THEN
    RAISE EXCEPTION 'Package price validation failed for %: price (%) >= package_value (%)', 
      package_title, package_price, total_individual_value;
  END IF;
  
  RAISE NOTICE 'Agency Package - Individual Value: %, Package Price: %, Savings: %, Percentage: %',
    total_individual_value, package_price, savings, savings_percentage || '%';
    
  -- Freelancing Package
  package_slug := 'freelancing';
  SELECT package_value, price, title INTO total_individual_value, package_price, package_title 
  FROM products WHERE slug = package_slug;
  savings := total_individual_value - package_price;
  savings_percentage := ROUND((savings / total_individual_value) * 100, 1);
  
  IF package_price >= total_individual_value THEN
    RAISE EXCEPTION 'Package price validation failed for %: price (%) >= package_value (%)', 
      package_title, package_price, total_individual_value;
  END IF;
  
  RAISE NOTICE 'Freelancing Package - Individual Value: %, Package Price: %, Savings: %, Percentage: %',
    total_individual_value, package_price, savings, savings_percentage || '%';
    
  RAISE NOTICE 'All package prices validated successfully!';
END $$;
