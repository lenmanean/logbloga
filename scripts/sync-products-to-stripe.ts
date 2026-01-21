/**
 * Sync Products to Stripe
 * 
 * This script creates Stripe products and prices for all products in the database
 * that don't already have Stripe IDs. It uses the Stripe API to create products
 * and prices, then updates the database with the Stripe IDs.
 * 
 * Usage:
 *   npx tsx scripts/sync-products-to-stripe.ts
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
import { formatAmountForStripe } from '../lib/stripe/utils';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import type { Database } from '../lib/types/supabase';

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  active: boolean;
}

/**
 * Create a Stripe product from a database product
 */
async function createStripeProduct(
  stripe: Stripe,
  product: Product
): Promise<{ productId: string; priceId: string }> {
  console.log(`Creating Stripe product for: ${product.title} (${product.slug})`);

  // Create Stripe product
  const stripeProduct = await stripe.products.create({
    name: product.title,
    description: product.description || undefined,
    metadata: {
      product_slug: product.slug,
      product_id: product.id,
    },
    // Enable automatic tax calculation
    tax_code: 'txcd_10301001', // Digital products tax code
  });

  console.log(`  ✓ Created Stripe product: ${stripeProduct.id}`);

  // Create Stripe price
  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: formatAmountForStripe(product.price),
    currency: 'usd',
    metadata: {
      product_slug: product.slug,
      product_id: product.id,
    },
    // Enable automatic tax for this price
    tax_behavior: 'exclusive', // Tax will be calculated automatically
  });

  console.log(`  ✓ Created Stripe price: ${stripePrice.id}`);

  return {
    productId: stripeProduct.id,
    priceId: stripePrice.id,
  };
}

/**
 * Update product in database with Stripe IDs
 */
async function updateProductStripeIds(
  supabase: ReturnType<typeof createSupabaseClient>,
  productId: string,
  stripeProductId: string,
  stripePriceId: string
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
    })
    .eq('id', productId);

  if (error) {
    throw new Error(`Failed to update product ${productId}: ${error.message}`);
  }

  console.log(`  ✓ Updated database with Stripe IDs`);
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
 * Main sync function
 */
async function syncProductsToStripe() {
  console.log('🚀 Starting product sync to Stripe...\n');

  try {
    // Initialize Stripe client
    const stripe = getStripeClient();
    console.log('✓ Stripe client initialized\n');

    // Initialize Supabase client
    const supabase = createSupabaseClient();
    console.log('✓ Supabase client initialized\n');

    // Fetch all active products that don't have Stripe IDs
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, slug, title, description, price, original_price, stripe_product_id, stripe_price_id, active')
      .eq('active', true)
      .is('stripe_product_id', null);

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      console.log('✓ All products already have Stripe IDs. Nothing to sync.\n');
      return;
    }

    console.log(`Found ${products.length} product(s) to sync\n`);

    // Process each product
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const { productId, priceId } = await createStripeProduct(
          stripe,
          product as Product
        );

        await updateProductStripeIds(supabase, product.id, productId, priceId);

        successCount++;
        console.log(`✅ Successfully synced: ${product.title}\n`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error syncing ${product.title}:`, error);
        console.error('');
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Sync Summary:');
    console.log(`  ✅ Successfully synced: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📦 Total products: ${products.length}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
if (require.main === module) {
  syncProductsToStripe()
    .then(() => {
      console.log('✓ Sync completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    });
}

export { syncProductsToStripe };
