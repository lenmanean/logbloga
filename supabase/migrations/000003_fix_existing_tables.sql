-- Migration: Fix existing tables and create missing ones
-- This migration handles the existing products/orders tables and creates missing tables

-- Add missing columns to existing products table if they don't exist
DO $$ 
BEGIN
  -- Add columns that might be missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'title') THEN
    ALTER TABLE products ADD COLUMN title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
    ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'difficulty') THEN
    ALTER TABLE products ADD COLUMN difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'duration') THEN
    ALTER TABLE products ADD COLUMN duration TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'content_hours') THEN
    ALTER TABLE products ADD COLUMN content_hours TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'package_image') THEN
    ALTER TABLE products ADD COLUMN package_image TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
    ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tagline') THEN
    ALTER TABLE products ADD COLUMN tagline TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'modules') THEN
    ALTER TABLE products ADD COLUMN modules JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'resources') THEN
    ALTER TABLE products ADD COLUMN resources JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'bonus_assets') THEN
    ALTER TABLE products ADD COLUMN bonus_assets JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'pricing_justification') THEN
    ALTER TABLE products ADD COLUMN pricing_justification TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
    ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
    ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') THEN
    ALTER TABLE products ADD COLUMN active BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_at') THEN
    ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Rename 'name' to 'title' if 'name' exists but 'title' doesn't
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'title') THEN
    ALTER TABLE products RENAME COLUMN name TO title;
  END IF;
  
  -- Rename 'image_url' to 'package_image' if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'package_image') THEN
    ALTER TABLE products RENAME COLUMN image_url TO package_image;
  END IF;
END $$;

-- Add missing columns to orders table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
    ALTER TABLE orders ADD COLUMN order_number TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status') THEN
    ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
    ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax_amount') THEN
    ALTER TABLE orders ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
    ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'currency') THEN
    ALTER TABLE orders ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_payment_intent_id') THEN
    ALTER TABLE orders ADD COLUMN stripe_payment_intent_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_checkout_session_id') THEN
    -- Use existing stripe_session_id if it exists, otherwise add new column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_session_id') THEN
      ALTER TABLE orders RENAME COLUMN stripe_session_id TO stripe_checkout_session_id;
    ELSE
      ALTER TABLE orders ADD COLUMN stripe_checkout_session_id TEXT;
    END IF;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
    ALTER TABLE orders ADD COLUMN customer_email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
    ALTER TABLE orders ADD COLUMN customer_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address') THEN
    ALTER TABLE orders ADD COLUMN billing_address JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address') THEN
    ALTER TABLE orders ADD COLUMN shipping_address JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'metadata') THEN
    ALTER TABLE orders ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'updated_at') THEN
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Add missing columns to order_items table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_name') THEN
    ALTER TABLE order_items ADD COLUMN product_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_sku') THEN
    ALTER TABLE order_items ADD COLUMN product_sku TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'quantity') THEN
    ALTER TABLE order_items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
    ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'total_price') THEN
    ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'variant_id') THEN
    ALTER TABLE order_items ADD COLUMN variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;
  END IF;
END $$;

