/**
 * Content for 2x ROAS blog post.
 * Narrative structure with prose, table, mermaid diagram, and bold/italic.
 */
export const ROAS_2X_METRIC_CONTENT = `## The Myth of "Good" ROAS

"We're at 2x ROAS" sounds like a win. Sometimes it is. Sometimes it's a sign you're **under-investing**, **over-discounting**, or **measuring the wrong thing**. ROAS is a ratio—revenue over ad spend—but *context defines whether it's healthy or not*.


## What 2x ROAS Actually Means

At 2x ROAS, for every dollar spent on ads, you generate two dollars in revenue. That sounds profitable until you remember: **revenue isn't profit**.

If your gross margin is **40%**, that $2 in revenue yields $0.80 in gross profit. You spent $1 to make $0.80. You're losing money.

The same 2x ROAS can mean profit or loss depending on your **margin**, **attribution accuracy**, and **stage of the business**. A high-margin brand in a learning phase might celebrate 2x. A thin-margin brand optimizing for volume might be quietly bleeding.


## When 2x ROAS Is Good vs. Bad

| Context | 2x ROAS Is Good | 2x ROAS Is Bad |
|---------|-----------------|----------------|
| **Margins** | Gross margins 60%+ | Margins thin; profitable on paper, not in reality |
| **Attribution** | Measuring attributed revenue that's reasonably accurate | Last-click only; ignoring assist conversions |
| **Pricing** | Price integrity maintained | Heavy discounts to hit the number |
| **Stage** | Learning or retention phase; short-term profit secondary | Scale phase; you need sustainable unit economics |

Don't judge the number in isolation. *Judge it against your margin, your goals, and your measurement.*


## When ROAS Becomes a Bad Metric

ROAS encourages some brands to chase the wrong outcomes. **Chase volume at any cost**—"We hit 3x!" while margins collapse. **Cut spend too early**—profitable at 2x, but scalable at 1.5x; they never test. **Optimize for the wrong outcome**—maximizing revenue instead of profit or LTV.

Use ROAS as **one input**, not the only input. Pair it with margin, **CAC**, **LTV**, and cash flow.


## The Math at a Glance

How margin and ROAS interact:

\`\`\`mermaid
flowchart LR
  subgraph "2x ROAS"
    A[$1 ad spend] --> B[$2 revenue]
  end
  B --> C{40% margin?}
  C -->|Yes| D[$0.80 profit - LOSS]
  B --> E{60% margin?}
  E -->|Yes| F[$1.20 profit - WIN]
\`\`\`


## A Better Framing

Instead of "What's our ROAS?", ask:

- *What's our blended CAC and does it work with our unit economics?*
- *What's our payback period?*
- *At what ROAS are we profitable, and at what ROAS can we scale?*

Define your **minimum viable ROAS** from margin and overhead. Then use ROAS to guide spend, not to celebrate or panic in isolation.


## The Bottom Line

2x ROAS is neither good nor bad by itself. It depends on your margins, attribution, and stage. *Define your break-even ROAS, pair ROAS with profit metrics, and don't let a single number drive decisions.*`;
