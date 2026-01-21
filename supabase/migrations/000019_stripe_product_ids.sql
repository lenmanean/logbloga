-- Migration: Add Stripe Product and Price IDs to Products Table
-- This enables using pre-created Stripe products/prices instead of price_data

-- Add Stripe product and price ID columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_stripe_product_id 
ON products(stripe_product_id) 
WHERE stripe_product_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_stripe_price_id 
ON products(stripe_price_id) 
WHERE stripe_price_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.stripe_product_id IS 'Stripe Product ID for this product. Used for checkout sessions and automatic tax calculation.';
COMMENT ON COLUMN products.stripe_price_id IS 'Stripe Price ID for this product. Used for checkout sessions and automatic tax calculation.';
