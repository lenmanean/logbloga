-- Migration: Admin Roles
-- Adds role field to profiles table for role-based access control (RBAC)
-- Supports 'user' (default) and 'admin' roles

-- ============================================================================
-- ADD ROLE COLUMN TO PROFILES
-- ============================================================================

-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN role TEXT DEFAULT 'user' NOT NULL 
    CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Create index on role for performance (admin queries)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE role = 'admin';

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN profiles.role IS 'User role: user (default) or admin (full access)';

