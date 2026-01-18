-- Migration: Row Level Security Policies
-- Enables RLS and creates security policies for all tables

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow it)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

-- Everyone can read active products (handle both old and new table structure)
DO $$
BEGIN
  -- Drop policy if it exists
  DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') THEN
    -- New structure with 'active' column
    CREATE POLICY "Products are viewable by everyone"
      ON products FOR SELECT
      USING (active = true);
  ELSE
    -- Old structure without 'active' column - show all products
    CREATE POLICY "Products are viewable by everyone"
      ON products FOR SELECT
      USING (true);
  END IF;
END $$;

-- Only authenticated users with admin role can modify products
-- Note: Admin role check would need to be implemented in user metadata or separate table
-- For now, we'll allow service role to manage (via service_role key, which bypasses RLS)
-- Service role operations bypass RLS, so no policy needed for admin operations

-- ============================================================================
-- PRODUCT VARIANTS POLICIES
-- ============================================================================

-- Everyone can read product variants for active products
DO $$
BEGIN
  DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON product_variants;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') THEN
    CREATE POLICY "Product variants are viewable by everyone"
      ON product_variants FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM products
          WHERE products.id = product_variants.product_id
          AND products.active = true
        )
      );
  ELSE
    CREATE POLICY "Product variants are viewable by everyone"
      ON product_variants FOR SELECT
      USING (true);
  END IF;
END $$;

-- ============================================================================
-- CART ITEMS POLICIES
-- ============================================================================

-- Users can view their own cart items
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders (will be created via server-side API with service role)
-- For now, allow authenticated users to create orders
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Users can update their own orders (limited to certain statuses - handled in application logic)
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ORDER ITEMS POLICIES
-- ============================================================================

-- Users can view order items for their own orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Order items are created via server-side API (service role)
-- No policy needed as service role bypasses RLS

-- ============================================================================
-- LICENSES POLICIES
-- ============================================================================

-- Users can view their own licenses
CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  USING (auth.uid() = user_id);

-- Licenses are created via server-side API (service role)
-- No policy needed as service role bypasses RLS

-- Users can update their own licenses (e.g., activate/deactivate)
CREATE POLICY "Users can update own licenses"
  ON licenses FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PRODUCT RECOMMENDATIONS POLICIES
-- ============================================================================

-- Everyone can read active product recommendations
CREATE POLICY "Product recommendations are viewable by everyone"
  ON product_recommendations FOR SELECT
  USING (active = true);

-- ============================================================================
-- COUPONS POLICIES
-- ============================================================================

-- Everyone can read active coupons
CREATE POLICY "Active coupons are viewable by everyone"
  ON coupons FOR SELECT
  USING (active = true);

-- Coupons are managed via server-side API (service role)
-- No policy needed as service role bypasses RLS

-- ============================================================================
-- REVIEWS POLICIES
-- ============================================================================

-- Everyone can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (status = 'approved');

-- Users can view their own reviews (including pending)
CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

