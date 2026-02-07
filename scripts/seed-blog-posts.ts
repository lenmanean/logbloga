/**
 * Seed Blog Posts
 *
 * Populates the blog_posts table with 7 performance-marketing-focused articles.
 * Uses service role to bypass RLS. Idempotent: re-running upserts by slug.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-posts.ts
 *
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/supabase';
import { IN_HOUSE_VS_AGENCY_CONTENT } from './blog-content/in-house-vs-agency';
import { PAID_AD_CAMPAIGNS_FAIL_CONTENT } from './blog-content/paid-ad-campaigns-fail';
import { ROAS_2X_METRIC_CONTENT } from './blog-content/roas-2x-metric';
import { TRAFFIC_ATTENTION_BUYERS_CONTENT } from './blog-content/traffic-attention-buyers';
import { VALIDATE_PRODUCT_BEFORE_ADS_CONTENT } from './blog-content/validate-product-before-ads';
import { META_VS_GOOGLE_ADS_CONTENT } from './blog-content/meta-vs-google-ads';
import { SCALING_ADS_TOO_EARLY_CONTENT } from './blog-content/scaling-ads-too-early';

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }
  return createClient<Database>(url, key);
}

interface BlogPostSeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  published_at: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
}

const POSTS: BlogPostSeed[] = [
  {
    slug: 'why-most-paid-ad-campaigns-fail-in-the-first-30-days',
    title: 'Why Most Paid Ad Campaigns Fail in the First 30 Days and How to Avoid It',
    excerpt:
      'Campaign failure is rarely about creative or targeting. The real culprits are structural mistakes made before the first click. Here’s how to fix the foundation.',
    published: true,
    published_at: '2026-01-03T12:00:00Z',
    tags: ['paid-ads', 'strategy'],
    seo_title: 'Why Most Paid Ad Campaigns Fail in the First 30 Days',
    seo_description:
      'Learn the structural mistakes that kill paid campaigns before tactics even matter—and how to avoid them.',
    content: PAID_AD_CAMPAIGNS_FAIL_CONTENT,
  },
  {
    slug: 'what-a-2x-roas-actually-means-and-when-its-a-bad-metric',
    title: "What a 2x ROAS Actually Means and When It's a Bad Metric",
    excerpt:
      'ROAS sounds simple, but it can mislead. Here’s what 2x ROAS really tells you—and when it’s actually a red flag.',
    published: true,
    published_at: '2026-01-10T12:00:00Z',
    tags: ['paid-ads', 'strategy'],
    seo_title: "What a 2x ROAS Actually Means and When It's a Bad Metric",
    seo_description:
      'Understanding ROAS beyond the number: when 2x is great, and when it means you’re leaving money on the table.',
    content: ROAS_2X_METRIC_CONTENT,
  },
  {
    slug: 'traffic-attention-and-buyers-why-brands-confuse-them',
    title: 'The Difference Between Traffic, Attention, and Buyers, and Why Most Brands Confuse Them',
    excerpt:
      'Traffic, attention, and buyers are not the same. Understanding the distinction is the key to building a quality funnel.',
    published: true,
    published_at: '2026-01-17T12:00:00Z',
    tags: ['funnel', 'strategy'],
    seo_title: 'Traffic, Attention, and Buyers: Why Brands Confuse Them',
    seo_description:
      'Most brands treat traffic as a goal. Learn why that’s wrong and how to focus on attention and buyers instead.',
    content: TRAFFIC_ATTENTION_BUYERS_CONTENT,
  },
  {
    slug: 'how-to-validate-a-product-before-spending-on-ads',
    title: 'How to Validate a Product Before Spending a Dollar on Ads',
    excerpt:
      'Don’t bet your ad budget on a guess. Validate demand, pricing, and positioning before you scale paid acquisition.',
    published: true,
    published_at: '2026-01-23T12:00:00Z',
    tags: ['ecommerce', 'strategy'],
    seo_title: 'How to Validate a Product Before Spending on Ads',
    seo_description:
      'Pre-launch validation steps for e-commerce and DTC brands: validate demand, pricing, and positioning before paid ads.',
    content: VALIDATE_PRODUCT_BEFORE_ADS_CONTENT,
  },
  {
    slug: 'meta-ads-vs-google-ads-for-premium-brands',
    title: 'Meta Ads vs Google Ads for Premium Brands: When Each Wins',
    excerpt:
      'Both platforms work—but for different goals and customer journeys. Here’s when to lean on Meta, when on Google, and when on both.',
    published: true,
    published_at: '2026-01-30T12:00:00Z',
    tags: ['paid-ads', 'strategy'],
    seo_title: 'Meta Ads vs Google Ads for Premium Brands',
    seo_description:
      'When to use Meta vs Google for premium and DTC brands: channel strengths, use cases, and decision framework.',
    content: META_VS_GOOGLE_ADS_CONTENT,
  },
  {
    slug: 'why-scaling-ads-too-early-kills-profitable-products',
    title: 'Why Scaling Ads Too Early Kills Profitable Products',
    excerpt:
      'Profitable at $5K/month doesn’t mean ready for $50K. Premature scaling destroys margin, data quality, and long-term viability.',
    published: true,
    published_at: '2026-02-04T12:00:00Z',
    tags: ['paid-ads', 'strategy'],
    seo_title: 'Why Scaling Ads Too Early Kills Profitable Products',
    seo_description:
      'The dangers of scaling paid ads before you’re ready—and how to know when it’s safe to grow spend.',
    content: SCALING_ADS_TOO_EARLY_CONTENT,
  },
  {
    slug: 'in-house-marketing-vs-performance-agency-cost',
    title: 'The Real Cost of In-House Marketing vs Hiring a Performance Agency',
    excerpt:
      'In-house versus agency isn’t just about hourly rates. It’s about total cost, speed, and risk. Here’s a clear framework.',
    published: true,
    published_at: '2026-02-06T12:00:00Z',
    tags: ['agency', 'strategy'],
    seo_title: 'In-House vs Performance Agency: The Real Cost',
    seo_description:
      'A transparent comparison of in-house marketing costs vs. hiring a performance agency—without the spin.',
    content: IN_HOUSE_VS_AGENCY_CONTENT,
  },
];

async function main() {
  const supabase = createSupabaseClient();

  for (const post of POSTS) {
    const { error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: null,
          published: post.published,
          published_at: post.published_at,
          featured_image: null,
          tags: post.tags,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          mdx_file_path: '',
        },
        { onConflict: 'slug', ignoreDuplicates: false }
      );

    if (error) {
      console.error(`Failed to upsert "${post.slug}":`, error);
      process.exit(1);
    }
    console.log(`✓ Upserted: ${post.title}`);
  }

  console.log(`\nDone. Seeded ${POSTS.length} blog posts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
