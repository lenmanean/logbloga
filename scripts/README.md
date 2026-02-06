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
- Creates a Stripe product and price for each database product (with automatic tax enabled)
- Updates the database with the Stripe **product** ID only (checkout uses `STRIPE_PRICE_*` env vars, not DB)
- Prints the new price ID for each product — set the corresponding env var (e.g. `STRIPE_PRICE_MASTER_BUNDLE=price_xxx`)

**Features:**
- ✅ Creates Stripe products with metadata linking to database products
- ✅ Enables automatic tax calculation (tax_code for digital products)
- ✅ Sets tax behavior to `exclusive` (tax calculated automatically)
- ✅ Skips products that already have Stripe product IDs
- ✅ Provides detailed logging and error handling

**After running:** Set each `STRIPE_PRICE_*` env var to the printed price ID, then run `sync-display-prices-from-stripe.ts` so UI prices match Stripe.

### `sync-display-prices-from-stripe.ts`

Syncs display prices **from Stripe to DB** (`products.price`). Reads `STRIPE_PRICE_*` env vars per slug, fetches `unit_amount` from Stripe, updates `products.price` for each sellable product so the UI (cart, checkout, product pages) reflects Stripe pricing.

**When to run:** After changing a price in Stripe or after setting a new `STRIPE_PRICE_*` env var.

**Usage:**
```bash
npx tsx scripts/sync-display-prices-from-stripe.ts
```

**Environment:** `STRIPE_SECRET_KEY`, `STRIPE_PRICE_AGENCY`, `STRIPE_PRICE_SOCIAL_MEDIA`, `STRIPE_PRICE_WEB_APPS`, `STRIPE_PRICE_FREELANCING`, `STRIPE_PRICE_MASTER_BUNDLE`; `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (e.g. in `.env.local`).

---

## Stripe Product Catalogue Cleanup

### `cleanup-stripe-products.ts`

Archives all Stripe products that are NOT one of our 5 products (Web Apps, Social Media, Agency, Freelancing, Master Bundle). Use when extra products exist in Stripe from testing or old seeds.

**Usage:**
```bash
# Preview what would be archived
npx tsx scripts/cleanup-stripe-products.ts --dry-run

# Archive extra products
npm run stripe:cleanup
# or
npx tsx scripts/cleanup-stripe-products.ts
```

**What it does:**
- Fetches the 4 packages + Master Bundle from database (by slug)
- Lists all active Stripe products
- Archives (sets `active: false`) any product not in the keep list
- Keeps: Web Apps, Social Media, Agency, Freelancing, Master Bundle

---

## Sync Stripe Product Content

### `sync-stripe-product-content.ts`

Updates Stripe product name, description, images, and prices to match the database. Use after database changes to keep Stripe in sync with your implementation.

**Usage:**
```bash
# Preview changes
npx tsx scripts/sync-stripe-product-content.ts --dry-run

# Apply updates
npm run stripe:sync-content
```

**What it does:**
- Fetches packages and Master Bundle from database (title, description, tagline, package_image, price)
- For each: updates Stripe product name, description, images to match DB
- If price differs: creates new Stripe price, archives old, and **prints** the new price ID with instructions to set the corresponding `STRIPE_PRICE_*` env var (checkout uses env, not DB). Then run `sync-display-prices-from-stripe.ts` to update `products.price`.

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

**Note:** Checkout uses `STRIPE_PRICE_*` env vars (see `sync-display-prices-from-stripe.ts`). Use CLI commands for verification and troubleshooting.

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
- Clears cache for products tag
- Revalidates all package pages (`/ai-to-usd/packages/*`)
- Revalidates packages listing page (`/ai-to-usd`)
- Revalidates products cache tag

**When to use:**
- After running database migrations that update product prices
- After manually updating prices in the database
- To force immediate UI updates (instead of waiting for ISR 1-hour revalidation)

**Note:** If the app is not running or REVALIDATE_SECRET is not set, some revalidations may fail. Pages will still update via ISR within 1 hour automatically.

---

## Web Apps Content ZIPs

### `build-web-apps-zips.ts`

Builds the four Web Apps template ZIPs from their source directories under `web-apps-content/`. Run before upload to refresh ZIPs from source.

**Usage:**
```bash
npm run content:build-zips
# or
npx tsx scripts/build-web-apps-zips.ts
```

**What it does:**
- Zips `basic-starter-template/`, `saas-starter-template/`, `advanced-saas-template/`, `ai-integration-examples/`
- Writes `web-apps-content/<name>.zip` for each
- Extracting a ZIP gives a top-level folder with the same name and contents

**When to use:**
- After changing any file inside a template or examples directory
- Before running `content:upload` so the uploaded ZIPs match the source

### `audit-web-apps-zips.ts`

Lists contents of each Web Apps ZIP source directory and key-file checks. Use to verify inventory.

**Usage:**
```bash
npx tsx scripts/audit-web-apps-zips.ts
npx tsx scripts/audit-web-apps-zips.ts --json
```

---

## Package Content Build (Social Media, Agency, Freelancing)

### `build-package-pdfs.ts`

Builds all PDFs from *-content.md for Social Media, Agency, and Freelancing packages. Strips spec preamble (Content Specification title, authoring paragraphs, Level context, authoring-only Notes) so output PDFs contain **user-facing content only**. No placeholders.

**Usage:**
```bash
npm run content:build-pdfs
# or
npx tsx scripts/build-package-pdfs.ts
```

**What it does:**
- Reads each *-content.md, preprocesses to remove spec-only content, runs markdownToPDF()
- Writes allowlist PDF filenames into social-media-content/, agency-content/, freelancing-content/
- Social Media: 5 PDFs (monetization worksheet, daily posting checklist, SMM planner, agency budget, client onboarding)
- Agency: 3 PDFs (solo, team, enterprise budget worksheets)
- Freelancing: 4 PDFs (side hustle, pricing calculator, full-time planner, business financial planning)

**When to use:** Before upload for Social Media, Agency, and Freelancing packages. Run first in the content build order.

### Build order before upload

Run scripts in this order, then `content:audit`, then upload:

1. `npm run content:build-pdfs`
2. `npx tsx scripts/build-social-media-xlsx.ts`
3. `npx tsx scripts/build-social-media-docx.ts`
4. `npx tsx scripts/build-social-media-zips.ts`
5. `npx tsx scripts/build-agency-zips.ts`
6. `npm run content:build-zips` (Web Apps)
7. `npx tsx scripts/build-freelancing-zips.ts`
8. `npm run content:audit` (must exit 0)
9. Upload: `upload-social-media-files.ts`, `upload-agency-files.ts`, `upload-freelancing-files.ts`, `upload-web-apps-files.ts`
