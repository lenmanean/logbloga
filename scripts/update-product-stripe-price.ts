/**
 * Update a single product's stripe_price_id by slug.
 * Use when you create a new Stripe Price (e.g. after the original failed) and need
 * to point the product row to the new price.
 *
 * Usage:
 *   npx tsx scripts/update-product-stripe-price.ts <slug> <stripe_price_id>
 * Example:
 *   npx tsx scripts/update-product-stripe-price.ts master-bundle price_1SvRghRPD0Bbk4QBldhV3krO
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
  const stripePriceId = process.argv[3];
  if (!slug || !stripePriceId) {
    console.error('Usage: npx tsx scripts/update-product-stripe-price.ts <slug> <stripe_price_id>');
    process.exit(1);
  }
  if (!stripePriceId.startsWith('price_')) {
    console.error('stripe_price_id must start with price_');
    process.exit(1);
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .update({ stripe_price_id: stripePriceId })
    .eq('slug', slug)
    .select('id, slug, title, stripe_price_id')
    .single();

  if (error) {
    console.error('Update failed:', error.message);
    process.exit(1);
  }
  if (!data) {
    console.error(`No product found with slug: ${slug}`);
    process.exit(1);
  }
  console.log(`Updated product: ${data.title} (${data.slug}) -> stripe_price_id: ${data.stripe_price_id}`);
}

main();
