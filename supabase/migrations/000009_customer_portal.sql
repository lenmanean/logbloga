-- Migration: Customer Portal
-- Creates tables for wishlist, saved addresses, and notification preferences
-- Adds stripe_customer_id to profiles table

-- ============================================================================
-- WISHLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

COMMENT ON TABLE wishlist_items IS 'User wishlist/favorites for products';

-- ============================================================================
-- SAVED ADDRESSES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('billing', 'shipping', 'both')),
  label TEXT,
  full_name TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  phone TEXT,
  is_default_billing BOOLEAN DEFAULT FALSE,
  is_default_shipping BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE saved_addresses IS 'User saved billing and shipping addresses';

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_order_confirmation BOOLEAN DEFAULT TRUE,
  email_order_shipped BOOLEAN DEFAULT TRUE,
  email_promotional BOOLEAN DEFAULT TRUE,
  email_product_updates BOOLEAN DEFAULT TRUE,
  email_newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE notification_preferences IS 'User email notification preferences';

-- ============================================================================
-- ADD STRIPE CUSTOMER ID TO PROFILES
-- ============================================================================

-- Add stripe_customer_id column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
  END IF;
END $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON wishlist_items(created_at);

-- Saved addresses indexes
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_type ON saved_addresses(type);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_is_default_billing ON saved_addresses(is_default_billing);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_is_default_shipping ON saved_addresses(is_default_shipping);

-- Notification preferences indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Profiles stripe_customer_id index
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

