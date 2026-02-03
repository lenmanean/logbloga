-- Ensure order_items price columns are NUMERIC(10,2) for dollar amounts (e.g. 0.51).
-- createOrderWithItems inserts decimal values; integer columns reject "0.51".
ALTER TABLE order_items
  ALTER COLUMN unit_price TYPE NUMERIC(10,2) USING unit_price::numeric(10,2),
  ALTER COLUMN total_price TYPE NUMERIC(10,2) USING total_price::numeric(10,2);

-- If a legacy "price" column exists as integer, convert it too.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'price'
  ) THEN
    EXECUTE 'ALTER TABLE order_items ALTER COLUMN price TYPE NUMERIC(10,2) USING price::numeric(10,2)';
  END IF;
END $$;
