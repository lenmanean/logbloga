-- Verification script to ensure all required tables exist
-- This migration will fail if any tables are missing, ensuring completeness

DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Verify products table exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'products';
    
    IF table_count = 0 THEN
        RAISE EXCEPTION 'products table does not exist';
    END IF;

    -- Verify orders table exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders';
    
    IF table_count = 0 THEN
        RAISE EXCEPTION 'orders table does not exist';
    END IF;

    -- Verify order_items table exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'order_items';
    
    IF table_count = 0 THEN
        RAISE EXCEPTION 'order_items table does not exist';
    END IF;

    -- Verify blog_posts table exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'blog_posts';
    
    IF table_count = 0 THEN
        RAISE EXCEPTION 'blog_posts table does not exist';
    END IF;

    -- Verify download_logs table exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'download_logs';
    
    IF table_count = 0 THEN
        RAISE EXCEPTION 'download_logs table does not exist';
    END IF;

    -- Verify all required columns exist in products table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'products'
        AND column_name IN ('id', 'name', 'slug', 'price', 'published', 'featured')
    ) THEN
        RAISE EXCEPTION 'products table is missing required columns';
    END IF;

    -- Verify all required columns exist in orders table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders'
        AND column_name IN ('id', 'user_id', 'stripe_session_id', 'total_amount', 'status')
    ) THEN
        RAISE EXCEPTION 'orders table is missing required columns';
    END IF;

    -- Verify all required columns exist in order_items table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'order_items'
        AND column_name IN ('id', 'order_id', 'product_id', 'download_key', 'expires_at')
    ) THEN
        RAISE EXCEPTION 'order_items table is missing required columns';
    END IF;

    -- Verify all required columns exist in blog_posts table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'blog_posts'
        AND column_name IN ('id', 'title', 'slug', 'mdx_file_path', 'published', 'tags')
    ) THEN
        RAISE EXCEPTION 'blog_posts table is missing required columns';
    END IF;

    -- Verify RLS is enabled on all tables
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'products'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on products table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'orders'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on orders table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'order_items'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on order_items table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'blog_posts'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on blog_posts table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'download_logs'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on download_logs table';
    END IF;

    -- Verify update_updated_at_column function exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column'
    ) THEN
        RAISE EXCEPTION 'update_updated_at_column function does not exist';
    END IF;

    RAISE NOTICE 'All tables, columns, RLS policies, and functions are properly configured!';
END $$;

