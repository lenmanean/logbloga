-- Migration: Recommendation Analytics
-- Creates table for storing recommendation analytics events (views, clicks, purchases)

-- ============================================================================
-- RECOMMENDATION ANALYTICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS recommendation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES product_recommendations(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('upsell', 'cross-sell', 'related')),
  event TEXT NOT NULL CHECK (event IN ('view', 'click', 'purchase')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for product-based queries
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_product_id 
ON recommendation_analytics(product_id);

-- Index for recommended product queries
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_recommended_product_id 
ON recommendation_analytics(recommended_product_id);

-- Index for user-based queries
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_user_id 
ON recommendation_analytics(user_id) WHERE user_id IS NOT NULL;

-- Index for session-based queries
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_session_id 
ON recommendation_analytics(session_id) WHERE session_id IS NOT NULL;

-- Index for timestamp queries (for time-based analytics)
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_timestamp 
ON recommendation_analytics(timestamp DESC);

-- Index for event type queries
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_event 
ON recommendation_analytics(event);

-- Composite index for common query patterns (product + event + timestamp)
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_product_event_timestamp 
ON recommendation_analytics(product_id, event, timestamp DESC);

-- Composite index for recommendation performance (recommendation_id + event)
CREATE INDEX IF NOT EXISTS idx_recommendation_analytics_recommendation_event 
ON recommendation_analytics(recommendation_id, event) WHERE recommendation_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE recommendation_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analytics events
CREATE POLICY "Users can view their own recommendation analytics"
  ON recommendation_analytics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can insert analytics events (for system tracking)
CREATE POLICY "Service role can insert recommendation analytics"
  ON recommendation_analytics
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can view all analytics events
CREATE POLICY "Admins can view all recommendation analytics"
  ON recommendation_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE recommendation_analytics IS 'Analytics events for product recommendations (views, clicks, purchases)';
COMMENT ON COLUMN recommendation_analytics.recommendation_id IS 'Optional reference to product_recommendations table entry';
COMMENT ON COLUMN recommendation_analytics.product_id IS 'Product that was being viewed when recommendation was shown';
COMMENT ON COLUMN recommendation_analytics.recommended_product_id IS 'Product that was recommended';
COMMENT ON COLUMN recommendation_analytics.type IS 'Type of recommendation: upsell, cross-sell, or related';
COMMENT ON COLUMN recommendation_analytics.event IS 'Event type: view (shown), click (clicked), purchase (purchased)';
COMMENT ON COLUMN recommendation_analytics.user_id IS 'User ID if authenticated, NULL for guest users';
COMMENT ON COLUMN recommendation_analytics.session_id IS 'Session ID for guest user tracking';
COMMENT ON COLUMN recommendation_analytics.metadata IS 'Additional event metadata (JSON)';
