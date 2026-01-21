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

3. **Checkout Updates** (`app/api/stripe/create-checkout-session/route.ts`)
   - Updated to use pre-created Stripe prices when available
   - Falls back to `price_data` for products without Stripe IDs
   - **Automatic tax calculation is now enabled** for all checkout sessions

4. **Package Scripts**
   - Added `npm run stripe:sync` command
   - Installed `tsx` and `dotenv` as dev dependencies

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
- Create a Stripe product for each one
- Create a Stripe price with automatic tax enabled
- Update your database with the Stripe product and price IDs

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
- `tax_code: 'txcd_10301001'` (Digital products)
- `tax_behavior: 'exclusive'` (Tax calculated automatically)

## 📋 How It Works

### Before Sync
- Checkout uses `price_data` to create products on-the-fly
- No automatic tax calculation
- Products not visible in Stripe Dashboard

### After Sync
- Checkout uses pre-created Stripe price IDs
- Automatic tax calculation enabled
- Products visible and manageable in Stripe Dashboard
- Faster checkout (no need to create products during checkout)

### Fallback Behavior
- If a product doesn't have a Stripe price ID, checkout falls back to `price_data`
- Automatic tax is still enabled even for fallback products

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
- Digital products tax code (`txcd_10301001`) is used by default

## 🎯 Benefits

✅ **Automatic Tax Calculation** - Stripe handles tax calculation automatically  
✅ **Better Product Management** - Products visible in Stripe Dashboard  
✅ **Faster Checkout** - Pre-created prices are faster than dynamic creation  
✅ **Tax Compliance** - Proper tax codes and behavior configured  
✅ **Scalability** - Easy to add new products and sync them
