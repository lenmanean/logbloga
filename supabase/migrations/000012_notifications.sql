-- Migration: Notifications Table
-- Creates notifications table for in-app notifications with real-time support

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'order_confirmation',
    'order_status_update',
    'license_delivered',
    'payment_received',
    'product_update',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user queries (most common)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Index for unread count queries
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read) WHERE read = FALSE;

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Index for type-based queries
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(user_id, type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Service role can insert notifications (for system notifications)
-- This allows server-side code to create notifications
-- Note: Service role bypasses RLS, but we add this for clarity
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON COLUMN notifications.type IS 'Type of notification: order_confirmation, order_status_update, license_delivered, payment_received, product_update, system';
COMMENT ON COLUMN notifications.metadata IS 'Additional data for the notification (JSON)';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read by the user';

-- ============================================================================
-- ENABLE REALTIME
-- ============================================================================

-- Enable Realtime for notifications table
-- This allows clients to subscribe to new notifications
-- Note: Realtime is enabled via Supabase Dashboard, but we document it here
-- To enable: Go to Supabase Dashboard > Database > Replication > Enable for notifications table
