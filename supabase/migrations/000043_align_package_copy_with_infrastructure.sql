-- Migration: Align package descriptions and pricing justification with PACKAGE_CONTENT_INFRASTRUCTURE
-- Removes inflated claims (e.g. "500+ templates") and aligns with actual file-based content.

-- Web Apps: 45 files; production-ready templates and implementation guides
UPDATE products
SET
  content_hours = '45 files',
  description = 'Build powerful web applications with AI assistance. Transform your skills into profitable web development projects with implementation plans, platform guides, creative frameworks, and production-ready templates.',
  pricing_justification = 'Comprehensive level-based content with 45 files: implementation plans, platform setup guides, creative frameworks, launch checklists, troubleshooting guides, budget worksheets, and code templates (Next.js, Supabase, Stripe). Comparable to bootcamps priced at $2,000-$6,000+. Lifetime access with immediate ROI through templates and tools.'
WHERE slug = 'web-apps';

-- Social Media: 39 files
UPDATE products
SET
  content_hours = '39 files',
  description = 'Monetize your AI-driven content by creating profitable social media automation tools. Grow your presence and engagement with implementation plans, platform guides, and templates.',
  pricing_justification = 'Complete social media package with 39 files: implementation plans, platform setup guides (Buffer, Canva, Later, Hootsuite), creative frameworks, content strategy templates, client reporting templates, and budget planners. Comparable to agency services at $500-$2,000/month. Lifetime access with templates that save 10+ hours/week.'
WHERE slug = 'social-media';

-- Agency: 40 files
UPDATE products
SET
  content_hours = '40 files',
  description = 'Build a profitable agency selling AI-powered services to business clients. Scale your operations with proven systems, implementation plans, and templates.',
  pricing_justification = 'Complete agency package with 40 files: implementation plans, platform setup guides (Systeme.io, GoHighLevel, HubSpot, ClickUp), creative frameworks, client onboarding templates, agency operations templates, and budget planners. Comparable to agency coaching programs at $2,000-$10,000+. ROI potential: $10K-$50K+ monthly revenue increase.'
WHERE slug = 'agency';

-- Freelancing: 41 files
UPDATE products
SET
  content_hours = '41 files',
  description = 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings. Build a successful freelancing career with implementation plans and templates.',
  pricing_justification = 'Complete freelancer package with 41 files: implementation plans, platform setup guides (Fiverr, Upwork, Hello Bonsai, Stripe), creative frameworks, proposal and contract templates, and budget planners. ROI potential: $1K-$10K+ monthly income increase. Accessible pricing that pays for itself with 1-2 projects.'
WHERE slug = 'freelancing';
