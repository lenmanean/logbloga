-- Migration: Enable RLS on package_products table
-- Adds Row Level Security policies for the package_products junction table

-- Enable Row Level Security
ALTER TABLE package_products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PACKAGE_PRODUCTS POLICIES
-- ============================================================================

-- Everyone can read package-product relationships (public information)
CREATE POLICY "Package products are viewable by everyone"
  ON package_products FOR SELECT
  USING (true);

-- Service role can manage package products (for admin operations)
-- Note: Service role operations bypass RLS, so this is mainly for documentation
-- In practice, service role operations will work regardless of policies

-- Add comment for documentation
COMMENT ON TABLE package_products IS 'Junction table tracking which individual products are included in each package. Public read access, service role write access.';
