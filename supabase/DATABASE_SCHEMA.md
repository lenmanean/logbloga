# Database Schema Summary

This document summarizes all database tables, their structure, and configurations for LogBloga.

## Tables Overview

### 1. `products`
Digital product catalog table.

**Columns:**
- `id` (UUID, Primary Key)
- `name` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `description` (TEXT)
- `price` (INTEGER, NOT NULL) - in cents
- `image_url` (TEXT)
- `file_path` (TEXT) - Supabase Storage path
- `file_size` (INTEGER)
- `category` (TEXT)
- `featured` (BOOLEAN, DEFAULT false)
- `published` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_products_slug` - Unique index on slug
- `idx_products_published` - Index on published status
- `idx_products_featured` - Index on featured status
- `idx_products_category` - Partial index on category (where not null)

**RLS Policies:**
- Public SELECT policy: Only published products are visible

**Triggers:**
- `update_products_updated_at` - Automatically updates `updated_at` on row update

---

### 2. `orders`
Customer order records.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, NOT NULL, FK to auth.users)
- `stripe_session_id` (TEXT, UNIQUE)
- `total_amount` (INTEGER, NOT NULL) - in cents
- `status` (TEXT, DEFAULT 'pending') - CHECK constraint: 'pending', 'completed', 'failed'
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_orders_user_id` - Index on user_id for user queries
- `idx_orders_stripe_session` - Unique index on stripe_session_id
- `idx_orders_status` - Index on status

**RLS Policies:**
- SELECT policy: Users can only read their own orders

**Relationships:**
- Foreign key to `auth.users(id)` with CASCADE delete
- Has many `order_items`

---

### 3. `order_items`
Individual items within orders with download access.

**Columns:**
- `id` (UUID, Primary Key)
- `order_id` (UUID, NOT NULL, FK to orders)
- `product_id` (UUID, NOT NULL, FK to products)
- `price` (INTEGER, NOT NULL) - price at time of purchase in cents
- `download_key` (UUID, UNIQUE, DEFAULT gen_random_uuid())
- `downloads_count` (INTEGER, DEFAULT 0)
- `expires_at` (TIMESTAMPTZ, DEFAULT NOW() + 30 days)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_order_items_order_id` - Index on order_id
- `idx_order_items_download_key` - Unique index on download_key
- `idx_order_items_expires_at` - Index on expiration date

**RLS Policies:**
- SELECT policy: Users can only read order_items from their own orders

**Relationships:**
- Foreign key to `orders(id)` with CASCADE delete
- Foreign key to `products(id)`

---

### 4. `blog_posts`
Blog post metadata (content stored in MDX files).

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `excerpt` (TEXT)
- `mdx_file_path` (TEXT, NOT NULL)
- `featured_image` (TEXT)
- `author` (TEXT, DEFAULT 'LogBloga Team')
- `published` (BOOLEAN, DEFAULT false)
- `published_at` (TIMESTAMPTZ)
- `seo_title` (TEXT)
- `seo_description` (TEXT)
- `tags` (TEXT[], DEFAULT '{}')
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_blog_posts_slug` - Unique index on slug
- `idx_blog_posts_published` - Composite index on published and published_at (DESC)
- `idx_blog_posts_tags` - GIN index on tags array

**RLS Policies:**
- SELECT policy: Only published blog posts are visible

**Triggers:**
- `update_blog_posts_updated_at` - Automatically updates `updated_at` on row update

---

### 5. `download_logs`
Analytics and tracking for file downloads.

**Columns:**
- `id` (UUID, Primary Key)
- `order_item_id` (UUID, NOT NULL, FK to order_items)
- `ip_address` (INET)
- `user_agent` (TEXT)
- `downloaded_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_download_logs_order_item_id` - Index on order_item_id
- `idx_download_logs_downloaded_at` - Index on download timestamp

**RLS Policies:**
- No public policies - Admin/service role access only

**Relationships:**
- Foreign key to `order_items(id)` with CASCADE delete

---

## Storage Buckets

### 1. `digital-products` (Private)
- **Purpose:** Store downloadable product files
- **Public:** false
- **File Size Limit:** 50MB
- **Allowed MIME Types:** PDF, ZIP, RAR, and binary files
- **Access:** Private - only via API with signed URLs

### 2. `blog-images` (Public)
- **Purpose:** Store blog post images
- **Public:** true
- **File Size Limit:** 10MB
- **Allowed MIME Types:** JPEG, PNG, GIF, WebP, SVG
- **Access:** Public read, authenticated upload/update/delete

### 3. `product-images` (Public)
- **Purpose:** Store product thumbnail images
- **Public:** true
- **File Size Limit:** 10MB
- **Allowed MIME Types:** JPEG, PNG, GIF, WebP, SVG
- **Access:** Public read, authenticated upload/update/delete

---

## Helper Functions

### `update_updated_at_column()`
Automatically updates the `updated_at` timestamp on table updates.

**Used by:**
- `products` table trigger
- `blog_posts` table trigger

---

## Security Configuration

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- **products:** Public can only see published products
- **orders:** Users can only see their own orders
- **order_items:** Users can only see items from their own orders
- **blog_posts:** Public can only see published posts
- **download_logs:** No public access (admin only)

### Data Validation
- Order status uses CHECK constraint to ensure only valid values
- Foreign keys enforce referential integrity
- Unique constraints on slugs and download keys

---

## Verification Status

✅ All 5 tables created and verified
✅ All required columns present
✅ All indexes created
✅ All RLS policies configured
✅ All triggers and functions installed
✅ Storage buckets created
✅ Storage policies configured

**Last Verified:** Migration `20250101000003_verify_tables.sql`

