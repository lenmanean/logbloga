/**
 * Cleanup Stripe Product Catalogue
 *
 * Archives all Stripe products that are NOT one of our 5 products
 * (Web Apps, Social Media, Agency, Freelancing, Master Bundle).
 *
 * Uses Stripe API (same as Stripe CLI). Run with --dry-run to preview.
 *
 * Usage:
 *   npx tsx scripts/cleanup-stripe-products.ts
 *   npx tsx scripts/cleanup-stripe-products.ts --dry-run
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getStripeClient } from '../lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/supabase';

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing', 'master-bundle'];

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  return createClient<Database>(url, key);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('Stripe product catalogue cleanup');
  console.log(dryRun ? '(DRY RUN - no changes will be made)\n' : '');

  const supabase = createSupabaseClient();
  const stripe = getStripeClient();

  // Get our 4 packages + Master Bundle and their Stripe product IDs
  const { data: packages, error: pkgError } = await supabase
    .from('products')
    .select('id, slug, title, stripe_product_id')
    .in('slug', PACKAGE_SLUGS)
    .eq('active', true)
    .or('product_type.eq.package,product_type.eq.bundle');

  if (pkgError || !packages) {
    throw new Error(`Failed to fetch packages: ${pkgError?.message || 'Unknown'}`);
  }

  const keepIds = new Set(
    packages
      .map((p) => p.stripe_product_id)
      .filter((id): id is string => !!id)
  );

  console.log('Packages to KEEP (from database):');
  for (const p of packages) {
    console.log(`  - ${p.title} (${p.slug}): ${p.stripe_product_id || '(no Stripe ID)'}`);
  }
  console.log('');

  // List all active Stripe products
  const products: { id: string; name: string }[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const list = await stripe.products.list({
      active: true,
      limit: 100,
      starting_after: startingAfter,
    });
    for (const p of list.data) {
      products.push({ id: p.id, name: p.name || p.id });
    }
    hasMore = list.has_more;
    if (list.data.length > 0) {
      startingAfter = list.data[list.data.length - 1].id;
    }
  }

  const toArchive = products.filter((p) => !keepIds.has(p.id));

  if (toArchive.length === 0) {
    console.log('No extra products to archive. Catalogue is clean.');
    return;
  }

  console.log(`Products to ARCHIVE (${toArchive.length}):`);
  for (const p of toArchive) {
    console.log(`  - ${p.name} (${p.id})`);
  }
  console.log('');

  if (dryRun) {
    console.log('Dry run complete. Run without --dry-run to archive these products.');
    return;
  }

  let archived = 0;
  for (const p of toArchive) {
    try {
      await stripe.products.update(p.id, { active: false });
      console.log(`  Archived: ${p.name} (${p.id})`);
      archived++;
    } catch (err) {
      console.error(`  Failed to archive ${p.id}:`, err);
    }
  }

  console.log(`\nArchived ${archived} product(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
