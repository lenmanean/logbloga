-- Migration: Reviews reviewer_display_name and product aggregate sync
-- Adds reviewer_display_name to reviews; keeps products.rating and products.review_count in sync via trigger.

-- Add reviewer_display_name (name shown with the review, user input)
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS reviewer_display_name TEXT;

COMMENT ON COLUMN reviews.reviewer_display_name IS 'Display name shown with the review (user-provided, optional)';

-- Function: recompute and set products.rating and products.review_count for a product from approved reviews
CREATE OR REPLACE FUNCTION sync_product_review_aggregates(p_product_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg_rating DECIMAL(3,2);
  v_count INTEGER;
BEGIN
  SELECT
    COALESCE(AVG(rating)::DECIMAL(3,2), 0),
    COUNT(*)::INTEGER
  INTO v_avg_rating, v_count
  FROM reviews
  WHERE product_id = p_product_id
    AND status = 'approved';

  UPDATE products
  SET
    rating = CASE WHEN v_count > 0 THEN v_avg_rating ELSE NULL END,
    review_count = COALESCE(v_count, 0),
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$;

COMMENT ON FUNCTION sync_product_review_aggregates(UUID) IS 'Updates products.rating and products.review_count from approved reviews for the given product_id';

-- Trigger function: after INSERT/UPDATE/DELETE on reviews, sync affected product(s)
CREATE OR REPLACE FUNCTION trigger_sync_reviews_to_product()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM sync_product_review_aggregates(NEW.product_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM sync_product_review_aggregates(NEW.product_id);
    IF OLD.product_id IS DISTINCT FROM NEW.product_id THEN
      PERFORM sync_product_review_aggregates(OLD.product_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM sync_product_review_aggregates(OLD.product_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_reviews_to_product_trigger ON reviews;
CREATE TRIGGER sync_reviews_to_product_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_reviews_to_product();

-- Backfill: sync all products that have reviews (so existing data is consistent)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT DISTINCT product_id FROM reviews)
  LOOP
    PERFORM sync_product_review_aggregates(r.product_id);
  END LOOP;
END;
$$;
