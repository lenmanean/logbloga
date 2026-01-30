# Package Content Infrastructure — Complete File-Level Specification

**Purpose:** Authoritative reference for implementing every package content file. Use this when creating, uploading, or linking level-based content.

**Sources:** `lib/data/package-level-content.ts`, `lib/data/package-level-titles.ts`, package UI (`components/ui/package-levels-content.tsx`, `components/ui/whats-included.tsx`). Pricing from database (migration `000026_optimize_package_pricing.sql`).

**Last Updated:** January 27, 2026  
**Implementation status** (as of January 27, 2026):
- Web Apps Package - ✅ FULLY IMPLEMENTED (all 45 files created, documented, and uploaded)
  - Infrastructure reviewed and validated
  - Documentation updated with AI Prompts files
  - Database architecture documented
  - File counts corrected (42 → 45)
  - Ready to serve as template for other packages

---

## Table of Contents

1. [Overview](#1-overview)
2. [Common Structure Across All Packages](#2-common-structure-across-all-packages)
3. [Web Apps Package](#3-web-apps-package)
4. [Social Media Package](#4-social-media-package)
5. [Agency Package](#5-agency-package)
6. [Freelancing Package](#6-freelancing-package)
7. [Storage, Paths & Delivery](#7-storage-paths--delivery)
8. [Summary Tables](#8-summary-tables)

---

## 1. Overview

### 1.1 Package Slugs & Categories

| Package      | Slug          | Category    |
|-------------|---------------|-------------|
| Web Apps    | `web-apps`    | web-apps    |
| Social Media| `social-media`| social-media|
| Agency      | `agency`      | agency      |
| Freelancing | `freelancing` | freelancing |

### 1.2 Level Titles (by package)

| Package      | Level 1                          | Level 2                         | Level 3                            |
|-------------|-----------------------------------|----------------------------------|------------------------------------|
| Web Apps    | Landing Page / Simple Web App     | SaaS MVP Application             | Enterprise SaaS Platform           |
| Social Media| Personal Brand / Content Creator  | Social Media Management Service  | Full-Service Social Media Agency   |
| Agency      | Solo Agency / Freelance+          | Small Team Agency                | Established Multi-Service Agency   |
| Freelancing | Part-Time Freelance Side Hustle   | Full-Time Freelance Business     | Premium Freelance Consultant       |

### 1.3 Content Categories per Level

Every level includes **seven** content categories (Web Apps, Social Media, Agency, and Freelancing). **7 Categories** (in UI display order):

1. **Implementation Plan** — One file per level. Step-by-step roadmap.
2. **Platform Setup Guides** — One or more guides per level (4 files per level typical). Account creation, configuration, screenshots.
3. **Creative Decision Frameworks** — Worksheets, exercises, decision prompts (2–3 files per level).
4. **Launch & Marketing** — Launch checklists, marketing guides, customer acquisition (1–2 files per level). (Web Apps, Social Media, Agency, Freelancing.)
5. **Troubleshooting** — Common issues, solutions, debugging guides (1 file per level). (Web Apps, Social Media, Agency, Freelancing.)
6. **Time & Budget Planning** — Time investment planners, budget worksheets, success metrics (1–2 files per level). (Web Apps, Social Media, Agency, Freelancing.)
7. **Templates & Checklists** — Ready-to-use resources (docs, spreadsheets, code, ZIPs; 3+ files per level, includes AI Prompts).

**Note:** This order reflects the natural user workflow — users access templates/checklists throughout their journey, making them easily accessible at the end of each level.

File types used: **MD**, **PDF**, **XLSX**, **DOCX**, **ZIP**. **Format consistency across all packages:** Implementation plans, platform guides, and creative frameworks use **MD** (hosted). Launch & Marketing, Troubleshooting, and Planning guides use **MD**; planning worksheets/calculators use **PDF** (downloadable). **Templates vary by package** (ZIP, MD, XLSX, DOCX, PDF) according to business model, context, and use-case.

---

## 2. Common Structure Across All Packages

### 2.1 Implementation Plan

- **Count:** 1 per level.
- **Role:** Roadmap with milestones, tasks, and (where applicable) trackable schedule.
- **Typical length:** ~15–40 pages equivalent (varies by level).
- **Format:** **All packages** → `.md` (hosted).

### 2.2 Platform Setup Guides

- **Role:** Step-by-step setup for specific platforms (accounts, config, integrations).
- **Conventions:** Numbered steps, screenshots (e.g. 1920×1080), troubleshooting where relevant.
- **Format:** **All packages** → `.md` (hosted).

### 2.3 Creative Decision Frameworks

- **Role:** Guided exercises (niche, positioning, pricing, strategy, etc.).
- **Format:** **All packages** → `.md` (hosted). Fillable or exercise-based.

### 2.4 Templates & Checklists

- **Formats:** PDF, XLSX, DOCX, MD, ZIP (code or multi-file packs).
- **Role:** Editable templates, checklists, code starters, or bundled assets.

### 2.5 Launch & Marketing (Web Apps, Social Media, Agency, Freelancing)

- **Role:** Launch checklists, basic marketing, customer acquisition, enterprise playbooks.
- **Format:** **All packages** → `.md` (hosted).

### 2.6 Troubleshooting (Web Apps, Social Media, Agency, Freelancing)

- **Role:** Common issues and solutions, debugging guides.
- **Format:** **All packages** → `.md` (hosted).

### 2.7 Time & Budget Planning (Web Apps, Social Media, Agency, Freelancing)

- **Role:** Time investment planners, budget worksheets, success metrics, scaling budgets.
- **Format:** Guides/strategies → `.md` (hosted); worksheets/calculators → `.pdf` (downloadable).

### 2.8 Schedule (optional, in DB)

Levels can optionally store a **schedule** (trackable timeline) in the database:

- `date` (YYYY-MM-DD), `milestone`, `tasks` (string[]), `completed` (boolean), `order` (number).

This is separate from the implementation plan **file**; the file is the canonical content.

### 2.9 Database vs Static Content Architecture

**Hybrid Approach:** Package content uses a hybrid storage model:

**Database-Stored (JSONB in products.levels):**
- `implementationPlan` (file, type, description)
- `platformGuides` (array of guides)
- `creativeFrameworks` (array of frameworks)
- `templates` (array of templates)

**Static-Only (in package-level-content.ts):**
- `launchMarketing` (array of guides)
- `troubleshooting` (array of guides)
- `planning` (array of guides)
- `aiLeverage` (description text)

**Rationale:** The database approach was designed for the original 4 categories. The 3 additional categories (Launch & Marketing, Troubleshooting, Planning) were added later and remain static-only for simplicity. This allows the first 4 categories to be edited via database if needed, while the latter 3 remain version-controlled in code.

**Merge Strategy:** The `getLevelContent()` function merges database data with static content, with database taking precedence for the 4 supported categories.

**For Template Replication:** This architecture is reusable for all packages. The same hybrid approach applies to Social Media, Agency, and Freelancing packages.

---

## 3. Web Apps Package

**Slug:** `web-apps`  
**File conventions:** Implementation plans, setup guides, and frameworks use **Markdown (`.md`)**. Templates use **ZIP** (code) or **MD** (checklists).

**AI Prompts Innovation:** Each level includes a dedicated AI Prompts file with copy-paste ready prompts for non-technical users. These files provide step-by-step instructions for using AI coding assistants (Cursor, ChatGPT, GitHub Copilot) to implement each phase of the plan. This is a key differentiator that democratizes technical implementation.

**Note:** Web Apps uses `.md` for budget planning worksheets instead of PDF to enable in-browser viewing and a better user experience. This design decision applies to all packages going forward — MD files allow users to view content immediately without downloading, while still providing PDF download options. Other file types (XLSX, DOCX, ZIP) remain as specified for their specific use cases.

### 3.1 Level 1: Landing Page / Simple Web App

- **Time investment:** 2–4 weeks  
- **Expected revenue:** $500–$2,000/month  
- **Platform costs:** $0–50/month  
- **AI leverage:** ChatGPT, Cursor, GitHub Copilot; build a Stripe-integrated landing page in 2–4 weeks.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `web-apps-level-1-plan.md` | md | Step-by-step roadmap for simple single-page app / landing page SaaS |
| 2 | Platform Setup | `nextjs-simple-setup-guide.md` | md | Next.js — create project, structure, run dev server |
| 3 | Platform Setup | `vercel-deployment-guide.md` | md | Vercel — connect repo, env vars, deploy, optional custom domain |
| 4 | Platform Setup | `stripe-basic-setup.md` | md | Stripe — account, API keys, basic payment integration |
| 5 | Platform Setup | `github-setup-guide.md` | md | GitHub — repo, git init, push, connect to Vercel |
| 6 | Creative Framework | `idea-generation-framework.md` | md | Idea Generation Framework |
| 7 | Creative Framework | `value-proposition-worksheet.md` | md | Value Proposition Worksheet |
| 8 | Creative Framework | `simple-mvp-framework.md` | md | Simple MVP Framework |
| 9 | Template | `basic-starter-template.zip` | zip | Basic Starter Template — minimal Next.js starter |
| 10 | Template | `mvp-checklist.md` | md | MVP Checklist |
| 11 | Template | `web-apps-level-1-ai-prompts.md` | md | AI Prompts for Implementation |
| 12 | Launch & Marketing | `web-apps-level-1-launch-checklist.md` | md | Launch Checklist |
| 13 | Launch & Marketing | `web-apps-level-1-basic-marketing-guide.md` | md | Basic Marketing Guide |
| 14 | Troubleshooting | `web-apps-level-1-common-issues-solutions.md` | md | Common Issues & Solutions |
| 15 | Planning | `web-apps-level-1-time-investment-planner.md` | md | Time Investment Planner |
| 16 | Planning | `web-apps-level-1-budget-planning-worksheet.md` | md | Budget Planning Worksheet |

**Level 1 total: 16 files.**

---

### 3.2 Level 2: SaaS MVP Application

- **Time investment:** 6–8 weeks  
- **Expected revenue:** $2,000–$8,000/month  
- **Platform costs:** $50–200/month  
- **AI leverage:** Cursor, ChatGPT, Claude, GitHub Copilot; optional OpenAI API; 6–8 weeks to MVP.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `web-apps-level-2-plan.md` | md | Step-by-step roadmap for medium-complexity SaaS |
| 2 | Platform Setup | `nextjs-saas-starter-setup.md` | md | Next.js SaaS starter — clone, install, structure, config |
| 3 | Platform Setup | `supabase-setup-guide.md` | md | Supabase — project, DB, auth, RLS, storage |
| 4 | Platform Setup | `stripe-integration-guide.md` | md | Stripe — subscriptions, webhooks, customer portal |
| 5 | Platform Setup | `vercel-advanced-deployment.md` | md | Vercel — advanced config, env, edge, domains |
| 6 | Creative Framework | `mvp-development-framework.md` | md | MVP Development Framework |
| 7 | Creative Framework | `go-to-market-strategy.md` | md | Go-to-Market Strategy |
| 8 | Creative Framework | `pricing-strategy-saas.md` | md | Pricing Strategy for SaaS |
| 9 | Template | `saas-starter-template.zip` | zip | SaaS Starter Template — Next.js + Supabase + Stripe |
| 10 | Template | `development-milestones-checklist.md` | md | Development Milestones Checklist |
| 11 | Template | `web-apps-level-2-ai-prompts.md` | md | AI Prompts for Implementation |
| 12 | Launch & Marketing | `web-apps-level-2-customer-acquisition-guide.md` | md | Customer Acquisition Guide |
| 13 | Troubleshooting | `web-apps-level-2-troubleshooting-debugging-guide.md` | md | Troubleshooting & Debugging Guide |
| 14 | Planning | `web-apps-level-2-success-metrics-dashboard.md` | md | Success Metrics Dashboard |
| 15 | Planning | `web-apps-level-2-budget-planning-worksheet.md` | md | Budget Planning Worksheet |

**Level 2 total: 15 files.**

---

### 3.3 Level 3: Enterprise SaaS Platform

- **Time investment:** 10–12 weeks  
- **Expected revenue:** $10,000–$50,000+/month  
- **Platform costs:** $200–500/month  
- **AI leverage:** Cursor, Claude, OpenAI/Anthropic APIs, GitHub Copilot; AI as dev tool and product feature.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `web-apps-level-3-plan.md` | md | Step-by-step roadmap for complex SaaS (e.g. DOER-style) |
| 2 | Platform Setup | `advanced-supabase-setup.md` | md | Advanced Supabase — complex schema, RLS, real-time, storage |
| 3 | Platform Setup | `ai-integration-guide.md` | md | AI services — OpenAI, Anthropic, keys, prompts, cost |
| 4 | Platform Setup | `third-party-integrations-guide.md` | md | Third-party APIs — architecture, webhooks, auth, retries |
| 5 | Platform Setup | `vercel-edge-functions.md` | md | Vercel Edge Functions — use cases, deploy, optimize |
| 6 | Creative Framework | `advanced-mvp-framework.md` | md | Advanced MVP Framework |
| 7 | Creative Framework | `scaling-strategy.md` | md | Scaling Strategy |
| 8 | Template | `advanced-saas-template.zip` | zip | Advanced SaaS Template — AI, multi-tenant, integrations |
| 9 | Template | `ai-integration-examples.zip` | zip | AI Integration Examples — OpenAI, Anthropic, prompts, patterns |
| 10 | Template | `web-apps-level-3-ai-prompts.md` | md | AI Prompts for Implementation |
| 11 | Launch & Marketing | `web-apps-level-3-enterprise-marketing-playbook.md` | md | Enterprise Marketing Playbook |
| 12 | Launch & Marketing | `web-apps-level-3-partnership-strategy.md` | md | Partnership Strategy |
| 13 | Troubleshooting | `web-apps-level-3-advanced-troubleshooting-guide.md` | md | Advanced Troubleshooting Guide |
| 14 | Planning | `web-apps-level-3-scaling-operations-budget.md` | md | Scaling Operations Budget |

**Level 3 total: 14 files.**

---

**Web Apps package total: 45 files** (16 + 15 + 14).

### 3.4 Web Apps as Template

**Web Apps is the reference implementation** for package UX and structure.

**Same across packages:** User experience (library page, level tabs, section layout, expand button, download button, progress stepper, mark complete), navigation (overview, level1/2/3, section anchors), and structure (seven categories, hybrid DB/static content, allowlist-based download).

**Different per package:** Context, volume, and file types (e.g. Social Media, Agency, Freelancing may have different template types or counts). When replicating to other packages, match Web Apps’ UX and navigation; content and file lists follow package-level-content and level plans.

---

## 4. Social Media Package

**Slug:** `social-media`  
**File conventions:** Implementation plans, setup guides, and frameworks use **MD** (hosted). Launch & Marketing, Troubleshooting, and Planning guides use **MD** (hosted); planning worksheets use **PDF** (downloadable). Templates use **PDF**, **XLSX**, **DOCX**, or **ZIP** as specified.

### 4.1 Level 1: Personal Brand / Content Creator

- **Time investment:** 2–3 weeks  
- **Expected revenue:** $300–$1,000/month  
- **Platform costs:** $0–30/month  
- **AI leverage:** ChatGPT, Canva AI, Claude; optional Midjourney/DALL·E; affiliate, sponsored, product sales.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-1-plan.md` | md | Step-by-step roadmap for personal brand / simple service |
| 2 | Platform Setup | `buffer-setup-guide.md` | md | Buffer — account, scheduling |
| 3 | Platform Setup | `canva-setup-guide.md` | md | Canva — account, AI features, branding |
| 4 | Platform Setup | `google-analytics-setup-guide.md` | md | Google Analytics — property, goals, social tracking |
| 5 | Creative Framework | `niche-selection-worksheet.md` | md | Niche Selection Worksheet |
| 6 | Creative Framework | `brand-identity-framework.md` | md | Brand Identity Framework |
| 7 | Creative Framework | `content-direction-framework.md` | md | Content Direction Framework |
| 8 | Launch & Marketing | `social-media-level-1-first-monetization-guide.md` | md | First Monetization Guide |
| 9 | Launch & Marketing | `social-media-level-1-content-growth-checklist.md` | md | Content Growth Checklist |
| 10 | Troubleshooting | `social-media-level-1-common-creator-issues.md` | md | Common Creator Issues |
| 11 | Planning | `social-media-level-1-creator-income-planning.md` | md | Creator Income Planning |
| 12 | Planning | `social-media-level-1-monetization-budget-worksheet.pdf` | pdf | Monetization Budget Worksheet |
| 13 | Template | `content-strategy-template.xlsx` | xlsx | Content Strategy Template |
| 14 | Template | `daily-posting-checklist.pdf` | pdf | Daily Posting Checklist |

**Level 1 total: 14 files.**

---

### 4.2 Level 2: Social Media Management Service

- **Time investment:** 4–6 weeks  
- **Expected revenue:** $1,000–$3,000/month  
- **Platform costs:** $30–100/month  
- **AI leverage:** ChatGPT, Canva AI, Buffer, Later; scale content and manage 3–5 clients.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-2-plan.md` | md | Step-by-step roadmap for social media management service |
| 2 | Platform Setup | `later-setup-guide.md` | md | Later — scheduling, calendar |
| 3 | Platform Setup | `metricool-setup-guide.md` | md | Metricool — analytics, reporting |
| 4 | Platform Setup | `buffer-paid-setup-guide.md` | md | Buffer — paid tiers, team features |
| 5 | Creative Framework | `client-onboarding-framework.md` | md | Client Onboarding Framework |
| 6 | Creative Framework | `service-pricing-framework.md` | md | Service Pricing Framework |
| 7 | Launch & Marketing | `social-media-level-2-first-smm-clients-guide.md` | md | First SMM Clients Guide |
| 8 | Launch & Marketing | `social-media-level-2-service-portfolio-checklist.md` | md | Service Portfolio Checklist |
| 9 | Troubleshooting | `social-media-level-2-client-service-issues.md` | md | Client & Service Issues |
| 10 | Planning | `social-media-level-2-service-pricing-strategy.md` | md | Service Pricing Strategy |
| 11 | Planning | `social-media-level-2-smm-budget-planner.pdf` | pdf | SMM Budget Planner |
| 12 | Template | `content-calendar-template.xlsx` | xlsx | Content Calendar Template — multi-client |
| 13 | Template | `client-reporting-template.docx` | docx | Client Reporting Template — monthly reports |
| 14 | Template | `client-onboarding-checklist.pdf` | pdf | Client Onboarding Checklist |

**Level 2 total: 14 files.**

---

### 4.3 Level 3: Full-Service Social Media Agency

- **Time investment:** 8–12 weeks  
- **Expected revenue:** $3,000–$10,000+/month  
- **Platform costs:** $100–300/month  
- **AI leverage:** Hootsuite, advanced analytics AI, workflow tools; lean team, agency-level results.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-3-plan.md` | md | Step-by-step roadmap for social media agency |
| 2 | Platform Setup | `hootsuite-setup-guide.md` | md | Hootsuite — agency workflows, streams |
| 3 | Platform Setup | `advanced-analytics-setup.md` | md | Advanced analytics stack |
| 4 | Creative Framework | `agency-operations-framework.md` | md | Agency Operations Framework |
| 5 | Creative Framework | `service-suite-development.md` | md | Service Suite Development |
| 6 | Launch & Marketing | `social-media-level-3-agency-positioning-guide.md` | md | Agency Positioning Guide |
| 7 | Launch & Marketing | `social-media-level-3-partnership-outreach-strategies.md` | md | Partnership & Outreach Strategies |
| 8 | Troubleshooting | `social-media-level-3-agency-operations-issues.md` | md | Agency Operations Issues |
| 9 | Planning | `social-media-level-3-agency-revenue-strategy.md` | md | Agency Revenue Strategy |
| 10 | Planning | `social-media-level-3-agency-budget-planning.pdf` | pdf | Agency Budget Planning |
| 11 | Template | `team-management-templates.zip` | zip | Team Management Templates — PDFs, Excel, Word |

**Level 3 total: 11 files.**

---

**Social Media package total: 39 files** (14 + 14 + 11).

**Content location and upload:** Package content lives in `social-media-content/` at the repo root. To upload all 39 files to Supabase Storage (`digital-products/{productId}/{filename}`), run `npx tsx scripts/upload-social-media-files.ts`. The script uses `getAllowedFilenamesForPackage('social-media')` and supports MD, PDF, ZIP, XLSX, and DOCX. Ensure XLSX, DOCX, PDF, and ZIP binaries exist in `social-media-content/` (generate via build scripts or add real files; see `social-media-content/README.md`) for every allowlist entry.

---

## 5. Agency Package

**Slug:** `agency`  
**File conventions:** Implementation plans, setup guides, and frameworks use **MD** (hosted). Launch & Marketing, Troubleshooting, and Planning guides use **MD** (hosted); planning worksheets use **PDF** (downloadable). Templates use **ZIP** (multi-file packs).

**Platform setup options (Level 1 & 2):** Level 1 and Level 2 each describe **two** setup paths:

- **Option A (All-in-One):** Single platform (Systeme.io for L1, GoHighLevel for L2). Fewer guides, lower complexity.
- **Option B (Best-of-Breed):** Multiple tools (HubSpot, ClickUp, Hello Bonsai for L1; HubSpot Paid, ClickUp Paid, Zite for L2).

All listed guide **files** are included regardless of path; users choose which path to follow. The file list below includes every guide for both options.

### 5.1 Level 1: Solo Agency / Freelance+

- **Time investment:** 3–4 weeks  
- **Expected revenue:** $2,000–$5,000/month  
- **Platform costs:** $100–300/month  
- **AI leverage:** ChatGPT, Claude, Canva AI, AI SEO (e.g. Jasper), AI ad tools; solo delivery at 2–3 person capacity.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `agency-level-1-plan.md` | md | Step-by-step roadmap for solo agency / one-person operation |
| 2 | Platform Setup | `systeme-io-setup-guide.md` | md | **Option A** — Systeme.io all-in-one |
| 3 | Platform Setup | `hubspot-free-setup.md` | md | **Option B** — HubSpot free |
| 4 | Platform Setup | `clickup-free-setup.md` | md | **Option B** — ClickUp free |
| 5 | Platform Setup | `hello-bonsai-setup.md` | md | **Option B** — Hello Bonsai contracts/invoicing |
| 6 | Creative Framework | `agency-niche-framework.md` | md | Agency Niche Framework |
| 7 | Creative Framework | `service-package-framework.md` | md | Service Package Framework |
| 8 | Creative Framework | `target-client-framework.md` | md | Target Client Framework |
| 9 | Launch & Marketing | `agency-level-1-first-clients-guide.md` | md | First Agency Clients Guide |
| 10 | Launch & Marketing | `agency-level-1-solo-launch-checklist.md` | md | Solo Launch Checklist |
| 11 | Troubleshooting | `agency-level-1-solo-operations-issues.md` | md | Solo Agency Operations Issues |
| 12 | Planning | `agency-level-1-solo-revenue-strategy.md` | md | Solo Revenue Strategy |
| 13 | Planning | `agency-level-1-solo-budget-worksheet.pdf` | pdf | Solo Agency Budget Worksheet |
| 14 | Template | `client-onboarding-template.zip` | zip | Client Onboarding Template |

**Level 1 total: 14 files.**

---

### 5.2 Level 2: Small Team Agency

- **Time investment:** 6–8 weeks  
- **Expected revenue:** $5,000–$15,000/month  
- **Platform costs:** $300–800/month  
- **AI leverage:** ChatGPT, Claude, workflow automation; 2–5 person team, 5–10 clients.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `agency-level-2-plan.md` | md | Step-by-step roadmap for small agency (2–5 person team) |
| 2 | Platform Setup | `gohighlevel-setup-guide.md` | md | **Option A (recommended)** — GoHighLevel all-in-one |
| 3 | Platform Setup | `hubspot-paid-setup.md` | md | **Option B** — HubSpot paid |
| 4 | Platform Setup | `clickup-paid-setup.md` | md | **Option B** — ClickUp paid |
| 5 | Platform Setup | `zite-setup-guide.md` | md | **Option B** — Zite |
| 6 | Creative Framework | `team-management-framework.md` | md | Team Management Framework |
| 7 | Creative Framework | `service-suite-development.md` | md | Service Suite Development |
| 8 | Creative Framework | `client-retention-strategies.md` | md | Client Retention Strategies |
| 9 | Launch & Marketing | `agency-level-2-client-acquisition-scaling-guide.md` | md | Client Acquisition Scaling Guide |
| 10 | Launch & Marketing | `agency-level-2-team-portfolio-checklist.md` | md | Team & Portfolio Checklist |
| 11 | Troubleshooting | `agency-level-2-team-client-issues.md` | md | Team & Client Operations Issues |
| 12 | Planning | `agency-level-2-team-pricing-revenue-strategy.md` | md | Team Pricing & Revenue Strategy |
| 13 | Planning | `agency-level-2-team-budget-planner.pdf` | pdf | Team Budget Planner |
| 14 | Template | `agency-operations-templates.zip` | zip | Agency Operations Templates |

**Level 2 total: 14 files.**

---

### 5.3 Level 3: Established Multi-Service Agency

- **Time investment:** 12–16 weeks  
- **Expected revenue:** $15,000–$50,000+/month  
- **Platform costs:** $800–2,000/month  
- **AI leverage:** Enterprise AI, ChatGPT, Claude, analytics; multi-service, premium offerings.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `agency-level-3-plan.md` | md | Step-by-step roadmap for established agency (5+ person team) |
| 2 | Platform Setup | `gohighlevel-enterprise-setup.md` | md | GoHighLevel — enterprise features |
| 3 | Platform Setup | `enterprise-platform-setup.md` | md | Enterprise platform stack |
| 4 | Creative Framework | `enterprise-operations-framework.md` | md | Enterprise Operations Framework |
| 5 | Creative Framework | `team-scaling-guide.md` | md | Team Scaling Guide |
| 6 | Creative Framework | `enterprise-service-development.md` | md | Enterprise Service Development |
| 7 | Launch & Marketing | `agency-level-3-enterprise-outreach-guide.md` | md | Enterprise Outreach Guide |
| 8 | Launch & Marketing | `agency-level-3-partnership-strategies.md` | md | Partnership & Strategic Alliances |
| 9 | Troubleshooting | `agency-level-3-enterprise-operations-issues.md` | md | Enterprise Operations Issues |
| 10 | Planning | `agency-level-3-scaling-revenue-strategy.md` | md | Scaling & Revenue Strategy |
| 11 | Planning | `agency-level-3-enterprise-budget-planning.pdf` | pdf | Enterprise Budget Planning |
| 12 | Template | `enterprise-templates.zip` | zip | Enterprise Templates |

**Level 3 total: 12 files.**

---

**Agency package total: 40 files** (14 + 14 + 12).

**Content location and upload:** Package content lives in `agency-content/` at repo root. To upload all 40 files to Supabase Storage, run `npx tsx scripts/upload-agency-files.ts`. The script uses `getAllowedFilenamesForPackage('agency')` and supports MD, PDF, and ZIP. Ensure PDF and ZIP binaries exist in `agency-content/` (generate via build scripts or add real files; see `agency-content/README.md`) for every allowlist entry.

---

## 6. Freelancing Package

**Slug:** `freelancing`  
**File conventions:** Implementation plans, setup guides, and frameworks use **MD** (hosted). Launch & Marketing, Troubleshooting, and Planning guides use **MD** (hosted). Planning worksheets/calculators use **PDF** (downloadable). Templates use **MD**, **ZIP**, or **DOCX** as specified.

### 6.1 Level 1: Part-Time Freelance Side Hustle

- **Time investment:** 1–2 weeks  
- **Expected revenue:** $500–$1,500/month  
- **Platform costs:** $0–20/month  
- **AI leverage:** ChatGPT, Claude, Canva AI, Fiverr AI; part-time, 2–3× faster delivery.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `freelancing-level-1-plan.md` | md | Step-by-step roadmap for side hustle / part-time freelancing |
| 2 | Platform Setup | `fiverr-profile-setup-guide.md` | md | Fiverr — profile, gigs, optimization |
| 3 | Platform Setup | `hello-bonsai-setup-guide.md` | md | Hello Bonsai — contracts, invoicing |
| 4 | Platform Setup | `paypal-setup-guide.md` | md | PayPal — payments, payouts |
| 5 | Creative Framework | `service-definition-framework.md` | md | Service Definition Framework |
| 6 | Creative Framework | `portfolio-creation-framework.md` | md | Portfolio Creation Framework |
| 7 | Creative Framework | `pricing-strategy-worksheet.md` | md | Pricing Strategy Worksheet |
| 8 | Template | `gig-listing-template.md` | md | Gig Listing Template |
| 9 | Template | `portfolio-showcase-template.md` | md | Portfolio Showcase Template |
| 10 | Launch & Marketing | `freelancing-level-1-first-client-acquisition-guide.md` | md | First Client Acquisition Guide |
| 11 | Launch & Marketing | `freelancing-level-1-profile-optimization-checklist.md` | md | Profile Optimization Checklist |
| 12 | Troubleshooting | `freelancing-level-1-common-freelancing-issues.md` | md | Common Freelancing Issues |
| 13 | Planning | `freelancing-level-1-side-hustle-budget-planner.pdf` | pdf | Side Hustle Budget Planner |
| 14 | Planning | `freelancing-level-1-pricing-calculator-worksheet.pdf` | pdf | Pricing Calculator Worksheet |

**Level 1 total: 14 files.**

---

### 6.2 Level 2: Full-Time Freelance Business

- **Time investment:** 3–4 weeks  
- **Expected revenue:** $1,500–$4,000/month  
- **Platform costs:** $20–50/month  
- **AI leverage:** ChatGPT, Claude, proposal/contract AI, comms automation; full-time, 2–3× more clients.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `freelancing-level-2-plan.md` | md | Step-by-step roadmap for full-time freelancing business |
| 2 | Platform Setup | `upwork-setup-guide.md` | md | Upwork — profile, proposals, JSS |
| 3 | Platform Setup | `hello-bonsai-paid-setup.md` | md | Hello Bonsai — paid features |
| 4 | Platform Setup | `stripe-setup-guide.md` | md | Stripe — invoices, payouts |
| 5 | Platform Setup | `google-workspace-setup.md` | md | Google Workspace — email, calendar, Drive |
| 6 | Creative Framework | `professional-portfolio-framework.md` | md | Professional Portfolio Framework |
| 7 | Creative Framework | `pricing-strategy-advanced.md` | md | Pricing Strategy Advanced |
| 8 | Template | `proposal-templates.zip` | zip | Proposal Templates |
| 9 | Template | `contract-templates.zip` | zip | Contract Templates |
| 10 | Template | `client-communication-templates.md` | md | Client Communication Templates |
| 11 | Launch & Marketing | `freelancing-level-2-client-acquisition-strategies.md` | md | Client Acquisition Strategies |
| 12 | Launch & Marketing | `freelancing-level-2-portfolio-promotion-guide.md` | md | Portfolio Promotion Guide |
| 13 | Troubleshooting | `freelancing-level-2-client-management-issues.md` | md | Client Management Issues |
| 14 | Planning | `freelancing-level-2-full-time-budget-planner.pdf` | pdf | Full-Time Freelancer Budget Planner |
| 15 | Planning | `freelancing-level-2-pricing-scaling-strategy.md` | md | Pricing Scaling Strategy |

**Level 2 total: 15 files.**

---

### 6.3 Level 3: Premium Freelance Consultant

- **Time investment:** 6–8 weeks  
- **Expected revenue:** $4,000–$10,000+/month  
- **Platform costs:** $50–150/month  
- **AI leverage:** ChatGPT, Claude, advanced AI, direct-client systems; premium consulting positioning.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `freelancing-level-3-plan.md` | md | Step-by-step roadmap for premium freelancing / consultant |
| 2 | Platform Setup | `premium-platform-guide.md` | md | Premium platforms (e.g. Toptal, Arc) |
| 3 | Platform Setup | `direct-client-acquisition-guide.md` | md | Direct client acquisition beyond marketplaces |
| 4 | Platform Setup | `crm-setup-guide.md` | md | CRM (e.g. HubSpot, GoHighLevel for freelancers) |
| 5 | Creative Framework | `consultant-positioning-framework.md` | md | Consultant Positioning Framework |
| 6 | Creative Framework | `direct-client-framework.md` | md | Direct Client Framework |
| 7 | Template | `business-systems-templates.zip` | zip | Business Systems Templates |
| 8 | Launch & Marketing | `freelancing-level-3-premium-positioning-guide.md` | md | Premium Positioning Guide |
| 9 | Launch & Marketing | `freelancing-level-3-partnership-strategies.md` | md | Partnership Strategies |
| 10 | Troubleshooting | `freelancing-level-3-advanced-business-challenges.md` | md | Advanced Business Challenges |
| 11 | Planning | `freelancing-level-3-premium-pricing-models.md` | md | Premium Pricing Models |
| 12 | Planning | `freelancing-level-3-business-financial-planning.pdf` | pdf | Business Financial Planning |

**Level 3 total: 12 files.**

---

**Freelancing package total: 41 files** (14 + 15 + 12).

---

## 7. Storage, Paths & Delivery

### 7.1 Storage

- **Bucket:** Supabase Storage `digital-products`
- **Path pattern:** `{productId}/{filename}`
- **Product ID:** From `products.id` (UUID). Use the **product** slug only for display; storage key is `productId`.

### 7.2 Download API

- **Endpoint:** `GET /api/library/[product-id]/download?file={filename}`
- **Auth:** User must have access to the product (e.g. via order/license). Enforced by `hasProductAccess(userId, productId)`.
- **Allowlist:** `file` must be a **flat filename** (no path separators) and must appear in the package’s content allowlist (`package-level-content`). Invalid or disallowed files return 404.
- **Flow:** Resolve `product-id` → check access → validate `file` against allowlist → stream file from `digital-products/{productId}/{filename}`.

### 7.3 Filename Rules

- **Exact match:** Use filenames exactly as in this document and in `lib/data/package-level-content.ts`. The UI and download flow use these `file` values.
- **Flat filenames only:** No path separators (`/` or `\`). All package files live directly under `digital-products/{productId}/`.
- **Case-sensitive:** Preserve casing (e.g. `web-apps-level-1-plan.md` not `Web-Apps-Level-1-Plan.md`).
- **Extensions:** Always include correct extension (`.md`, `.pdf`, `.xlsx`, `.docx`, `.zip`).

### 7.4 Package-Level vs Product-Level

- **Package products** (e.g. Web Apps, Social Media, Agency, Freelancing) contain **all three levels**. Purchasing the package grants access to every file for every level.
- **Production access model:** All packages are paid products. Access is granted via Stripe checkout and order completion only. There is no development bypass in production; the `/api/packages/[id]/grant-access` endpoint returns 404.
- **Product ID:** One per package product. All level files for that package live under the same `productId` folder.
- **DOER coupon:** 6 months free DOER Pro; separate from file delivery. Shown on product page, order confirmation, and account library.

### 7.5 ZIP Workflow (Web Apps)

1. **Source dirs:** Under `web-apps-content/<name>/` (e.g. `basic-starter-template/`, `saas-starter-template/`).
2. **Build ZIPs:** Run `npm run content:build-zips` or `npx tsx scripts/build-web-apps-zips.ts` to produce `web-apps-content/<name>.zip`.
3. **Upload:** Run the upload script to push root `.md` and `.zip` files to `digital-products/{productId}/`. See [scripts/README.md](../scripts/README.md) for build and audit scripts.

### 7.6 Expanded Document View

For **all package products** (Web Apps, Social Media, Agency, Freelancing): hosted MD can be opened in an **expanded overlay** with table of contents (TOC) and word-based search; download remains for non-hosted files (ZIP, PDF, etc.). No change to storage or API; purely frontend UX.

### 7.7 Freelancing Upload Workflow

Source files live in `freelancing-content/` at repo root. Run `npx tsx scripts/build-freelancing-zips.ts` to build the three ZIPs from source dirs (`proposal-templates/`, `contract-templates/`, `business-systems-templates/`). Run `npx tsx scripts/upload-freelancing-files.ts` to upload all 41 files to `digital-products/{productId}/`. Same allowlist and path rules as Web Apps.

---

## 8. Summary Tables

### 8.1 File Count per Package and Level

| Package      | Level 1 | Level 2 | Level 3 | **Total** |
|-------------|---------|---------|---------|-----------|
| Web Apps    | 16      | 15      | 14      | **45**    |
| Social Media| 14      | 14      | 11      | **39**    |
| Agency      | 14      | 14      | 12      | **40**    |
| Freelancing | 14      | 15      | 12      | **41**    |
| **Total**   | **58**  | **58**  | **49**  | **165**   |

### 8.2 File Type Distribution (all packages)

| Type | Use | Count |
|------|-----|-------|
| **md** | All packages: implementation plans, platform guides, creative frameworks; Web Apps, Social Media, Agency & Freelancing launch/marketing, troubleshooting, planning guides; templates (MD where used) | 139 |
| **pdf** | Templates (checklists) and planning worksheets/calculators only | 12 |
| **zip** | Code templates, multi-file packs | 11 |
| **xlsx** | Editable templates (content calendar, strategy) | 2 |
| **docx** | Editable docs (client reporting) | 1 |
| **Total** | | **165** |

### 8.3 Content Category Counts (all levels, all packages)

| Category               | Total files |
|------------------------|-------------|
| Implementation Plans   | 12          |
| Platform Setup Guides  | 40          |
| Creative Frameworks    | 31          |
| Templates & Checklists | 21 (including ZIP bundles with multiple assets) |
| Launch & Marketing     | 22 (Web Apps: 5, Social Media: 6, Agency: 6, Freelancing: 5) |
| Troubleshooting        | 12 (Web Apps: 3, Social Media: 3, Agency: 3, Freelancing: 3) |
| Time & Budget Planning | 22 (Web Apps: 5, Social Media: 6, Agency: 6, Freelancing: 5) |

### 8.4 Master File List (alphabetical)

Use this for checklists when creating or uploading. Filenames are unique across packages unless otherwise noted; same name in different packages = different file (e.g. `service-suite-development.md` in Social Media L3 vs Agency L2).

**Web Apps (md, zip):**  
`advanced-mvp-framework.md`, `advanced-saas-template.zip`, `advanced-supabase-setup.md`, `ai-integration-examples.zip`, `ai-integration-guide.md`, `basic-starter-template.zip`, `development-milestones-checklist.md`, `github-setup-guide.md`, `go-to-market-strategy.md`, `idea-generation-framework.md`, `mvp-checklist.md`, `mvp-development-framework.md`, `nextjs-saas-starter-setup.md`, `nextjs-simple-setup-guide.md`, `pricing-strategy-saas.md`, `saas-starter-template.zip`, `scaling-strategy.md`, `simple-mvp-framework.md`, `stripe-basic-setup.md`, `stripe-integration-guide.md`, `supabase-setup-guide.md`, `third-party-integrations-guide.md`, `value-proposition-worksheet.md`, `vercel-advanced-deployment.md`, `vercel-deployment-guide.md`, `vercel-edge-functions.md`, `web-apps-level-1-ai-prompts.md`, `web-apps-level-1-basic-marketing-guide.md`, `web-apps-level-1-budget-planning-worksheet.md`, `web-apps-level-1-common-issues-solutions.md`, `web-apps-level-1-launch-checklist.md`, `web-apps-level-1-plan.md`, `web-apps-level-1-time-investment-planner.md`, `web-apps-level-2-ai-prompts.md`, `web-apps-level-2-budget-planning-worksheet.md`, `web-apps-level-2-customer-acquisition-guide.md`, `web-apps-level-2-plan.md`, `web-apps-level-2-success-metrics-dashboard.md`, `web-apps-level-2-troubleshooting-debugging-guide.md`, `web-apps-level-3-ai-prompts.md`, `web-apps-level-3-advanced-troubleshooting-guide.md`, `web-apps-level-3-enterprise-marketing-playbook.md`, `web-apps-level-3-partnership-strategy.md`, `web-apps-level-3-plan.md`, `web-apps-level-3-scaling-operations-budget.md`.

**Social Media (md, pdf, xlsx, docx, zip):**  
`advanced-analytics-setup.md`, `agency-operations-framework.md`, `brand-identity-framework.md`, `buffer-paid-setup-guide.md`, `buffer-setup-guide.md`, `canva-setup-guide.md`, `client-onboarding-checklist.pdf`, `client-onboarding-framework.md`, `client-reporting-template.docx`, `content-calendar-template.xlsx`, `content-direction-framework.md`, `content-strategy-template.xlsx`, `daily-posting-checklist.pdf`, `google-analytics-setup-guide.md`, `hootsuite-setup-guide.md`, `later-setup-guide.md`, `metricool-setup-guide.md`, `niche-selection-worksheet.md`, `service-pricing-framework.md`, `service-suite-development.md`, `social-media-level-1-common-creator-issues.md`, `social-media-level-1-content-growth-checklist.md`, `social-media-level-1-creator-income-planning.md`, `social-media-level-1-first-monetization-guide.md`, `social-media-level-1-monetization-budget-worksheet.pdf`, `social-media-level-1-plan.md`, `social-media-level-2-client-service-issues.md`, `social-media-level-2-first-smm-clients-guide.md`, `social-media-level-2-plan.md`, `social-media-level-2-service-portfolio-checklist.md`, `social-media-level-2-service-pricing-strategy.md`, `social-media-level-2-smm-budget-planner.pdf`, `social-media-level-3-agency-budget-planning.pdf`, `social-media-level-3-agency-operations-issues.md`, `social-media-level-3-agency-positioning-guide.md`, `social-media-level-3-agency-revenue-strategy.md`, `social-media-level-3-partnership-outreach-strategies.md`, `social-media-level-3-plan.md`, `team-management-templates.zip`.

**Agency (md, pdf, zip):**  
`agency-level-1-first-clients-guide.md`, `agency-level-1-plan.md`, `agency-level-1-solo-budget-worksheet.pdf`, `agency-level-1-solo-launch-checklist.md`, `agency-level-1-solo-operations-issues.md`, `agency-level-1-solo-revenue-strategy.md`, `agency-level-2-client-acquisition-scaling-guide.md`, `agency-level-2-plan.md`, `agency-level-2-team-budget-planner.pdf`, `agency-level-2-team-client-issues.md`, `agency-level-2-team-portfolio-checklist.md`, `agency-level-2-team-pricing-revenue-strategy.md`, `agency-level-3-enterprise-budget-planning.pdf`, `agency-level-3-enterprise-operations-issues.md`, `agency-level-3-enterprise-outreach-guide.md`, `agency-level-3-partnership-strategies.md`, `agency-level-3-plan.md`, `agency-level-3-scaling-revenue-strategy.md`, `agency-niche-framework.md`, `agency-operations-templates.zip`, `client-onboarding-template.zip`, `client-retention-strategies.md`, `clickup-free-setup.md`, `clickup-paid-setup.md`, `enterprise-operations-framework.md`, `enterprise-platform-setup.md`, `enterprise-service-development.md`, `enterprise-templates.zip`, `gohighlevel-enterprise-setup.md`, `gohighlevel-setup-guide.md`, `hello-bonsai-setup.md`, `hubspot-free-setup.md`, `hubspot-paid-setup.md`, `service-package-framework.md`, `service-suite-development.md`, `systeme-io-setup-guide.md`, `target-client-framework.md`, `team-management-framework.md`, `team-scaling-guide.md`, `zite-setup-guide.md`.

**Freelancing (pdf, md, zip):**  
`business-systems-templates.zip`, `client-communication-templates.md`, `consultant-positioning-framework.md`, `contract-templates.zip`, `crm-setup-guide.md`, `direct-client-acquisition-guide.md`, `direct-client-framework.md`, `fiverr-profile-setup-guide.md`, `freelancing-level-1-common-freelancing-issues.md`, `freelancing-level-1-first-client-acquisition-guide.md`, `freelancing-level-1-plan.md`, `freelancing-level-1-pricing-calculator-worksheet.pdf`, `freelancing-level-1-profile-optimization-checklist.md`, `freelancing-level-1-side-hustle-budget-planner.pdf`, `freelancing-level-2-client-acquisition-strategies.md`, `freelancing-level-2-client-management-issues.md`, `freelancing-level-2-full-time-budget-planner.pdf`, `freelancing-level-2-plan.md`, `freelancing-level-2-portfolio-promotion-guide.md`, `freelancing-level-2-pricing-scaling-strategy.md`, `freelancing-level-3-advanced-business-challenges.md`, `freelancing-level-3-business-financial-planning.pdf`, `freelancing-level-3-partnership-strategies.md`, `freelancing-level-3-plan.md`, `freelancing-level-3-premium-positioning-guide.md`, `freelancing-level-3-premium-pricing-models.md`, `gig-listing-template.md`, `google-workspace-setup.md`, `hello-bonsai-paid-setup.md`, `hello-bonsai-setup-guide.md`, `paypal-setup-guide.md`, `portfolio-creation-framework.md`, `portfolio-showcase-template.md`, `premium-platform-guide.md`, `pricing-strategy-advanced.md`, `pricing-strategy-worksheet.md`, `professional-portfolio-framework.md`, `proposal-templates.zip`, `service-definition-framework.md`, `stripe-setup-guide.md`, `upwork-setup-guide.md`.

---

## Document History

| Date       | Change |
|------------|--------|
| Jan 2025   | Initial version; file list aligned with `package-level-content.ts` and rundown specs |
| Jan 2026   | Web Apps 45 files, ZIP remediation, expanded view; Web Apps as template; file count corrections (8.1/8.2). |

---

**Next steps:** Implement each file per this spec, then upload to `digital-products/{productId}/` and ensure the library/download UI uses these exact filenames.
