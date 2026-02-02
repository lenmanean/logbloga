-- Set Master Bundle (and optionally other packages) display price so checkout shows correct total.
-- Checkout and cart read price from products table; Stripe charges use stripe_price_id.
-- Run this in Supabase SQL Editor if the script fails (e.g. column type mismatch).

-- If products.price is DECIMAL (dollars):
UPDATE products SET price = 0.51 WHERE slug = 'master-bundle';

-- If you use integer cents instead, uncomment and use:
-- UPDATE products SET price = 51 WHERE slug = 'master-bundle';
