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
    tags: ['paid-ads', 'campaign-structure', 'strategy'],
    seo_title: 'Why Most Paid Ad Campaigns Fail in the First 30 Days',
    seo_description:
      'Learn the structural mistakes that kill paid campaigns before tactics even matter—and how to avoid them.',
    content: `## The Real Problem Isn’t Tactics

Most paid ad campaigns fail in the first 30 days. Not because the creative was weak or the targeting was off—though those matter—but because the structure beneath them was wrong. Brands pour budget into campaigns built on shaky foundations, then wonder why scaling feels impossible.

Here are the structural mistakes that matter most, and how to fix them.

---

## 1. No Clear Conversion Definition

Before you spend a dollar, define what “success” looks like. Not vanity metrics—actual business outcomes.

- **Bad:** “We want more traffic” or “we want engagement”
- **Good:** “We want leads with email, phone, and budget qualifier” or “we want purchases over $100”

Without a crisp conversion definition, you can’t optimize. The algorithm has nothing concrete to learn from. Fix this before launch.

---

## 2. Mismatched Offer and Funnel

Your ad promise must align with what happens after the click. If the ad says “free audit” and the landing page pushes a demo, you’re training users to leave. If the ad promises a discount and the page asks for an email first, you’ll see high bounce and low conversion.

**Fix:** Map ad → landing page → next step. Ensure the offer is consistent and the next action is obvious.

---

## 3. Inadequate Tracking and Attribution

You can’t improve what you don’t measure. Many campaigns fail because:

- Pixels or events are missing or firing incorrectly
- Conversions aren’t passed back to the ad platform
- Multi-touch attribution is ignored, so you don’t know which touchpoints drive value

**Fix:** Audit your tracking before launch. Test events in sandbox, validate in production, and confirm the ad platform receives conversion data.

---

## 4. No Audience Strategy Beyond Demographics

Demographics alone don’t predict intent. A 35-year-old in NYC and a 35-year-old in rural Texas may behave differently. Interests, behaviors, and lookalikes often outperform broad demographic targets.

**Fix:** Layer in intent signals: past site visitors, engaged users, lookalikes of converters. Use sequential messaging where it makes sense.

---

## 5. Expecting Immediate Profitability

Profitable campaigns rarely emerge in week one. The learning phase exists for a reason. Brands that slash budget or change everything after a few days never give the system a chance to optimize.

**Fix:** Set a realistic learning budget and timeline. Avoid major changes in the first 2–4 weeks. Optimize methodically, not reactively.

---

## The Takeaway

Campaign failure is usually structural. Fix your conversion definition, align offer and funnel, verify tracking, refine audience strategy, and give the system time to learn. Get the foundation right, and tactics will matter far more.`,
  },
  {
    slug: 'what-a-2x-roas-actually-means-and-when-its-a-bad-metric',
    title: "What a 2x ROAS Actually Means and When It's a Bad Metric",
    excerpt:
      'ROAS sounds simple, but it can mislead. Here’s what 2x ROAS really tells you—and when it’s actually a red flag.',
    published: true,
    published_at: '2026-01-10T12:00:00Z',
    tags: ['roas', 'metrics', 'paid-ads'],
    seo_title: "What a 2x ROAS Actually Means and When It's a Bad Metric",
    seo_description:
      'Understanding ROAS beyond the number: when 2x is great, and when it means you’re leaving money on the table.',
    content: `## The Myth of “Good” ROAS

“We’re at 2x ROAS” sounds like a win. Sometimes it is. Sometimes it’s a sign you’re under-investing, over-discounting, or measuring the wrong thing. ROAS is a ratio—revenue over ad spend—but context defines whether it’s healthy or not.

---

## What 2x ROAS Actually Means

At 2x ROAS, for every dollar spent on ads, you generate two dollars in revenue. That sounds profitable until you remember: revenue isn’t profit.

If your gross margin is 40%, that $2 in revenue yields $0.80 in gross profit. You spent $1 to make $0.80. You’re losing money.

**When 2x ROAS is good:**
- Gross margins are high (e.g., 60%+)
- You’re measuring attributed revenue and it’s reasonably accurate
- You’re in a learning or retention phase where short-term profitability is secondary

**When 2x ROAS is bad:**
- Margins are thin; you’re profitable on paper but not in reality
- You’re counting last-click only and ignoring assist conversions
- You’re sacrificing margin with heavy discounts to hit the number

---

## When ROAS Becomes a Bad Metric

ROAS encourages some brands to:

1. **Chase volume at any cost** — “We hit 3x!” while margins collapse
2. **Cut spend too early** — Profitable at 2x, but scalable at 1.5x; they never test
3. **Optimize for the wrong outcome** — Maximizing revenue instead of profit or LTV

Use ROAS as one input, not the only input. Pair it with margin, CAC, LTV, and cash flow.

---

## A Better Framing

Instead of “What’s our ROAS?”, ask:

- *What’s our blended CAC and does it work with our unit economics?*
- *What’s our payback period?*
- *At what ROAS are we profitable, and at what ROAS can we scale?*

Define your minimum viable ROAS from margin and overhead. Then use ROAS to guide spend, not to celebrate or panic in isolation.`,
  },
  {
    slug: 'traffic-attention-and-buyers-why-brands-confuse-them',
    title: 'The Difference Between Traffic, Attention, and Buyers, and Why Most Brands Confuse Them',
    excerpt:
      'Traffic, attention, and buyers are not the same. Understanding the distinction is the key to building a quality funnel.',
    published: true,
    published_at: '2026-01-17T12:00:00Z',
    tags: ['funnel', 'traffic', 'conversion'],
    seo_title: 'Traffic, Attention, and Buyers: Why Brands Confuse Them',
    seo_description:
      'Most brands treat traffic as a goal. Learn why that’s wrong and how to focus on attention and buyers instead.',
    content: `## Three Different Outcomes

**Traffic** is visits. Clicks. Sessions. It’s quantity. A million visitors from a meme might be traffic, but it’s rarely valuable.

**Attention** is focus. Someone paused, read, watched, or engaged. They’re present. They might not buy, but they’re in the room.

**Buyers** are people who take the action you care about: purchase, sign up, book a call. They’re the outcome that pays the bills.

Most brands optimize for traffic and call it success. They celebrate impressions and clicks while ignoring whether anyone actually moved toward a purchase.

---

## Why the Confusion Hurts

When you treat traffic as the goal:

- You optimize for cheap clicks instead of qualified visitors
- You judge campaigns by reach and engagement, not by leads or sales
- You build funnels that attract the wrong people and filter out the right ones

A funnel that attracts 10,000 visitors and converts 0.1% is worse than one that attracts 1,000 and converts 5%. Quality of traffic matters more than volume.

---

## Mapping the Funnel

Think of it as stages:

1. **Traffic** — Someone lands on your asset. They might bounce in seconds.
2. **Attention** — They stay. They read, watch, or scroll. They’re considering.
3. **Intent** — They raise a hand: form fill, add to cart, start checkout.
4. **Buyer** — They complete the action that generates revenue.

Each stage has different metrics. Traffic: sessions, unique visitors. Attention: time on page, scroll depth, video completion. Intent: form submissions, cart adds. Buyers: purchases, signups.

---

## What to Optimize For

Don’t optimize for traffic. Optimize for attention and buyers.

- Use creative and copy that speaks to people with real intent
- Design landing experiences that qualify visitors and move them toward action
- Measure cost per attention and cost per buyer, not just cost per click

When you focus on traffic, you get traffic. When you focus on buyers, you get a business.`,
  },
  {
    slug: 'how-to-validate-a-product-before-spending-on-ads',
    title: 'How to Validate a Product Before Spending a Dollar on Ads',
    excerpt:
      'Don’t bet your ad budget on a guess. Validate demand, pricing, and positioning before you scale paid acquisition.',
    published: true,
    published_at: '2026-01-23T12:00:00Z',
    tags: ['validation', 'ecommerce', 'product-market-fit'],
    seo_title: 'How to Validate a Product Before Spending on Ads',
    seo_description:
      'Pre-launch validation steps for e-commerce and DTC brands: validate demand, pricing, and positioning before paid ads.',
    content: `## Why Validation Comes First

Spending on ads before validating a product is like buying a billboard for a restaurant that hasn’t opened. You might get attention, but you don’t know if anyone will show up—or if the offering is ready when they do.

Validation answers: *Does anyone want this, at this price, from us?*

---

## Step 1: Validate Demand

Before you build or buy inventory, test whether people care.

**Options:**
- **Pre-sales or waitlists** — Collect emails or take deposits. If no one signs up, demand may be weak.
- **Landing page test** — Describe the product and offer. Measure CTR and signup rate. No ad spend needed; use organic or tiny paid tests.
- **Manual outreach** — DM or email your ideal customers. Offer the product or a beta. Gauge interest and objections.

If you can’t get 20 people to raise a hand before you invest heavily, ads won’t fix that.

---

## Step 2: Validate Pricing

Price tests don’t require a full funnel. You can:

- Run simple surveys: “Would you pay $X for this?”
- Offer early-bird pricing and see conversion
- A/B test price points on a small audience before scaling

The goal: find a price that converts and leaves margin for CAC. Too low and you can’t afford acquisition; too high and volume dies.

---

## Step 3: Validate Positioning and Messaging

What resonates? Test angles:

- Problem-focused vs. outcome-focused
- Feature-led vs. benefit-led
- Different hooks and headlines in low-budget tests

Use qualitative feedback (calls, surveys) and quantitative tests (landing pages, small ad tests). Double down on what converts.

---

## Step 4: Validate Unit Economics

Before scaling ads, know your numbers:

- COGS and gross margin
- Target CAC based on LTV
- Break-even ROAS

If your math doesn’t work at small scale, it won’t work at large scale. Fix the product, price, or economics before spending heavily on acquisition.

---

## The Checklist

- [ ] Demand validated (waitlist, pre-sales, or manual outreach)
- [ ] Pricing tested and profitable at small scale
- [ ] Messaging and positioning tested and refined
- [ ] Unit economics calculated and sustainable

Only then does ad spend make sense. Validate first. Scale second.`,
  },
  {
    slug: 'meta-ads-vs-google-ads-for-premium-brands',
    title: 'Meta Ads vs Google Ads for Premium Brands: When Each Wins',
    excerpt:
      'Both platforms work—but for different goals and customer journeys. Here’s when to lean on Meta, when on Google, and when on both.',
    published: true,
    published_at: '2026-01-30T12:00:00Z',
    tags: ['meta-ads', 'google-ads', 'premium-brands'],
    seo_title: 'Meta Ads vs Google Ads for Premium Brands',
    seo_description:
      'When to use Meta vs Google for premium and DTC brands: channel strengths, use cases, and decision framework.',
    content: `## Two Different Intent Signals

**Google Ads** — Users are searching. They have a problem or desire and are actively looking for a solution. Intent is high and immediate.

**Meta Ads** — Users are scrolling. They’re browsing, not hunting. You interrupt with relevance. Intent is lower but reach is huge.

Premium brands need both, but at different stages.

---

## When Meta Wins

Meta excels when:

- **Discovery is the goal** — New audiences who don’t know you exist. Broad reach, interest targeting, lookalikes.
- **Visual products** — Fashion, beauty, home, lifestyle. Creative carries the message.
- **Consideration and retargeting** — Warm audiences who’ve visited, engaged, or added to cart. Meta’s retargeting is strong.
- **Lower-funnel retargeting** — Dynamic ads, catalog sales, abandoned cart.

Use Meta for top-of-funnel awareness and mid-funnel consideration. Creative and audience testing matter more than keywords.

---

## When Google Wins

Google excels when:

- **Intent is high** — Users searching for your category, brand, or problem. Search ads meet demand that’s already there.
- **Performance branding** — Capture brand searches so competitors don’t. Defend and convert high-intent traffic.
- **Shopping and comparison** — Shopping ads and PLAs for e-commerce. Users comparing options.
- **Consideration keywords** — “Best [product],” “reviews,” “[competitor] alternative.” You intercept the comparison phase.

Use Google when people are actively looking. Less discovery, more conversion.

---

## Decision Matrix

| Scenario | Primary Channel | Secondary |
|----------|-----------------|-----------|
| New brand, no awareness | Meta | — |
| Established brand, defend search | Google | Meta retargeting |
| Visual / impulse product | Meta | Google Shopping |
| High-intent, considered purchase | Google | Meta retargeting |
| Full-funnel growth | Both | — |

---

## For Premium Brands

Premium brands often benefit from:

1. **Meta** for discovery and emotional storytelling
2. **Google** for capturing high-intent searches and defending brand
3. **Both** for retargeting and remarketing

Start where your audience is. Test. Allocate budget based on CAC and LTV by channel, not assumptions.`,
  },
  {
    slug: 'why-scaling-ads-too-early-kills-profitable-products',
    title: 'Why Scaling Ads Too Early Kills Profitable Products',
    excerpt:
      'Profitable at $5K/month doesn’t mean ready for $50K. Premature scaling destroys margin, data quality, and long-term viability.',
    published: true,
    published_at: '2026-02-04T12:00:00Z',
    tags: ['scaling', 'paid-ads', 'restraint'],
    seo_title: 'Why Scaling Ads Too Early Kills Profitable Products',
    seo_description:
      'The dangers of scaling paid ads before you’re ready—and how to know when it’s safe to grow spend.',
    content: `## The Temptation to Scale

You’re profitable at $5K ad spend. ROAS looks good. So you push to $15K, then $30K. Suddenly margins compress, CPA jumps, and what worked at small scale stops working. It’s a common pattern—and a costly one.

---

## What Goes Wrong When You Scale Too Early

**1. Audience exhaustion** — You’ve burned through your best segments. You’re now reaching marginal users who convert less and cost more.

**2. Rising CAC** — As you go up the demand curve, incremental acquisition gets more expensive. The first 100 customers are cheap; the next 1,000 may not be.

**3. Operational strain** — Fulfillment, support, and inventory may not be ready. One viral campaign can expose operational gaps you didn’t know existed.

**4. Learning reset** — Algorithm and creative tests get diluted at higher spend. You lose signal before you gain scale.

---

## Signs You’re Not Ready to Scale

- Profitability is fragile—one bad week and you’re in the red
- You haven’t tested multiple audiences, creatives, or offers
- Fulfillment, support, or inventory are already stretched
- You don’t have a clear view of LTV and payback period
- You’re scaling because of FOMO, not data

If any of these are true, focus on deepening before widening.

---

## When Scaling Makes Sense

Scale when:

- You’re profitably acquiring customers across multiple segments
- You’ve validated incrementality (ads aren’t just stealing organic)
- Operations can handle 2–3x volume without breaking
- You have a tested playbook: creative, audiences, offers, and landing experiences

---

## The Restraint Mindset

Scaling too early feels like momentum. It’s often haste. The brands that win long-term are the ones that:

- Lock in profitability before chasing volume
- Build systems before increasing spend
- Treat scaling as a deliberate phase, not a reflex

Profitable at small scale is a signal to refine, not necessarily to spend more. Get the foundation right. Then scale.`,
  },
  {
    slug: 'in-house-marketing-vs-performance-agency-cost',
    title: 'The Real Cost of In-House Marketing vs Hiring a Performance Agency',
    excerpt:
      'In-house versus agency isn’t just about hourly rates. It’s about total cost, speed, and risk. Here’s a clear framework.',
    published: true,
    published_at: '2026-02-06T12:00:00Z',
    tags: ['agency', 'in-house', 'pricing'],
    seo_title: 'In-House vs Performance Agency: The Real Cost',
    seo_description:
      'A transparent comparison of in-house marketing costs vs. hiring a performance agency—without the spin.',
    content: `## It’s Not Just the Retainer

When comparing in-house vs. agency, most people compare salary to monthly fee. That’s incomplete. The real cost includes hiring, tools, management, turnover, and opportunity cost.

---

## What In-House Actually Costs

**Direct costs:**
- Salary (or multiple salaries for specialists)
- Benefits (often 25–35% of salary)
- Tools: ad platforms, analytics, creative tools, project management
- Training and certifications

**Hidden costs:**
- Recruiting and onboarding (3–6 months to full productivity)
- Management time (your time, or a marketing lead’s)
- Vacations, sick days, turnover—you cover the gap
- Opportunity cost of a generalist vs. specialists

A single mid-level paid media manager might cost $80K–$120K all-in. Add tools ($2K–$5K/month) and management overhead. You’re easily at $10K–$12K/month for one person—and they can’t do strategy, creative, analytics, and execution at a high level alone.

---

## What an Agency Actually Costs

**Direct costs:**
- Monthly retainer (varies by scope: $5K–$20K+ for performance work)
- Ad spend (separate; you control this)

**What you get:**
- A team: strategist, media buyer, analyst, creative support
- Tool access and expertise
- No benefits, recruiting, or turnover on your books
- Faster ramp-up—days or weeks, not months

The tradeoff: less control, potential for misalignment, and the need to manage the relationship. But for many brands, the total cost and risk are lower than building in-house from scratch.

---

## When In-House Makes Sense

- You’re spending enough to justify a full-time specialist ($500K+ annual ad spend, often more)
- You need deep integration with product, sales, or operations
- You have existing marketing leadership to manage and develop talent
- You’re playing a long game and want institutional knowledge in-house

---

## When an Agency Makes Sense

- You’re sub-scale for a full team but need expert execution
- You want speed—launch and iterate without a long hiring process
- You prefer variable cost over fixed headcount
- You want access to cross-client learnings and best practices

---

## Framing the Decision

Don’t compare “agency retainer” to “one salary.” Compare:

- Total cost of ownership (in-house) vs. total cost of engagement (agency)
- Time to value (how fast can you get results?)
- Risk (turnover, ramp-up, single points of failure)

The right choice depends on your stage, spend, and capacity to hire and manage. Be honest about both the numbers and the intangibles.`,
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
