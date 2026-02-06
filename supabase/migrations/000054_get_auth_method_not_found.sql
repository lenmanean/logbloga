-- Returns 'password' | 'otp' | 'not_found' for sign-in UI.
-- 'not_found': no user with that email (show error on submit).
-- 'password': user exists and has a password.
-- 'otp': user exists and has no password.
CREATE OR REPLACE FUNCTION public.get_auth_method(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  user_exists boolean;
  has_pw boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) INTO user_exists;
  IF NOT user_exists THEN
    RETURN 'not_found';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM auth.users
    WHERE email = user_email
      AND encrypted_password IS NOT NULL
      AND length(encrypted_password) > 0
  ) INTO has_pw;
  IF has_pw THEN
    RETURN 'password';
  ELSE
    RETURN 'otp';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'otp';
END;
$$;

COMMENT ON FUNCTION public.get_auth_method(text) IS 'Returns auth method for email: password, otp, or not_found. Used by sign-in UI.';
