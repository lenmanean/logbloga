-- Migration: Add AI Leverage Field to Package Levels Structure
-- Adds aiLeverage field to levels JSONB structure to document how AI tools are used at each level
-- and how they drive the stated revenue

-- Update comment on products.levels column to include aiLeverage field
COMMENT ON COLUMN products.levels IS 'Level-based content structure for packages. Format: { "level1": { "level": 1, "timeInvestment": "2-3 Weeks", "expectedProfit": "$500-$1,500/month", "platformCosts": "$0-50/month", "aiLeverage": "Comprehensive text description of AI tools used and how they drive revenue", "schedule": [...], "implementationPlan": {...}, "platformGuides": [...], "creativeFrameworks": [...], "templates": [...] }, ... }';

-- JSONB is flexible; application requires aiLeverage for all package levels (see migration 000033).
