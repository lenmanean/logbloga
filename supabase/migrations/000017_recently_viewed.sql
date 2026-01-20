-- Migration: Recently Viewed Products
-- Creates table for tracking recently viewed products by users and guests

-- ============================================================================
-- RECENTLY VIEWED PRODUCTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS recently_viewed_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================

-- Ensure either user_id or session_id is provided
ALTER TABLE recently_viewed_products 
ADD CONSTRAINT recently_viewed_user_or_session_check 
CHECK (
  (user_id IS NOT NULL AND session_id IS NULL) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

-- Unique constraint: one entry per user/product or session/product combination
-- This prevents duplicate entries and allows updating viewed_at on re-view
CREATE UNIQUE INDEX IF NOT EXISTS idx_recently_viewed_user_product 
ON recently_viewed_products(user_id, product_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_recently_viewed_session_product 
ON recently_viewed_products(session_id, product_id) 
WHERE session_id IS NOT NULL;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user-based queries
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id 
ON recently_viewed_products(user_id) 
WHERE user_id IS NOT NULL;

-- Index for session-based queries
CREATE INDEX IF NOT EXISTS idx_recently_viewed_session_id 
ON recently_viewed_products(session_id) 
WHERE session_id IS NOT NULL;

-- Index for product-based queries
CREATE INDEX IF NOT EXISTS idx_recently_viewed_product_id 
ON recently_viewed_products(product_id);

-- Index for timestamp queries (for ordering by most recent)
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at 
ON recently_viewed_products(viewed_at DESC);

-- Composite index for common query pattern (user_id + viewed_at)
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_viewed_at 
ON recently_viewed_products(user_id, viewed_at DESC) 
WHERE user_id IS NOT NULL;

-- Composite index for session queries (session_id + viewed_at)
CREATE INDEX IF NOT EXISTS idx_recently_viewed_session_viewed_at 
ON recently_viewed_products(session_id, viewed_at DESC) 
WHERE session_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE recently_viewed_products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recently viewed products
CREATE POLICY "Users can view their own recently viewed products"
  ON recently_viewed_products
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can insert recently viewed products (for tracking)
CREATE POLICY "Service role can insert recently viewed products"
  ON recently_viewed_products
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can update recently viewed products (to update viewed_at)
CREATE POLICY "Service role can update recently viewed products"
  ON recently_viewed_products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Service role can delete recently viewed products (for cleanup)
CREATE POLICY "Service role can delete recently viewed products"
  ON recently_viewed_products
  FOR DELETE
  USING (true);

-- ============================================================================
-- FUNCTION: Update viewed_at on duplicate insert
-- ============================================================================

-- Function to update viewed_at when product is viewed again
CREATE OR REPLACE FUNCTION update_recently_viewed_on_duplicate()
RETURNS TRIGGER AS $$
BEGIN
  -- If entry exists, update viewed_at instead of inserting
  IF NEW.user_id IS NOT NULL THEN
    UPDATE recently_viewed_products
    SET viewed_at = NOW()
    WHERE user_id = NEW.user_id 
      AND product_id = NEW.product_id;
    
    -- If update affected a row, return NULL to prevent insert
    IF FOUND THEN
      RETURN NULL;
    END IF;
  ELSIF NEW.session_id IS NOT NULL THEN
    UPDATE recently_viewed_products
    SET viewed_at = NOW()
    WHERE session_id = NEW.session_id 
      AND product_id = NEW.product_id;
    
    -- If update affected a row, return NULL to prevent insert
    IF FOUND THEN
      RETURN NULL;
    END IF;
  END IF;
  
  -- If no existing row, allow insert
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle duplicate inserts
DROP TRIGGER IF EXISTS trigger_update_recently_viewed_on_duplicate ON recently_viewed_products;
CREATE TRIGGER trigger_update_recently_viewed_on_duplicate
  BEFORE INSERT ON recently_viewed_products
  FOR EACH ROW
  EXECUTE FUNCTION update_recently_viewed_on_duplicate();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE recently_viewed_products IS 'Tracks recently viewed products for authenticated users and guest sessions';
COMMENT ON COLUMN recently_viewed_products.user_id IS 'User ID for authenticated users, NULL for guest sessions';
COMMENT ON COLUMN recently_viewed_products.session_id IS 'Session ID for guest users, NULL for authenticated users';
COMMENT ON COLUMN recently_viewed_products.viewed_at IS 'Timestamp when product was last viewed (updated on re-view)';
