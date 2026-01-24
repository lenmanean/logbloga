-- Migration: Remove illustrative revenue from aiLeverage descriptions
-- Revenue figures remain in level metadata (expectedProfit); avoid reiteration in AI leverage panels.

-- Web Apps
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('We use ChatGPT, Cursor, and GitHub Copilot. This AI-assisted approach helps you build a functional Stripe-integrated landing page in 2-4 weeks instead of 6-8 weeks and reach market faster.'::text)),
    '{level2,aiLeverage}', to_jsonb('We use Cursor, ChatGPT, Claude, and GitHub Copilot, with optional OpenAI API integration. This AI leverage supports rapid MVP development and faster market entry (e.g. 6-8 weeks instead of 12-16).'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('We use Cursor, Claude, OpenAI and Anthropic APIs, and GitHub Copilot. AI serves as both a development tool and a product feature. This dual leverage supports building enterprise-grade platforms.'::text)
)
WHERE slug = 'web-apps' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Social Media
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('We use ChatGPT, Canva AI, and Claude, with optional tools like Midjourney or DALL-E. This AI leverage supports personal brand monetization through affiliate marketing, sponsored content, and product sales.'::text)),
    '{level2,aiLeverage}', to_jsonb('We use ChatGPT, Canva AI, Buffer, Later, and related automation tools. This AI leverage supports scaling content creation and managing 3-5 clients simultaneously. AI multiplies your output (e.g. one hour of AI-assisted work = 10 hours of manual work).'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('We use Hootsuite, advanced analytics AI, and related workflow tools. This AI leverage supports running a social media agency with a lean team and enterprise-level results.'::text)
)
WHERE slug = 'social-media' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Agency
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('We use ChatGPT, Claude, Canva AI, AI SEO tools (e.g. Jasper or similar), and AI ad-creation tools. This AI leverage allows a solo operator to deliver services that typically require 2-3 person teams.'::text)),
    '{level2,aiLeverage}', to_jsonb('We use ChatGPT, Claude, AI workflow automation, and related tools. This AI leverage supports scaling service delivery across your team and managing 5-10 clients with a 2-5 person team.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('We use enterprise AI platforms, ChatGPT, Claude, and AI analytics tools. This AI leverage supports multi-service delivery and premium offerings.'::text)
)
WHERE slug = 'agency' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Freelancing
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('We use ChatGPT, Claude, Canva AI, and Fiverr''s AI features. This AI leverage supports part-time freelancing and helps you deliver work 2-3x faster.'::text)),
    '{level2,aiLeverage}', to_jsonb('We use ChatGPT, Claude, proposal and contract AI tools, and communication automation. This AI leverage supports full-time freelancing and taking on 2-3x more clients.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('We use ChatGPT, Claude, advanced AI platforms, and direct-client AI systems. This AI leverage supports premium consulting and positioning.'::text)
)
WHERE slug = 'freelancing' AND levels IS NOT NULL AND levels != '{}'::jsonb;
