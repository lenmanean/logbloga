-- Ensure orders amount columns are NUMERIC(10,2) for dollar amounts (e.g. 0.51).
-- updateOrderTotals and app expect decimals; integer columns reject values like "0.51".
ALTER TABLE orders
  ALTER COLUMN total_amount TYPE NUMERIC(10,2) USING total_amount::numeric(10,2),
  ALTER COLUMN subtotal TYPE NUMERIC(10,2) USING subtotal::numeric(10,2),
  ALTER COLUMN tax_amount TYPE NUMERIC(10,2) USING COALESCE(tax_amount, 0)::numeric(10,2),
  ALTER COLUMN discount_amount TYPE NUMERIC(10,2) USING COALESCE(discount_amount, 0)::numeric(10,2);
