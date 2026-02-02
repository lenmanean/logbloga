-- Update stripe_price_id column comment: checkout uses STRIPE_PRICE_* env vars, not this column.
-- This column remains for reference/reporting; display prices come from products.price (synced via sync-display-prices-from-stripe.ts).
COMMENT ON COLUMN products.stripe_price_id IS 'Stripe Price ID (reference only). Checkout uses STRIPE_PRICE_* env vars per slug; display uses products.price.';
