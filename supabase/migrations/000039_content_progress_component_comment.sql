-- Migration: Ensure content_progress.component column comment is up to date
-- Aligns with 000038 extended component list (all seven types).
-- Idempotent; safe to run even if 000038 already updated the comment.

COMMENT ON COLUMN content_progress.component IS 'Component type: implementation_plan, platform_guides, creative_frameworks, templates, launch_marketing, troubleshooting, planning';
