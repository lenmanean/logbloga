-- Restore original_price for sellable packages so savings display correctly.
-- Values match the pre–test-pricing setup (000026 + 000041).
-- price is synced from Stripe via sync-display-prices-from-stripe.ts; this sets original_price only.

UPDATE products SET original_price = 1049.00 WHERE slug = 'web-apps';
UPDATE products SET original_price = 595.00  WHERE slug = 'social-media';
UPDATE products SET original_price = 1330.00 WHERE slug = 'agency';
UPDATE products SET original_price = 560.00  WHERE slug = 'freelancing';
UPDATE products SET original_price = 2288.00 WHERE slug = 'master-bundle';
