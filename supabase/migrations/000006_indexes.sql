-- Migration: Performance Indexes
-- Creates indexes for optimal query performance

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Licenses indexes
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_product_id ON licenses(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_order_id ON licenses(order_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- Product recommendations indexes
CREATE INDEX IF NOT EXISTS idx_product_recommendations_product_id ON product_recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_recommended_product_id ON product_recommendations(recommended_product_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_type ON product_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_active ON product_recommendations(active);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Coupons indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_from ON coupons(valid_from);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

