/**
 * Seed Package Reviews
 *
 * Inserts 1–5 high-rated, human-like approved reviews per sellable package
 * (web-apps, social-media, agency, freelancing, master-bundle). Uses a single
 * seed user (created if needed). The trigger from migration 000050 will
 * update products.rating and products.review_count.
 *
 * Usage: npx tsx scripts/seed-package-reviews.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/supabase';

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing', 'master-bundle'] as const;

const REVIEW_CONTENT: Record<string, string[]> = {
  'web-apps': [
    'The step-by-step guides and Stripe integration examples got my first SaaS live in under a month. Exactly what I needed.',
    'Clear structure and real code snippets. I used the Next.js and Vercel guides and had no surprises.',
    'Worth it for the implementation plan alone. Level 2 content helped me add proper auth and scale.',
    'Templates saved me days. The AI prompts file is gold for iterating with Cursor.',
    'Solid value. Went from idea to paying users with the MVP checklist and deployment guide.',
  ],
  'social-media': [
    'The content calendar and reporting templates made going from solo to small team manageable.',
    'Metricool setup was a game changer. Now I actually report metrics clients care about.',
    'Clear path from Level 1 to 3. The client onboarding framework is professional and reusable.',
    'Service suite and pricing guides helped me position and charge properly. No fluff.',
    'Finally a system that scales. The team management templates are exactly what I needed.',
  ],
  'agency': [
    'GoHighLevel setup guide got our CRM and pipelines running in a weekend. Option A was the right call.',
    'Team pricing and revenue strategy gave us a real framework instead of guessing.',
    'The operations templates and handoff checklist improved our delivery a lot.',
    'Level 2 content is dense and actionable. Budget planning and client review templates are keepers.',
    'Worth every dollar. We’re running 5 clients smoothly with the frameworks in this package.',
  ],
  'freelancing': [
    'Fiverr and Upwork guides were practical. Portfolio framework helped me land better gigs.',
    'First client acquisition guide gave me a clear sequence instead of spraying and praying.',
    'PayPal and contract templates made getting paid and staying protected straightforward.',
    'Premium positioning guide changed how I talk about my work. Rates went up.',
    'Direct client acquisition section had real tactics. Already booked two leads from it.',
  ],
  'master-bundle': [
    'Having all four packages in one place is a no-brainer. I bounce between Web Apps and Agency as needed.',
    'The combined 145+ hours would have cost way more separately. Master bundle is the best value.',
    'Started with Social Media, then added Agency. Same quality across the board.',
    'One purchase, every path. I use Web Apps for product and Freelancing for side income.',
    'If you’re serious about monetizing AI, get the bundle. The level structure is consistent and clear.',
  ],
};

const DISPLAY_NAMES = [
  'Jordan M.',
  'Sam K.',
  'Alex R.',
  'Casey L.',
  'Riley T.',
  'Morgan P.',
  'Jamie F.',
  'Quinn W.',
  'Taylor S.',
  'Drew H.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getOrCreateSeedUserId(supabase: ReturnType<typeof createClient<Database>>): Promise<string> {
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1 });
  if (list?.users?.length && list.users[0]?.id) {
    return list.users[0].id;
  }
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: 'seed-reviews@logbloga.local',
    password: process.env.SEED_REVIEWS_PASSWORD || `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    email_confirm: true,
  });
  if (error) throw new Error(`Failed to create seed user: ${error.message}`);
  if (!created?.user?.id) throw new Error('Seed user created but no id returned');
  return created.user.id;
}

async function seedPackageReviews() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const supabase = createClient<Database>(url, key);

  const userId = await getOrCreateSeedUserId(supabase);
  console.log('Using seed user id:', userId);

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug')
    .in('slug', [...PACKAGE_SLUGS])
    .eq('active', true);

  if (productsError) throw new Error(`Failed to fetch products: ${productsError.message}`);
  if (!products?.length) throw new Error('No active products found for package slugs');

  const usedNames = new Set<string>();
  const getDisplayName = () => {
    const pool = DISPLAY_NAMES.filter((n) => !usedNames.has(n));
    const name = pool.length ? pick(pool) : `Reviewer ${usedNames.size + 1}`;
    usedNames.add(name);
    return name;
  };

  let totalInserted = 0;
  for (const product of products) {
    const slug = product.slug as keyof typeof REVIEW_CONTENT;
    const contents = REVIEW_CONTENT[slug] ?? REVIEW_CONTENT['master-bundle'];
    const count = randomInt(1, 5);
    const toInsert = Math.min(count, contents.length);
    const shuffled = [...contents].sort(() => Math.random() - 0.5).slice(0, toInsert);

    for (const content of shuffled) {
      const { error: insertError } = await supabase.from('reviews').insert({
        user_id: userId,
        product_id: product.id,
        order_id: null,
        rating: randomInt(4, 5),
        content,
        reviewer_display_name: getDisplayName(),
        status: 'approved',
        verified_purchase: false,
      });
      if (insertError) {
        console.warn(`Insert failed for product ${product.slug}:`, insertError.message);
        continue;
      }
      totalInserted++;
    }
    console.log(`  ${product.slug}: ${toInsert} review(s)`);
  }

  console.log(`Done. Inserted ${totalInserted} approved reviews. Product rating/review_count updated by DB trigger.`);
}

seedPackageReviews().catch((err) => {
  console.error(err);
  process.exit(1);
});
