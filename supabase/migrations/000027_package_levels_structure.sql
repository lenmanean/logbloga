-- Migration: Add Package Levels Structure
-- Adds levels JSONB column to products table for level-based content organization
-- Supports Level 1, 2, 3 structure with Implementation Plans, Platform Guides, Creative Frameworks, and Templates

-- Add levels column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS levels JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the levels structure
COMMENT ON COLUMN products.levels IS 'Level-based content structure for packages. Format: { "level1": { "level": 1, "timeInvestment": "2-3 Weeks", "expectedProfit": "$500-$1,500/month", "platformCosts": "$0-50/month", "implementationPlan": {...}, "platformGuides": [...], "creativeFrameworks": [...], "templates": [...] }, ... }';

-- Create index on levels for efficient querying
CREATE INDEX IF NOT EXISTS idx_products_levels ON products USING GIN (levels);

-- Add check constraint to ensure levels structure is valid (optional, can be removed if too restrictive)
-- This ensures that if levels exist, they have the expected structure
-- Note: We keep this lenient to allow gradual migration

-- Update existing packages to have empty levels structure (they will be populated later)
-- This ensures backward compatibility - old structure (modules/resources) still works
UPDATE products 
SET levels = '{}'::jsonb
WHERE product_type = 'package' AND (levels IS NULL OR levels = '{}'::jsonb);

-- Add helpful comment about migration strategy
COMMENT ON TABLE products IS 'Products table. The levels column stores level-based content (Level 1, 2, 3) for packages. Legacy modules and resources columns are maintained for backward compatibility during migration.';
