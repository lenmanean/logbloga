-- Ensure products.price is NUMERIC(10,2) for dollar amounts (e.g. 0.51).
-- Sync script and app expect dollars; integer column rejects decimal values.
ALTER TABLE products
  ALTER COLUMN price TYPE NUMERIC(10,2) USING price::numeric(10,2);
