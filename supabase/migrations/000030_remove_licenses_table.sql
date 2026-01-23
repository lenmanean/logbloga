-- Migration: Remove Licenses Table and Related Objects
-- Removes all license-related database objects since licenses are no longer used
-- Access is now determined by completed orders only

-- ============================================================================
-- DROP TRIGGERS
-- ============================================================================

-- Drop trigger on licenses table
DROP TRIGGER IF EXISTS update_licenses_updated_at ON licenses;

-- ============================================================================
-- DROP ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Drop RLS policies on licenses table
DROP POLICY IF EXISTS "Users can view own licenses" ON licenses;
DROP POLICY IF EXISTS "Users can update own licenses" ON licenses;

-- ============================================================================
-- DROP INDEXES
-- ============================================================================

-- Drop indexes from migration 000006_indexes.sql
DROP INDEX IF EXISTS idx_licenses_user_id;
DROP INDEX IF EXISTS idx_licenses_product_id;
DROP INDEX IF EXISTS idx_licenses_license_key;
DROP INDEX IF EXISTS idx_licenses_order_id;
DROP INDEX IF EXISTS idx_licenses_status;

-- Drop composite indexes from migration 000015_performance_indexes.sql
DROP INDEX IF EXISTS idx_licenses_user_status;
DROP INDEX IF EXISTS idx_licenses_product_status;

-- ============================================================================
-- DROP FUNCTION
-- ============================================================================

-- Drop the generate_license_key() function
-- This function was created in 000005 and replaced in 000025
DROP FUNCTION IF EXISTS generate_license_key();

-- ============================================================================
-- UPDATE NOTIFICATIONS TABLE
-- ============================================================================

-- Remove 'license_delivered' from notifications type CHECK constraint
-- Since no licenses exist, this type is no longer needed
-- Note: Existing notifications with this type will remain, but new ones cannot be created
ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
  ADD CONSTRAINT notifications_type_check 
  CHECK (type IN (
    'order_confirmation',
    'order_status_update',
    'payment_received',
    'product_update',
    'system'
  ));

-- Update the comment on the type column
COMMENT ON COLUMN notifications.type IS 'Type of notification: order_confirmation, order_status_update, payment_received, product_update, system';

-- ============================================================================
-- DROP TABLE
-- ============================================================================

-- Drop the licenses table
-- Foreign keys are ON DELETE CASCADE, so this is safe
DROP TABLE IF EXISTS licenses CASCADE;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify licenses table is dropped
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'licenses') THEN
    RAISE EXCEPTION 'Licenses table still exists after drop attempt';
  ELSE
    RAISE NOTICE 'Licenses table successfully removed';
  END IF;
END $$;
