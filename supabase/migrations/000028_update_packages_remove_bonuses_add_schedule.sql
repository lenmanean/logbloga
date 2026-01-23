-- Migration: Update Packages - Remove Bonuses and Add Schedule/Timeline to Levels
-- Removes bonus_assets from packages and adds trackable schedule/timeline to levels structure

-- First, remove bonus_assets from all package products
UPDATE products
SET bonus_assets = '[]'::jsonb
WHERE slug IN ('web-apps', 'social-media', 'agency', 'freelancing');

-- Add schedule/timeline structure to levels for each package
-- The schedule will be an array of timeline items with dates, milestones, and tasks

-- Web Apps Package - Add levels with schedule
UPDATE products
SET levels = jsonb_build_object(
  'level1', jsonb_build_object(
    'level', 1,
    'timeInvestment', '2-3 Weeks',
    'expectedProfit', '$500-$1,500/month',
    'platformCosts', '$0-50/month',
    'schedule', '[]'::jsonb, -- Will be populated with trackable timeline
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level2', jsonb_build_object(
    'level', 2,
    'timeInvestment', '4-6 Weeks',
    'expectedProfit', '$1,500-$5,000/month',
    'platformCosts', '$50-200/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level3', jsonb_build_object(
    'level', 3,
    'timeInvestment', '8-12 Weeks',
    'expectedProfit', '$5,000-$15,000+/month',
    'platformCosts', '$200-500/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  )
)
WHERE slug = 'web-apps'
  AND (levels IS NULL OR levels = '{}'::jsonb);

-- Social Media Package - Add levels with schedule
UPDATE products
SET levels = jsonb_build_object(
  'level1', jsonb_build_object(
    'level', 1,
    'timeInvestment', '2-3 Weeks',
    'expectedProfit', '$300-$1,000/month',
    'platformCosts', '$0-30/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level2', jsonb_build_object(
    'level', 2,
    'timeInvestment', '4-6 Weeks',
    'expectedProfit', '$1,000-$3,000/month',
    'platformCosts', '$30-100/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level3', jsonb_build_object(
    'level', 3,
    'timeInvestment', '8-12 Weeks',
    'expectedProfit', '$3,000-$10,000+/month',
    'platformCosts', '$100-300/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  )
)
WHERE slug = 'social-media'
  AND (levels IS NULL OR levels = '{}'::jsonb);

-- Agency Package - Add levels with schedule
UPDATE products
SET levels = jsonb_build_object(
  'level1', jsonb_build_object(
    'level', 1,
    'timeInvestment', '3-4 Weeks',
    'expectedProfit', '$2,000-$5,000/month',
    'platformCosts', '$100-300/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level2', jsonb_build_object(
    'level', 2,
    'timeInvestment', '6-8 Weeks',
    'expectedProfit', '$5,000-$15,000/month',
    'platformCosts', '$300-800/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level3', jsonb_build_object(
    'level', 3,
    'timeInvestment', '12-16 Weeks',
    'expectedProfit', '$15,000-$50,000+/month',
    'platformCosts', '$800-2,000/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  )
)
WHERE slug = 'agency'
  AND (levels IS NULL OR levels = '{}'::jsonb);

-- Freelancing Package - Add levels with schedule
UPDATE products
SET levels = jsonb_build_object(
  'level1', jsonb_build_object(
    'level', 1,
    'timeInvestment', '1-2 Weeks',
    'expectedProfit', '$500-$1,500/month',
    'platformCosts', '$0-20/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level2', jsonb_build_object(
    'level', 2,
    'timeInvestment', '3-4 Weeks',
    'expectedProfit', '$1,500-$4,000/month',
    'platformCosts', '$20-50/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  ),
  'level3', jsonb_build_object(
    'level', 3,
    'timeInvestment', '6-8 Weeks',
    'expectedProfit', '$4,000-$10,000+/month',
    'platformCosts', '$50-150/month',
    'schedule', '[]'::jsonb,
    'implementationPlan', '{}'::jsonb,
    'platformGuides', '[]'::jsonb,
    'creativeFrameworks', '[]'::jsonb,
    'templates', '[]'::jsonb
  )
)
WHERE slug = 'freelancing'
  AND (levels IS NULL OR levels = '{}'::jsonb);

-- Verify updates
DO $$
DECLARE
  web_apps_bonus JSONB;
  social_media_bonus JSONB;
  agency_bonus JSONB;
  freelancing_bonus JSONB;
  web_apps_levels JSONB;
BEGIN
  SELECT bonus_assets INTO web_apps_bonus FROM products WHERE slug = 'web-apps';
  SELECT bonus_assets INTO social_media_bonus FROM products WHERE slug = 'social-media';
  SELECT bonus_assets INTO agency_bonus FROM products WHERE slug = 'agency';
  SELECT bonus_assets INTO freelancing_bonus FROM products WHERE slug = 'freelancing';
  SELECT levels INTO web_apps_levels FROM products WHERE slug = 'web-apps';
  
  RAISE NOTICE 'Web Apps bonus_assets cleared: %', web_apps_bonus;
  RAISE NOTICE 'Social Media bonus_assets cleared: %', social_media_bonus;
  RAISE NOTICE 'Agency bonus_assets cleared: %', agency_bonus;
  RAISE NOTICE 'Freelancing bonus_assets cleared: %', freelancing_bonus;
  RAISE NOTICE 'Web Apps levels structure added: %', web_apps_levels IS NOT NULL AND web_apps_levels != '{}'::jsonb;
END $$;

-- Add comment about schedule structure
COMMENT ON COLUMN products.levels IS 'Level-based content structure for packages. Each level includes: level (1-3), timeInvestment, expectedProfit, platformCosts, schedule (trackable timeline array), implementationPlan, platformGuides, creativeFrameworks, templates. Schedule format: [{"date": "YYYY-MM-DD", "milestone": "string", "tasks": ["task1", "task2"], "completed": false}]';
