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
# or
npx tsx scripts/sync-products-to-stripe.ts
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

---

## Stripe Price Updates

### `update-stripe-prices.ts`

Updates Stripe prices for products that have changed in the database. Since Stripe doesn't allow editing prices, this script creates new prices and archives old ones.

**Prerequisites:**
1. Products must already have Stripe IDs (run `sync-products-to-stripe.ts` first if needed)
2. Same environment variables as sync script

**Usage:**
```bash
# Preview changes without making updates
npx tsx scripts/update-stripe-prices.ts --dry-run

# Apply updates
npx tsx scripts/update-stripe-prices.ts
```

**What it does:**
- Fetches all active products with existing Stripe IDs
- Compares database prices with current Stripe prices
- Creates new Stripe prices for products with price changes
- Archives old Stripe prices (sets `active: false`)
- Updates database with new `stripe_price_id`
- Handles both packages and individual products

**Features:**
- ✅ Dry-run mode to preview changes
- ✅ Batch processing with error handling
- ✅ Detailed logging of all price updates
- ✅ Validation that new prices match database
- ✅ Automatically archives old prices
- ✅ Skips products with no price changes

**When to use:**
- After running database migrations that update product prices
- When manually updating prices in the database
- To sync price changes from database to Stripe

**Example output:**
```
🚀 Starting Stripe price update...

✓ Stripe client initialized
✓ Supabase client initialized

Checking 4 product(s) for price updates...

Found 4 product(s) with price changes:

  Web Apps Package (web-apps)
    Old: $1997.00 → New: $697.00 (-$1300.00)
  Social Media Package (social-media)
    Old: $997.00 → New: $397.00 (-$600.00)
  Agency Package (agency)
    Old: $2997.00 → New: $797.00 (-$2200.00)
  Freelancing Package (freelancing)
    Old: $497.00 → New: $397.00 (-$100.00)

Updating: Web Apps Package (web-apps)
  Creating new Stripe price for: Web Apps Package
  ✓ Created new Stripe price: price_xxx ($697.00)
  ✓ Archived old Stripe price: price_yyy
  ✓ Updated database with new Stripe price ID
✅ Successfully updated: Web Apps Package
```

---

## Stripe CLI Commands

Useful Stripe CLI commands for manual verification and troubleshooting:

### List All Prices
```bash
stripe prices list
```

### List Prices for Specific Product
```bash
# First, get the product ID from your database or Stripe Dashboard
stripe prices list --product prod_xxxxx
```

### Check Specific Price Details
```bash
stripe prices retrieve price_xxxxx
```

### Archive a Price (Manual)
```bash
stripe prices update price_xxxxx --active=false
```

### Create New Price (Manual Backup)
```bash
stripe prices create \
  --product=prod_xxxxx \
  --unit-amount=69700 \
  --currency=usd \
  --tax-behavior=exclusive
```

### List Products
```bash
stripe products list
```

### Check Product Details
```bash
stripe products retrieve prod_xxxxx
```

**Note:** The `update-stripe-prices.ts` script handles price updates automatically. Use CLI commands primarily for verification and troubleshooting.

---

## Cache Revalidation

### `revalidate-package-pages.ts`

Revalidates package pages and clears product cache to ensure UI reflects updated pricing immediately after database changes.

**Prerequisites:**
1. Database prices should already be updated
2. Environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `REVALIDATE_SECRET` - Secret token for revalidation API (optional, for production)
   - `NEXT_PUBLIC_APP_URL` - Your app URL (defaults to http://localhost:3000)

**Usage:**
```bash
npx tsx scripts/revalidate-package-pages.ts
```

**What it does:**
- Clears Redis cache for products tag
- Revalidates all package pages (`/ai-to-usd/packages/*`)
- Revalidates packages listing page (`/ai-to-usd`)
- Revalidates products cache tag

**When to use:**
- After running database migrations that update product prices
- After manually updating prices in the database
- To force immediate UI updates (instead of waiting for ISR 1-hour revalidation)

**Note:** If the app is not running or REVALIDATE_SECRET is not set, some revalidations may fail. Pages will still update via ISR within 1 hour automatically.
