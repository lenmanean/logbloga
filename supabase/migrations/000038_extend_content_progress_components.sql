-- Migration: Extend content_progress component types
-- Adds launch_marketing, troubleshooting, planning to supported components
-- For Web Apps package content expansion

-- Drop existing CHECK constraint (auto-named content_progress_component_check or inline)
ALTER TABLE content_progress
  DROP CONSTRAINT IF EXISTS content_progress_component_check;

-- Recreate with extended component list
ALTER TABLE content_progress
  ADD CONSTRAINT content_progress_component_check
  CHECK (component IN (
    'implementation_plan',
    'platform_guides',
    'creative_frameworks',
    'templates',
    'launch_marketing',
    'troubleshooting',
    'planning'
  ));

-- Update column comment
COMMENT ON COLUMN content_progress.component IS 'Component type: implementation_plan, platform_guides, creative_frameworks, templates, launch_marketing, troubleshooting, planning';
