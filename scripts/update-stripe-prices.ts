/**
 * Update Stripe Prices
 * 
 * This script updates Stripe prices for products that have changed in the database.
 * Since Stripe doesn't allow editing prices, it creates new prices and archives old ones.
 * 
 * Usage:
 *   npx tsx scripts/update-stripe-prices.ts [--dry-run]
 * 
 * Options:
 *   --dry-run: Preview changes without making updates
 * 
 * Environment Variables Required:
 *   - STRIPE_SECRET_KEY: Your Stripe secret key
 *   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Also try .env as fallback
config({ path: resolve(process.cwd(), '.env') });

import { getStripeClient } from '../lib/stripe/client';
import { formatAmountForStripe, formatAmountFromStripe } from '../lib/stripe/utils';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import type { Database } from '../lib/types/supabase';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  active: boolean;
}

interface PriceUpdate {
  product: Product;
  oldPriceId: string;
  oldPriceAmount: number;
  newPriceAmount: number;
  difference: number;
}

/**
 * Create Supabase client for script usage
 */
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your .env.local file.'
    );
  }

  if (!supabaseKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Please add it to your .env.local file.'
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${supabaseUrl}". It should start with https:// or http://`
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Get current Stripe price amount
 */
async function getStripePriceAmount(
  stripe: Stripe,
  priceId: string
): Promise<number> {
  const price = await stripe.prices.retrieve(priceId);
  return price.unit_amount || 0;
}

/**
 * Create a new Stripe price for a product
 */
async function createNewStripePrice(
  stripe: Stripe,
  product: Product
): Promise<string> {
  if (!product.stripe_product_id) {
    throw new Error(`Product ${product.slug} has no Stripe product ID`);
  }

  console.log(`  Creating new Stripe price for: ${product.title}`);
  
  const stripePrice = await stripe.prices.create({
    product: product.stripe_product_id,
    unit_amount: formatAmountForStripe(product.price),
    currency: 'usd',
    metadata: {
      product_slug: product.slug,
      product_id: product.id,
      updated_at: new Date().toISOString(),
    },
    tax_behavior: 'exclusive',
  });

  console.log(`  ✓ Created new Stripe price: ${stripePrice.id} ($${product.price.toFixed(2)})`);
  
  return stripePrice.id;
}

/**
 * Archive an old Stripe price
 */
async function archiveStripePrice(
  stripe: Stripe,
  priceId: string
): Promise<void> {
  await stripe.prices.update(priceId, {
    active: false,
  });
  console.log(`  ✓ Archived old Stripe price: ${priceId}`);
}

/**
 * Update product in database with new Stripe price ID
 */
async function updateProductStripePriceId(
  supabase: ReturnType<typeof createSupabaseClient>,
  productId: string,
  newPriceId: string
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      stripe_price_id: newPriceId,
    })
    .eq('id', productId);

  if (error) {
    throw new Error(`Failed to update product ${productId}: ${error.message}`);
  }

  console.log(`  ✓ Updated database with new Stripe price ID`);
}

/**
 * Find products that need price updates
 */
async function findProductsNeedingUpdate(
  stripe: Stripe,
  supabase: ReturnType<typeof createSupabaseClient>
): Promise<PriceUpdate[]> {
  // Fetch all active products with Stripe IDs
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, slug, title, price, stripe_product_id, stripe_price_id, active')
    .eq('active', true)
    .not('stripe_product_id', 'is', null)
    .not('stripe_price_id', 'is', null);

  if (fetchError) {
    throw new Error(`Failed to fetch products: ${fetchError.message}`);
  }

  if (!products || products.length === 0) {
    return [];
  }

  console.log(`Checking ${products.length} product(s) for price updates...\n`);

  const updates: PriceUpdate[] = [];

  for (const product of products as Product[]) {
    try {
      // Get current Stripe price amount
      const oldPriceAmount = await getStripePriceAmount(
        stripe,
        product.stripe_price_id!
      );
      const oldPriceDollars = formatAmountFromStripe(oldPriceAmount);
      const newPriceDollars = product.price;
      const databasePriceCents = formatAmountForStripe(newPriceDollars);

      // Check if price has changed (allowing for small rounding differences)
      const priceDifference = Math.abs(oldPriceAmount - databasePriceCents);
      
      if (priceDifference > 1) { // More than 1 cent difference
        updates.push({
          product,
          oldPriceId: product.stripe_price_id!,
          oldPriceAmount: oldPriceDollars,
          newPriceAmount: newPriceDollars,
          difference: newPriceDollars - oldPriceDollars,
        });
      }
    } catch (error) {
      console.error(`  ⚠️  Error checking ${product.title}:`, error);
    }
  }

  return updates;
}

/**
 * Main update function
 */
async function updateStripePrices(dryRun: boolean = false) {
  console.log('🚀 Starting Stripe price update...\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Initialize Stripe client
    const stripe = getStripeClient();
    console.log('✓ Stripe client initialized\n');

    // Initialize Supabase client
    const supabase = createSupabaseClient();
    console.log('✓ Supabase client initialized\n');

    // Find products needing updates
    const updates = await findProductsNeedingUpdate(stripe, supabase);

    if (updates.length === 0) {
      console.log('✓ All Stripe prices are up to date. No updates needed.\n');
      return;
    }

    console.log(`Found ${updates.length} product(s) with price changes:\n`);

    // Display preview
    updates.forEach((update) => {
      const sign = update.difference > 0 ? '+' : '';
      console.log(`  ${update.product.title} (${update.product.slug})`);
      console.log(`    Old: $${update.oldPriceAmount.toFixed(2)} → New: $${update.newPriceAmount.toFixed(2)} (${sign}$${Math.abs(update.difference).toFixed(2)})`);
    });

    console.log('');

    if (dryRun) {
      console.log('🔍 DRY RUN: Would update the above products\n');
      return;
    }

    // Process each update
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        console.log(`\nUpdating: ${update.product.title} (${update.product.slug})`);

        // Create new Stripe price
        const newPriceId = await createNewStripePrice(stripe, update.product);

        // Archive old Stripe price
        await archiveStripePrice(stripe, update.oldPriceId);

        // Update database with new price ID
        await updateProductStripePriceId(supabase, update.product.id, newPriceId);

        successCount++;
        console.log(`✅ Successfully updated: ${update.product.title}\n`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error updating ${update.product.title}:`, error);
        console.error('');
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Update Summary:');
    console.log(`  ✅ Successfully updated: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📦 Total products: ${updates.length}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error during update:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

// Run the update
if (require.main === module) {
  updateStripePrices(dryRun)
    .then(() => {
      console.log('✓ Update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Update failed:', error);
      process.exit(1);
    });
}

export { updateStripePrices };
