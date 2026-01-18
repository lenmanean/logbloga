-- Check what tables exist in the database
-- Run this in Supabase Dashboard > SQL Editor

SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if our new tables exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN 'profiles EXISTS'
    ELSE 'profiles MISSING'
  END as profiles_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') THEN 'cart_items EXISTS'
    ELSE 'cart_items MISSING'
  END as cart_items_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'licenses') THEN 'licenses EXISTS'
    ELSE 'licenses MISSING'
  END as licenses_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants') THEN 'product_variants EXISTS'
    ELSE 'product_variants MISSING'
  END as product_variants_status;

