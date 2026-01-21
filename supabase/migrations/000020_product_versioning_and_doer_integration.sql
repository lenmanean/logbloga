-- Migration: Product Versioning and Doer Integration
-- Adds product versioning fields and Doer coupon tracking to orders

-- Add product versioning fields to products table
DO $$ 
BEGIN
  -- Add version_year field for year-based edition tracking (e.g., 2025, 2026)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'version_year') THEN
    ALTER TABLE products ADD COLUMN version_year INTEGER;
    -- Default current year for existing products
    UPDATE products SET version_year = EXTRACT(YEAR FROM NOW())::INTEGER WHERE version_year IS NULL;
  END IF;
  
  -- Add is_current_version flag to indicate latest version
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_current_version') THEN
    ALTER TABLE products ADD COLUMN is_current_version BOOLEAN DEFAULT TRUE;
    -- Mark all existing products as current version
    UPDATE products SET is_current_version = TRUE WHERE is_current_version IS NULL;
  END IF;
  
  -- Add product_type to distinguish packages from individual products
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_type') THEN
    ALTER TABLE products ADD COLUMN product_type TEXT CHECK (product_type IN ('package', 'individual', 'tool', 'template', 'strategy', 'course'));
    -- Set default for existing products based on slug
    UPDATE products SET product_type = 'package' 
    WHERE slug IN ('web-apps', 'social-media', 'agency', 'freelancing');
    -- Set individual products (based on slug patterns)
    UPDATE products SET product_type = 'individual' 
    WHERE product_type IS NULL AND slug NOT IN ('web-apps', 'social-media', 'agency', 'freelancing');
  END IF;
  
  -- Add included_products JSONB field to store array of included product slugs/IDs for packages
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'included_products') THEN
    ALTER TABLE products ADD COLUMN included_products JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add package_value field to show total value of included products
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'package_value') THEN
    ALTER TABLE products ADD COLUMN package_value DECIMAL(10,2);
    -- Calculate package value for packages (sum of individual product prices in package)
    -- This will be set manually or via script later
  END IF;
END $$;

-- Add Doer integration fields to orders table
DO $$ 
BEGIN
  -- Add Doer coupon code field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_coupon_code') THEN
    ALTER TABLE orders ADD COLUMN doer_coupon_code TEXT;
  END IF;
  
  -- Add Doer coupon generation timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_coupon_generated_at') THEN
    ALTER TABLE orders ADD COLUMN doer_coupon_generated_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add Doer coupon expiration timestamp (90 days from generation)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_coupon_expires_at') THEN
    ALTER TABLE orders ADD COLUMN doer_coupon_expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add Doer coupon used flag
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_coupon_used') THEN
    ALTER TABLE orders ADD COLUMN doer_coupon_used BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add Doer user ID to track which Doer account used the coupon
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_user_id') THEN
    ALTER TABLE orders ADD COLUMN doer_user_id TEXT;
  END IF;
  
  -- Add Doer coupon used timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'doer_coupon_used_at') THEN
    ALTER TABLE orders ADD COLUMN doer_coupon_used_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create package_products junction table for tracking which products are included in packages
-- This provides flexibility for future changes without modifying JSONB fields
CREATE TABLE IF NOT EXISTS package_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  -- Package-equivalent value of this product within the package (not standalone price)
  package_value DECIMAL(10,2),
  -- Order of display in package contents
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a product can only be included once per package
  UNIQUE(package_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_package_products_package_id ON package_products(package_id);
CREATE INDEX IF NOT EXISTS idx_package_products_product_id ON package_products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_version_year ON products(version_year);
CREATE INDEX IF NOT EXISTS idx_products_is_current_version ON products(is_current_version);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_orders_doer_coupon_code ON orders(doer_coupon_code);

-- Add comments for documentation
COMMENT ON COLUMN products.version_year IS 'Year-based version tracking (e.g., 2025, 2026) for annual editions';
COMMENT ON COLUMN products.is_current_version IS 'Indicates if this is the latest version of the product';
COMMENT ON COLUMN products.product_type IS 'Type of product: package, individual, tool, template, strategy, or course';
COMMENT ON COLUMN products.included_products IS 'Array of product slugs/IDs included in this package (JSONB)';
COMMENT ON COLUMN products.package_value IS 'Total value of included products when purchased separately';
COMMENT ON COLUMN orders.doer_coupon_code IS 'Unique coupon code for 6 months free Doer Pro subscription';
COMMENT ON COLUMN orders.doer_coupon_generated_at IS 'Timestamp when Doer coupon was generated';
COMMENT ON COLUMN orders.doer_coupon_expires_at IS 'Expiration date for Doer coupon (90 days from generation)';
COMMENT ON COLUMN orders.doer_coupon_used IS 'Whether the Doer coupon has been redeemed';
COMMENT ON COLUMN orders.doer_user_id IS 'Doer.com user ID of the account that redeemed the coupon';
COMMENT ON COLUMN orders.doer_coupon_used_at IS 'Timestamp when Doer coupon was redeemed';
COMMENT ON TABLE package_products IS 'Junction table tracking which individual products are included in each package';
