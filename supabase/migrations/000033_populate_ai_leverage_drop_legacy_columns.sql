-- Migration: Populate aiLeverage in package levels, drop legacy modules/resources/bonus_assets
-- Pre-launch: no backward compatibility. All packages use levels structure only.

-- 1. Add aiLeverage to each level for all four packages (required for validation)
-- Web Apps
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('Use ChatGPT and Cursor to generate landing page code 3-5x faster than manual coding. Cursor''s AI-assisted development helps you build a functional Stripe-integrated landing page in 2-4 weeks instead of 6-8 weeks. This speed-to-market enables you to launch and start generating $500-$2,000/month revenue within the first month. AI handles repetitive code patterns, error debugging, and copy optimization, allowing you to focus on business logic and customer acquisition. GitHub Copilot assists with boilerplate code generation, while ChatGPT helps with copywriting, user flow design, and marketing messaging.'::text)),
    '{level2,aiLeverage}', to_jsonb('Leverage AI for rapid MVP development: Cursor generates Supabase schema patterns, ChatGPT helps design authentication flows, and Claude assists with API endpoint planning. This AI-assisted development reduces build time from 12-16 weeks to 6-8 weeks, enabling faster market entry. The $2,000-$8,000/month revenue target is achievable because AI handles 40-60% of boilerplate code, allowing you to focus on unique value propositions and user acquisition. GitHub Copilot accelerates feature development, while optional OpenAI API integration enables basic AI features that differentiate your SaaS from competitors.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('AI is both a development tool AND a product feature. Use Cursor and Claude for complex architecture design, integrate OpenAI and Anthropic APIs to build AI-powered features (chatbots, recommendation systems, automation) that differentiate your SaaS. This dual AI leverage (development + product) enables building enterprise-grade platforms that command $10,000-$50,000+/month revenue. AI accelerates development while AI features create premium pricing and competitive moats. GitHub Copilot handles advanced code patterns, and AI-powered debugging tools optimize performance at scale.'::text)
)
WHERE slug = 'web-apps' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Social Media
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('Use ChatGPT for daily content ideation and caption writing, Canva AI for image creation, and Claude for brand voice consistency. This AI-powered content creation enables producing 30+ posts per month in 5-10 hours instead of 20-30 hours. The $300-$1,000/month revenue comes from monetizing your personal brand through affiliate marketing, sponsored content, and product sales - all made possible by AI''s content multiplication effect. Optional tools like Midjourney or DALL-E can create unique visuals, while AI hashtag research tools optimize discoverability.'::text)),
    '{level2,aiLeverage}', to_jsonb('Scale content creation for multiple clients using AI: ChatGPT generates client-specific content batches, Canva AI creates branded visuals, and automation tools schedule everything. This AI leverage allows managing 3-5 clients simultaneously, generating $1,000-$3,000/month. AI''s content multiplication (one hour of AI-assisted work = 10 hours of manual work) is the core revenue driver. Buffer AI features and Later AI optimize posting times, while AI-powered reporting tools create professional client reports that justify premium pricing.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('AI powers the entire agency operation: content strategy at scale, team efficiency through AI-assisted workflows, and premium services (AI-powered analytics, competitive intelligence) that command $3,000-$10,000+/month per client. AI enables the agency to deliver enterprise-level results with a lean team, maximizing profit margins. Hootsuite AI features automate complex multi-platform campaigns, advanced analytics AI provides strategic insights, and AI workflow tools train and scale your team efficiently.'::text)
)
WHERE slug = 'social-media' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Agency
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('AI is your service delivery engine: ChatGPT and Claude for content creation, AI SEO tools (like Jasper or specialized SEO AI) for optimization, AI ad creation tools for campaign development. This AI leverage allows a solo operator to deliver services that typically require 2-3 person teams, enabling $2,000-$5,000/month revenue. AI handles 60-70% of service delivery work, allowing you to focus on client relationships and business development. Canva AI accelerates design work, while AI proposal tools help you win more clients.'::text)),
    '{level2,aiLeverage}', to_jsonb('AI standardizes and scales service delivery across your team: AI-powered SOPs ensure consistency, AI training systems onboard new hires faster, and AI quality control maintains standards. This enables managing 5-10 clients simultaneously with a 2-5 person team, generating $5,000-$15,000/month. AI is the force multiplier that allows small teams to compete with larger agencies. ChatGPT and Claude create team workflows, AI workflow automation tools streamline operations, and AI quality control systems ensure every deliverable meets agency standards.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('AI enables enterprise-level service delivery: AI-powered multi-service offerings, AI-driven client management systems, and premium AI-enhanced services (AI strategy consulting, AI implementation) that command $15,000-$50,000+/month per client. AI is both operational efficiency and a premium service offering, maximizing revenue per client and profit margins. Enterprise AI platforms automate complex workflows, ChatGPT and Claude provide strategic consulting capabilities, and AI analytics platforms deliver insights that justify premium pricing.'::text)
)
WHERE slug = 'agency' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- Freelancing
UPDATE products SET levels = jsonb_set(
  jsonb_set(
    jsonb_set(levels, '{level1,aiLeverage}', to_jsonb('Use ChatGPT to write compelling Fiverr gig descriptions and portfolio copy, Claude for service delivery templates, and Canva AI for portfolio visuals. This AI leverage enables delivering high-quality work 2-3x faster, allowing you to complete more gigs and generate $500-$1,500/month part-time. AI makes freelancing accessible by reducing skill barriers and time investment. Fiverr''s AI features help optimize your gig listings, while AI service delivery templates ensure consistent quality that builds your reputation.'::text)),
    '{level2,aiLeverage}', to_jsonb('AI powers professional freelancing: ChatGPT and Claude generate winning proposals and contracts, AI communication tools handle client updates, and AI-assisted service delivery enables taking on 2-3x more clients. This AI leverage transforms freelancing from gig work to a full-time business generating $1,500-$4,000/month. AI handles administrative overhead, allowing focus on high-value work. Proposal AI tools create professional documents quickly, contract AI ensures legal compliance, and AI communication automation maintains client relationships while you focus on delivery.'::text)
  ),
  '{level3,aiLeverage}', to_jsonb('AI enables premium positioning: use ChatGPT and Claude for thought leadership content, AI platforms for high-value deliverables (AI strategy, AI implementation consulting), and AI systems for direct client acquisition. This AI leverage transforms freelancing into premium consulting, commanding $4,000-$10,000+/month through AI-enhanced services and positioning. AI is both the delivery method and the value proposition. Advanced AI platforms enable complex consulting deliverables, AI positioning tools establish your expertise, and direct client AI systems help you bypass platforms to work with high-value clients directly.'::text)
)
WHERE slug = 'freelancing' AND levels IS NOT NULL AND levels != '{}'::jsonb;

-- 2. Drop legacy columns (modules, resources, bonus_assets)
ALTER TABLE products DROP COLUMN IF EXISTS modules;
ALTER TABLE products DROP COLUMN IF EXISTS resources;
ALTER TABLE products DROP COLUMN IF EXISTS bonus_assets;

-- 3. Update table comment (remove backward-compatibility reference)
COMMENT ON TABLE products IS 'Products table. Package content uses levels JSONB (Level 1–3) with aiLeverage, implementationPlan, platformGuides, creativeFrameworks, templates.';
