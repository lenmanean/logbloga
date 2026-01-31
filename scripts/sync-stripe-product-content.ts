/**
 * Sync Stripe Product Content to Match Database
 *
 * Updates Stripe products (name, description, images) and prices to match
 * our database implementation. Use after database changes to keep Stripe in sync.
 *
 * Usage:
 *   npx tsx scripts/sync-stripe-product-content.ts
 *   npx tsx scripts/sync-stripe-product-content.ts --dry-run
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getStripeClient } from '../lib/stripe/client';
import { formatAmountForStripe, formatAmountFromStripe } from '../lib/stripe/utils';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import type { Database } from '../lib/types/supabase';

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing', 'master-bundle'];

interface DbProduct {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  tagline: string | null;
  price: number;
  package_image: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
}

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  return createClient<Database>(url, key);
}

function toImageUrl(image: string | null): string[] {
  if (!image || !image.trim()) return [];
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return [image];
  }
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://logbloga.com';
  const path = image.startsWith('/') ? image : `/${image}`;
  return [`${base.replace(/\/$/, '')}${path}`];
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('Sync Stripe product content to match database');
  console.log(dryRun ? '(DRY RUN - no changes will be made)\n' : '\n');

  const supabase = createSupabaseClient();
  const stripe = getStripeClient();

  const { data: packages, error } = await supabase
    .from('products')
    .select('id, slug, title, description, tagline, price, package_image, stripe_product_id, stripe_price_id')
    .in('slug', PACKAGE_SLUGS)
    .eq('active', true)
    .or('product_type.eq.package,product_type.eq.bundle');

  if (error) {
    throw new Error(`Failed to fetch packages: ${error.message}`);
  }
  if (!packages?.length) {
    throw new Error('No packages found in database');
  }

  let contentUpdates = 0;
  let priceUpdates = 0;

  for (const pkg of packages as DbProduct[]) {
    if (!pkg.stripe_product_id) {
      console.log(`Skip ${pkg.slug}: no Stripe product ID`);
      continue;
    }

    const name = pkg.title || pkg.slug;
    const description = pkg.description || pkg.tagline || '';
    const images = toImageUrl(pkg.package_image);

    const stripeProduct = await stripe.products.retrieve(pkg.stripe_product_id);

    const needsContentUpdate =
      stripeProduct.name !== name ||
      (stripeProduct.description || '') !== description ||
      JSON.stringify(stripeProduct.images || []) !== JSON.stringify(images);

    if (needsContentUpdate) {
      console.log(`Update content: ${name} (${pkg.slug})`);
      if (stripeProduct.name !== name) {
        console.log(`  name: "${stripeProduct.name}" → "${name}"`);
      }
      if ((stripeProduct.description || '') !== description) {
        console.log(`  description: ${(stripeProduct.description || '').slice(0, 40)}... → ${description.slice(0, 40)}...`);
      }
      if (JSON.stringify(stripeProduct.images || []) !== JSON.stringify(images)) {
        console.log(`  images: ${(stripeProduct.images || []).length} → ${images.length}`);
      }

      if (!dryRun) {
        await stripe.products.update(pkg.stripe_product_id, {
          name,
          description: description || undefined,
          images: images.length > 0 ? images : undefined,
          metadata: {
            product_slug: pkg.slug,
            product_id: pkg.id,
          },
        });
        contentUpdates++;
      }
    }

    if (pkg.stripe_price_id) {
      const stripePrice = await stripe.prices.retrieve(pkg.stripe_price_id);
      const dbCents = formatAmountForStripe(pkg.price);
      const stripeCents = stripePrice.unit_amount || 0;

      if (Math.abs(dbCents - stripeCents) > 1) {
        console.log(`Update price: ${name} (${pkg.slug})`);
        console.log(`  $${(stripeCents / 100).toFixed(2)} → $${pkg.price.toFixed(2)}`);

        if (!dryRun) {
          const newPrice = await stripe.prices.create({
            product: pkg.stripe_product_id,
            unit_amount: dbCents,
            currency: 'usd',
            metadata: { product_slug: pkg.slug, product_id: pkg.id },
            tax_behavior: 'exclusive',
          });
          await stripe.prices.update(pkg.stripe_price_id, { active: false });
          await supabase
            .from('products')
            .update({ stripe_price_id: newPrice.id })
            .eq('id', pkg.id);
          priceUpdates++;
        }
      }
    }
  }

  console.log('');
  if (dryRun) {
    console.log('Dry run complete. Run without --dry-run to apply.');
  } else {
    console.log(`Done. Content updates: ${contentUpdates}, Price updates: ${priceUpdates}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
