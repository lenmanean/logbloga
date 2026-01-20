-- Migration: Performance Optimization Indexes
-- Creates composite indexes for common query patterns to improve query performance

-- Products table composite indexes
-- Common query: Get active products by category (used in product listings)
CREATE INDEX IF NOT EXISTS idx_products_category_active 
ON products(category, active) 
WHERE active = true;

-- Common query: Get featured active products (used in homepage)
CREATE INDEX IF NOT EXISTS idx_products_featured_active 
ON products(featured, active, created_at DESC) 
WHERE featured = true AND active = true;

-- Common query: Search active products by title/description
CREATE INDEX IF NOT EXISTS idx_products_active_search 
ON products USING gin(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '')))
WHERE active = true;

-- Orders table composite indexes
-- Common query: Get user orders by status and date (used in order history)
CREATE INDEX IF NOT EXISTS idx_orders_user_status_created 
ON orders(user_id, status, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Common query: Get orders by status for admin (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders(status, created_at DESC);

-- Common query: Get orders by date range (analytics)
CREATE INDEX IF NOT EXISTS idx_orders_created_status 
ON orders(created_at DESC, status);

-- Order items table composite indexes
-- Common query: Get order items with product info (used in order details)
CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
ON order_items(order_id, product_id);

-- Licenses table composite indexes
-- Common query: Get active licenses by user (used in user account)
CREATE INDEX IF NOT EXISTS idx_licenses_user_status 
ON licenses(user_id, status, created_at DESC) 
WHERE status = 'active';

-- Common query: Get licenses by product and status
CREATE INDEX IF NOT EXISTS idx_licenses_product_status 
ON licenses(product_id, status) 
WHERE status = 'active';

-- Cart items table composite indexes
-- Common query: Get cart items by user (already has user_id index, but adding composite)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product 
ON cart_items(user_id, product_id, created_at DESC);

-- Reviews table composite indexes
-- Common query: Get approved reviews by product (used in product pages)
CREATE INDEX IF NOT EXISTS idx_reviews_product_status_rating 
ON reviews(product_id, status, rating DESC, created_at DESC) 
WHERE status = 'approved';

-- Common query: Get verified purchase reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_verified 
ON reviews(product_id, verified_purchase, created_at DESC) 
WHERE verified_purchase = true AND status = 'approved';

-- Wishlist table composite indexes (from customer portal migration)
-- Common query: Check if product is in user's wishlist
-- Already has user_id and product_id indexes, composite might help for join queries
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_product 
ON wishlist_items(user_id, product_id);

-- Saved addresses table composite indexes
-- Common query: Get default addresses by user and type
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_type_default 
ON saved_addresses(user_id, type, is_default_billing, is_default_shipping);

-- Notifications table composite indexes (from notifications migration)
-- Common query: Get unread notifications by user and type
-- Already has composite index, but adding for specific patterns
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_type 
ON notifications(user_id, read, type, created_at DESC) 
WHERE read = false;

-- Product recommendations table composite indexes
-- Common query: Get active recommendations by product and type
CREATE INDEX IF NOT EXISTS idx_product_recommendations_product_type_active 
ON product_recommendations(product_id, recommendation_type, active, priority DESC) 
WHERE active = true;

-- Coupons table composite indexes
-- Common query: Get active valid coupons by code
CREATE INDEX IF NOT EXISTS idx_coupons_code_active_valid 
ON coupons(code, active, valid_from, valid_until) 
WHERE active = true;

-- Comments and notes
COMMENT ON INDEX idx_products_category_active IS 'Optimizes queries for active products filtered by category';
COMMENT ON INDEX idx_products_featured_active IS 'Optimizes queries for featured active products on homepage';
COMMENT ON INDEX idx_orders_user_status_created IS 'Optimizes user order history queries by status and date';
COMMENT ON INDEX idx_orders_status_created IS 'Optimizes admin order queries by status and date';
COMMENT ON INDEX idx_licenses_user_status IS 'Optimizes user active license queries';
COMMENT ON INDEX idx_reviews_product_status_rating IS 'Optimizes product review display queries';
