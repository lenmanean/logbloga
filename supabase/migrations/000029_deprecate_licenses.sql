-- Migration: Deprecate licenses table
-- Licenses are no longer created for new orders. Access is now determined by completed orders.
-- This table is kept for historical data access.

COMMENT ON TABLE licenses IS 'DEPRECATED: Licenses are no longer created. Access is now determined by completed orders. Table kept for historical data.';
