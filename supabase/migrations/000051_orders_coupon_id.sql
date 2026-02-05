-- Add coupon_id to orders to track which Logbloga discount coupon was applied
-- (discount_amount is already stored; this enables reporting and support)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id);

CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON orders(coupon_id) WHERE coupon_id IS NOT NULL;

COMMENT ON COLUMN orders.coupon_id IS 'Logbloga discount coupon applied at checkout (FK to coupons.id)';
