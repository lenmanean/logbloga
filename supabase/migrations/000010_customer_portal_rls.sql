-- Migration: Customer Portal RLS Policies
-- Adds Row Level Security policies for wishlist_items, saved_addresses, and notification_preferences

-- ============================================================================
-- WISHLIST ITEMS RLS
-- ============================================================================

-- Enable RLS on wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist items
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own wishlist items
CREATE POLICY "Users can insert their own wishlist items"
  ON wishlist_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own wishlist items
CREATE POLICY "Users can delete their own wishlist items"
  ON wishlist_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED ADDRESSES RLS
-- ============================================================================

-- Enable RLS on saved_addresses
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own addresses
CREATE POLICY "Users can view their own addresses"
  ON saved_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own addresses
CREATE POLICY "Users can insert their own addresses"
  ON saved_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own addresses
CREATE POLICY "Users can update their own addresses"
  ON saved_addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own addresses
CREATE POLICY "Users can delete their own addresses"
  ON saved_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATION PREFERENCES RLS
-- ============================================================================

-- Enable RLS on notification_preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notification preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own notification preferences
CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notification preferences
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

