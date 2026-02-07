/**
 * Case Studies data
 * Real-world examples and success stories
 */

import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'doer-ai-goal-achievement-platform',
    title: 'DOER: Building an AI-Powered Goal Achievement Platform',
    description: 'How DOER evolved from an AI roadmap generator to a full goal-achievement platform—core planning, monetization, integrations, compliance, and the Logbloga partner channel.',
    category: 'Web Apps',
    tags: ['web-apps', 'saas', 'ai-integration', 'product-development'],
    content: `# DOER: Building an AI-Powered Goal Achievement Platform

## From Roadmap Generator to Full Platform

DOER began as a simple idea: users state a goal, and the product turns it into a **structured plan** with checkpoints, tasks, and a personalized timeline. From that core, it grew into a full goal-achievement platform at [usedoer.com](https://usedoer.com)—with a clear sequence of stages that mirrors the AI to USD Web Apps package progression.

The story is one of consistent growth: *core AI planning first, then monetization and security, then deep integrations, then trust and compliance, and finally a structured partner channel.*


## Phase 1: The Foundation

The foundation was the **core data model**: plans, tasks, task scheduling, scheduling history, user settings, onboarding, and health snapshots. That established **AI-generated planning** and **time-block scheduling** as the product spine—the "goal in, plan out" experience that defines DOER.


## Phase 2: Trust and Monetization

With the core in place, the next phase focused on trust and monetization. **Robust authentication** and profile handling—including username and referral source—ensured users could own their data. **Stripe-backed subscriptions** (monthly and annual Pro plans), usage and credits, and **API tokens for power users** made billing production-ready.

**RLS and security hardening** ensured billing and data access were locked down. DOER could now charge, protect user data, and scale confidently.


## Phase 3: Integrations—Sitting Inside Existing Tools

DOER expanded into the user's existing toolset rather than replacing it. **Google Calendar** first, then provider-agnostic calendar sync—**two-way event sync** and conflict-aware scheduling so tasks land in the user's calendar without collisions.

Then **task-management integrations**: Todoist, Asana, Trello—pushing AI-scheduled tasks and due dates into existing workflows. Then **Slack** for notifications and rescheduling, and **Notion** for plan context. The AI scheduler sits *inside* calendars and task tools instead of forcing users to switch.


## Phase 4: Trust and Compliance

In parallel, the product added responsible growth and compliance. A **pre-launch and waitlist flow** with feature flags. **Cookie consent** and marketing analytics (e.g. GA4, Meta Pixel). Newsletter and contact-sales flows. **Misuse reporting**. And **full account deletion** with audit and trial-abuse prevention—so deletion didn't grant repeated free trials.

These policies set the stage for partnerships and enterprise readiness.


## The Evolution Path

\`\`\`mermaid
flowchart LR
  A[AI Roadmap Generator] --> B[Foundation: Data Model]
  B --> C[Trust & Monetization]
  C --> D[Calendar & Task Integrations]
  D --> E[Compliance & Policies]
  E --> F[Partner Channel]
  F --> G[Logbloga Bundled Offer]
\`\`\`


## Evolution at a Glance

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| **1. Foundation** | Core data model | Plans, tasks, scheduling, health snapshots, AI planning spine |
| **2. Trust & Monetization** | Billing and security | Stripe subscriptions, usage/credits, API tokens, RLS hardening |
| **3. Integrations** | User's existing tools | Calendar sync, Todoist/Asana/Trello, Slack, Notion |
| **4. Compliance** | Responsible growth | Cookie consent, analytics, misuse reporting, account deletion, trial-abuse prevention |
| **5. Partner Channel** | Bundled distribution | Logbloga integration, HMAC-secured API, single-use Pro coupons |


## The Logbloga Integration

The Logbloga integration is the next step: a **partner API** that issues single-use, time-limited Pro coupons (e.g. \`LBG-XXXXXXXX\`) for Logbloga's Web Apps Package and other packages. HMAC-secured requests, **idempotency by order**, and redemption on usedoer.com mean DOER can be offered as a **bundled benefit** in Logbloga's offerings.

The case study—and the Web Apps Package—captures that evolution and the platform's readiness for bundled distribution.


## Key Results

| Metric | Value |
|--------|-------|
| **Platform Status** | Production Ready |
| **AI Integration** | Goal analysis, scheduling, time-block placement |
| **Calendar Integrations** | Google, provider-agnostic sync, two-way events |
| **Task Tools** | Todoist, Asana, Trello, Notion, Slack |
| **Partner Channel** | Logbloga Web Apps Package (bundled Pro coupons) |


## The Bottom Line

From inception as an AI roadmap generator to today, DOER's story is one of consistent growth. Core AI planning first. Monetization and security. Deep calendar and task-tool integrations. Trust and compliance. And finally a structured partner channel—with the Logbloga Web Apps Package case study capturing that evolution and the platform's readiness for bundled distribution.`,
    company: 'DOER',
    industry: 'SaaS',
    outcome: 'Production-ready goal-achievement platform with AI planning, Stripe subscriptions, calendar and task-tool integrations, compliance, and Logbloga-bundled Pro coupons.',
    testimonial: 'Building DOER using the AI to USD Web Apps package provided the structured approach, resources, and implementation plans needed to create a sophisticated AI-powered platform. The level-based progression and comprehensive templates were invaluable in going from concept to production.',
    featuredImage: '/usedoer_favicon.png',
    results: [
      { metric: 'Platform Status', value: 'Production Ready' },
      { metric: 'AI Integration', value: 'Goal analysis, scheduling, time-block placement' },
      { metric: 'Calendar Integrations', value: 'Google, provider-agnostic sync, two-way events' },
      { metric: 'Task Tools', value: 'Todoist, Asana, Trello, Notion, Slack' },
      { metric: 'Partner Channel', value: 'Logbloga Web Apps Package (bundled Pro coupons)' }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2025-01-25'
  }
];

/**
 * Get case study by slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}

/**
 * Get case studies by industry
 */
export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  return caseStudies.filter(study => study.industry === industry);
}

/**
 * Get case studies by category
 */
export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  return caseStudies.filter(study => study.category === category);
}

/**
 * Get case studies by tag
 */
export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return caseStudies.filter(study => study.tags.includes(tag));
}

/**
 * Search case studies
 */
export function searchCaseStudies(query: string): CaseStudy[] {
  const lowerQuery = query.toLowerCase();
  return caseStudies.filter(study =>
    study.title.toLowerCase().includes(lowerQuery) ||
    study.description.toLowerCase().includes(lowerQuery) ||
    study.content.toLowerCase().includes(lowerQuery) ||
    study.company?.toLowerCase().includes(lowerQuery) ||
    study.industry.toLowerCase().includes(lowerQuery) ||
    study.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique industries
 */
export function getAllIndustries(): string[] {
  return Array.from(new Set(caseStudies.map(study => study.industry)));
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(caseStudies.map(study => study.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(caseStudies.flatMap(study => study.tags)));
}
