# Web Apps Level 3: Enterprise SaaS Platform Implementation Plan

## Overview

This implementation plan guides you through building a complex, enterprise-grade SaaS platform with advanced features, AI integration, and scalability. Whether you're coding yourself or using AI tools to assist, this plan provides a clear roadmap to success.

**AI-Assisted Development**: If you're using AI tools (like Cursor, Claude, OpenAI/Anthropic APIs, or GitHub Copilot), they can significantly accelerate development, allowing you to complete this enterprise platform in **10-12 weeks**. AI tools can handle complex code generation, architecture planning, and assist with debugging.

**Traditional Development**: If you prefer to code manually, this plan provides all the steps and technical details you need. You can still use AI tools for assistance with specific tasks, boilerplate code, or when you get stuck.

**Expected Outcome**: A sophisticated SaaS platform with AI features, multi-tenancy, advanced integrations, and enterprise capabilities that can generate $10,000-$50,000+/month in revenue.

## Prerequisites

Before starting, ensure you have:

- Completed Level 2 or equivalent experience (SaaS MVP with authentication and subscriptions)
- A **GitHub account** (free tier is sufficient)
- A **Vercel account** (free tier is sufficient)
- A **Supabase account** (free tier is sufficient, may need Pro for advanced features)
- A **Stripe account** with subscription features enabled
- **OpenAI API account** (for AI features) - optional but recommended
- **Anthropic API account** (for AI features) - optional but recommended
- **Node.js 18+ installed** (or use AI tools to help with installation)
- A code editor (VS Code, Cursor, or your preferred editor)
- Basic computer skills (opening applications, using a web browser)

**AI Tools (Optional but Recommended)**: AI tools like Cursor, Claude, ChatGPT, or GitHub Copilot can significantly accelerate development. For Level 3, AI tools are especially valuable for complex architecture decisions, AI integration, and enterprise features.

**AI Prompts Available (for non-technical users)**: If you're using AI tools to build your application, download the [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) file for ready-to-use prompts you can copy and paste into your AI tool for each step.

## Milestones

### Milestone 1: Advanced Architecture
- [ ] Advanced database schema with multi-tenancy
- [ ] AI integration framework implemented
- [ ] Multi-tenant architecture working
- [ ] Advanced authentication and authorization
- [ ] Admin dashboard foundation

### Milestone 2: Core Platform Features
- [ ] Advanced product features implemented
- [ ] AI-powered capabilities functional
- [ ] Workflow automation system working
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

### Milestone 3: Enterprise Features
- [ ] SSO integration (SAML/OAuth) implemented
- [ ] Advanced permissions and role management
- [ ] Audit logging system functional
- [ ] API for third-party integrations
- [ ] White-label options available

### Milestone 4: Scale & Optimize
- [ ] Performance optimization completed
- [ ] Scalability improvements implemented
- [ ] Security hardening done
- [ ] Enterprise support features ready
- [ ] Production deployment successful

## Working with AI Tools

AI tools can significantly accelerate your development process, especially for complex enterprise features. Here's how to effectively incorporate AI into your workflow.

### For Non-Technical Users

If you're using AI tools as your primary development method:

**Effective Communication with AI**:
- **Be Specific**: Instead of "add multi-tenancy," say "implement a multi-tenant architecture where each organization has isolated data, and users can switch between organizations they belong to"
- **Provide Context**: Share your vision and goals. For example: "I want enterprise customers to be able to use SSO, manage teams, and have advanced permissions"
- **Give Feedback**: Review what AI creates and provide specific feedback: "The multi-tenant setup works, but I need better tenant switching UI"
- **Ask Questions**: If you don't understand something AI suggests, ask for clarification

**What to Direct AI On**:
- **What to build**: Describe enterprise features, integrations, and functionality you want
- **How it should work**: Explain business logic and user flows
- **What integrations you need**: Describe third-party services and APIs
- **When to test**: Request testing at key milestones

**Reviewing AI-Generated Work**:
1. **Test the functionality**: Try using what AI built
2. **Check the architecture**: Review how the system is structured
3. **Provide feedback**: Tell AI what works and what needs changes
4. **Request improvements**: Ask AI to refine or adjust as needed

**Using AI Prompts**:
For each step in this implementation plan, we've created ready-to-use prompts you can copy and paste directly into your AI tool. Download the [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) file to have all prompts in one place. These prompts are designed to save you time and ensure clear, effective communication with AI tools.

### For Technical Users

If you're coding yourself and using AI for assistance:

**How AI Can Help**:
- **Architecture Planning**: Get suggestions for complex system architecture
- **AI Integration**: Generate code for OpenAI/Anthropic API integration
- **Boilerplate Generation**: Generate starter code for enterprise features
- **Code Suggestions**: Get suggestions for implementations, patterns, and best practices
- **Debugging Assistance**: Get help understanding errors and finding solutions

**Best Practices**:
- Use AI to generate initial architecture, then review and customize it
- Ask AI to explain complex concepts or unfamiliar patterns
- Use AI for repetitive tasks like creating similar components
- Always review and test AI-generated code before using it in production
- Use AI to learn new technologies or frameworks faster

## Step-by-Step Roadmap

### Phase 1: Advanced Architecture

#### Step 1.1: Database Architecture

Design and implement a multi-tenant database schema with advanced RLS policies and optimization.

**Time Estimate**: 3–5 days  
**Prerequisites**: Level 2 completed; Supabase project and schema experience  
**Expected Outcome**: Multi-tenant schema with tenant isolation, RLS policies, audit tables, and performance indexes

### Sub-Step 1.1.1: Design Tenant Isolation Strategy
**File Path**: `supabase/migrations/`, design doc or notes  
**Purpose**: Choose row-level vs schema-level isolation and document the approach

**Option A (Using AI Tools)**: *"Help me choose between row-level and schema-level multi-tenancy for Supabase/PostgreSQL. Document pros/cons and recommend an approach for an enterprise SaaS where each organization (tenant) has isolated data and users can belong to multiple organizations."*

**Option B (Manual)**:
1. Research row-level (single schema, `tenant_id` on tables) vs schema-per-tenant
2. Document choice: typically row-level with `tenant_id` for Supabase
3. List all tables that must be tenant-scoped
4. Define how `tenant_id` is set (from JWT, session, or context)

**Security Considerations**: Ensure RLS always filters by `tenant_id`; never expose cross-tenant data  
**Testing Checklist**: [ ] Strategy documented; [ ] Tables identified

### Sub-Step 1.1.2: Create Tenants Table
**File Path**: `supabase/migrations/YYYYMMDD_tenants.sql`  
**Purpose**: Add `tenants` (organizations) table with required fields

**Option A (Using AI Tools)**: *"Create a Supabase migration that adds a `tenants` table with columns: id (uuid, default gen_random_uuid()), name (text), slug (text unique), created_at, updated_at. Include RLS so only admins or service role can manage tenants."*

**Option B (Manual)**:
1. Create migration file in `supabase/migrations/`
2. Add `tenants` table with id, name, slug, created_at, updated_at
3. Enable RLS; add policy for service role / admin only
4. Run migration: `supabase db push` or apply in Dashboard

**Code Structure Example**:
```sql
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
```

**Testing Checklist**: [ ] Migration runs; [ ] Table exists; [ ] RLS enabled

### Sub-Step 1.1.3: Create Tenant Members Junction Table
**File Path**: `supabase/migrations/YYYYMMDD_tenant_members.sql`  
**Purpose**: Link users to tenants with roles

**Option A (Using AI Tools)**: *"Add a migration for `tenant_members` table: tenant_id (fk to tenants), user_id (uuid, e.g. auth.users id), role (text), created_at. Add unique (tenant_id, user_id). Set up RLS so users see only rows where they are the user_id."*

**Option B (Manual)**:
1. Create migration for `tenant_members` (tenant_id, user_id, role, created_at)
2. Add foreign keys and unique constraint on (tenant_id, user_id)
3. RLS: SELECT where user_id = auth.uid(); INSERT/UPDATE per tenant role as needed
4. Run migration

**Security Considerations**: Users must only access memberships for their own user_id  
**Testing Checklist**: [ ] Migration runs; [ ] Users can only read own memberships

### Sub-Step 1.1.4: Implement RLS Policies for Tenant Isolation
**File Path**: `supabase/migrations/YYYYMMDD_rls_tenant_isolation.sql`  
**Purpose**: Ensure all tenant-scoped tables restrict access by tenant_id and membership

**Option A (Using AI Tools)**: *"Create RLS policies for my tenant-scoped tables. For each table with tenant_id, allow SELECT/INSERT/UPDATE/DELETE only when the current user (auth.uid()) is a member of that tenant (exists in tenant_members). Use a helper function if needed: get_tenant_ids_for_user()."*

**Option B (Manual)**:
1. Create function `get_tenant_ids_for_user()` returning set of tenant_ids for auth.uid()
2. For each tenant-scoped table, add RLS policies: tenant_id IN (SELECT get_tenant_ids_for_user())
3. Apply to all relevant tables (e.g. projects, documents, subscriptions per tenant)
4. Test with two tenants; verify no cross-tenant access

**Security Considerations**: Every tenant-scoped table must enforce tenant_id via RLS  
**Testing Checklist**: [ ] No cross-tenant read/write in tests

### Sub-Step 1.1.5: Create Database Functions for Tenant Operations
**File Path**: `supabase/migrations/YYYYMMDD_tenant_functions.sql`  
**Purpose**: Functions to create tenant, add member, set current tenant in session

**Option A (Using AI Tools)**: *"Add PostgreSQL functions: create_tenant(name, slug), add_tenant_member(tenant_id, user_id, role), and optionally set_tenant_context(tenant_id) using a config or session variable so RLS can use it."*

**Option B (Manual)**:
1. Implement `create_tenant(name, slug)` with INSERT and return id
2. Implement `add_tenant_member(tenant_id, user_id, role)` with checks
3. If using session variable for current tenant, add `set_config('app.current_tenant_id', ...)` in app layer
4. Document how app passes tenant context (JWT claim or session)

**Testing Checklist**: [ ] create_tenant and add_tenant_member work; [ ] RLS respects context

### Sub-Step 1.1.6: Set Up Audit Logging Tables
**File Path**: `supabase/migrations/YYYYMMDD_audit_logs.sql`  
**Purpose**: Table(s) to log important actions per tenant for compliance

**Option A (Using AI Tools)**: *"Create an audit_logs table with tenant_id, user_id, action, resource_type, resource_id, old_data (jsonb), new_data (jsonb), created_at. Add RLS so users see only their tenant's logs. Add a trigger or app-level logging for key operations."*

**Option B (Manual)**:
1. Create `audit_logs` table with tenant_id, user_id, action, resource_type, resource_id, metadata (jsonb), created_at
2. Enable RLS with tenant isolation
3. Create trigger or application code to insert on key events (user login, subscription change, etc.)
4. Add index on (tenant_id, created_at) for queries

**Testing Checklist**: [ ] Logs written on key actions; [ ] Users see only own tenant logs

### Sub-Step 1.1.7: Create Indexes for Performance
**File Path**: `supabase/migrations/YYYYMMDD_tenant_indexes.sql`  
**Purpose**: Indexes on tenant_id and common filters to keep queries fast

**Option A (Using AI Tools)**: *"Add indexes for multi-tenant queries: composite indexes on (tenant_id, created_at) and (tenant_id, user_id) for main tables. Include any indexes needed for audit_logs and tenant_members lookups."*

**Option B (Manual)**:
1. Add composite index (tenant_id, created_at) on high-read tables
2. Add index on tenant_members(user_id, tenant_id) for membership lookups
3. Add indexes on audit_logs(tenant_id, created_at)
4. Run EXPLAIN on critical queries to verify index use

**Testing Checklist**: [ ] Key queries use indexes; [ ] No full table scans on large tables

### Sub-Step 1.1.8: Implement Data Partitioning Strategy (Optional)
**File Path**: `supabase/migrations/` or documentation  
**Purpose**: Plan or implement partitioning for very large tables (e.g. by tenant_id or time)

**Option A (Using AI Tools)**: *"Document a partitioning strategy for our largest table (e.g. audit_logs or events) by tenant_id or by month. If we use Supabase, provide migration snippets for PostgreSQL native partitioning."*

**Option B (Manual)**:
1. Identify tables that may grow very large (e.g. >10M rows)
2. Document partitioning by tenant_id or time range
3. If implementing, create partitioned table and migrate data; update app to use new table
4. Defer unless scale demands it

**Testing Checklist**: [ ] Strategy documented or implemented; [ ] Queries still correct

### Sub-Step 1.1.9: Test Tenant Isolation Thoroughly
**File Path**: Tests in `__tests__/` or Supabase Edge Functions tests  
**Purpose**: Verify no data leakage between tenants

**Option A (Using AI Tools)**: *"Write tests that create two tenants and two users (one per tenant). Insert data for each tenant. As each user, verify they can only read/update their own tenant's data and never the other tenant's."*

**Option B (Manual)**:
1. Create two tenants and two users (each in one tenant)
2. Insert rows in tenant-scoped tables for both tenants
3. Using Supabase client as User A, list and update rows; confirm only Tenant A data
4. Repeat as User B for Tenant B
5. Attempt (via API or direct client) to access Tenant B data as User A; must fail

**Security Considerations**: Critical: any cross-tenant access is a security failure  
**Testing Checklist**: [ ] No cross-tenant read; [ ] No cross-tenant write

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.2: AI Integration Framework

Set up AI service abstraction layer to work with multiple AI providers.

**Time Estimate**: 2–3 days  
**Prerequisites**: OpenAI and Anthropic API keys; Node.js 18+  
**Expected Outcome**: Single AI service interface, provider switching, prompt management, feature flags, and rate/cost tracking

### Sub-Step 1.2.1: Create AI Service Abstraction Layer
**File Path**: `lib/ai/service.ts` (or `lib/ai/index.ts`)  
**Purpose**: Define a common interface (e.g. `complete`, `stream`) so app code does not depend on a specific provider

**Option A (Using AI Tools)**: *"Create an AI service abstraction in lib/ai/service.ts. Define an interface with methods like complete(prompt, options) and stream(prompt, options). Implement a factory that returns the configured provider (OpenAI or Anthropic) based on environment variable. Use dependency injection so we can switch providers without changing callers."*

**Option B (Manual)**:
1. Create `lib/ai/types.ts` with interface `AIProvider { complete(...), stream(...) }`
2. Create `lib/ai/service.ts` that exports `getAIProvider(): AIProvider` reading from env (e.g. AI_PROVIDER=openai|anthropic)
3. Implement OpenAI and Anthropic adapters that satisfy the interface
4. Export a single `complete` and `stream` function that delegate to the active provider

**Code Structure Example**:
```typescript
// lib/ai/types.ts
export interface AIProvider {
  complete(prompt: string, options?: CompleteOptions): Promise<string>;
  stream(prompt: string, options?: StreamOptions): AsyncIterable<string>;
}
// lib/ai/service.ts
export function getAIProvider(): AIProvider { ... }
```

**Security Considerations**: Never log or expose full prompts containing PII; store API keys in env only  
**Testing Checklist**: [ ] Interface used by app; [ ] Provider switch works via env

### Sub-Step 1.2.2: Set Up OpenAI Client with Configuration
**File Path**: `lib/ai/providers/openai.ts`, `.env.local`  
**Purpose**: Initialize OpenAI client and read API key and model from config

**Option A (Using AI Tools)**: *"Create lib/ai/providers/openai.ts that initializes the OpenAI SDK with the API key from process.env.OPENAI_API_KEY. Support model override via OPENAI_MODEL (default gpt-4o-mini or gpt-4). Implement complete and stream methods that match our AIProvider interface."*

**Option B (Manual)**:
1. Install `openai` package; add OPENAI_API_KEY and OPENAI_MODEL to .env.local
2. Create `lib/ai/providers/openai.ts`; instantiate OpenAI client
3. Implement complete() using chat.completions.create
4. Implement stream() using the same with stream: true
5. Map responses to the common interface (e.g. return content only)

**Testing Checklist**: [ ] complete() returns text; [ ] stream() yields chunks

### Sub-Step 1.2.3: Set Up Anthropic Client with Configuration
**File Path**: `lib/ai/providers/anthropic.ts`, `.env.local`  
**Purpose**: Initialize Anthropic client and support model selection

**Option A (Using AI Tools)**: *"Create lib/ai/providers/anthropic.ts using the Anthropic SDK. Read ANTHROPIC_API_KEY and ANTHROPIC_MODEL from env. Implement complete and stream to match our AIProvider interface so we can swap OpenAI for Anthropic without changing callers."*

**Option B (Manual)**:
1. Install `@anthropic-ai/sdk`; add ANTHROPIC_API_KEY and ANTHROPIC_MODEL to .env
2. Create anthropic.ts with create() and stream() that call messages.create
3. Map Claude response format to same return shape as OpenAI adapter
4. Ensure errors are normalized (e.g. rate limit, auth) for consistent handling

**Testing Checklist**: [ ] complete() and stream() work; [ ] Same interface as OpenAI

### Sub-Step 1.2.4: Implement Provider Switching Logic
**File Path**: `lib/ai/service.ts`  
**Purpose**: Choose provider at runtime via env or per-request option

**Option A (Using AI Tools)**: *"In lib/ai/service.ts, implement getAIProvider() to return OpenAI or Anthropic based on AI_PROVIDER env. Add optional parameter to complete()/stream() to override provider for a single request. Log which provider was used (without logging prompts)."*

**Option B (Manual)**:
1. In getAIProvider(), read process.env.AI_PROVIDER (e.g. 'openai' | 'anthropic')
2. Return the corresponding provider instance (lazy-init to avoid loading both SDKs if not needed)
3. Optionally accept provider override in options for A/B testing
4. Document env vars in .env.example

**Testing Checklist**: [ ] Switching AI_PROVIDER changes provider; [ ] Override works when supported

### Sub-Step 1.2.5: Create Prompt Management System (Database + UI)
**File Path**: `supabase/migrations/` for prompts table, `lib/ai/prompts.ts`, optional admin UI  
**Purpose**: Store and version prompts in DB; load by key in code

**Option A (Using AI Tools)**: *"Add a prompts table (id, key, body, version, tenant_id optional, created_at). Create lib/ai/prompts.ts with getPrompt(key, tenantId?) that fetches the latest version. Optionally add a simple admin page to edit prompts."*

**Option B (Manual)**:
1. Migration: create table prompts (id, key text unique, body text, version int, created_at)
2. Implement getPrompt(key) in lib/ai/prompts.ts using Supabase client
3. Use in AI service: complete(getPrompt('support_reply') + userMessage)
4. Optionally add CRUD UI under /admin/prompts with RLS for admins only

**Security Considerations**: Restrict prompt editing to admins; sanitize prompt body if rendered in UI  
**Testing Checklist**: [ ] Prompts load by key; [ ] Versioning or override works

### Sub-Step 1.2.6: Add Feature Flags for AI Features
**File Path**: `lib/feature-flags.ts` or env-based flags, usage in components  
**Purpose**: Enable/disable AI features per tenant or globally without deploy

**Option A (Using AI Tools)**: *"Add feature flags for AI: AI_CHAT_ENABLED, AI_SUGGESTIONS_ENABLED. Check these in the AI service or in components before calling AI. Support per-tenant override via a tenant_settings table or env."*

**Option B (Manual)**:
1. Define flags (e.g. in env: NEXT_PUBLIC_AI_CHAT_ENABLED=true)
2. Create getFeatureFlag(name, tenantId?) that reads env or DB
3. Guard AI calls: if (!getFeatureFlag('ai_chat', tenantId)) return fallback
4. Document how to enable/disable per environment

**Testing Checklist**: [ ] Disabling flag turns off AI; [ ] No errors when disabled

### Sub-Step 1.2.7: Implement Rate Limiting Per User
**File Path**: `lib/ai/rate-limit.ts`, middleware or API route  
**Purpose**: Limit AI requests per user/tenant to avoid abuse and control cost

**Option A (Using AI Tools)**: *"Add rate limiting for AI API calls: e.g. 100 requests per user per day. Use Redis or Supabase to store counters. In the API route that calls AI, check the limit before calling the provider and return 429 with Retry-After if exceeded."*

**Option B (Manual)**:
1. Create lib/ai/rate-limit.ts with checkLimit(userId, tenantId) and recordUsage(userId, tenantId)
2. Use Supabase table (ai_usage: user_id, date, count) or Redis
3. In API route (e.g. /api/ai/complete), get user from session; if over limit return 429
4. Increment count after successful call
5. Optionally add different limits per plan (from subscription)

**Security Considerations**: Identify user by authenticated session only; do not trust client-supplied user id  
**Testing Checklist**: [ ] Limit enforced; [ ] 429 returned when exceeded

### Sub-Step 1.2.8: Add Cost Tracking and Monitoring
**File Path**: `lib/ai/usage.ts`, optional DB table or logging  
**Purpose**: Log token usage and estimated cost per request for billing or alerts

**Option A (Using AI Tools)**: *"After each AI completion, log token usage (input + output) and estimated cost to a table ai_usage_logs (user_id, tenant_id, provider, model, input_tokens, output_tokens, estimated_cost, created_at). Use provider pricing (e.g. OpenAI pricing page) to compute cost. Add a simple dashboard or export for finance."*

**Option B (Manual)**:
1. Create ai_usage_logs table or append to existing usage table
2. In AI provider adapters, capture input/output token counts from response
3. Map model to cost per 1K tokens (from provider docs); compute and store
4. Aggregate by tenant/month for reporting
5. Optional: alert when daily cost exceeds threshold

**Testing Checklist**: [ ] Each call logs tokens and cost; [ ] Aggregations correct

### Sub-Step 1.2.9: Create AI Usage Analytics
**File Path**: `lib/analytics/ai.ts` or existing analytics  
**Purpose**: Track which features use AI and how much (for product decisions)

**Option A (Using AI Tools)**: *"Track AI usage events: feature name, tenant_id, model, token count, latency. Send to our analytics (e.g. PostHog, Mixpanel, or Supabase). Add a simple internal dashboard showing AI usage by feature and by tenant."*

**Option B (Manual)**:
1. Emit events (e.g. ai.invoked { feature, tenantId, model, tokens, latencyMs })
2. Send to existing analytics pipeline or write to Supabase
3. Build dashboard (e.g. in admin) with charts: usage by feature, by tenant, over time
4. Use for capacity planning and feature prioritization

**Testing Checklist**: [ ] Events emitted; [ ] Dashboard shows data

### Sub-Step 1.2.10: Set Up Error Handling and Fallbacks
**File Path**: `lib/ai/service.ts`, provider adapters  
**Purpose**: Handle provider errors, timeouts, and optional fallback to second provider

**Option A (Using AI Tools)**: *"In the AI service, wrap provider calls in try/catch. On OpenAI rate limit or 5xx, optionally retry with exponential backoff or fallback to Anthropic (if configured). Return user-friendly error messages; log full errors server-side. Set timeouts (e.g. 30s) for completion calls."*

**Option B (Manual)**:
1. Set timeout on fetch/call (e.g. 30 seconds)
2. Catch rate limit (429), server error (5xx), and timeout; map to user message
3. Optional: if primary provider fails, call getAIProvider('fallback') and retry once
4. Log error with request id for debugging; never expose API keys or stack to client
5. Return structured error { code: 'RATE_LIMIT' | 'UNAVAILABLE', message }

**Security Considerations**: Do not leak provider names or internal errors to client  
**Testing Checklist**: [ ] Timeout returns clean error; [ ] Fallback works when configured

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.3: Multi-Tenant Architecture

Implement multi-tenant architecture with tenant isolation and management.

**Time Estimate**: 2–4 days  
**Prerequisites**: Step 1.1 (Database Architecture) completed; tenants and tenant_members tables exist  
**Expected Outcome**: App-wide tenant context, tenant switcher UI, and verified data isolation

### Sub-Step 1.3.1: Design Tenant Isolation Strategy in Application
**File Path**: `lib/tenant.ts`, middleware or auth layer  
**Purpose**: Decide how current tenant is determined (JWT claim, cookie, session, URL)

**Option A (Using AI Tools)**: *"Design how we pass the current tenant through the app: store tenant_id in JWT custom claim after login, or in a cookie/session. Document: where we set it (login, tenant switch), where we read it (middleware, API, Supabase RLS), and how RLS gets it (e.g. set_config or JWT claim)."*

**Option B (Manual)**:
1. Choose mechanism: JWT claim (e.g. app_metadata.tenant_id) or server session/cookie
2. Ensure Supabase RLS can read it (JWT claim in auth.jwt() or set_config in request)
3. Document flow: login → set tenant; switch → update JWT/session; API/middleware → read and pass to DB
4. Create lib/tenant.ts with getCurrentTenantId(req) and setCurrentTenantId(req, id)

**Security Considerations**: Tenant ID must come from server/session, never solely from client  
**Testing Checklist**: [ ] Strategy documented; [ ] getCurrentTenantId returns correct value

### Sub-Step 1.3.2: Implement Tenant Context in Application
**File Path**: `contexts/tenant-context.tsx`, `app/layout.tsx`  
**Purpose**: Provide current tenant (and list of memberships) to all components

**Option A (Using AI Tools)**: *"Create a React context TenantContext that holds currentTenantId and tenants (list of { id, name } the user belongs to). Fetch tenants from Supabase tenant_members + tenants on load. Provide setCurrentTenantId to switch. Wrap the app in TenantProvider in layout.tsx."*

**Option B (Manual)**:
1. Create contexts/tenant-context.tsx with TenantContext, currentTenantId, tenants, setCurrentTenantId
2. Fetch user's tenants via API or Supabase (tenant_members join tenants) when user is authenticated
3. Persist currentTenantId in cookie or session so it survives refresh
4. Wrap app in TenantProvider in app/layout.tsx; use useTenant() in components
5. Ensure unauthenticated users get null tenant

**Testing Checklist**: [ ] useTenant() returns current tenant; [ ] tenants list populated

### Sub-Step 1.3.3: Set Up Tenant Management System
**File Path**: `app/admin/tenants/` or `lib/admin/tenants.ts`, API routes  
**Purpose**: Create/organize tenants and members (admin or self-service)

**Option A (Using AI Tools)**: *"Create tenant management: API route POST /api/tenants to create a tenant (admin only or first user). API route POST /api/tenants/[id]/members to add a member with role. Use RLS or server-side checks so only admins or tenant owners can manage."*

**Option B (Manual)**:
1. Create POST /api/tenants (body: name, slug); validate; insert into tenants; add caller as owner in tenant_members
2. Create POST /api/tenants/[id]/members (body: email or user_id, role); check caller is admin or tenant owner; insert into tenant_members
3. Add GET /api/tenants to list tenants (for current user: only those in tenant_members)
4. Protect all routes with auth; enforce admin or tenant-owner for mutations
5. Optional: invite by email (create invite row, send email, accept adds tenant_member)

**Security Considerations**: Only admins or tenant owners can add/remove members; validate tenant_id  
**Testing Checklist**: [ ] Create tenant works; [ ] Add member works; [ ] Non-owners cannot add members

### Sub-Step 1.3.4: Create Tenant Switching Functionality
**File Path**: `components/tenant-switcher.tsx`, API or middleware to set tenant  
**Purpose**: UI to switch current tenant and persist choice

**Option A (Using AI Tools)**: *"Build a tenant switcher component: dropdown or list of tenants the user belongs to. On select, call API to set current tenant (e.g. POST /api/tenant/switch with tenant_id, which sets cookie or updates session/JWT) and refresh or redirect. Show current tenant name in header."*

**Option B (Manual)**:
1. Create components/tenant-switcher.tsx that lists tenants from useTenant()
2. On select, call POST /api/tenant/switch with { tenant_id }; API sets cookie or updates session and returns ok
3. After switch, revalidate or redirect so all data refetches with new tenant
4. Place switcher in header or sidebar; show current tenant name
5. If user has one tenant, optionally hide switcher or show single option

**Security Considerations**: API must verify user is member of requested tenant_id before setting  
**Testing Checklist**: [ ] Switch updates context and cookie; [ ] Data refetches for new tenant

### Sub-Step 1.3.5: Ensure All Queries Use Tenant Context
**File Path**: All API routes and Supabase queries that touch tenant-scoped data  
**Purpose**: No query omits tenant_id filter

**Option A (Using AI Tools)**: *"Audit all API routes and Supabase queries that read or write tenant-scoped tables. Ensure each uses the current tenant ID from context/session (getCurrentTenantId). Add a checklist or comment in each file. Fix any query that does not filter by tenant_id."*

**Option B (Manual)**:
1. List all API routes and server components that query tenants, tenant_members, or tenant-scoped tables
2. For each, add getCurrentTenantId() (or equivalent) and pass tenant_id to Supabase .eq('tenant_id', id)
3. Remove any hardcoded tenant_id or queries without tenant filter
4. Add integration test: switch tenant, verify list endpoints return only that tenant's data
5. Document pattern: "Always pass tenant_id from context to DB queries"

**Security Considerations**: Missing tenant_id filter can cause data leakage  
**Testing Checklist**: [ ] All tenant-scoped queries filter by tenant; [ ] Integration test passes

### Sub-Step 1.3.6: Test Tenant Isolation Thoroughly
**File Path**: `__tests__/integration/tenant-isolation.test.ts` or E2E  
**Purpose**: Verify no cross-tenant access in UI and API

**Option A (Using AI Tools)**: *"Write integration tests: two users in two different tenants. As User A, create data; switch to Tenant B (if possible) and verify User A cannot see Tenant B data. As User B, try to access Tenant A resource by ID via API; expect 404 or 403."*

**Option B (Manual)**:
1. Create two tenants and two users (one primary per tenant)
2. As User A: create a resource (e.g. project); note ID
3. As User A: call GET /api/projects/[id] with Tenant B's project ID (if known); expect 404 or 403
4. As User B: call GET /api/projects with Tenant A's project ID; expect not in list or 403
5. E2E: log in as User A, switch tenant to B; confirm UI shows only Tenant B data
6. Run tests in CI

**Security Considerations**: Critical; any cross-tenant access is a failure  
**Testing Checklist**: [ ] API returns 403/404 for other tenant; [ ] UI shows only current tenant data

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 2: AI Features

#### Step 2.1: AI-Powered Features

Implement AI-powered capabilities in your platform.

**Time Estimate**: 3–5 days  
**Prerequisites**: Step 1.2 (AI Integration Framework) and 1.3 (Multi-Tenant Architecture) completed  
**Expected Outcome**: Content generation, analysis, recommendations, chat UI, and optional customization—all tenant-aware

### Sub-Step 2.1.1: Implement AI Content Generation
**File Path**: `app/.../generate/` or `components/ai-generate.tsx`, `lib/ai/content.ts`  
**Purpose**: Let users generate text/content (e.g. drafts, descriptions) via AI

**Option A (Using AI Tools)**: *"Add AI content generation: a form or textarea where users enter a topic or outline, then call our AI service (complete) with a prompt from getPrompt('content_generation'). Return generated text in the UI. Store prompt key and options in DB; respect tenant_id and feature flag AI_CONTENT_ENABLED."*

**Option B (Manual)**:
1. Create API route POST /api/ai/generate (body: type, input, options); get tenant from session; check feature flag
2. Load prompt template from getPrompt('content_generation'); substitute input; call getAIProvider().complete()
3. Return { content } to client; optionally save to DB with tenant_id and user_id
4. Build UI: input field, "Generate" button, loading state, display result; allow copy or insert
5. Add rate limit check in API; log usage for cost/analytics

**Security Considerations**: Sanitize user input before putting in prompt; enforce tenant and rate limits  
**Testing Checklist**: [ ] Generate returns content; [ ] Tenant and rate limit enforced

### Sub-Step 2.1.2: Add AI Analysis and Insights
**File Path**: `lib/ai/analysis.ts`, API route, dashboard or report UI  
**Purpose**: Analyze user data (e.g. summaries, trends) using AI

**Option A (Using AI Tools)**: *"Implement AI analysis: send aggregated or sampled data (e.g. last 30 days of activity) to AI with a prompt like 'Summarize key trends and suggest actions.' Return summary and bullet points. Show in a dashboard; respect tenant_id so each tenant sees only their data."*

**Option B (Manual)**:
1. Create POST /api/ai/analyze (body: scope, dateRange); fetch tenant-scoped data from DB
2. Aggregate or sample data; build a safe text representation (no PII in prompt if possible)
3. Call getAIProvider().complete() with getPrompt('analysis_insights') + data summary
4. Parse response (e.g. bullets, summary); return to client
5. Add UI section "AI Insights" on dashboard; show loading and result; cache for 1 hour if needed
6. Enforce tenant_id on data fetch and feature flag

**Security Considerations**: Do not send raw PII to AI; use aggregated/sanitized data  
**Testing Checklist**: [ ] Analysis returns insights; [ ] Data is tenant-scoped

### Sub-Step 2.1.3: Create AI Recommendation System
**File Path**: `lib/recommendations/ai.ts`, API route, UI components  
**Purpose**: Recommend items (e.g. next steps, content) based on user behavior and AI

**Option A (Using AI Tools)**: *"Build AI recommendations: given user's recent actions and tenant data, call AI with a prompt that asks for 3–5 personalized recommendations. Store recommendations in DB or return on demand. Show in sidebar or dashboard; refresh when user context changes."*

**Option B (Manual)**:
1. Create GET /api/ai/recommendations (optional: type, limit); get current user and tenant_id
2. Fetch user's recent activity and relevant tenant data (e.g. projects, usage)
3. Build prompt with getPrompt('recommendations') + context; call AI complete(); parse list
4. Return recommendations; optionally cache per user for 15–30 minutes
5. Add Recommendations component to dashboard; link each item to relevant page
6. Respect feature flag and rate limits

**Testing Checklist**: [ ] Recommendations returned; [ ] Context is tenant and user-specific

### Sub-Step 2.1.4: Build AI Chat Interface
**File Path**: `components/ai-chat.tsx`, `app/.../chat/` or modal, API route for chat  
**Purpose**: Conversational UI (chat) that uses AI with conversation history

**Option A (Using AI Tools)**: *"Create an AI chat UI: message list, input, send button. API route POST /api/ai/chat accepts messages array and returns assistant message. Use AI stream() for real-time typing. Store conversation in DB per user/tenant; load last N messages on open. Respect AI_CHAT_ENABLED and rate limits."*

**Option B (Manual)**:
1. Create table chat_conversations (id, tenant_id, user_id, title, created_at) and chat_messages (id, conversation_id, role, content, created_at)
2. Create POST /api/ai/chat (body: conversationId?, messages); load history if conversationId; append user message; call AI complete() or stream() with messages; save assistant reply
3. If stream: use ReadableStream or SSE to send chunks; client appends to last message
4. Build components/ai-chat.tsx: message list (user/assistant), input, submit; optional conversation list sidebar
5. Enforce tenant_id on all reads/writes; feature flag and rate limit
6. Optional: add "New conversation" and list previous conversations

**Security Considerations**: Sanitize messages; do not store secrets in chat; enforce tenant and user ownership  
**Testing Checklist**: [ ] Chat sends and receives; [ ] History loads; [ ] Stream works if implemented

### Sub-Step 2.1.5: Add AI Customization Options
**File Path**: `app/settings/ai/` or tenant/user settings, DB for preferences  
**Purpose**: Let users or admins customize tone, length, or model for AI features

**Option A (Using AI Tools)**: *"Add AI settings: optional tenant-level or user-level preferences (tone: professional/casual, max length, model override). Store in tenant_settings or user_settings. When calling AI, merge these into request options. Add a simple settings page under /settings/ai (admin or user)."*

**Option B (Manual)**:
1. Add columns or table: ai_preferences (tenant_id or user_id, tone, max_tokens, model_override)
2. Create GET/PATCH /api/settings/ai to read and update preferences; enforce tenant and auth
3. In AI service or API layer, load preferences and pass to provider (e.g. max_tokens, system prompt for tone)
4. Build settings page: dropdowns for tone, optional model; save via PATCH
5. Document which options are tenant vs user level
6. Optional: allow admins to set defaults for tenant

**Testing Checklist**: [ ] Preferences saved and loaded; [ ] AI calls use preferences

### Sub-Step 2.1.6: Integrate AI Features with Multi-Tenant Architecture
**File Path**: All AI API routes and components  
**Purpose**: Every AI call and stored AI data is scoped to current tenant

**Option A (Using AI Tools)**: *"Audit all AI API routes and DB writes: ensure tenant_id is set from getCurrentTenantId() and all reads filter by tenant_id. Ensure chat, recommendations, and generated content are tenant-isolated. Add tests that create two tenants and verify no cross-tenant AI data."*

**Option B (Manual)**:
1. List every AI-related API route and table (chat_messages, ai_usage_logs, generated_content, etc.)
2. For each route: get tenant_id from session/context; pass to DB and to AI usage logging
3. For each table: ensure tenant_id column and RLS or query filter
4. Run integration test: two tenants, two users; generate content and chat in Tenant A; verify Tenant B cannot see it
5. Document: "All AI features require valid tenant context"

**Security Considerations**: Tenant ID must never come from client; always from authenticated session  
**Testing Checklist**: [ ] All AI data has tenant_id; [ ] No cross-tenant access in tests

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 2.2: Workflow Automation

Create a workflow automation system for your platform.

**Time Estimate**: 3–5 days  
**Prerequisites**: Multi-tenant architecture; database and API patterns in place  
**Expected Outcome**: Workflow definitions, triggers, actions, executor, and builder UI—all tenant-scoped

### Sub-Step 2.2.1: Design Automation System Architecture
**File Path**: Design doc or `lib/workflows/types.ts`  
**Purpose**: Define workflow model (workflow, steps, triggers, actions) and execution flow

**Option A (Using AI Tools)**: *"Design a workflow automation system: workflows belong to a tenant; each workflow has a name, trigger (e.g. on_event, schedule), and steps (each step: action type, config). Define data model: workflows table, workflow_steps table. Document how triggers fire (webhook, cron, event from app) and how steps run (sync or queue)."*

**Option B (Manual)**:
1. Define workflow entity: id, tenant_id, name, trigger_type, trigger_config, enabled, created_at
2. Define workflow_steps: id, workflow_id, order, action_type, action_config
3. Define trigger types: webhook, schedule (cron), event (e.g. user_created, subscription_updated)
4. Define action types: send_email, call_api, update_db, notify_slack, etc.
5. Document execution: trigger fires → load workflow → run steps in order; use queue (e.g. Vercel queue, Supabase Edge) for async
6. Create lib/workflows/types.ts with interfaces

**Testing Checklist**: [ ] Data model documented; [ ] Types defined

### Sub-Step 2.2.2: Create Workflow Builder UI
**File Path**: `app/[tenant]/workflows/` or `app/admin/workflows/`, `components/workflow-builder.tsx`  
**Purpose**: UI to create and edit workflows (trigger + steps)

**Option A (Using AI Tools)**: *"Build a workflow builder: list workflows, create/edit workflow. Form: name, trigger type (webhook / schedule / event), trigger config (e.g. cron expression, event name). Add steps: for each step choose action type and config (e.g. email template, API URL). Save to workflows and workflow_steps tables; enforce tenant_id."*

**Option B (Manual)**:
1. Create GET/POST /api/workflows (tenant-scoped); GET/PATCH/DELETE /api/workflows/[id]
2. Create app/workflows/page.tsx: list workflows; link to create and edit
3. Create app/workflows/[id]/edit/page.tsx: form for name, trigger type, trigger config
4. Add step editor: add/remove/reorder steps; each step: action type dropdown, config (JSON or form fields)
5. Save workflow and steps via API; validate trigger and action configs
6. Optional: drag-and-drop step order; preview or test run button

**Security Considerations**: Only tenant members (or admins) can create/edit workflows; validate configs  
**Testing Checklist**: [ ] Create and edit workflow; [ ] Steps saved in order

### Sub-Step 2.2.3: Implement Trigger System
**File Path**: `lib/workflows/triggers.ts`, API routes for webhook/cron, event emitters  
**Purpose**: Fire workflows when webhook received, cron runs, or app event occurs

**Option A (Using AI Tools)**: *"Implement workflow triggers: (1) Webhook: POST /api/webhooks/workflows/[workflow_id] with secret; verify signature and enqueue execution. (2) Schedule: cron job (e.g. Vercel Cron) that finds workflows with trigger_type=schedule and cron matching; enqueue each. (3) Event: when app emits event (e.g. user.created), find workflows with that event; enqueue. Use a queue table or Vercel queue for execution."*

**Option B (Manual)**:
1. Create workflow_runs table: id, workflow_id, status, triggered_at, payload (jsonb), error (text)
2. Webhook: POST /api/webhooks/workflows/[id] with body; verify secret; insert workflow_runs; call executor or push to queue
3. Schedule: create API route GET /api/cron/workflows (called by Vercel Cron); query workflows where trigger_type='schedule' and cron matches now; enqueue each
4. Event: in app code (e.g. after user signup), call enqueueWorkflows(tenant_id, 'user.created', payload); insert workflow_runs for matching workflows
5. Implement enqueueWorkflows(tenantId, event, payload) that finds workflows and creates run records
6. Document how to add new trigger types

**Security Considerations**: Webhook must verify secret; cron route must be protected (e.g. CRON_SECRET)  
**Testing Checklist**: [ ] Webhook triggers workflow; [ ] Schedule triggers; [ ] Event triggers

### Sub-Step 2.2.4: Add Action System
**File Path**: `lib/workflows/actions.ts`, executor  
**Purpose**: Execute each action type (send email, HTTP, DB update, etc.)

**Option A (Using AI Tools)**: *"Implement workflow actions: create runAction(step, payload) that switches on action_type. For send_email: use Resend or Supabase with template from config. For http: fetch URL with payload. For update_db: run Supabase update from config. Log result to workflow_runs or step result; on failure retry or mark failed."*

**Option B (Manual)**:
1. Create lib/workflows/actions.ts with action runners: sendEmail(config, payload), callHttp(config, payload), updateDb(config, payload)
2. Implement runAction(step, payload): call appropriate runner; return { success, result, error }
3. For send_email: use existing email service; substitute payload into template
4. For http: POST to URL with payload; handle timeouts and non-2xx
5. For update_db: build update from config (table, filters, values from payload); use service role if needed
6. Add new action types (e.g. notify_slack) by extending runAction
7. Document each action type's config schema

**Security Considerations**: Validate URLs (no internal network if possible); limit DB updates to allowed tables  
**Testing Checklist**: [ ] Each action type runs; [ ] Errors logged and optional retry

### Sub-Step 2.2.5: Create Workflow Executor
**File Path**: `lib/workflows/executor.ts`, API route or queue consumer  
**Purpose**: Load workflow run, execute steps in order, update status

**Option A (Using AI Tools)**: *"Create workflow executor: given workflow_run_id, load run and workflow with steps. Execute steps in order; for each step call runAction(step, payload). Update workflow_runs.status to running then completed or failed; store step results. If a step fails, optionally retry or stop and mark run failed. Use idempotency so duplicate webhook/cron doesn't double-run."*

**Option B (Manual)**:
1. Create executeWorkflowRun(runId): load workflow_runs and workflow + steps; set status = 'running'
2. Build payload from run (e.g. trigger payload + context)
3. For each step in order: result = runAction(step, payload); if !result.success, set status = 'failed', store error, exit
4. Set status = 'completed'; store final payload or summary
5. Call executeWorkflowRun from webhook/cron/event handler (or from queue worker)
6. Use unique constraint or lock to avoid duplicate execution for same run
7. Optional: timeout per run; retry failed steps with backoff

**Testing Checklist**: [ ] Full workflow runs; [ ] Failure in step marks run failed; [ ] No duplicate execution

### Sub-Step 2.2.6: Test Automations End-to-End
**File Path**: `__tests__/integration/workflows.test.ts` or E2E  
**Purpose**: Verify trigger → executor → actions with real or mocked actions

**Option A (Using AI Tools)**: *"Write integration tests: create a workflow with webhook trigger and one step (e.g. send_email with test template). Call webhook endpoint; assert workflow_runs row is created and status becomes completed. Mock email sender to avoid sending real email. Add test for schedule and event triggers if implemented."*

**Option B (Manual)**:
1. Create test workflow: trigger = webhook; step = send_email (use test template or mock)
2. POST to webhook URL with test payload; wait for executor to finish
3. Assert workflow_runs has status completed; assert email mock was called (or check logs)
4. Test failure: step with invalid config; assert run status failed and error stored
5. Optional: E2E test from UI—create workflow, trigger via webhook or cron, check run history in UI
6. Document how to test new trigger/action types

**Testing Checklist**: [ ] Webhook → run → success; [ ] Failure case handled; [ ] Tenant isolation (run only for correct tenant)

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 3: Enterprise Features

#### Step 3.1: Advanced Integrations

Set up API gateway and integration system for third-party services.

**Time Estimate**: 3–5 days  
**Prerequisites**: Multi-tenant architecture; authentication and API patterns in place  
**Expected Outcome**: API gateway, incoming/outgoing webhooks, OAuth integrations, optional data sync, and integration UI

### Sub-Step 3.1.1: Set Up API Gateway / Base API Layer
**File Path**: `app/api/`, middleware, `lib/api/auth.ts`  
**Purpose**: Central auth, rate limiting, and versioning for external API access

**Option A (Using AI Tools)**: *"Set up an API layer for third-party access: require API key or OAuth token in header (e.g. Authorization: Bearer <key>). Validate key against integrations or api_keys table (tenant_id, key hash). Apply rate limit per key. Return consistent JSON errors (401, 429, 500). Document base URL and auth in docs."*

**Option B (Manual)**:
1. Create api_keys table: tenant_id, key_hash, name, scopes (optional), created_at; store hashed key only
2. Middleware or helper: getApiKey(req) from Authorization header; lookup by hash; attach tenant_id to request
3. Return 401 if invalid/missing; 429 if rate limit exceeded (use Redis or DB counter per key)
4. Create lib/api/auth.ts with validateApiKey(req) and getTenantFromApiKey(req)
5. Document: POST /api/v1/... with Authorization: Bearer <api_key>
6. Optional: API version prefix (e.g. /api/v1/) for future changes

**Security Considerations**: Never log or expose raw API keys; use hash only; rate limit strictly  
**Testing Checklist**: [ ] Valid key returns 200; [ ] Invalid key 401; [ ] Rate limit 429

### Sub-Step 3.1.2: Create Webhook System for Incoming Webhooks
**File Path**: `app/api/webhooks/[provider]/route.ts`, `lib/webhooks/verify.ts`  
**Purpose**: Accept webhooks from third parties (e.g. Stripe, GitHub) with verification

**Option A (Using AI Tools)**: *"Create incoming webhook handling: POST /api/webhooks/[provider] (e.g. stripe, github). For each provider, verify signature (e.g. Stripe signing secret, GitHub HMAC). Parse payload; dispatch to handler (e.g. stripe handler updates subscription). Store raw payload in webhook_logs (tenant_id, provider, event_id, payload, status) for idempotency and debugging."*

**Option B (Manual)**:
1. Create webhook_logs table: id, tenant_id, provider, event_id, payload (jsonb), status, created_at
2. For Stripe: POST /api/webhooks/stripe; verify stripe signature; parse event; handle subscription events; insert webhook_logs; return 200
3. For GitHub (or other): verify HMAC; parse; handle; log; return 200
4. Use event_id (or idempotency key) to skip duplicate events
5. Document webhook URLs and required headers for each provider
6. Optional: retry logic on provider side; return 5xx only for transient errors

**Security Considerations**: Always verify webhook signature; never trust body without verification  
**Testing Checklist**: [ ] Valid signature processes event; [ ] Invalid signature 401; [ ] Duplicate event idempotent

### Sub-Step 3.1.3: Create Outgoing Webhooks
**File Path**: `lib/webhooks/outgoing.ts`, `integrations` or `webhook_subscriptions` table  
**Purpose**: Let tenants configure URLs to receive events from your platform

**Option A (Using AI Tools)**: *"Implement outgoing webhooks: table webhook_subscriptions (tenant_id, url, secret, events[], enabled). When an event occurs (e.g. user.created, subscription.updated), find subscriptions for that event; POST to each URL with payload and HMAC signature. Retry on 5xx; disable after N failures. Store delivery logs."*

**Option B (Manual)**:
1. Create webhook_subscriptions table: tenant_id, url, secret, events (text[]), enabled, created_at
2. Create webhook_deliveries table: subscription_id, event, payload, status, response_code, created_at
3. On event (e.g. in API or DB trigger): getSubscriptions(tenant_id, event); for each, POST url with JSON payload and X-Signature: HMAC(secret, body)
4. Retry 2–3 times on 5xx with backoff; mark subscription disabled after repeated failures (optional)
5. Admin or settings UI: add/edit/delete subscription URL and event selection
6. Document payload shape and signature verification for customers

**Security Considerations**: Use HTTPS only; validate URL format; keep secret per subscription  
**Testing Checklist**: [ ] Event triggers POST; [ ] Signature verifiable; [ ] Retry on 5xx

### Sub-Step 3.1.4: Implement OAuth Integrations
**File Path**: `app/api/oauth/[provider]/route.ts`, `lib/oauth/`  
**Purpose**: Let users or tenants connect third-party accounts (e.g. Google, Slack) via OAuth

**Option A (Using AI Tools)**: *"Implement OAuth for integrations: GET /api/oauth/[provider]/connect redirects to provider auth; GET /api/oauth/[provider]/callback receives code, exchanges for token, stores in integrations table (tenant_id, user_id, provider, access_token encrypted, refresh_token, expires_at). Create lib/oauth/getClient(provider, tenantId) that returns authenticated client for API calls."*

**Option B (Manual)**:
1. Create integrations table: tenant_id, user_id, provider, access_token_encrypted, refresh_token_encrypted, expires_at, created_at
2. For each provider (e.g. Google, Slack): register app; get client_id, client_secret; add to env
3. GET /api/oauth/[provider]/connect: build auth URL with state (csrf + tenant_id); redirect user
4. GET /api/oauth/[provider]/callback: verify state; exchange code for tokens; encrypt and store; redirect to app
5. Create getOAuthClient(provider, tenantId): load tokens; refresh if expired; return client (e.g. Google API client)
6. Document how to add new OAuth providers
7. Optional: scopes per integration; revoke endpoint

**Security Considerations**: Encrypt tokens at rest; use state for CSRF; store minimal scopes  
**Testing Checklist**: [ ] Connect flow works; [ ] Token refresh works; [ ] API calls use correct tenant

### Sub-Step 3.1.5: Add Data Sync Capabilities
**File Path**: `lib/sync/`, cron or queue jobs  
**Purpose**: Sync data to/from third parties (e.g. CRM, billing) on a schedule or event

**Option A (Using AI Tools)**: *"Add data sync: for each tenant with an integration (e.g. Salesforce), run a sync job: fetch data from external API using stored OAuth client; map to our schema; upsert into our DB (tenant-scoped). Run via cron (e.g. daily) or trigger on event. Log sync runs (tenant_id, provider, status, record_count); handle rate limits and pagination."*

**Option B (Manual)**:
1. Create sync_runs table: tenant_id, provider, status, started_at, finished_at, record_count, error
2. Implement syncJob(tenantId, provider): get OAuth client; fetch from provider API; map records; upsert to tenant-scoped tables
3. Call syncJob from cron route (e.g. /api/cron/sync) or queue; iterate tenants with that integration enabled
4. Handle pagination and rate limits (backoff); log errors
5. Optional: webhook from provider to trigger incremental sync
6. Document supported providers and mapping

**Testing Checklist**: [ ] Sync runs without error; [ ] Data appears in tenant tables; [ ] Rate limit handled

### Sub-Step 3.1.6: Build Integration Marketplace or Settings UI
**File Path**: `app/integrations/` or `app/settings/integrations/`  
**Purpose**: UI for tenants to connect, configure, and disconnect integrations

**Option A (Using AI Tools)**: *"Build integrations UI: list available integrations (e.g. Stripe, Google, Slack) with Connect button. Connect opens OAuth or API key form. After connect, show status (connected, last sync). Allow disconnect (revoke token or delete api_key). Show outgoing webhook list and add/edit form. Enforce tenant_id for all."*

**Option B (Manual)**:
1. Create app/integrations/page.tsx: list providers; for each, show Connected/Not connected and Connect or Disconnect
2. Connect: link to /api/oauth/[provider]/connect (with tenant in state) or form for API key
3. After callback, redirect to integrations page; show "Connected as ..." and optional config (e.g. sync frequency)
4. Disconnect: DELETE /api/integrations/[provider] (remove row for tenant); confirm in UI
5. Add section Outgoing Webhooks: list webhook_subscriptions; form to add URL and events; delete
6. Optional: integration health (last successful sync, errors)
7. Enforce tenant on all API routes

**Security Considerations**: Only tenant members can manage tenant integrations; confirm disconnect  
**Testing Checklist**: [ ] Connect and disconnect work; [ ] Webhook CRUD works; [ ] Tenant-scoped

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 3.2: Enterprise Security

Implement enterprise security features including SSO and advanced permissions.

**Time Estimate**: 4–6 days  
**Prerequisites**: Authentication and multi-tenant architecture in place  
**Expected Outcome**: SSO (SAML/OAuth), permissions and roles, role management UI, audit logging, and compliance considerations

### Sub-Step 3.2.1: Choose SSO Provider and Protocol (SAML vs OAuth)
**File Path**: Documentation or `lib/auth/sso-types.ts`  
**Purpose**: Decide SAML vs OAuth/OIDC and document IdP requirements

**Option A (Using AI Tools)**: *"Document SSO options: SAML 2.0 (enterprise IdPs like Okta, Azure AD) vs OAuth 2.0 / OIDC (Google, Microsoft, Okta). List which IdPs we will support first. Document required IdP metadata (SAML: entity ID, ACS URL, certificate; OIDC: issuer, client_id, client_secret). Create lib/auth/sso-types.ts with types for SAML and OIDC config."*

**Option B (Manual)**:
1. Research SAML vs OIDC: SAML for enterprise IdPs; OIDC for modern IdPs and social
2. Document: SAML requires SP metadata, ACS URL, entity ID; OIDC requires redirect_uri, client_id, client_secret, issuer
3. Create types: SAMLConfig, OIDCConfig, IdPConfig (provider name, type, config)
4. Document how tenant chooses IdP (one IdP per tenant or multiple)
5. Create lib/auth/sso-types.ts with interfaces

**Testing Checklist**: [ ] Options documented; [ ] Types defined

### Sub-Step 3.2.2: Set Up SAML Configuration
**File Path**: `lib/auth/saml.ts`, `app/api/auth/saml/`  
**Purpose**: Implement SAML SP (Service Provider) flow for enterprise IdPs

**Option A (Using AI Tools)**: *"Implement SAML SP: use passport-saml or similar. Create GET /api/auth/saml/metadata to expose SP metadata (entity ID, ACS URL, certificate). Create POST /api/auth/saml/callback to receive IdP response; validate signature; extract name ID and attributes; find or create user and tenant; establish session. Store IdP config per tenant (metadata URL or XML, cert)."*

**Option B (Manual)**:
1. Install saml2-js or passport-saml; create lib/auth/saml.ts
2. Store tenant_saml_config: tenant_id, idp_metadata_url or idp_metadata_xml, certificate
3. GET /api/auth/saml/login?tenant=slug: build SAML request; redirect to IdP
4. POST /api/auth/saml/callback: parse response; verify signature; get name ID and attributes; lookup user by email or create; set tenant; create session; redirect to app
5. GET /api/auth/saml/metadata: return SP metadata for tenant (for IdP configuration)
6. Document IdP setup (ACS URL, entity ID, attribute mapping)
7. Test with IdP test tool or real IdP (e.g. Okta trial)

**Security Considerations**: Validate SAML response signature; use HTTPS; prevent replay (check InResponseTo)  
**Testing Checklist**: [ ] Metadata endpoint works; [ ] Callback creates session; [ ] Signature validated

### Sub-Step 3.2.3: Set Up OAuth/OIDC for SSO
**File Path**: `lib/auth/oidc.ts`, `app/api/auth/oidc/`  
**Purpose**: Implement OIDC flow for IdPs that support OAuth 2.0 / OIDC

**Option A (Using AI Tools)**: *"Implement OIDC SSO: GET /api/auth/oidc/login?tenant=slug redirects to IdP with client_id, redirect_uri, scope openid profile email, state (csrf+tenant). GET /api/auth/oidc/callback receives code; exchange for tokens; get userinfo; find or create user and tenant; establish session. Store tenant_oidc_config: tenant_id, issuer, client_id, client_secret, redirect_uri."*

**Option B (Manual)**:
1. Create tenant_oidc_config table: tenant_id, issuer, client_id, client_secret, redirect_uri
2. GET /api/auth/oidc/login: build authorization URL; state = csrf + tenant slug; redirect
3. GET /api/auth/oidc/callback: verify state; exchange code for tokens; call userinfo endpoint; map email/name to user; find or create user; set tenant; create session; redirect
4. Support dynamic discovery (issuer/.well-known/openid-configuration) for issuer URL
5. Document how to register app in IdP (e.g. Azure AD, Okta) and get client_id/secret
6. Test with one IdP (e.g. Google Workspace or Azure AD)

**Security Considerations**: Validate state (CSRF); store client_secret encrypted; use PKCE if supported  
**Testing Checklist**: [ ] Login redirects to IdP; [ ] Callback creates session; [ ] User attributes mapped

### Sub-Step 3.2.4: Implement User Provisioning (SCIM or Manual)
**File Path**: `lib/auth/provisioning.ts`, optional `app/api/scim/`  
**Purpose**: Sync users from IdP (optional SCIM) or allow IdP-driven JIT provisioning

**Option A (Using AI Tools)**: *"Implement provisioning: on first SSO login, create user and tenant_member if not exists (JIT). Optionally add SCIM 2.0 endpoint for IdPs that support it: GET/POST /Users, PATCH/DELETE for group sync. Map IdP user attributes to our user and tenant_members; enforce tenant from IdP or config."*

**Option B (Manual)**:
1. In SAML/OIDC callback: if user not found by email, create user (and optionally profile); create tenant_member for tenant with default role
2. Map IdP attributes: email, name, groups (if provided) to roles
3. Optional: implement SCIM 2.0 /Users and /Groups; authenticate with bearer token per tenant; map create/update/delete to users and tenant_members
4. Document JIT behavior and optional SCIM for enterprise customers
5. Handle deprovisioning: if IdP says user disabled, disable or remove tenant_member (optional)
6. Test: SSO login as new user; verify user and membership created

**Security Considerations**: SCIM endpoint must be authenticated per tenant; validate IdP attributes  
**Testing Checklist**: [ ] JIT creates user and membership; [ ] SCIM works if implemented

### Sub-Step 3.2.5: Set Up Role Mapping (IdP → App Roles)
**File Path**: `lib/auth/role-mapping.ts`, tenant config  
**Purpose**: Map IdP groups/attributes to app roles per tenant

**Option A (Using AI Tools)**: *"Implement role mapping: store tenant_role_mapping (tenant_id, idp_group_or_attribute, app_role). On SSO login, read groups or custom attribute from IdP; for each mapping match, assign that app role to tenant_member. Default role for tenant if no match. Update tenant_members.role on each login or via SCIM."*

**Option B (Manual)**:
1. Add tenant_role_mapping table: tenant_id, idp_claim (e.g. groups, custom attr), idp_value, app_role
2. In SSO callback: get groups or attribute from IdP response; for each mapping where idp_value in user's groups, set role to app_role (or highest role if multiple)
3. Set default role (e.g. member) if no mapping matches
4. Update tenant_members.role on login; optional: admin UI to edit mappings
5. Document claim names for common IdPs (Okta groups, Azure AD roles)
6. Test: login with different IdP groups; verify role in tenant_members

**Testing Checklist**: [ ] Mapped groups set correct role; [ ] Default role applied

### Sub-Step 3.2.6: Create Advanced Permissions System
**File Path**: `lib/auth/permissions.ts`, DB tables for permissions  
**Purpose**: Fine-grained permissions (e.g. resource + action) and checks

**Option A (Using AI Tools)**: *"Create permissions system: permissions table (id, resource, action, description). role_permissions (role_id, permission_id). Middleware or helper can(tenantId, userId, resource, action): load user's role in tenant; check role_permissions; return boolean. Use in API routes and UI. Seed default roles (admin, member, viewer) with permission sets."*

**Option B (Manual)**:
1. Create permissions table: resource (e.g. projects, billing), action (e.g. read, write, delete)
2. Create roles table: id, name, tenant_id (null = system role)
3. Create role_permissions: role_id, permission_id
4. Implement can(tenantId, userId, resource, action): get user's role in tenant; check role_permissions; return true/false
5. In API routes: if (!can(tenantId, userId, 'projects', 'write')) return 403
6. Seed admin (all), member (read/write own), viewer (read)
7. Optional: resource-level permissions (e.g. project_id) for ownership
8. Document permission list and how to add new ones

**Security Considerations**: Always check server-side; never trust client for permission checks  
**Testing Checklist**: [ ] can() returns correct result; [ ] API returns 403 when not allowed

### Sub-Step 3.2.7: Build Role Management UI
**File Path**: `app/admin/roles/` or `app/settings/roles/`  
**Purpose**: UI for admins to create roles and assign permissions; assign users to roles

**Option A (Using AI Tools)**: *"Build role management UI: list roles for tenant; create/edit role (name, permissions checklist). List tenant_members with role dropdown; save updates role. Only tenant admins can access. Show which permissions each role has. Optional: clone role, custom roles per tenant."*

**Option B (Manual)**:
1. Create GET/POST/PATCH /api/tenants/[id]/roles (tenant-scoped); GET/PATCH /api/tenants/[id]/members/[userId] for role
2. Create app/admin/roles/page.tsx: list roles; link to edit; form for name and permission checkboxes; save
3. Create app/admin/members/page.tsx: list tenant_members; dropdown to change role; save
4. Enforce: only users with admin permission can access; filter by current tenant
5. Optional: create custom role (tenant-specific); clone from template
6. Document default roles and how to add custom permissions

**Security Considerations**: Only tenant admins can change roles; audit log role changes  
**Testing Checklist**: [ ] Create/edit role; [ ] Assign role to member; [ ] Permission enforced in API

### Sub-Step 3.2.8: Implement Permission Checking Middleware
**File Path**: `middleware.ts`, `lib/auth/require-permission.ts`  
**Purpose**: Central place to enforce permissions on API and server actions

**Option A (Using AI Tools)**: *"Add requirePermission(resource, action): wrapper for API route or server action that gets tenant and user from session; calls can(tenantId, userId, resource, action); if false returns 403. Use in all protected API routes. Add getTenantId() and getUserId() from session so routes don't repeat auth logic."*

**Option B (Manual)**:
1. Create lib/auth/require-permission.ts: requirePermission(resource, action) that returns a function (handler) or throws 403
2. In each API route: get session; get tenantId (from context or body); requirePermission('resource', 'action')(session); then proceed
3. Optional: middleware that attaches tenant and user to request; route-level requirePermission
4. Document pattern: "All tenant-scoped routes must call requirePermission or equivalent"
5. Add tests: call API without permission; expect 403; with permission expect 200
6. Ensure 403 does not leak resource existence (same message for not-found vs forbidden if appropriate)

**Testing Checklist**: [ ] 403 when permission missing; [ ] 200 when permission present

### Sub-Step 3.2.9: Set Up Audit Logging for Security Events
**File Path**: `lib/audit/security-events.ts`, audit_logs or security_events table  
**Purpose**: Log login, SSO, role change, permission denial, and other security events

**Option A (Using AI Tools)**: *"Add security audit logging: table security_events (tenant_id, user_id, event_type, resource, action, result, ip, user_agent, created_at). Log: login, login_failed, sso_login, role_changed, permission_denied, api_key_created. In auth callbacks and requirePermission, insert event. Create admin view to search and export (for compliance)."*

**Option B (Manual)**:
1. Create security_events table: tenant_id, user_id, event_type, resource, action, result (success/failure), ip, user_agent, metadata (jsonb), created_at
2. Create logSecurityEvent({ tenantId, userId, eventType, resource, action, result, req })
3. Call in: login success/failure; SSO callback; role change API; permission denied in requirePermission; API key create/revoke
4. Add index on (tenant_id, created_at) and (user_id, created_at)
5. Create GET /api/admin/audit/security (admin only) with filters and export
6. Optional: retain for 90 days; archive to cold storage
7. Document event types and retention

**Security Considerations**: Do not log passwords or tokens; log IP and user agent for forensics  
**Testing Checklist**: [ ] Events logged on login and permission denial; [ ] Admin can search

### Sub-Step 3.2.10: Add Compliance Features (GDPR, SOC2 Considerations)
**File Path**: `lib/compliance/`, documentation, optional data export/deletion  
**Purpose**: Document and implement controls for GDPR and SOC2-relevant requirements

**Option A (Using AI Tools)**: *"Add compliance support: (1) GDPR: data export endpoint (GET /api/users/me/export) returning user and tenant data; data deletion (DELETE /api/users/me) with anonymization or hard delete; consent logging if needed. (2) SOC2: document access control, encryption at rest/transit, audit log retention, change management. Create docs/compliance.md with checklist."*

**Option B (Manual)**:
1. Data export: GET /api/users/me/export (auth required); aggregate user profile, tenant_members, and tenant-scoped data; return JSON or ZIP; document in privacy policy
2. Data deletion: DELETE /api/users/me (auth required); anonymize or delete user and memberships; cascade or retain audit logs with user_id null; document retention
3. Consent: if collecting consent, store in consents table with timestamp and version; document in privacy policy
4. Create docs/compliance.md: list encryption (TLS, DB encryption), access control (RLS, roles), audit logging, retention, incident response
5. Optional: SOC2 control mapping (e.g. CC6.1 access control); document how we meet each
6. Document data processing agreement (DPA) and subprocessors if applicable
7. Ensure .env and secrets are not logged; document key rotation

**Security Considerations**: Export and delete must be authenticated; verify identity for sensitive operations  
**Testing Checklist**: [ ] Export returns user data; [ ] Delete anonymizes/removes; [ ] Docs updated

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 4: Scale & Deploy

#### Step 4.1: Performance

Optimize the platform for performance and scale.

**Time Estimate**: 2–3 days  
**Prerequisites**: Core features and multi-tenant architecture in place  
**Expected Outcome**: Indexed queries, caching, CDN where applicable, optimized API routes, and load-tested bottlenecks addressed

### Sub-Step 4.1.1: Optimize Database Queries
**File Path**: `supabase/migrations/` for indexes, query review in `lib/`  
**Purpose**: Add indexes and optimize slow queries

**Option A (Using AI Tools)**: *"Review our main Supabase queries: list tables with high read volume. Add composite indexes on (tenant_id, created_at) and (tenant_id, user_id) where we filter by both. Run EXPLAIN on slow queries and add indexes to avoid full table scans. Document index strategy in migrations."*

**Option B (Manual)**:
1. Identify slow queries (Supabase dashboard, logs, or APM)
2. Add composite indexes: (tenant_id, created_at), (tenant_id, user_id) on main tables
3. Add index on tenant_members(user_id, tenant_id) for membership lookups
4. Run EXPLAIN ANALYZE on critical queries; add covering indexes if needed
5. Avoid N+1: batch loads or use joins; document pattern
6. Create migration file for new indexes; run in staging

**Testing Checklist**: [ ] Key queries use indexes; [ ] No full table scans on large tables

### Sub-Step 4.1.2: Implement Caching Strategy
**File Path**: `lib/cache/`, Redis or Supabase/edge cache  
**Purpose**: Cache tenant config, user permissions, and hot data

**Option A (Using AI Tools)**: *"Implement caching: use Redis or Vercel KV. Cache tenant config (by tenant_id), user permissions (by user_id + tenant_id), and hot read data (e.g. feature flags). TTL: config 5 min, permissions 1 min. Invalidate on update (role change, tenant update). Add getCached(key, fetcher) helper."*

**Option B (Manual)**:
1. Set up Redis or Vercel KV; add REDIS_URL or KV store to env
2. Create lib/cache.ts: getCached(key, ttl, fetcher) that gets or sets
3. Cache tenant config: key = tenant:${id}; fetcher = load from DB; TTL 5 min
4. Cache permissions: key = perms:${userId}:${tenantId}; fetcher = load role + permissions; TTL 1 min; invalidate on role change
5. Optional: cache hot lists (e.g. tenant members) with short TTL
6. Document invalidation points (e.g. PATCH role → delete perms key)
7. Add cache hit/miss metrics if needed

**Testing Checklist**: [ ] Cache hit returns correct data; [ ] Invalidation works

### Sub-Step 4.1.3: Add CDN Configuration
**File Path**: `next.config.ts`, Vercel config, static assets  
**Purpose**: Serve static assets and optionally API responses via CDN

**Option A (Using AI Tools)**: *"Configure CDN: ensure Next.js static assets and public folder are served with cache headers (e.g. immutable for hashed files). If using Vercel, document edge caching for GET API routes that are cacheable (e.g. public config). Add Cache-Control headers for API responses that can be cached per tenant."*

**Option B (Manual)**:
1. In next.config.ts, ensure static files have long cache (Next.js default for _next/static)
2. For public assets, set headers in vercel.json or next.config headers: Cache-Control max-age
3. For cacheable API routes (e.g. GET /api/public/config): add Cache-Control: public, max-age=60 or use Vercel edge cache
4. Document which routes are cacheable and at what level (public vs private)
5. Use Vercel Edge Config or similar for global config if needed
6. Test: verify cache headers in browser DevTools

**Testing Checklist**: [ ] Static assets cached; [ ] Cache headers correct for API

### Sub-Step 4.1.4: Optimize API Routes for Performance
**File Path**: `app/api/` routes, `lib/` data loaders  
**Purpose**: Reduce latency and payload size

**Option A (Using AI Tools)**: *"Optimize API routes: (1) Return only needed fields (no over-fetching). (2) Use pagination (limit, cursor) for list endpoints. (3) Batch DB calls where possible. (4) Use streaming for large responses if applicable. (5) Add response compression (gzip). Document pagination and field selection for public API."*

**Option B (Manual)**:
1. Audit list endpoints: add limit (default 20, max 100) and cursor or offset
2. Return minimal fields; optional ?fields= for public API
3. Batch: e.g. load members and roles in one query instead of N+1
4. Enable gzip in Vercel (default) or middleware
5. For large exports, use streaming or chunked response
6. Add timing logs or APM for slow routes; fix hotspots
7. Document pagination and rate limits in API docs

**Testing Checklist**: [ ] List endpoints paginated; [ ] No N+1 in critical paths

### Sub-Step 4.1.5: Run Load Testing and Fix Bottlenecks
**File Path**: Load test scripts (e.g. k6, artillery), `docs/load-test.md`  
**Purpose**: Identify and fix bottlenecks under load

**Option A (Using AI Tools)**: *"Add load testing: use k6 or artillery. Script: simulate 50–100 concurrent users hitting login, list projects, and key API routes. Run for 2–5 minutes. Measure p95 latency and error rate. Identify slow endpoints or DB; add indexes or caching; re-run until p95 is acceptable (e.g. <500ms for key routes). Document in docs/load-test.md."*

**Option B (Manual)**:
1. Install k6 or artillery; create script that hits main flows (auth, list, create)
2. Run against staging: 50 concurrent users, 2–5 min
3. Collect p50, p95, p99 latency and error rate per endpoint
4. Identify slow routes (e.g. >1s p95); add indexes, caching, or optimize queries
5. Re-run until p95 meets target (e.g. <500ms for key routes)
6. Document results and run command in docs/load-test.md
7. Optional: add load test to CI (smoke only) or scheduled run

**Testing Checklist**: [ ] Load test runs; [ ] Bottlenecks addressed; [ ] p95 acceptable

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 4.2: Enterprise Support

Create enterprise support features and tools.

**Time Estimate**: 2–3 weeks  
**Prerequisites**: Multi-tenant architecture working; authentication and admin role in place  
**Expected Outcome**: Admin dashboard, user and subscription management, support tickets, knowledge base, monitoring (Sentry), APM, audit/logging, documentation, and support tools integration

### Sub-Step 4.2.1: Admin Dashboard Foundation
**File Path**: `app/admin/layout.tsx`, `middleware.ts`, `components/admin/nav.tsx`, `lib/admin/role.ts`  
**Purpose**: Create protected admin routes and navigation structure

**Option A (Using AI Tools)**: *"Create admin dashboard foundation: app/admin/layout.tsx that wraps all /admin routes with a sidebar and header. Add middleware or layout check: only users with admin role (or is_admin flag) can access /admin/*. Create components/admin/nav.tsx with links to Users, Subscriptions, Support, Settings. Create lib/admin/requireAdmin() that gets session and checks role; use in layout or each admin page."*

**Option B (Manual)**:
1. Create app/admin/layout.tsx: fetch session; if !requireAdmin(session) redirect to / or 403
2. In layout, render sidebar (components/admin/nav.tsx) with links: Users, Subscriptions, Support, Knowledge Base, Settings, Logs
3. Add middleware.ts: for pathname.startsWith('/admin'), check session and admin role; redirect if not admin
4. Create lib/admin/role.ts: requireAdmin(session) returns session.user has admin role (from tenant_members or user metadata)
5. Create app/admin/page.tsx: dashboard overview (counts: users, subscriptions, open tickets)
6. Test: non-admin cannot access /admin; admin sees sidebar and overview

**Code Structure Example**:
```typescript
// app/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!requireAdmin(session)) redirect('/');
  return (
    <div className="flex">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
```

**Security Considerations**: Admin check must run server-side; never trust client for admin access  
**Testing Checklist**: [ ] Non-admin gets 403 or redirect; [ ] Admin sees layout and nav

### Sub-Step 4.2.2: User Management Dashboard
**File Path**: `app/admin/users/page.tsx`, `app/admin/users/[id]/page.tsx`, `lib/admin/users.ts`  
**Purpose**: List users with filtering/search; view and edit user details; activity and ban

**Option A (Using AI Tools)**: *"Build admin user management: app/admin/users/page.tsx with table of users (email, name, tenant, role, last login, created_at). Add search by email/name and filter by tenant/role. Link to app/admin/users/[id]/page.tsx for user detail: profile, activity log, subscription, edit role, ban/unban. Use RLS or server-side checks so only admins can access. Create lib/admin/users.ts for list and getById."*

**Option B (Manual)**:
1. Create GET /api/admin/users (admin only): query users (join profiles, tenant_members); support ?search=, ?tenant=, ?role=; paginate
2. Create app/admin/users/page.tsx: fetch users; table with search and filters; link to [id]
3. Create GET /api/admin/users/[id] (admin only): user profile, memberships, last activity
4. Create app/admin/users/[id]/page.tsx: show profile; activity list; subscription; form to edit role; button ban/unban
5. Create PATCH /api/admin/users/[id] (admin only): update role or set banned flag; log in audit
6. Add activity: log logins and key actions in audit_logs or user_activity; show last N on user detail
7. Enforce admin-only in API and layout

**Security Considerations**: Never expose passwords or tokens; audit all admin actions on users  
**Testing Checklist**: [ ] List and search work; [ ] Detail and edit work; [ ] Ban enforced in auth

### Sub-Step 4.2.3: Subscription Management Dashboard
**File Path**: `app/admin/subscriptions/page.tsx`, `lib/admin/subscriptions.ts`  
**Purpose**: View all subscriptions; status, analytics, manual adjustments; billing history

**Option A (Using AI Tools)**: *"Create admin subscription dashboard: app/admin/subscriptions/page.tsx with list of subscriptions (tenant/user, plan, status, current_period_end, stripe_subscription_id). Filter by status (active, canceled, past_due). Show metrics: MRR, churn, active count. Link to Stripe Customer Portal or detail page. Add optional manual adjustment (e.g. extend trial) via API or Stripe. Create lib/admin/subscriptions.ts for list and metrics."*

**Option B (Manual)**:
1. Create GET /api/admin/subscriptions (admin only): query subscriptions (join users/tenants); support ?status=; paginate
2. Create app/admin/subscriptions/page.tsx: table of subscriptions; filters; link to user or Stripe
3. Add metrics: MRR (sum of active subscription amounts), active count, canceled this month; show in dashboard or this page
4. Create GET /api/admin/subscriptions/[id] or use Stripe link: show billing history, invoices
5. Optional: POST /api/admin/subscriptions/[id]/extend-trial (admin only): call Stripe API to extend trial; log in audit
6. Document link to Stripe Customer Portal for customer self-service
7. Enforce admin-only; log sensitive actions

**Security Considerations**: Do not expose full Stripe keys in UI; audit manual adjustments  
**Testing Checklist**: [ ] List and filters work; [ ] Metrics correct; [ ] Stripe link works

### Sub-Step 4.2.4: Support Ticket System
**File Path**: `supabase/migrations/` for tickets table, `app/admin/support/`, `app/support/`, `lib/support/`  
**Purpose**: Tickets table; create/view/assign tickets; status workflow; email notifications

**Option A (Using AI Tools)**: *"Implement support tickets: migration for support_tickets (id, tenant_id, user_id, subject, body, status, assigned_to, priority, created_at, updated_at). App/support/page.tsx for users to create ticket; app/admin/support/page.tsx for list (filter by status, assignee); app/admin/support/[id] for detail, assign, change status, reply. On status change or reply, send email (e.g. Resend). RLS: users see own tickets; admins see all."*

**Option B (Manual)**:
1. Create migration: support_tickets (id, tenant_id, user_id, subject, body, status enum: open, in_progress, waiting, resolved, closed), assigned_to, priority, created_at, updated_at; support_ticket_replies (id, ticket_id, user_id, body, created_at)
2. Enable RLS: users SELECT/INSERT own tickets; admins SELECT/UPDATE all
3. Create POST /api/support/tickets (auth): insert ticket; send confirmation email
4. Create app/support/page.tsx: form to create ticket; list user's tickets; link to detail
5. Create app/admin/support/page.tsx: list all tickets; filter by status, assignee; link to [id]
6. Create app/admin/support/[id]/page.tsx: show ticket and replies; form to reply; assign; change status
7. On reply or status change: send email to user (e.g. "Your ticket was updated"); optional: notify assignee on new ticket
8. Create GET/POST /api/support/tickets and /api/admin/support/tickets as needed
9. Enforce tenant and admin checks

**Security Considerations**: Users see only own tickets; admins only see tickets they are allowed to (e.g. by tenant)  
**Testing Checklist**: [ ] User can create and view own tickets; [ ] Admin can assign and reply; [ ] Email sent on update

### Sub-Step 4.2.5: Knowledge Base System
**File Path**: `supabase/migrations/` for kb tables, `app/admin/kb/`, `app/kb/`, `lib/kb/`  
**Purpose**: Knowledge base schema; article CRUD; search; versioning; public KB page

**Option A (Using AI Tools)**: *"Create knowledge base: migration for kb_articles (id, tenant_id optional, slug, title, body, status published/draft, version, created_at, updated_at, author_id). kb_article_versions for history. App/admin/kb for create/edit articles (rich text or markdown). App/kb/page.tsx public list; app/kb/[slug] for article. Full-text search on title and body. RLS: public read published; admins CRUD."*

**Option B (Manual)**:
1. Create migration: kb_articles (id, tenant_id nullable for global, slug, title, body, status, version, created_at, updated_at, author_id); kb_article_versions (id, article_id, body, version, created_at)
2. Add full-text search: tsvector on title and body; GIN index
3. RLS: SELECT for published (and tenant_id match if multi-tenant); INSERT/UPDATE/DELETE for admins
4. Create GET/POST/PATCH /api/admin/kb/articles; GET /api/kb/articles (public, published only); GET /api/kb/articles/[slug]
5. Create app/admin/kb/page.tsx: list articles; create/edit form (markdown or rich text); save new version
6. Create app/kb/page.tsx: list published articles; search input (query ?q=)
7. Create app/kb/[slug]/page.tsx: show article by slug; optional table of contents
8. On update: insert row into kb_article_versions; increment version
9. Document how to add new articles and search syntax
10. Enforce tenant_id for tenant-scoped KB; optional global KB (tenant_id null)

**Security Considerations**: Draft articles not visible to public; sanitize body if rendered as HTML  
**Testing Checklist**: [ ] Admin can create/edit; [ ] Public sees only published; [ ] Search works

### Sub-Step 4.2.6: Monitoring Setup (Sentry)
**File Path**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`  
**Purpose**: Install and configure Sentry; error tracking; alert rules; optional Slack/email

**Option A (Using AI Tools)**: *"Install and configure Sentry for this Next.js app: sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts. Set DSN from env SENTRY_DSN. Add instrumentation.ts if needed. Configure alert rules: notify on error rate spike or high-volume errors. Optional: send critical errors to Slack or email. Add user context (tenant_id, user_id) to events (no PII)."*

**Option B (Manual)**:
1. Install @sentry/nextjs; run sentry wizard or add config files manually
2. Create sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts with Sentry.init({ dsn: process.env.SENTRY_DSN })
3. Add SENTRY_DSN to env; set in Vercel
4. In config, set beforeSend or similar to add context: tenant_id, user_id (from session); strip PII
5. In Sentry dashboard: create alert rule (e.g. error count > 10 in 5 min); add Slack or email action
6. Optional: create error boundary that reports to Sentry
7. Document how to test: trigger an error; verify event in Sentry with context
8. Add release tracking (e.g. Vercel deployment revision) for source maps
9. Test: throw in API route; verify server event; throw in client; verify client event

**Security Considerations**: Do not send PII (passwords, tokens) to Sentry; use server-side DSN only  
**Testing Checklist**: [ ] Errors appear in Sentry; [ ] Alerts fire; [ ] Context attached

### Sub-Step 4.2.7: Application Performance Monitoring
**File Path**: Sentry Performance or Datadog APM, `lib/monitoring/`  
**Purpose**: Track performance (transactions, spans); dashboard; custom metrics; thresholds

**Option A (Using AI Tools)**: *"Add APM: use Sentry Performance or Datadog. Instrument key routes (e.g. GET /api/projects, GET /api/admin/users) as transactions. Add custom spans for DB queries and external API calls. Create dashboard for p95 latency and throughput. Set alert when p95 > 1s or error rate > 1%. Document how to add new transactions and custom metrics."*

**Option B (Manual)**:
1. Enable Sentry Performance (or add Datadog APM): add tracing to Next.js (see Sentry docs)
2. Ensure key API routes and server components are auto-instrumented
3. Add custom spans in critical paths: e.g. span for "db.getProjects"; span for "stripe.getSubscription"
4. Create dashboard in Sentry/Datadog: p50, p95 latency by route; request count; error rate
5. Add alert: p95 latency > 1s for 5 min; or error rate > 1%
6. Optional: track DB query time (Supabase or Prisma instrumentation)
7. Document how to add new spans and what thresholds mean
8. Test: hit key routes; verify transactions and spans in dashboard

**Testing Checklist**: [ ] Transactions appear; [ ] Spans show DB/API time; [ ] Alerts configured

### Sub-Step 4.2.8: Logging and Audit System
**File Path**: `lib/audit/logger.ts`, `supabase/migrations/` for audit_logs, `app/admin/logs/`  
**Purpose**: Central audit log table; logging service; log viewer UI; retention policy

**Option A (Using AI Tools)**: *"Implement audit logging: table audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, old_value jsonb, new_value jsonb, ip, user_agent, created_at). Create lib/audit/logger.ts with logAudit({ action, resourceType, resourceId, oldValue, newValue, req }). Call from API routes on create/update/delete. Create app/admin/logs/page.tsx: list logs with filter by action, resource, user, date; export CSV. Document retention (e.g. 90 days); optional archive to cold storage."*

**Option B (Manual)**:
1. Create migration: audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, old_value, new_value, ip, user_agent, created_at); index (tenant_id, created_at), (user_id, created_at)
2. Create lib/audit/logger.ts: logAudit({ action, resourceType, resourceId, oldValue, newValue, req }) that inserts into audit_logs; get user_id and tenant_id from req/session; get ip and user_agent from req
3. In key API routes (e.g. PATCH project, delete user): call logAudit before/after with old and new value
4. Create GET /api/admin/audit (admin only): query audit_logs with filters ?action=, ?resource=, ?user=, ?from=, ?to=; paginate
5. Create app/admin/logs/page.tsx: table of logs; filters; link to resource if applicable; export CSV button
6. Document retention: e.g. keep 90 days; delete or archive older; document in compliance
7. Ensure sensitive data (passwords, tokens) never in old_value/new_value
8. Test: perform action; verify log entry; verify admin can search and export

**Security Considerations**: Only admins can read audit logs; do not log secrets  
**Testing Checklist**: [ ] Logs written on key actions; [ ] Admin can search and export; [ ] Retention documented

### Sub-Step 4.2.9: Enterprise Documentation System
**File Path**: `docs/`, `app/docs/` or static site, optional API doc generation  
**Purpose**: Structured docs; viewer; versioning; search; optional API docs

**Option A (Using AI Tools)**: *"Create documentation system: docs/ folder with markdown files (getting-started.md, api.md, admin-guide.md). Use Next.js MDX or static site (e.g. Docusaurus) for app/docs with sidebar and search. Optional: version docs (e.g. /docs/v1, /docs/v2). Generate API docs from OpenAPI spec or code comments (e.g. next-swagger-doc). Document architecture, deployment, and runbooks in docs/."*

**Option B (Manual)**:
1. Create docs/ with markdown: getting-started.md, architecture.md, deployment.md, admin-guide.md, api-overview.md
2. Add app/docs/layout.tsx and page.tsx: read markdown from docs/ or use MDX; render with table of contents and sidebar
3. Optional: add search (e.g. client-side search on doc titles and content)
4. Optional: versioning (e.g. docs/v1, docs/v2) with dropdown or URL
5. For API: document endpoints (method, path, auth, body, response) in api-overview.md or generate from OpenAPI
6. Add runbooks: incident response, scaling, backup/restore
7. Link to docs from admin dashboard and footer
8. Document how to add new docs and update versions
9. Test: verify all links and search work

**Testing Checklist**: [ ] Docs render; [ ] Search works; [ ] API docs up to date

### Sub-Step 4.2.10: Support Tools Integration
**File Path**: `lib/support/intercom.ts` or similar, env, optional components  
**Purpose**: Optional live chat (Intercom, Crisp); email support; support analytics; SLA tracking

**Option A (Using AI Tools)**: *"Integrate support tools: add Intercom or Crisp script to layout (env NEXT_PUBLIC_INTERCOM_APP_ID). Pass user id and email (no sensitive data) for identity. Optional: add support email (e.g. support@company.com) and link from help page. Create simple support analytics: count tickets by status, avg resolution time; show in admin dashboard. Document SLA targets (e.g. first response < 24h) and track in support_tickets."*

**Option B (Manual)**:
1. Sign up for Intercom or Crisp; get app id
2. Add script to app/layout.tsx (client component): load Intercom/Crisp JS; identify user (id, email) when logged in
3. Add NEXT_PUBLIC_INTERCOM_APP_ID to env; document in .env.example
4. Add support email and help link on footer and /support page
5. Support analytics: query support_tickets for count by status; avg (resolved_at - created_at) for resolution time; show in app/admin/support or dashboard
6. Optional: add SLA fields to support_tickets (e.g. first_response_by, resolved_by); cron or job to flag overdue; alert
7. Document SLA targets and how to update them
8. Test: load app; verify chat widget (if enabled); verify analytics numbers
9. Optional: integrate ticket system with Intercom (e.g. create ticket from Intercom conversation)
10. Document how to add new support channels

**Security Considerations**: Do not pass PII beyond id and email to third-party scripts; comply with privacy policy  
**Testing Checklist**: [ ] Chat widget loads; [ ] Analytics correct; [ ] SLA tracking documented

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

## AI-Assisted Development Workflow

### How AI Can Help Your Development

Whether you're new to programming or an experienced developer, AI tools can accelerate your workflow, especially for complex enterprise features:

**For Non-Technical Users**:
- AI can handle complex code generation, architecture planning, and implementation
- You provide vision, make decisions, and review the work
- AI follows best practices and coding standards automatically
- AI can help with complex concepts like multi-tenancy and enterprise architecture

**For Technical Users**:
- AI assists with architecture decisions and complex implementations
- You maintain control over system design and implementation
- AI helps with AI API integration and complex patterns
- AI accelerates learning of new technologies and frameworks

### Effective AI Prompting (for Non-Technical Users)

**Good prompts**:
- *"Implement multi-tenant architecture where each organization has completely isolated data. Users can belong to multiple organizations and switch between them. Make sure data is secure and properly isolated."*
- *"Set up OpenAI and Anthropic API integration with a service layer that can switch between providers. Add prompt management and feature flags."*
- *"Create an SSO integration system that supports SAML and OAuth. Make it easy for enterprise customers to connect their identity provider."*

**Less effective prompts**:
- *"Add enterprise stuff"* (too vague)
- *"Make it scalable"* (doesn't specify what needs scaling)
- *"Do the AI thing"* (not specific enough)

### When to Provide More Detail

Provide more detail when:
- You have specific enterprise requirements
- You need particular integrations
- You have compliance or security requirements
- You want specific user flows

Let AI or your own expertise handle:
- Technical implementation details
- Architecture patterns and best practices
- Security and compliance considerations
- Performance optimization approaches

## Success Criteria

Your Level 3 implementation is complete when you can verify:

1. ✅ Multi-tenant architecture working with proper data isolation
2. ✅ AI features integrated and functional (content generation, analysis, chat)
3. ✅ Enterprise features implemented (SSO, advanced permissions, audit logs)
4. ✅ Third-party integrations working (API gateway, webhooks, OAuth)
5. ✅ System scales to handle growth (performance optimized, caching working)
6. ✅ Security and compliance requirements met
7. ✅ Performance optimized (fast queries, efficient caching, CDN configured)
8. ✅ Enterprise support features ready (admin dashboard, monitoring, documentation)

**Note**: Focus on whether the platform works well for enterprise customers. If using AI tools, they can help with architecture and complex implementations. If coding manually, consider running security audits and performance tests.

## Next Steps

After completing Level 3:

1. Onboard enterprise customers - test with real enterprise use cases
2. Scale infrastructure as you grow
3. Build partner ecosystem - integrate with more third-party services
4. Expand AI capabilities - add more AI-powered features
5. Consider platform features - allow customers to build on your platform

## Resources

### AI Prompts (for non-technical users)
- [Web Apps Level 3 AI Prompts](web-apps-level-3-ai-prompts.md) - Ready-to-use prompts for each step. Download this file and copy-paste prompts directly into your AI tool.

### Documentation
Reference documentation for the technologies used:
- [Next.js Advanced Patterns](https://nextjs.org/docs) - Framework documentation
- [Supabase Advanced Features](https://supabase.com/docs) - Database and advanced features guide
- [OpenAI API](https://platform.openai.com/docs) - AI integration guide
- [Anthropic API](https://docs.anthropic.com) - AI integration guide
- [Stripe Enterprise](https://stripe.com/docs) - Enterprise payment features

## Troubleshooting

If you encounter issues:

**Option A (Using AI Tools)**: 
1. Describe the problem clearly to your AI tool: "When I try to implement multi-tenancy, I'm seeing data leakage between tenants..."
2. Show AI any error messages: Copy and paste error text
3. Ask AI to explain: "Can you explain what this error means and how to fix it?"
4. Request step-by-step help: "Walk me through fixing this multi-tenant isolation issue"

**Option B (Manual)**: 
1. Check browser console and server logs for error messages
2. Review the troubleshooting guide: `web-apps-level-3-advanced-troubleshooting-guide.md`
3. Check documentation for the specific technology causing issues
4. Verify environment variables and configuration are correct
5. Review Supabase logs, API logs, and monitoring tools

Common issues and solutions are covered in the troubleshooting guide. Refer to `web-apps-level-3-advanced-troubleshooting-guide.md` for detailed help.

---

**Remember**: Whether you're coding yourself or using AI tools, focus on clear communication, making informed decisions, and thoroughly testing your application. Level 3 is about building a platform, not just a product - focus on architecture, scalability, and enterprise needs!
