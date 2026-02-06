-- Restore production prices for sellable packages (removes legacy $0.01 test pricing).
-- Display prices are the source of truth from Stripe; run sync-display-prices-from-stripe.ts
-- after deploy. These values match canonical production pricing (000026 + 000041).

UPDATE products SET price = 697.00 WHERE slug = 'web-apps';
UPDATE products SET price = 397.00 WHERE slug = 'social-media';
UPDATE products SET price = 797.00 WHERE slug = 'agency';
UPDATE products SET price = 397.00 WHERE slug = 'freelancing';
UPDATE products SET price = 1897.00 WHERE slug = 'master-bundle';
