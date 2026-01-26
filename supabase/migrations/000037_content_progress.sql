-- Migration: Content Progress Tracking
-- Creates table for tracking user progress through package level components
-- Tracks manual completion of: implementation_plan, platform_guides, creative_frameworks, templates

-- ============================================================================
-- CONTENT PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  level SMALLINT NOT NULL CHECK (level IN (1, 2, 3)),
  component TEXT NOT NULL CHECK (component IN ('implementation_plan', 'platform_guides', 'creative_frameworks', 'templates')),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, product_id, level, component)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user/product queries (most common)
CREATE INDEX IF NOT EXISTS idx_content_progress_user_product 
ON content_progress(user_id, product_id);

-- Index for level-specific queries
CREATE INDEX IF NOT EXISTS idx_content_progress_user_product_level 
ON content_progress(user_id, product_id, level);

-- Index for product queries
CREATE INDEX IF NOT EXISTS idx_content_progress_product_id 
ON content_progress(product_id);

-- Index for timestamp queries
CREATE INDEX IF NOT EXISTS idx_content_progress_completed_at 
ON content_progress(completed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view their own content progress"
  ON content_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert their own content progress"
  ON content_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update their own content progress"
  ON content_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own progress
CREATE POLICY "Users can delete their own content progress"
  ON content_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Service role can manage all progress (for API operations)
CREATE POLICY "Service role can manage all content progress"
  ON content_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE content_progress IS 'Tracks user progress through package level components (manual completion)';
COMMENT ON COLUMN content_progress.user_id IS 'User ID (required, authenticated users only)';
COMMENT ON COLUMN content_progress.product_id IS 'Product/package ID';
COMMENT ON COLUMN content_progress.level IS 'Level number (1, 2, or 3)';
COMMENT ON COLUMN content_progress.component IS 'Component type: implementation_plan, platform_guides, creative_frameworks, or templates';
COMMENT ON COLUMN content_progress.completed_at IS 'Timestamp when component was marked as complete';
