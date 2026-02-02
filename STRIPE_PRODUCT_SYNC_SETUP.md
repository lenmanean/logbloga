# Stripe Product Sync Setup

## ✅ What's Been Completed

1. **Database Migration** (`000019_stripe_product_ids.sql`)
   - Added `stripe_product_id` and `stripe_price_id` columns to the `products` table
   - Added indexes for faster lookups
   - Migration has been applied to your database

2. **Product Sync Script** (`scripts/sync-products-to-stripe.ts`)
   - Creates Stripe products and prices for all active database products
   - Automatically enables automatic tax calculation
   - Updates database with Stripe IDs
   - Includes error handling and progress reporting

3. **Checkout** (`app/api/stripe/create-checkout-session/route.ts`)
   - Uses **environment variables** for Stripe price IDs: `STRIPE_PRICE_AGENCY`, `STRIPE_PRICE_SOCIAL_MEDIA`, `STRIPE_PRICE_WEB_APPS`, `STRIPE_PRICE_FREELANCING`, `STRIPE_PRICE_MASTER_BUNDLE`. Each must be set to a Stripe Price ID (`price_xxx`). Checkout does **not** read `stripe_price_id` from the database.
   - **Automatic tax calculation is enabled** for all checkout sessions.

4. **Display price sync** (`scripts/sync-display-prices-from-stripe.ts`)
   - Syncs **from Stripe to DB**: reads the same `STRIPE_PRICE_*` env vars, fetches `unit_amount` from Stripe, updates `products.price` by slug so the UI (cart, checkout, product pages) reflects Stripe pricing. Run after changing a price in Stripe or setting a new env var.

5. **Package Scripts**
   - Added `npm run stripe:sync` command
   - Installed `tsx` and `dotenv` as dev dependencies

**Note:** Paid checkout requires the five `STRIPE_PRICE_*` env vars to be set (one per sellable product). Run `npm run stripe:sync` to create Stripe products/prices, then set each env var to the created price ID (the script prints the values). Run `npx tsx scripts/sync-display-prices-from-stripe.ts` so UI prices match Stripe.

## 🚀 Next Steps

### 1. Ensure Environment Variables Are Set

Make sure your `.env.local` file contains:

```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run the Product Sync

Once your environment variables are set, run:

```bash
npm run stripe:sync
```

This will:
- Fetch all active products from your database that don't have Stripe IDs
- Create a Stripe product and price for each one (with automatic tax enabled)
- Update your database with the Stripe **product** ID only (checkout uses env for price IDs)
- Print the new price ID for each product — set the corresponding `STRIPE_PRICE_*` env var (e.g. `STRIPE_PRICE_MASTER_BUNDLE=price_xxx`)

Then run the display-price sync so UI matches Stripe:

```bash
npx tsx scripts/sync-display-prices-from-stripe.ts
```

### 3. Verify in Stripe Dashboard

After running the sync:
1. Go to your Stripe Dashboard → Products
2. You should see all your products listed
3. Each product will have a price with automatic tax enabled

### 4. Complete Stripe Tax Setup

Based on your Stripe Dashboard, you still need to:
1. **Add tax registrations** - Register for tax collection in jurisdictions where you operate
2. **Configure tax on transactions** - Ensure products have correct tax behavior settings

The sync script already sets:
- `tax_code: 'txcd_10000000'` (General - Electronically Supplied Services)
- `tax_behavior: 'exclusive'` (Tax calculated automatically)

## 📋 How It Works

### Before Sync
- Checkout uses `price_data` to create products on-the-fly
- No automatic tax calculation
- Products not visible in Stripe Dashboard

### After Sync
- Checkout uses Stripe price IDs from **environment variables** (`STRIPE_PRICE_*` per slug)
- Automatic tax calculation enabled
- Products visible and manageable in Stripe Dashboard
- Display prices in UI come from `products.price`; keep them in sync with Stripe by running `sync-display-prices-from-stripe.ts`

### No Fallback
- Each sellable product must have its `STRIPE_PRICE_*` env var set to a valid `price_xxx`. If missing, checkout returns 400 with a clear message.

## 🔍 Troubleshooting

### Error: "STRIPE_SECRET_KEY is not configured"
- Make sure `STRIPE_SECRET_KEY` is set in `.env.local`
- Key should start with `sk_test_` or `sk_live_`

### Error: "NEXT_PUBLIC_SUPABASE_URL is not a valid URL"
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Should be a full URL like `https://xxxxx.supabase.co`
- No trailing slash

### Error: "SUPABASE_SERVICE_ROLE_KEY is not set"
- Get your service role key from Supabase Dashboard → Settings → API
- Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### Products Not Syncing
- Check that products are marked as `active: true` in your database
- Products with existing `stripe_product_id` will be skipped
- Check the console output for specific error messages

## 📝 Notes

- The sync script is idempotent - you can run it multiple times safely
- It only syncs products that don't already have Stripe IDs
- All products are created with automatic tax enabled
- General digital products tax code (`txcd_10000000`) is used by default

## 🎯 Benefits

✅ **Automatic Tax Calculation** - Stripe handles tax calculation automatically  
✅ **Better Product Management** - Products visible in Stripe Dashboard  
✅ **Faster Checkout** - Pre-created prices are faster than dynamic creation  
✅ **Tax Compliance** - Proper tax codes and behavior configured  
✅ **Scalability** - Easy to add new products and sync them
