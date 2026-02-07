-- Migration: Sync profiles.email when auth.users.email changes
-- When a user updates their email in Supabase Auth (e.g. after email change verification),
-- keep the profiles table in sync. handle_new_user only runs on INSERT.

-- Function to update profiles.email when auth.users.email changes
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    UPDATE public.profiles
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync email on auth.users UPDATE
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_update_user();

-- One-time sync: fix any existing profiles where email diverged from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS DISTINCT FROM u.email;
