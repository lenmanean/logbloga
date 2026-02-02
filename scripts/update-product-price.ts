/**
 * Update a single product's display price (and optional original_price) by slug.
 * Checkout uses STRIPE_PRICE_* env vars; cart and UI use products.price from the DB.
 * This script updates products.price (display only). For canonical sync from Stripe, run sync-display-prices-from-stripe.ts.
 *
 * Usage:
 *   npx tsx scripts/update-product-price.ts <slug> <price>
 * Example:
 *   npx tsx scripts/update-product-price.ts master-bundle 0.51
 *
 * Environment: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (.env.local)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/supabase';

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  }
  return createClient<Database>(supabaseUrl, supabaseKey);
}

async function main() {
  const slug = process.argv[2];
  const priceStr = process.argv[3];
  if (!slug || priceStr === undefined) {
    console.error('Usage: npx tsx scripts/update-product-price.ts <slug> <price>');
    process.exit(1);
  }
  const price = parseFloat(priceStr);
  if (Number.isNaN(price) || price < 0) {
    console.error('Price must be a non-negative number.');
    process.exit(1);
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .update({ price })
    .eq('slug', slug)
    .select('id, slug, title, price')
    .single();

  if (error) {
    console.error('Update failed:', error.message);
    process.exit(1);
  }
  if (!data) {
    console.error(`No product found with slug: ${slug}`);
    process.exit(1);
  }
  console.log(`Updated product: ${data.title} (${data.slug}) -> price: $${data.price}`);
}

main();
