-- Returns 'password' if a user exists for the email and has a password set, else 'otp'.
-- Used by sign-in UI to show password field or "Send one-time code" without user enumeration.
-- Unknown emails return 'otp'.
CREATE OR REPLACE FUNCTION public.get_auth_method(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  has_pw boolean;
BEGIN
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

COMMENT ON FUNCTION public.get_auth_method(text) IS 'Returns auth method for email: password or otp. Used by sign-in UI; unknown emails return otp.';
