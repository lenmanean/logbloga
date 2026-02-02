/**
 * Sync display prices from Stripe to DB (products.price).
 * Reads STRIPE_PRICE_* env vars per slug, fetches unit_amount from Stripe, updates products.price.
 * Run after changing a price in Stripe or setting a new env var so UI matches Stripe.
 *
 * Usage:
 *   npx tsx scripts/sync-display-prices-from-stripe.ts
 *
 * Environment: STRIPE_SECRET_KEY, STRIPE_PRICE_AGENCY, STRIPE_PRICE_SOCIAL_MEDIA, etc.;
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (.env.local)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getStripeClient } from '../lib/stripe/client';
import { formatAmountFromStripe } from '../lib/stripe/utils';
import { SELLABLE_SLUGS, getStripePriceIdBySlug } from '../lib/stripe/prices';
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
  const stripe = getStripeClient();
  const supabase = createSupabaseClient();
  let updated = 0;
  let skipped = 0;

  for (const slug of SELLABLE_SLUGS) {
    const priceId = getStripePriceIdBySlug(slug);
    if (!priceId) {
      console.warn(`Skipping ${slug}: STRIPE_PRICE_* not set or invalid (must start with price_).`);
      skipped++;
      continue;
    }

    try {
      const price = await stripe.prices.retrieve(priceId);
      const unitAmountCents = price.unit_amount ?? 0;
      const priceUsd = formatAmountFromStripe(unitAmountCents);

      const { data, error } = await supabase
        .from('products')
        .update({ price: priceUsd })
        .eq('slug', slug)
        .select('id, slug, title, price')
        .single();

      if (error) {
        console.error(`Failed to update ${slug}:`, error.message);
        continue;
      }
      if (data) {
        console.log(`Updated ${data.title} (${slug}) -> $${data.price}`);
        updated++;
      }
    } catch (err) {
      console.error(`Error syncing ${slug}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('');
  console.log(`Done. Updated: ${updated}, skipped: ${skipped}.`);
  if (skipped > 0) {
    process.exit(1);
  }
}

main();
