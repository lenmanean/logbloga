-- Migration: Fix Function Search Path Security Issues
-- Sets search_path for all functions to prevent search path injection attacks

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_order_number TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT COUNT(*) INTO exists_check FROM orders WHERE order_number = new_order_number;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN new_order_number;
END;
$$;

-- Function to generate license keys
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
  char_pos INTEGER;
BEGIN
  FOR i IN 1..25 LOOP
    IF i > 1 AND (i - 1) % 5 = 0 THEN
      result := result || '-';
    END IF;
    char_pos := FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER;
    result := result || SUBSTR(chars, char_pos, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Function to update consents updated_at
CREATE OR REPLACE FUNCTION update_consents_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to update recently viewed on duplicate
CREATE OR REPLACE FUNCTION update_recently_viewed_on_duplicate()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- If entry exists, update viewed_at instead of inserting
  IF NEW.user_id IS NOT NULL THEN
    UPDATE recently_viewed_products
    SET viewed_at = NOW()
    WHERE user_id = NEW.user_id 
      AND product_id = NEW.product_id;
    
    -- If update affected a row, return NULL to prevent insert
    IF FOUND THEN
      RETURN NULL;
    END IF;
  ELSIF NEW.session_id IS NOT NULL THEN
    UPDATE recently_viewed_products
    SET viewed_at = NOW()
    WHERE session_id = NEW.session_id 
      AND product_id = NEW.product_id;
    
    -- If update affected a row, return NULL to prevent insert
    IF FOUND THEN
      RETURN NULL;
    END IF;
  END IF;
  
  -- If no existing entry, allow insert
  RETURN NEW;
END;
$$;

-- Function to update blog posts updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to set blog post published_at
CREATE OR REPLACE FUNCTION set_blog_post_published_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Set published_at when post is first published
  IF NEW.published = TRUE AND OLD.published = FALSE AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  -- Clear published_at when post is unpublished
  IF NEW.published = FALSE THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION generate_order_number() IS 'Generates unique order numbers. Has fixed search_path for security.';
COMMENT ON FUNCTION generate_license_key() IS 'Generates license keys. Has fixed search_path for security.';
COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to update updated_at timestamp. Has fixed search_path for security.';
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile when user signs up. Has fixed search_path for security.';
COMMENT ON FUNCTION update_consents_updated_at() IS 'Updates consents updated_at timestamp. Has fixed search_path for security.';
COMMENT ON FUNCTION update_recently_viewed_on_duplicate() IS 'Updates recently viewed products on duplicate. Has fixed search_path for security.';
COMMENT ON FUNCTION update_blog_posts_updated_at() IS 'Updates blog posts updated_at timestamp. Has fixed search_path for security.';
COMMENT ON FUNCTION set_blog_post_published_at() IS 'Sets blog post published_at timestamp. Has fixed search_path for security.';
