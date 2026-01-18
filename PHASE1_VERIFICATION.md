# Phase 1: Database Infrastructure - Verification Checklist

This document provides a step-by-step verification process for Phase 1 implementation.

## Prerequisites

- ✅ Supabase project created and configured
- ✅ Environment variables set in `.env.local` (from `.env.local.example`)
- ✅ Supabase CLI installed (optional, for local development)

## Step 1: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `supabase/migrations/000001_initial_schema.sql`
   - `supabase/migrations/000002_enable_extensions.sql`
   - `supabase/migrations/000003_functions_and_triggers.sql`
   - `supabase/migrations/000004_rls_policies.sql`
   - `supabase/migrations/000005_indexes.sql`
   - `supabase/migrations/000006_seed_products.sql`

### Option B: Using Supabase CLI (For Local Development)

```bash
# Link to your project (one-time setup)
npx supabase link --project-ref your-project-ref

# Push all migrations
npx supabase db push
```

## Step 2: Verify Database Tables

### Check in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. Verify all tables exist:
   - ✅ `profiles`
   - ✅ `products`
   - ✅ `product_variants`
   - ✅ `cart_items`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `licenses`
   - ✅ `product_recommendations`
   - ✅ `coupons`
   - ✅ `reviews`

### Verify Table Structure

Run this SQL query in SQL Editor:

```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

## Step 3: Verify Row Level Security (RLS)

### Check RLS is Enabled

Run this SQL query:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should have `rowsecurity = true`.

### Check Policies Exist

```sql
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Expected policies:
- ✅ `profiles`: Users can view/update own profile
- ✅ `products`: Products viewable by everyone
- ✅ `cart_items`: Users can manage own cart
- ✅ `orders`: Users can view own orders
- ✅ `licenses`: Users can view own licenses
- ✅ `reviews`: Approved reviews viewable by everyone
- ✅ `coupons`: Active coupons viewable by everyone

## Step 4: Verify Database Functions

Run these SQL queries to test functions:

### Test Order Number Generation

```sql
SELECT generate_order_number();
-- Should return: ORD-YYYYMMDD-XXXXXX format
```

### Test License Key Generation

```sql
SELECT generate_license_key();
-- Should return: XXXX-XXXX-XXXX-XXXX-XXXX format
```

### Verify Triggers

Update a product to test the `updated_at` trigger:

```sql
UPDATE products 
SET title = 'Test Update' 
WHERE slug = 'web-apps';
SELECT updated_at FROM products WHERE slug = 'web-apps';
-- updated_at should be recent
```

## Step 5: Verify Seed Data

### Check Products Were Inserted

```sql
SELECT 
  slug,
  title,
  category,
  price,
  featured
FROM products
ORDER BY created_at;
```

Expected results:
- ✅ 4 package products (web-apps, social-media, agency, freelancing)
- ✅ 12 sample products
- ✅ Total: 16 products

### Verify Package Products Have All Fields

```sql
SELECT 
  slug,
  title,
  modules,
  resources,
  bonus_assets,
  pricing_justification
FROM products
WHERE slug IN ('web-apps', 'social-media', 'agency', 'freelancing');
```

All package products should have:
- ✅ Non-null `modules` (JSONB array)
- ✅ Non-null `resources` (JSONB array)
- ✅ Non-null `bonus_assets` (JSONB array)
- ✅ Non-null `pricing_justification`

## Step 6: Verify Indexes

Check indexes were created:

```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Expected indexes:
- ✅ `idx_products_slug`
- ✅ `idx_products_category`
- ✅ `idx_cart_items_user_id`
- ✅ `idx_orders_user_id`
- ✅ `idx_licenses_user_id`
- And many more...

## Step 7: Verify Application Connection

### Check Environment Variables

Ensure `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Test Database Queries

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit these pages and verify they load:
   - `/ai-to-usd/packages/web-apps`
   - `/ai-to-usd/packages/social-media`
   - `/ai-to-usd/packages/agency`
   - `/ai-to-usd/packages/freelancing`
   - `/ai-to-usd/web-apps` (category page)

3. Check browser console for errors

### Test Product Queries

Create a test route to verify database queries work:

```typescript
// app/test-db/route.ts (temporary test file)
import { getAllProducts, getProductBySlug } from '@/lib/db/products';

export async function GET() {
  try {
    const products = await getAllProducts();
    const webApps = await getProductBySlug('web-apps');
    return Response.json({ 
      success: true, 
      productCount: products.length,
      webAppsPackage: webApps ? 'Found' : 'Not found'
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
```

Visit `/test-db` and verify it returns:
```json
{
  "success": true,
  "productCount": 16,
  "webAppsPackage": "Found"
}
```

## Step 8: Verify Type Safety

### Generate Types (After Migrations)

```bash
# If using Supabase CLI locally
npm run db:types

# OR manually from Supabase dashboard
# Copy generated types from Supabase dashboard > Settings > API > TypeScript types
```

### Verify Type Imports Work

Check that these imports work without TypeScript errors:

```typescript
import type { Product, Profile, Order } from '@/lib/types/database';
import type { Database } from '@/lib/types/supabase';
```

## Step 9: Performance Verification

### Query Performance

Run these queries and verify they complete quickly (< 200ms):

```sql
-- Simple product query
EXPLAIN ANALYZE
SELECT * FROM products WHERE slug = 'web-apps';

-- Category filter
EXPLAIN ANALYZE
SELECT * FROM products WHERE category = 'web-apps' AND active = true;

-- Featured products
EXPLAIN ANALYZE
SELECT * FROM products WHERE featured = true AND active = true;
```

## Step 10: Security Verification

### Verify RLS Blocks Unauthorized Access

1. Test with anonymous (unauthenticated) user:
   - Should be able to read products ✅
   - Should NOT be able to read other users' cart items ✅
   - Should NOT be able to read other users' orders ✅

2. Test with authenticated user:
   - Should be able to read own profile ✅
   - Should be able to manage own cart ✅
   - Should be able to read own orders ✅

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check for syntax errors in SQL files
   - Ensure migrations run in order
   - Verify extensions are enabled first

2. **RLS Blocking Queries**
   - Check policies are correctly defined
   - Verify user authentication state
   - Check policy conditions match your use case

3. **Type Generation Issues**
   - Ensure migrations completed successfully
   - Regenerate types after schema changes
   - Check Supabase CLI is up to date

4. **Connection Issues**
   - Verify environment variables are set correctly
   - Check Supabase project is active
   - Verify network connectivity

## Next Steps

After successful verification:

1. ✅ Remove test files (e.g., `app/test-db/route.ts` if created)
2. ✅ Update product counts in `lib/products.ts` categories array
3. ✅ Consider removing fallback data arrays after extended testing
4. ✅ Proceed to Phase 2: Authentication & User Management

## Success Criteria Summary

- ✅ All 11 tables created
- ✅ All RLS policies active and working
- ✅ All functions and triggers working
- ✅ Seed data inserted (16 products)
- ✅ Indexes created for performance
- ✅ Application queries database successfully
- ✅ TypeScript types generated and working
- ✅ No breaking changes to existing functionality
- ✅ Performance acceptable (< 200ms query time)

---

**Last Updated**: After Phase 1 Implementation
**Status**: Ready for Verification

