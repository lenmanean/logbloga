# Scripts

## Stripe Product Sync

### `sync-products-to-stripe.ts`

Syncs products from your database to Stripe, creating Stripe products and prices for all active products that don't already have Stripe IDs.

**Prerequisites:**
1. Run the database migration to add `stripe_product_id` and `stripe_price_id` fields:
   ```bash
   npm run db:migrate
   ```

2. Ensure environment variables are set:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**Usage:**
```bash
npm run stripe:sync
```

**What it does:**
- Fetches all active products from your database that don't have Stripe IDs
- Creates a Stripe product for each database product
- Creates a Stripe price for each product (with automatic tax enabled)
- Updates the database with the Stripe product and price IDs
- Provides a summary of successful syncs and any errors

**Features:**
- ✅ Creates Stripe products with metadata linking to database products
- ✅ Enables automatic tax calculation (tax_code: `txcd_10301001` for digital products)
- ✅ Sets tax behavior to `exclusive` (tax calculated automatically)
- ✅ Skips products that already have Stripe IDs
- ✅ Provides detailed logging and error handling

**After running:**
Once products are synced, your checkout will automatically:
- Use pre-created Stripe prices (faster checkout)
- Enable automatic tax calculation
- Provide better product management in Stripe Dashboard
