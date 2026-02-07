-- Returns 'password' | 'otp' | 'not_found'.
-- Uses raw_user_meta_data to distinguish OTP users (Supabase may set encrypted_password)
-- from users who explicitly set a password.
CREATE OR REPLACE FUNCTION public.get_auth_method(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  rec RECORD;
BEGIN
  SELECT
    raw_user_meta_data->>'has_set_password' AS has_set,
    raw_user_meta_data->>'signup_method' AS signup_method,
    (encrypted_password IS NOT NULL AND length(encrypted_password) > 0) AS has_encrypted
  INTO rec
  FROM auth.users
  WHERE email = user_email;

  IF NOT FOUND THEN
    RETURN 'not_found';
  END IF;

  IF rec.has_set = 'true' THEN
    RETURN 'password';
  END IF;

  IF rec.signup_method = 'otp' THEN
    RETURN 'otp';
  END IF;

  IF rec.has_encrypted THEN
    RETURN 'password';
  END IF;

  RETURN 'otp';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'otp';
END;
$$;

COMMENT ON FUNCTION public.get_auth_method(text) IS 'Returns password, otp, or not_found. Uses metadata (has_set_password, signup_method) to handle OTP users with auto-set encrypted_password.';
