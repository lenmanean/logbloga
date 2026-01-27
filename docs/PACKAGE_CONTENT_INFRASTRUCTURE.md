# Package Content Infrastructure — Complete File-Level Specification

**Purpose:** Authoritative reference for implementing every package content file. Use this when creating, uploading, or linking level-based content.

**Sources:** `lib/data/package-level-content.ts`, `lib/data/package-level-titles.ts`, package UI (`components/ui/package-levels-content.tsx`, `components/ui/whats-included.tsx`). Pricing from database (migration `000026_optimize_package_pricing.sql`).

**Last Updated:** January 2025  
**Status:** Pre-Implementation (canonical file list; actual files not yet in storage)

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

Every level includes **seven** content categories (Web Apps package; other packages retain four until expanded):

1. **Implementation Plan** — One file per level. Step-by-step roadmap.
2. **Platform Setup Guides** — One or more guides per level. Account creation, configuration, screenshots.
3. **Creative Decision Frameworks** — Worksheets, exercises, decision prompts.
4. **Templates & Checklists** — Ready-to-use resources (docs, spreadsheets, code, ZIPs).
5. **Launch & Marketing** — Launch checklists, marketing guides, customer acquisition. (Web Apps only.)
6. **Troubleshooting** — Common issues, solutions, debugging guides. (Web Apps only.)
7. **Time & Budget Planning** — Time investment planners, budget worksheets, success metrics. (Web Apps only.)

File types used: **MD**, **PDF**, **XLSX**, **DOCX**, **ZIP**. Web Apps uses **MD** for plans, guides, frameworks, and the new categories; other packages use **PDF** for those. Templates vary by package.

---

## 2. Common Structure Across All Packages

### 2.1 Implementation Plan

- **Count:** 1 per level.
- **Role:** Roadmap with milestones, tasks, and (where applicable) trackable schedule.
- **Typical length:** ~15–40 pages equivalent (varies by level).
- **Format:** Web Apps → `.md`; Social Media, Agency, Freelancing → `.pdf`.

### 2.2 Platform Setup Guides

- **Role:** Step-by-step setup for specific platforms (accounts, config, integrations).
- **Conventions:** Numbered steps, screenshots (e.g. 1920×1080), troubleshooting where relevant.
- **Format:** Web Apps → `.md`; others → `.pdf`.

### 2.3 Creative Decision Frameworks

- **Role:** Guided exercises (niche, positioning, pricing, strategy, etc.).
- **Format:** Web Apps → `.md`; others → `.pdf`. Fillable or exercise-based.

### 2.4 Templates & Checklists

- **Formats:** PDF, XLSX, DOCX, MD, ZIP (code or multi-file packs).
- **Role:** Editable templates, checklists, code starters, or bundled assets.

### 2.5 Launch & Marketing (Web Apps)

- **Role:** Launch checklists, basic marketing, customer acquisition, enterprise playbooks.
- **Format:** Web Apps → `.md`.

### 2.6 Troubleshooting (Web Apps)

- **Role:** Common issues and solutions, debugging guides.
- **Format:** Web Apps → `.md`.

### 2.7 Time & Budget Planning (Web Apps)

- **Role:** Time investment planners, budget worksheets, success metrics, scaling budgets.
- **Format:** Web Apps → `.md`.

### 2.8 Schedule (optional, in DB)

Levels can optionally store a **schedule** (trackable timeline) in the database:

- `date` (YYYY-MM-DD), `milestone`, `tasks` (string[]), `completed` (boolean), `order` (number).

This is separate from the implementation plan **file**; the file is the canonical content.

---

## 3. Web Apps Package

**Slug:** `web-apps`  
**File conventions:** Implementation plans, setup guides, and frameworks use **Markdown (`.md`)**. Templates use **ZIP** (code) or **MD** (checklists).

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
| 11 | Launch & Marketing | `web-apps-level-1-launch-checklist.md` | md | Launch Checklist |
| 12 | Launch & Marketing | `web-apps-level-1-basic-marketing-guide.md` | md | Basic Marketing Guide |
| 13 | Troubleshooting | `web-apps-level-1-common-issues-solutions.md` | md | Common Issues & Solutions |
| 14 | Planning | `web-apps-level-1-time-investment-planner.md` | md | Time Investment Planner |
| 15 | Planning | `web-apps-level-1-budget-planning-worksheet.md` | md | Budget Planning Worksheet |

**Level 1 total: 15 files.**

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
| 11 | Launch & Marketing | `web-apps-level-2-customer-acquisition-guide.md` | md | Customer Acquisition Guide |
| 12 | Troubleshooting | `web-apps-level-2-troubleshooting-debugging-guide.md` | md | Troubleshooting & Debugging Guide |
| 13 | Planning | `web-apps-level-2-success-metrics-dashboard.md` | md | Success Metrics Dashboard |
| 14 | Planning | `web-apps-level-2-budget-planning-worksheet.md` | md | Budget Planning Worksheet |

**Level 2 total: 14 files.**

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
| 10 | Launch & Marketing | `web-apps-level-3-enterprise-marketing-playbook.md` | md | Enterprise Marketing Playbook |
| 11 | Launch & Marketing | `web-apps-level-3-partnership-strategy.md` | md | Partnership Strategy |
| 12 | Troubleshooting | `web-apps-level-3-advanced-troubleshooting-guide.md` | md | Advanced Troubleshooting Guide |
| 13 | Planning | `web-apps-level-3-scaling-operations-budget.md` | md | Scaling Operations Budget |

**Level 3 total: 13 files.**

---

**Web Apps package total: 42 files** (15 + 14 + 13).

---

## 4. Social Media Package

**Slug:** `social-media`  
**File conventions:** Implementation plans, setup guides, and frameworks use **PDF**. Templates use **PDF**, **XLSX**, **DOCX**, or **ZIP** as specified.

### 4.1 Level 1: Personal Brand / Content Creator

- **Time investment:** 2–3 weeks  
- **Expected revenue:** $300–$1,000/month  
- **Platform costs:** $0–30/month  
- **AI leverage:** ChatGPT, Canva AI, Claude; optional Midjourney/DALL·E; affiliate, sponsored, product sales.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-1-plan.pdf` | pdf | Step-by-step roadmap for personal brand / simple service |
| 2 | Platform Setup | `buffer-setup-guide.pdf` | pdf | Buffer — account, scheduling |
| 3 | Platform Setup | `canva-setup-guide.pdf` | pdf | Canva — account, AI features, branding |
| 4 | Platform Setup | `google-analytics-setup-guide.pdf` | pdf | Google Analytics — property, goals, social tracking |
| 5 | Creative Framework | `niche-selection-worksheet.pdf` | pdf | Niche Selection Worksheet |
| 6 | Creative Framework | `brand-identity-framework.pdf` | pdf | Brand Identity Framework |
| 7 | Creative Framework | `content-direction-framework.pdf` | pdf | Content Direction Framework |
| 8 | Template | `content-strategy-template.xlsx` | xlsx | Content Strategy Template |
| 9 | Template | `daily-posting-checklist.pdf` | pdf | Daily Posting Checklist |

**Level 1 total: 9 files.**

---

### 4.2 Level 2: Social Media Management Service

- **Time investment:** 4–6 weeks  
- **Expected revenue:** $1,000–$3,000/month  
- **Platform costs:** $30–100/month  
- **AI leverage:** ChatGPT, Canva AI, Buffer, Later; scale content and manage 3–5 clients.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-2-plan.pdf` | pdf | Step-by-step roadmap for social media management service |
| 2 | Platform Setup | `later-setup-guide.pdf` | pdf | Later — scheduling, calendar |
| 3 | Platform Setup | `metricool-setup-guide.pdf` | pdf | Metricool — analytics, reporting |
| 4 | Platform Setup | `buffer-paid-setup-guide.pdf` | pdf | Buffer — paid tiers, team features |
| 5 | Creative Framework | `client-onboarding-framework.pdf` | pdf | Client Onboarding Framework |
| 6 | Creative Framework | `service-pricing-framework.pdf` | pdf | Service Pricing Framework |
| 7 | Template | `content-calendar-template.xlsx` | xlsx | Content Calendar Template — multi-client |
| 8 | Template | `client-reporting-template.docx` | docx | Client Reporting Template — monthly reports |
| 9 | Template | `client-onboarding-checklist.pdf` | pdf | Client Onboarding Checklist |

**Level 2 total: 9 files.**

---

### 4.3 Level 3: Full-Service Social Media Agency

- **Time investment:** 8–12 weeks  
- **Expected revenue:** $3,000–$10,000+/month  
- **Platform costs:** $100–300/month  
- **AI leverage:** Hootsuite, advanced analytics AI, workflow tools; lean team, agency-level results.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `social-media-level-3-plan.pdf` | pdf | Step-by-step roadmap for social media agency |
| 2 | Platform Setup | `hootsuite-setup-guide.pdf` | pdf | Hootsuite — agency workflows, streams |
| 3 | Platform Setup | `advanced-analytics-setup.pdf` | pdf | Advanced analytics stack |
| 4 | Creative Framework | `agency-operations-framework.pdf` | pdf | Agency Operations Framework |
| 5 | Creative Framework | `service-suite-development.pdf` | pdf | Service Suite Development |
| 6 | Template | `team-management-templates.zip` | zip | Team Management Templates — PDFs, Excel, Word |

**Level 3 total: 6 files.**

---

**Social Media package total: 24 files** (9 + 9 + 6).

---

## 5. Agency Package

**Slug:** `agency`  
**File conventions:** Implementation plans, setup guides, and frameworks use **PDF**. Templates use **ZIP** (multi-file packs).

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
| 1 | Implementation Plan | `agency-level-1-plan.pdf` | pdf | Step-by-step roadmap for solo agency / one-person operation |
| 2 | Platform Setup | `systeme-io-setup-guide.pdf` | pdf | **Option A** — Systeme.io all-in-one |
| 3 | Platform Setup | `hubspot-free-setup.pdf` | pdf | **Option B** — HubSpot free |
| 4 | Platform Setup | `clickup-free-setup.pdf` | pdf | **Option B** — ClickUp free |
| 5 | Platform Setup | `hello-bonsai-setup.pdf` | pdf | **Option B** — Hello Bonsai contracts/invoicing |
| 6 | Creative Framework | `agency-niche-framework.pdf` | pdf | Agency Niche Framework |
| 7 | Creative Framework | `service-package-framework.pdf` | pdf | Service Package Framework |
| 8 | Creative Framework | `target-client-framework.pdf` | pdf | Target Client Framework |
| 9 | Template | `client-onboarding-template.zip` | zip | Client Onboarding Template |

**Level 1 total: 9 files.**

---

### 5.2 Level 2: Small Team Agency

- **Time investment:** 6–8 weeks  
- **Expected revenue:** $5,000–$15,000/month  
- **Platform costs:** $300–800/month  
- **AI leverage:** ChatGPT, Claude, workflow automation; 2–5 person team, 5–10 clients.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `agency-level-2-plan.pdf` | pdf | Step-by-step roadmap for small agency (2–5 person team) |
| 2 | Platform Setup | `gohighlevel-setup-guide.pdf` | pdf | **Option A (recommended)** — GoHighLevel all-in-one |
| 3 | Platform Setup | `hubspot-paid-setup.pdf` | pdf | **Option B** — HubSpot paid |
| 4 | Platform Setup | `clickup-paid-setup.pdf` | pdf | **Option B** — ClickUp paid |
| 5 | Platform Setup | `zite-setup-guide.pdf` | pdf | **Option B** — Zite |
| 6 | Creative Framework | `team-management-framework.pdf` | pdf | Team Management Framework |
| 7 | Creative Framework | `service-suite-development.pdf` | pdf | Service Suite Development |
| 8 | Creative Framework | `client-retention-strategies.pdf` | pdf | Client Retention Strategies |
| 9 | Template | `agency-operations-templates.zip` | zip | Agency Operations Templates |

**Level 2 total: 9 files.**

---

### 5.3 Level 3: Established Multi-Service Agency

- **Time investment:** 12–16 weeks  
- **Expected revenue:** $15,000–$50,000+/month  
- **Platform costs:** $800–2,000/month  
- **AI leverage:** Enterprise AI, ChatGPT, Claude, analytics; multi-service, premium offerings.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `agency-level-3-plan.pdf` | pdf | Step-by-step roadmap for established agency (5+ person team) |
| 2 | Platform Setup | `gohighlevel-enterprise-setup.pdf` | pdf | GoHighLevel — enterprise features |
| 3 | Platform Setup | `enterprise-platform-setup.pdf` | pdf | Enterprise platform stack |
| 4 | Creative Framework | `enterprise-operations-framework.pdf` | pdf | Enterprise Operations Framework |
| 5 | Creative Framework | `team-scaling-guide.pdf` | pdf | Team Scaling Guide |
| 6 | Creative Framework | `enterprise-service-development.pdf` | pdf | Enterprise Service Development |
| 7 | Template | `enterprise-templates.zip` | zip | Enterprise Templates |

**Level 3 total: 7 files.**

---

**Agency package total: 25 files** (9 + 9 + 7).

---

## 6. Freelancing Package

**Slug:** `freelancing`  
**File conventions:** Implementation plans, setup guides, and frameworks use **PDF**. Templates use **MD**, **ZIP**, or **DOCX** as specified.

### 6.1 Level 1: Part-Time Freelance Side Hustle

- **Time investment:** 1–2 weeks  
- **Expected revenue:** $500–$1,500/month  
- **Platform costs:** $0–20/month  
- **AI leverage:** ChatGPT, Claude, Canva AI, Fiverr AI; part-time, 2–3× faster delivery.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `freelancing-level-1-plan.pdf` | pdf | Step-by-step roadmap for side hustle / part-time freelancing |
| 2 | Platform Setup | `fiverr-profile-setup-guide.pdf` | pdf | Fiverr — profile, gigs, optimization |
| 3 | Platform Setup | `hello-bonsai-setup-guide.pdf` | pdf | Hello Bonsai — contracts, invoicing |
| 4 | Platform Setup | `paypal-setup-guide.pdf` | pdf | PayPal — payments, payouts |
| 5 | Creative Framework | `service-definition-framework.pdf` | pdf | Service Definition Framework |
| 6 | Creative Framework | `portfolio-creation-framework.pdf` | pdf | Portfolio Creation Framework |
| 7 | Creative Framework | `pricing-strategy-worksheet.pdf` | pdf | Pricing Strategy Worksheet |
| 8 | Template | `gig-listing-template.md` | md | Gig Listing Template |
| 9 | Template | `portfolio-showcase-template.md` | md | Portfolio Showcase Template |
| 10 | Launch & Marketing | `freelancing-level-1-first-client-acquisition-guide.pdf` | pdf | First Client Acquisition Guide |
| 11 | Launch & Marketing | `freelancing-level-1-profile-optimization-checklist.pdf` | pdf | Profile Optimization Checklist |
| 12 | Troubleshooting | `freelancing-level-1-common-freelancing-issues.pdf` | pdf | Common Freelancing Issues |
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
| 1 | Implementation Plan | `freelancing-level-2-plan.pdf` | pdf | Step-by-step roadmap for full-time freelancing business |
| 2 | Platform Setup | `upwork-setup-guide.pdf` | pdf | Upwork — profile, proposals, JSS |
| 3 | Platform Setup | `hello-bonsai-paid-setup.pdf` | pdf | Hello Bonsai — paid features |
| 4 | Platform Setup | `stripe-setup-guide.pdf` | pdf | Stripe — invoices, payouts |
| 5 | Platform Setup | `google-workspace-setup.pdf` | pdf | Google Workspace — email, calendar, Drive |
| 6 | Creative Framework | `professional-portfolio-framework.pdf` | pdf | Professional Portfolio Framework |
| 7 | Creative Framework | `pricing-strategy-advanced.pdf` | pdf | Pricing Strategy Advanced |
| 8 | Template | `proposal-templates.zip` | zip | Proposal Templates |
| 9 | Template | `contract-templates.zip` | zip | Contract Templates |
| 10 | Template | `client-communication-templates.md` | md | Client Communication Templates |
| 11 | Launch & Marketing | `freelancing-level-2-client-acquisition-strategies.pdf` | pdf | Client Acquisition Strategies |
| 12 | Launch & Marketing | `freelancing-level-2-portfolio-promotion-guide.pdf` | pdf | Portfolio Promotion Guide |
| 13 | Troubleshooting | `freelancing-level-2-client-management-issues.pdf` | pdf | Client Management Issues |
| 14 | Planning | `freelancing-level-2-full-time-budget-planner.pdf` | pdf | Full-Time Freelancer Budget Planner |
| 15 | Planning | `freelancing-level-2-pricing-scaling-strategy.pdf` | pdf | Pricing Scaling Strategy |

**Level 2 total: 15 files.**

---

### 6.3 Level 3: Premium Freelance Consultant

- **Time investment:** 6–8 weeks  
- **Expected revenue:** $4,000–$10,000+/month  
- **Platform costs:** $50–150/month  
- **AI leverage:** ChatGPT, Claude, advanced AI, direct-client systems; premium consulting positioning.

| # | Category | Filename | Type | Description / Notes |
|---|----------|----------|------|---------------------|
| 1 | Implementation Plan | `freelancing-level-3-plan.pdf` | pdf | Step-by-step roadmap for premium freelancing / consultant |
| 2 | Platform Setup | `premium-platform-guide.pdf` | pdf | Premium platforms (e.g. Toptal, Arc) |
| 3 | Platform Setup | `direct-client-acquisition-guide.pdf` | pdf | Direct client acquisition beyond marketplaces |
| 4 | Platform Setup | `crm-setup-guide.pdf` | pdf | CRM (e.g. HubSpot, GoHighLevel for freelancers) |
| 5 | Creative Framework | `consultant-positioning-framework.pdf` | pdf | Consultant Positioning Framework |
| 6 | Creative Framework | `direct-client-framework.pdf` | pdf | Direct Client Framework |
| 7 | Template | `business-systems-templates.zip` | zip | Business Systems Templates |
| 8 | Launch & Marketing | `freelancing-level-3-premium-positioning-guide.pdf` | pdf | Premium Positioning Guide |
| 9 | Launch & Marketing | `freelancing-level-3-partnership-strategies.pdf` | pdf | Partnership Strategies |
| 10 | Troubleshooting | `freelancing-level-3-advanced-business-challenges.pdf` | pdf | Advanced Business Challenges |
| 11 | Planning | `freelancing-level-3-premium-pricing-models.pdf` | pdf | Premium Pricing Models |
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
- **Flow:** Resolve `product-id` → check access → stream file from `digital-products/{productId}/{filename}`.

### 7.3 Filename Rules

- **Exact match:** Use filenames exactly as in this document and in `lib/data/package-level-content.ts`. The UI and download flow use these `file` values.
- **Case-sensitive:** Preserve casing (e.g. `web-apps-level-1-plan.md` not `Web-Apps-Level-1-Plan.md`).
- **Extensions:** Always include correct extension (`.md`, `.pdf`, `.xlsx`, `.docx`, `.zip`).

### 7.4 Package-Level vs Product-Level

- **Package products** (e.g. Web Apps, Social Media, Agency, Freelancing) contain **all three levels**. Purchasing the package grants access to every file for every level.
- **Product ID:** One per package product. All level files for that package live under the same `productId` folder.
- **DOER coupon:** 6 months free DOER Pro; separate from file delivery. Shown on product page, order confirmation, and account library.

---

## 8. Summary Tables

### 8.1 File Count per Package and Level

| Package      | Level 1 | Level 2 | Level 3 | **Total** |
|-------------|---------|---------|---------|-----------|
| Web Apps    | 15      | 14      | 13      | **42**    |
| Social Media| 9       | 9       | 6       | **24**    |
| Agency      | 9       | 9       | 7       | **25**    |
| Freelancing | 14      | 15      | 12      | **41**    |
| **Total**   | **47**  | **47**  | **38**  | **132**   |

### 8.2 File Type Distribution (all packages)

| Type | Use | Count |
|------|-----|-------|
| **md** | Web Apps plans, guides, frameworks, checklists, launch/marketing, troubleshooting, planning; Freelancing templates | 41 |
| **pdf** | Social Media, Agency, Freelancing plans, guides, frameworks, checklists, launch/marketing, troubleshooting, planning | 77 |
| **zip** | Code templates, multi-file packs | 11 |
| **xlsx** | Editable templates (content calendar, strategy) | 2 |
| **docx** | Editable docs (client reporting) | 1 |
| **Total** | | **132** |

### 8.3 Content Category Counts (all levels, all packages)

| Category               | Total files |
|------------------------|-------------|
| Implementation Plans   | 12          |
| Platform Setup Guides  | 40          |
| Creative Frameworks    | 31          |
| Templates & Checklists | 21 (including ZIP bundles with multiple assets) |
| Launch & Marketing     | 10 (Web Apps: 5, Freelancing: 5) |
| Troubleshooting        | 6 (Web Apps: 3, Freelancing: 3) |
| Time & Budget Planning | 10 (Web Apps: 5, Freelancing: 5) |

### 8.4 Master File List (alphabetical)

Use this for checklists when creating or uploading. Filenames are unique across packages unless otherwise noted; same name in different packages = different file (e.g. `service-suite-development.pdf` in Social Media L3 vs Agency L2).

**Web Apps (md, zip):**  
`advanced-mvp-framework.md`, `advanced-saas-template.zip`, `advanced-supabase-setup.md`, `ai-integration-examples.zip`, `ai-integration-guide.md`, `basic-starter-template.zip`, `development-milestones-checklist.md`, `github-setup-guide.md`, `go-to-market-strategy.md`, `idea-generation-framework.md`, `mvp-checklist.md`, `mvp-development-framework.md`, `nextjs-saas-starter-setup.md`, `nextjs-simple-setup-guide.md`, `pricing-strategy-saas.md`, `saas-starter-template.zip`, `scaling-strategy.md`, `simple-mvp-framework.md`, `stripe-basic-setup.md`, `stripe-integration-guide.md`, `supabase-setup-guide.md`, `third-party-integrations-guide.md`, `value-proposition-worksheet.md`, `vercel-advanced-deployment.md`, `vercel-deployment-guide.md`, `vercel-edge-functions.md`, `web-apps-level-1-basic-marketing-guide.md`, `web-apps-level-1-budget-planning-worksheet.md`, `web-apps-level-1-common-issues-solutions.md`, `web-apps-level-1-launch-checklist.md`, `web-apps-level-1-plan.md`, `web-apps-level-1-time-investment-planner.md`, `web-apps-level-2-budget-planning-worksheet.md`, `web-apps-level-2-customer-acquisition-guide.md`, `web-apps-level-2-plan.md`, `web-apps-level-2-success-metrics-dashboard.md`, `web-apps-level-2-troubleshooting-debugging-guide.md`, `web-apps-level-3-advanced-troubleshooting-guide.md`, `web-apps-level-3-enterprise-marketing-playbook.md`, `web-apps-level-3-partnership-strategy.md`, `web-apps-level-3-plan.md`, `web-apps-level-3-scaling-operations-budget.md`.

**Social Media (pdf, xlsx, docx, zip):**  
`advanced-analytics-setup.pdf`, `agency-operations-framework.pdf`, `brand-identity-framework.pdf`, `buffer-paid-setup-guide.pdf`, `buffer-setup-guide.pdf`, `canva-setup-guide.pdf`, `client-onboarding-checklist.pdf`, `client-onboarding-framework.pdf`, `client-reporting-template.docx`, `content-calendar-template.xlsx`, `content-direction-framework.pdf`, `content-strategy-template.xlsx`, `daily-posting-checklist.pdf`, `google-analytics-setup-guide.pdf`, `hootsuite-setup-guide.pdf`, `later-setup-guide.pdf`, `metricool-setup-guide.pdf`, `niche-selection-worksheet.pdf`, `service-pricing-framework.pdf`, `service-suite-development.pdf`, `social-media-level-1-plan.pdf`, `social-media-level-2-plan.pdf`, `social-media-level-3-plan.pdf`, `team-management-templates.zip`.

**Agency (pdf, zip):**  
`agency-level-1-plan.pdf`, `agency-level-2-plan.pdf`, `agency-level-3-plan.pdf`, `agency-niche-framework.pdf`, `agency-operations-templates.zip`, `client-onboarding-template.zip`, `client-retention-strategies.pdf`, `clickup-free-setup.pdf`, `clickup-paid-setup.pdf`, `enterprise-operations-framework.pdf`, `enterprise-platform-setup.pdf`, `enterprise-service-development.pdf`, `enterprise-templates.zip`, `gohighlevel-enterprise-setup.pdf`, `gohighlevel-setup-guide.pdf`, `hello-bonsai-setup.pdf`, `hubspot-free-setup.pdf`, `hubspot-paid-setup.pdf`, `service-package-framework.pdf`, `service-suite-development.pdf`, `systeme-io-setup-guide.pdf`, `target-client-framework.pdf`, `team-management-framework.pdf`, `team-scaling-guide.pdf`, `zite-setup-guide.pdf`.

**Freelancing (pdf, md, zip):**  
`business-systems-templates.zip`, `client-communication-templates.md`, `consultant-positioning-framework.pdf`, `contract-templates.zip`, `crm-setup-guide.pdf`, `direct-client-acquisition-guide.pdf`, `direct-client-framework.pdf`, `fiverr-profile-setup-guide.pdf`, `freelancing-level-1-common-freelancing-issues.pdf`, `freelancing-level-1-first-client-acquisition-guide.pdf`, `freelancing-level-1-plan.pdf`, `freelancing-level-1-pricing-calculator-worksheet.pdf`, `freelancing-level-1-profile-optimization-checklist.pdf`, `freelancing-level-1-side-hustle-budget-planner.pdf`, `freelancing-level-2-client-acquisition-strategies.pdf`, `freelancing-level-2-client-management-issues.pdf`, `freelancing-level-2-full-time-budget-planner.pdf`, `freelancing-level-2-plan.pdf`, `freelancing-level-2-portfolio-promotion-guide.pdf`, `freelancing-level-2-pricing-scaling-strategy.pdf`, `freelancing-level-3-advanced-business-challenges.pdf`, `freelancing-level-3-business-financial-planning.pdf`, `freelancing-level-3-partnership-strategies.pdf`, `freelancing-level-3-plan.pdf`, `freelancing-level-3-premium-positioning-guide.pdf`, `freelancing-level-3-premium-pricing-models.pdf`, `gig-listing-template.md`, `google-workspace-setup.pdf`, `hello-bonsai-paid-setup.pdf`, `hello-bonsai-setup-guide.pdf`, `paypal-setup-guide.pdf`, `portfolio-creation-framework.pdf`, `portfolio-showcase-template.md`, `premium-platform-guide.pdf`, `pricing-strategy-advanced.pdf`, `pricing-strategy-worksheet.pdf`, `professional-portfolio-framework.pdf`, `proposal-templates.zip`, `service-definition-framework.pdf`, `stripe-setup-guide.pdf`, `upwork-setup-guide.pdf`.

---

## Document History

| Date       | Change |
|------------|--------|
| Jan 2025   | Initial version; file list aligned with `package-level-content.ts` and rundown specs |

---

**Next steps:** Implement each file per this spec, then upload to `digital-products/{productId}/` and ensure the library/download UI uses these exact filenames.
