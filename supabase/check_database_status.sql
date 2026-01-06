-- Database Status Check Query
-- Run this in Supabase SQL Editor to see current database status

-- Check all tables exist
SELECT 
    'Tables' AS category,
    COUNT(*) AS count,
    STRING_AGG(table_name, ', ' ORDER BY table_name) AS items
FROM information_schema.tables
WHERE table_schema = 'public' 
    AND table_name IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs');

-- Check RLS status
SELECT 
    'RLS Enabled' AS category,
    COUNT(*) AS count,
    STRING_AGG(tablename, ', ' ORDER BY tablename) AS items
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs')
    AND rowsecurity = true;

-- Check indexes
SELECT 
    'Indexes' AS category,
    COUNT(*) AS count,
    STRING_AGG(indexname, ', ' ORDER BY indexname) AS items
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs');

-- Check RLS policies
SELECT 
    'RLS Policies' AS category,
    COUNT(*) AS count,
    STRING_AGG(policyname || ' (' || tablename || ')', ', ' ORDER BY tablename, policyname) AS items
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs');

-- Check storage buckets
SELECT 
    'Storage Buckets' AS category,
    COUNT(*) AS count,
    STRING_AGG(name || ' (' || CASE WHEN public THEN 'public' ELSE 'private' END || ')', ', ' ORDER BY name) AS items
FROM storage.buckets
WHERE name IN ('digital-products', 'blog-images', 'product-images');

-- Check triggers
SELECT 
    'Triggers' AS category,
    COUNT(*) AS count,
    STRING_AGG(tgname || ' (' || tgrelid::regclass::text || ')', ', ' ORDER BY tgrelid::regclass::text, tgname) AS items
FROM pg_trigger
WHERE tgrelid IN (
    SELECT oid FROM pg_class 
    WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND relname IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs')
)
AND tgname NOT LIKE 'RI_%'
AND tgisinternal = false;

-- Check functions
SELECT 
    'Functions' AS category,
    COUNT(*) AS count,
    STRING_AGG(p.proname, ', ' ORDER BY p.proname) AS items
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname = 'update_updated_at_column';

-- Detailed table information
SELECT 
    table_name,
    COUNT(*) AS column_count,
    STRING_AGG(column_name, ', ' ORDER BY ordinal_position) AS columns
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('products', 'orders', 'order_items', 'blog_posts', 'download_logs')
GROUP BY table_name
ORDER BY table_name;

