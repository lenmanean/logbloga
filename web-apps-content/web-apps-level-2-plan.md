# Web Apps Level 2: SaaS MVP Application Implementation Plan

## Overview

This implementation plan guides you through building a medium-complexity SaaS MVP with user authentication, database integration, and subscription management. Whether you're coding yourself or using AI tools to assist, this plan provides a clear roadmap to success.

**AI-Assisted Development**: If you're using AI tools (like Cursor, ChatGPT, Claude, or GitHub Copilot), they can significantly accelerate development, reducing build time from 12-16 weeks to 6-8 weeks. AI tools can handle code generation, provide suggestions, and assist with debugging.

**Traditional Development**: If you prefer to code manually, this plan provides all the steps and technical details you need. You can still use AI tools for assistance with specific tasks, boilerplate code, or when you get stuck.

**Expected Outcome**: A fully functional SaaS application with user accounts, subscriptions, and core features that can generate $2,000-$8,000/month in revenue.

## Prerequisites

Before starting, ensure you have:

- Completed Level 1 or equivalent experience (basic Next.js and Stripe integration)
- A **GitHub account** (free tier is sufficient)
- A **Vercel account** (free tier is sufficient)
- A **Supabase account** (free tier is sufficient)
- A **Stripe account** with subscription features enabled
- **Node.js 18+ installed** (or use AI tools to help with installation)
- A code editor (VS Code, Cursor, or your preferred editor)
- Basic computer skills (opening applications, using a web browser)

**AI Tools (Optional but Recommended)**: AI tools like Cursor, ChatGPT, Claude, or GitHub Copilot can significantly accelerate development. If you're new to programming or want to speed up your workflow, consider using one of these tools.

**AI Prompts Available (for non-technical users)**: If you're using AI tools to build your application, download the [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) file for ready-to-use prompts you can copy and paste into your AI tool for each step.

## Milestones

### Milestone 1: Foundation
- [ ] Next.js SaaS project initialized
- [ ] Supabase project created and configured
- [ ] Authentication system implemented
- [ ] Database schema designed and created
- [ ] Basic user dashboard created

### Milestone 2: Core Features
- [ ] Main product features implemented
- [ ] User profile management
- [ ] Data CRUD operations
- [ ] Role-based access control
- [ ] Basic admin panel

### Milestone 3: Subscriptions
- [ ] Stripe subscription integration
- [ ] Pricing tiers implemented
- [ ] Subscription management UI
- [ ] Webhook handling
- [ ] Customer portal

### Milestone 4: Production Ready
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing and QA
- [ ] Production deployment

## Working with AI Tools

AI tools can significantly accelerate your development process, whether you're new to programming or an experienced developer. Here's how to effectively incorporate AI into your workflow.

### For Non-Technical Users

If you're using AI tools as your primary development method:

**Effective Communication with AI**:
- **Be Specific**: Instead of "set up authentication," say "create a login page with email and password fields, and connect it to Supabase authentication"
- **Provide Context**: Share your vision and goals. For example: "I want users to be able to sign up, log in, and manage their subscriptions"
- **Give Feedback**: Review what AI creates and provide specific feedback: "The login form works, but I want it to have a more modern design"
- **Ask Questions**: If you don't understand something AI suggests, ask for clarification

**What to Direct AI On**:
- **What to build**: Describe features, pages, and functionality you want
- **How it should look**: Share design preferences, colors, layout ideas
- **What it should do**: Explain user flows and business logic
- **When to test**: Request testing at key milestones

**Reviewing AI-Generated Work**:
1. **Test the functionality**: Try using what AI built
2. **Check the appearance**: Review how it looks
3. **Provide feedback**: Tell AI what works and what needs changes
4. **Request improvements**: Ask AI to refine or adjust as needed

**Using AI Prompts**:
For each step in this implementation plan, we've created ready-to-use prompts you can copy and paste directly into your AI tool. Download the [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) file to have all prompts in one place. These prompts are designed to save you time and ensure clear, effective communication with AI tools.

### For Technical Users

If you're coding yourself and using AI for assistance:

**How AI Can Help**:
- **Boilerplate Generation**: Generate starter code, components, and file structures
- **Code Suggestions**: Get suggestions for implementations, patterns, and best practices
- **Debugging Assistance**: Get help understanding errors and finding solutions
- **Documentation**: Generate comments, README files, and code explanations
- **Refactoring**: Get suggestions for improving code structure and performance

**Best Practices**:
- Use AI to generate initial code, then review and customize it
- Ask AI to explain complex concepts or unfamiliar patterns
- Use AI for repetitive tasks like creating similar components
- Always review and test AI-generated code before using it in production
- Use AI to learn new technologies or frameworks faster

## Step-by-Step Roadmap

### Phase 1: Project Setup

#### Step 1.1: Initialize Next.js SaaS Project

**Time Estimate**: 1–2 hours  
**Prerequisites**: Node.js 18+ installed; GitHub account  
**Expected Outcome**: Next.js App Router project with TypeScript, Tailwind, Supabase clients, and env config

### Sub-Step 1.1.1: Create Next.js Project
**File Path**: Project root (e.g. `my-saas-app/`)  
**Purpose**: Bootstrap Next.js with TypeScript and Tailwind using App Router

**Option A (Using AI Tools)**: *"Create a new Next.js project named my-saas-app with TypeScript, Tailwind CSS, and the App Router. Use the latest create-next-app. Do not use src/ directory; use app/ at root. Enable ESLint."*

**Option B (Manual)**:
1. Run: `npx create-next-app@latest my-saas-app --typescript --tailwind --app --no-src-dir --eslint`
2. Choose Yes for Turbopack if prompted
3. `cd my-saas-app` and run `npm run dev`; verify http://localhost:3000
4. Confirm folder structure: `app/`, `app/layout.tsx`, `app/page.tsx`, `public/`

**Testing Checklist**: [ ] Dev server runs; [ ] Home page loads

### Sub-Step 1.1.2: Install Supabase Client Libraries
**File Path**: `package.json`  
**Purpose**: Add Supabase browser and SSR packages for auth and data

**Option A (Using AI Tools)**: *"Install Supabase client libraries for Next.js: @supabase/supabase-js and @supabase/ssr. These are needed for authentication and database from both client and server."*

**Option B (Manual)**:
1. Run: `npm install @supabase/supabase-js @supabase/ssr`
2. Verify package.json includes both packages
3. Do not commit .env.local (add to .gitignore if not already)

**Testing Checklist**: [ ] Packages installed; [ ] No install errors

### Sub-Step 1.1.3: Set Up Project Structure for SaaS
**File Path**: `app/`, `lib/`, `components/`, `contexts/`  
**Purpose**: Create folders for auth, API, components, and shared lib

**Option A (Using AI Tools)**: *"Set up folder structure for a SaaS app: app/(auth)/login and signup routes, app/(dashboard)/ for protected pages, app/api/ for API routes, lib/ for Supabase client and utils, components/ for reusable UI, contexts/ for auth context. Create placeholder files so the structure is clear."*

**Option B (Manual)**:
1. Create `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` (placeholder)
2. Create `app/(dashboard)/page.tsx` (placeholder dashboard)
3. Create `lib/supabase/client.ts` and `lib/supabase/server.ts` (placeholder; will add in 1.2)
4. Create `contexts/auth-context.tsx` (placeholder)
5. Create `components/ui/` if using shadcn later
6. Document structure in README or leave as-is

**Testing Checklist**: [ ] Folders exist; [ ] Placeholder pages do not error

### Sub-Step 1.1.4: Configure Environment Variables
**File Path**: `.env.local`, `.env.example`, `.gitignore`  
**Purpose**: Define required env vars and keep secrets out of git

**Option A (Using AI Tools)**: *"Create .env.local with placeholders for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Create .env.example with the same keys and example values (e.g. https://xxx.supabase.co, eyJ...). Ensure .env.local and .env*.local are in .gitignore."*

**Option B (Manual)**:
1. Create `.env.local`: `NEXT_PUBLIC_SUPABASE_URL=`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
2. Create `.env.example`: same keys with placeholder values and comments
3. Check `.gitignore` includes `.env*.local` and `.env.local`
4. Do not commit real keys
5. Document in README: "Copy .env.example to .env.local and fill in Supabase values"

**Security Considerations**: Never commit .env.local; use NEXT_PUBLIC_ only for client-safe values  
**Testing Checklist**: [ ] .env.local in .gitignore; [ ] .env.example committed

### Sub-Step 1.1.5: Verify Build and Scripts
**File Path**: `package.json`, terminal  
**Purpose**: Ensure build succeeds and scripts are correct

**Option A (Using AI Tools)**: *"Run npm run build and fix any TypeScript or build errors. Ensure scripts dev, build, start, and lint are defined and work."*

**Option B (Manual)**:
1. Run `npm run build`; fix any errors (e.g. missing types, invalid imports)
2. Run `npm run lint`; fix reported issues
3. Confirm `npm run start` runs production build (after build)
4. Document any custom scripts in README

**Testing Checklist**: [ ] npm run build succeeds; [ ] npm run lint passes

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.2: Set Up Supabase

**Time Estimate**: 1–2 hours  
**Prerequisites**: Step 1.1 completed; Supabase account  
**Expected Outcome**: Supabase project created; browser and server clients configured; connection verified

### Sub-Step 1.2.1: Create Supabase Project
**File Path**: Supabase Dashboard  
**Purpose**: Create project and obtain URL and anon key

**Option A (Using AI Tools)**: *"I need to create a Supabase project. Walk me through: go to supabase.com, New Project, choose org, name, password for DB, region. After creation, where do I find the Project URL and anon public key?"*

**Option B (Manual)**:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click New Project; select organization (or create one); name the project (e.g. my-saas)
3. Set database password and choose region; create project
4. Wait for project to be ready; go to Project Settings > API
5. Copy Project URL and anon public key (not service_role in client code)
6. Paste into .env.local as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

**Security Considerations**: Use anon key for client; reserve service_role for server-only, never expose in client  
**Testing Checklist**: [ ] Project created; [ ] URL and anon key copied

### Sub-Step 1.2.2: Create Browser (Client-Side) Supabase Client
**File Path**: `lib/supabase/client.ts`  
**Purpose**: Singleton Supabase client for use in Client Components

**Option A (Using AI Tools)**: *"Create lib/supabase/client.ts that creates a Supabase client using createBrowserClient from @supabase/ssr with process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY. Export a singleton so the same client is reused."*

**Option B (Manual)**:
1. Create `lib/supabase/client.ts`
2. Import createBrowserClient from '@supabase/ssr'
3. Call createBrowserClient(url, anonKey) with env vars
4. Export the client (e.g. `export const supabase = createBrowserClient(...)`)
5. Use only in Client Components ('use client') or client-side code

**Code Structure Example**:
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Testing Checklist**: [ ] File exists; [ ] No runtime error when importing in a client component

### Sub-Step 1.2.3: Create Server-Side Supabase Client
**File Path**: `lib/supabase/server.ts`  
**Purpose**: Create Supabase client that respects cookies for SSR and Server Components

**Option A (Using AI Tools)**: *"Create lib/supabase/server.ts that uses createServerClient from @supabase/ssr. Accept cookies() from next/headers and pass them so the server client can read the session. Export a function createClient() that returns the client for use in Server Components and Route Handlers."*

**Option B (Manual)**:
1. Create `lib/supabase/server.ts`
2. Import createServerClient from '@supabase/ssr' and cookies from 'next/headers'
3. Create async function createClient(): get cookieStore = cookies(); return createServerClient(url, anonKey, { cookies: { getAll, setAll } })
4. Implement getAll and setAll to read/write from cookieStore so auth state is shared with client
5. Use createClient() in Server Components and API routes when you need server-side Supabase
6. Document: "Use this in server components; use client.ts in client components"

**Code Structure Example**:
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
    },
  })
}
```

**Testing Checklist**: [ ] createClient() returns client; [ ] No cookie errors in server component

### Sub-Step 1.2.4: Create Middleware for Session Refresh
**File Path**: `middleware.ts` (project root)  
**Purpose**: Refresh Supabase session on each request so auth stays in sync

**Option A (Using AI Tools)**: *"Add middleware.ts at the project root that uses updateSession from @supabase/ssr. Call it with the request and response so Supabase can refresh the session cookie. Export config with matcher for all routes that need auth (e.g. exclude static and _next)."*

**Option B (Manual)**:
1. Create `middleware.ts` at project root
2. Import createServerClient from '@supabase/ssr' and NextResponse from 'next/server'
3. Get request; create response; create Supabase client with cookies from request/response
4. Call await supabase.auth.getUser() (or updateSession helper if using one) to refresh session
5. Return response (or next())
6. Set matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] or similar
7. Test: log in; reload page; verify session still present

**Testing Checklist**: [ ] Middleware runs; [ ] Session persists across reloads

### Sub-Step 1.2.5: Test the Connection
**File Path**: `app/page.tsx` or a test API route  
**Purpose**: Verify app can reach Supabase (e.g. list a table or get auth config)

**Option A (Using AI Tools)**: *"Add a simple test: in a Server Component or API route, use the server Supabase client to run a harmless query (e.g. select 1 or fetch auth.getSession()). Log or display success. If it fails, show the error so we can fix env or URL."*

**Option B (Manual)**:
1. In app/page.tsx (server) or app/api/health/route.ts: const supabase = await createClient(); const { data, error } = await supabase.from('_any_table').select('id').limit(1).maybeSingle() or just supabase.auth.getSession()
2. If no tables yet, use supabase.auth.getSession() to verify connection
3. Return or display success; if error, log and fix (env, URL, network)
4. Remove or comment out test after verification
5. Optional: add GET /api/health that returns { supabase: 'ok' } for deployment checks

**Testing Checklist**: [ ] No connection error; [ ] Session or query works

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.3: Design Database Schema

Design the database schema for your SaaS application, including tables for users, subscriptions, and core features.

**Time Estimate**: 2–4 hours  
**Prerequisites**: Step 1.2 completed; Supabase project ready  
**Expected Outcome**: Migrations for profiles, subscriptions, and core feature tables; RLS policies; migrations applied

### Sub-Step 1.3.1: Identify Core Entities and Relationships
**File Path**: Design doc or list  
**Purpose**: List tables and relationships (profiles, subscriptions, core feature entities)

**Option A (Using AI Tools)**: *"Help me list core entities for a SaaS app: (1) profiles — extends auth.users with display name, avatar; (2) subscriptions — stripe_subscription_id, status, plan, user_id; (3) [my feature tables]. Document relationships: profile 1:1 auth.users; subscription many:1 user; feature tables many:1 user or subscription."*

**Option B (Manual)**:
1. List: profiles (id, user_id FK auth.users, display_name, avatar_url, created_at, updated_at)
2. List: subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, status, plan_id, current_period_end, created_at)
3. List core feature tables (e.g. projects, documents) with user_id or subscription_id
4. Draw or write relationships; ensure every table has clear ownership (user_id or similar)
5. Document in a short schema.md or comments in migrations

**Testing Checklist**: [ ] Entities listed; [ ] Relationships clear

### Sub-Step 1.3.2: Create Profiles Table and Trigger
**File Path**: `supabase/migrations/YYYYMMDD_profiles.sql`  
**Purpose**: Profiles table linked to auth.users; auto-create profile on signup

**Option A (Using AI Tools)**: *"Create a migration: profiles table with id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE, display_name text, avatar_url text, created_at, updated_at. Enable RLS. Add policy: users can SELECT/UPDATE own row (auth.uid() = user_id). Add trigger on auth.users INSERT to insert a row into public.profiles (id = new.id, user_id = new.id)."*

**Option B (Manual)**:
1. Create migration file in supabase/migrations/
2. CREATE TABLE profiles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL, display_name text, avatar_url text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now())
3. ENABLE ROW LEVEL SECURITY
4. CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = user_id)
5. CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id)
6. CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN INSERT INTO public.profiles (user_id) VALUES (new.id); RETURN new; END; $$ LANGUAGE plpgsql SECURITY DEFINER
7. CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
8. Run migration: supabase db push or apply in Dashboard

**Security Considerations**: RLS must restrict to own row; trigger runs as SECURITY DEFINER so restrict to insert only  
**Testing Checklist**: [ ] Migration runs; [ ] New user gets profile row

### Sub-Step 1.3.3: Create Subscriptions Table
**File Path**: `supabase/migrations/YYYYMMDD_subscriptions.sql`  
**Purpose**: Store Stripe subscription state per user

**Option A (Using AI Tools)**: *"Create subscriptions table: id uuid PRIMARY KEY, user_id uuid REFERENCES auth.users NOT NULL, stripe_customer_id text, stripe_subscription_id text UNIQUE, status text, plan_id text, current_period_end timestamptz, created_at, updated_at. Enable RLS: users can SELECT own row; only service role or webhook can INSERT/UPDATE."*

**Option B (Manual)**:
1. CREATE TABLE subscriptions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, stripe_customer_id text, stripe_subscription_id text UNIQUE, status text, plan_id text, current_period_end timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now())
2. ENABLE ROW LEVEL SECURITY
3. Policy: SELECT WHERE auth.uid() = user_id
4. Policy for INSERT/UPDATE: use service role in webhook; or allow user to INSERT one row for user_id = auth.uid() when creating customer
5. Add index on (user_id) and (stripe_subscription_id)
6. Run migration

**Testing Checklist**: [ ] Migration runs; [ ] RLS allows user to read own subscription

### Sub-Step 1.3.4: Create Core Feature Tables
**File Path**: `supabase/migrations/YYYYMMDD_core_features.sql`  
**Purpose**: Tables for main product data (e.g. projects, items)

**Option A (Using AI Tools)**: *"Add migration for my core feature: [e.g. projects table with id, user_id, name, description, created_at]. Enable RLS: SELECT/INSERT/UPDATE/DELETE where auth.uid() = user_id. Add indexes on user_id and created_at."*

**Option B (Manual)**:
1. Create table(s) for core feature with user_id (and optional subscription_id if plan-gated)
2. Add foreign key user_id REFERENCES auth.users(id) ON DELETE CASCADE
3. ENABLE ROW LEVEL SECURITY; policies FOR SELECT/INSERT/UPDATE/DELETE USING (auth.uid() = user_id)
4. Create indexes: (user_id), (user_id, created_at)
5. Run migration
6. Repeat for each core entity
7. Document in schema or README

**Security Considerations**: Every table with user data must have RLS with user_id check  
**Testing Checklist**: [ ] Migrations run; [ ] User can only access own rows

### Sub-Step 1.3.5: Set Up Row Level Security Policies Consistently
**File Path**: All migration files  
**Purpose**: Ensure no table is missing RLS or has overly permissive policies

**Option A (Using AI Tools)**: *"Review all tables: ensure RLS is enabled on every table that holds user or subscription data. Ensure policies use auth.uid() or service role for webhooks. Document which tables are user-scoped vs admin-only."*

**Option B (Manual)**:
1. List every table in public schema that stores user/subscription data
2. For each: confirm RLS is ENABLED; list policies (SELECT/INSERT/UPDATE/DELETE)
3. Fix any table missing RLS or with (true) permissive policy
4. For webhook-updated tables (e.g. subscriptions), ensure updates happen via service role or a SECURITY DEFINER function that validates webhook
5. Test: as user A, try to read/update user B's row (should fail)
6. Document RLS summary in docs or migration comments

**Security Considerations**: RLS is the primary guard; never rely only on app code  
**Testing Checklist**: [ ] All tables have RLS; [ ] Cross-user access denied

### Sub-Step 1.3.6: Run Migrations and Verify
**File Path**: Supabase Dashboard or CLI  
**Purpose**: Apply all migrations and verify tables and RLS

**Option A (Using AI Tools)**: *"Apply all Supabase migrations (supabase db push or run in SQL editor). Then verify: list tables in public schema; run SELECT from profiles as a test user; confirm RLS blocks cross-user access."*

**Option B (Manual)**:
1. Run `supabase db push` (if using CLI) or run each migration SQL in Dashboard SQL editor
2. In Dashboard > Table Editor, confirm profiles, subscriptions, and feature tables exist
3. In Authentication, create test user; confirm profile row exists
4. Optional: use Supabase client as that user; insert a row in a feature table; try to select another user's row (should get empty or error)
5. Document migration order and how to reset (e.g. supabase db reset) for dev
6. Add migration files to git
7. Document how to run new migrations in README

**Testing Checklist**: [ ] All migrations applied; [ ] Tables and RLS work; [ ] Migrations in git

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 2: Authentication

#### Step 2.1: Implement Supabase Auth

Set up user authentication with Supabase, including sign up, login, and session management.

**Time Estimate**: 2–3 hours  
**Prerequisites**: Step 1.2 and 1.3 completed; Supabase Auth enabled  
**Expected Outcome**: Login and signup pages; session management; protected routes and auth context

### Sub-Step 2.1.1: Enable Email/Password in Supabase Dashboard
**File Path**: Supabase Dashboard > Authentication > Providers  
**Purpose**: Enable email provider and configure email templates if needed

**Option A (Using AI Tools)**: *"I need to enable email/password auth in Supabase: Authentication > Providers > Email: enable Email provider; confirm Confirm email is on or off as I prefer. Where do I set the site URL and redirect URLs for email links?"*

**Option B (Manual)**:
1. In Supabase Dashboard go to Authentication > Providers
2. Enable Email provider; set Confirm email to On or Off (Off for faster dev)
3. Go to Authentication > URL Configuration: set Site URL to http://localhost:3000 (dev) and add Redirect URLs (e.g. http://localhost:3000/auth/callback)
4. Save; note that magic link and OTP are also available
5. Optional: customize email templates under Authentication > Email Templates
6. Document Site URL and redirect URLs for production later

**Testing Checklist**: [ ] Email provider enabled; [ ] Redirect URL set

### Sub-Step 2.1.2: Create Signup Page
**File Path**: `app/(auth)/signup/page.tsx`  
**Purpose**: Form to sign up with email and password; call Supabase auth.signUp

**Option A (Using AI Tools)**: *"Create app/(auth)/signup/page.tsx: form with email and password fields, submit button. On submit call supabase.auth.signUp({ email, password }). Use the browser Supabase client. Show success message or redirect to dashboard; show error if signUp fails. Add client-side validation (email format, password length)."*

**Option B (Manual)**:
1. Create app/(auth)/signup/page.tsx with 'use client'
2. Import supabase from lib/supabase/client
3. Form: email (type email), password (type password), optional confirm password
4. onSubmit: e.preventDefault(); const { data, error } = await supabase.auth.signUp({ email, password })
5. If error: setErrorMessage(error.message); if success: redirect to /dashboard or show "Check your email"
6. Add basic validation (e.g. password length >= 6)
7. Style with Tailwind; add link to login page
8. If confirm email is on: show "Check your email to confirm"; if off: redirect after signUp

**Security Considerations**: Do not log passwords; use HTTPS in production; enforce strong password in Supabase or client  
**Testing Checklist**: [ ] Signup creates user; [ ] Error shown on invalid input; [ ] Redirect or message on success

### Sub-Step 2.1.3: Create Login Page
**File Path**: `app/(auth)/login/page.tsx`  
**Purpose**: Form to log in with email and password; call Supabase auth.signInWithPassword

**Option A (Using AI Tools)**: *"Create app/(auth)/login/page.tsx: form with email and password, submit button. On submit call supabase.auth.signInWithPassword({ email, password }). Redirect to dashboard on success; show error on failure. Add link to signup and optional 'Forgot password'."*

**Option B (Manual)**:
1. Create app/(auth)/login/page.tsx with 'use client'
2. Form: email, password; onSubmit: supabase.auth.signInWithPassword({ email, password })
3. On success: router.push('/dashboard') or router.refresh()
4. On error: setErrorMessage(error.message)
5. Add link to signup page; optional link to forgot-password page
6. Style consistently with signup
7. Test: log in with existing user; verify redirect and session

**Testing Checklist**: [ ] Login succeeds with valid credentials; [ ] Error shown for invalid; [ ] Redirect works

### Sub-Step 2.1.4: Create Auth Callback Route
**File Path**: `app/auth/callback/route.ts`  
**Purpose**: Handle OAuth or email link redirects; exchange code for session

**Option A (Using AI Tools)**: *"Create app/auth/callback/route.ts: GET handler that receives code and next from query. Use createServerClient from @supabase/ssr with cookies; call supabase.auth.exchangeCodeForSession(code). Redirect to next or /dashboard. Handle errors (e.g. redirect to login with error param)."*

**Option B (Manual)**:
1. Create app/auth/callback/route.ts
2. Import createServerClient and cookies; get request.url and searchParams
3. const code = searchParams.get('code'); const next = searchParams.get('next') || '/dashboard'
4. Create Supabase server client with cookies; await supabase.auth.exchangeCodeForSession(code)
5. redirect(next); on error redirect to /login?error=...
6. Document: set redirect URL in Supabase to https://yoursite.com/auth/callback
7. Test: use magic link or OAuth; confirm redirect and session set
8. If only using email/password form (no magic link), callback may still be needed for email confirmation links
9. Ensure middleware allows /auth/callback so cookies can be set

**Testing Checklist**: [ ] Callback exchanges code; [ ] Redirect and session work; [ ] Error handled

### Sub-Step 2.1.5: Create Auth Context/Provider
**File Path**: `contexts/auth-context.tsx`, `app/layout.tsx`  
**Purpose**: Expose user and session to entire app; optional loading state

**Option A (Using AI Tools)**: *"Create AuthProvider in contexts/auth-context.tsx: use Supabase client to get session (supabase.auth.getSession()) and subscribe to auth.onAuthStateChange. Store user and session in state; provide via React context. Export useAuth() that returns { user, session, loading, signOut }. Wrap app in AuthProvider in layout.tsx."*

**Option B (Manual)**:
1. Create contexts/auth-context.tsx with 'use client'
2. Create AuthContext with value { user, session, loading, signOut }
3. In provider: useState for user/session/loading; useEffect to getSession() and set state; useEffect to subscribe to onAuthStateChange and update state
4. signOut: await supabase.auth.signOut(); router.refresh() or set user null
5. Export useAuth() that uses useContext(AuthContext)
6. In app/layout.tsx wrap children with <AuthProvider> (inside body)
7. Use useAuth() in client components to show user menu or redirect if !user
8. Handle loading: show spinner or skeleton until session is resolved
9. Test: login/signup and confirm user is available in components
10. Document: "Use useAuth() in client components; use createClient() in server for server-side user"

**Testing Checklist**: [ ] useAuth() returns user after login; [ ] signOut clears user; [ ] Loading state works

### Sub-Step 2.1.6: Add Protected Route Middleware or Layout
**File Path**: `middleware.ts` or `app/(dashboard)/layout.tsx`  
**Purpose**: Redirect unauthenticated users away from /dashboard and other protected routes

**Option A (Using AI Tools)**: *"Protect /dashboard and all routes under it: in middleware, get session from Supabase (createServerClient with request/response cookies); if path starts with /dashboard and no session, redirect to /login?redirect=/dashboard. Alternatively protect in app/(dashboard)/layout.tsx by checking session server-side and redirecting if null."*

**Option B (Manual)**:
1. Option A — Middleware: in middleware.ts create Supabase client with request/response; getSession(); if pathname.startsWith('/dashboard') && !session redirect to /login?redirect=pathname
2. Option B — Layout: in app/(dashboard)/layout.tsx (server) await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login?redirect=' + pathname); then render children
3. Prefer layout if you need server-side data; middleware is lighter
4. On login success, read redirect query and go to that path
5. Test: open /dashboard while logged out; expect redirect to login; after login expect redirect back to /dashboard
6. Document which routes are protected
7. Add sign out button that calls signOut() and redirects to /
8. Ensure /login and /signup are not protected (or redirect to dashboard if already logged in)

**Security Considerations**: Protect server-side; do not rely only on client redirect  
**Testing Checklist**: [ ] Unauthenticated user cannot access /dashboard; [ ] Redirect back after login works

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 2.2: User Profile

Create user profile pages where users can view and edit their information.

**Time Estimate**: 2–3 hours  
**Prerequisites**: Step 2.1 completed; profiles table exists  
**Expected Outcome**: Profile view page; profile edit form; avatar upload; settings page; optional metadata/preferences

### Sub-Step 2.2.1: Create Profile View Page
**File Path**: `app/(dashboard)/profile/page.tsx`  
**Purpose**: Display current user's profile (name, email, avatar)

**Option A (Using AI Tools)**: *"Create app/(dashboard)/profile/page.tsx: fetch profile from Supabase (profiles table where user_id = auth.uid()). Show display_name, email (from session or auth), avatar_url. Use server component and createClient(); protect route so only logged-in user can access. Style with Tailwind."*

**Option B (Manual)**:
1. Create app/(dashboard)/profile/page.tsx (server component)
2. const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
3. const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
4. Render display_name (or user.email), avatar (img or placeholder), email
5. Add link to edit profile or /profile/edit
6. Ensure layout protects /profile (dashboard layout or middleware)
7. Test: log in; open /profile; see own data

**Testing Checklist**: [ ] Profile page shows own data; [ ] Unauthenticated redirects

### Sub-Step 2.2.2: Add Profile Editing Functionality
**File Path**: `app/(dashboard)/profile/edit/page.tsx`, optional `app/api/profile/route.ts`  
**Purpose**: Form to update display_name (and optionally other profile fields)

**Option A (Using AI Tools)**: *"Create profile edit page: form with display_name (and any other profile fields). On submit, PATCH profiles set display_name where user_id = auth.uid(). Use server action or POST /api/profile. Validate input (length, trim); show success/error. Redirect to /profile on success."*

**Option B (Manual)**:
1. Create app/(dashboard)/profile/edit/page.tsx (client or server with form)
2. Load current profile (server: createClient and select; or client: fetch from API)
3. Form: display_name input (defaultValue from profile); submit button
4. On submit: call PATCH /api/profile with { display_name } or server action that updates profiles via createClient()
5. Validate: display_name length (e.g. 1–100); trim
6. On success: redirect to /profile or show toast
7. On error: show error message (e.g. "Update failed")
8. Protect route; ensure update uses auth.uid() so user can only update own row
9. Test: change name; save; reload; confirm persisted

**Security Considerations**: Update only own profile (user_id = auth.uid()); validate input  
**Testing Checklist**: [ ] Edit saves; [ ] Only own profile editable

### Sub-Step 2.2.3: Implement Avatar Upload to Supabase Storage
**File Path**: `app/(dashboard)/profile/edit/page.tsx` or `components/avatar-upload.tsx`, Storage bucket  
**Purpose**: Upload avatar image; store URL in profiles.avatar_url

**Option A (Using AI Tools)**: *"Add avatar upload: create Supabase Storage bucket 'avatars' with RLS (users can upload to folder named their user_id). In profile edit page, file input; on select, upload to avatars/{user_id}/avatar (or with timestamp). Get public URL; update profiles set avatar_url where user_id = auth.uid(). Show current avatar and preview after select. Max size 2MB; allow jpg, png."*

**Option B (Manual)**:
1. In Supabase Dashboard: Storage > New bucket > name 'avatars'; set public or use signed URLs
2. Add RLS policy: INSERT/UPDATE where bucket = 'avatars' and (name like auth.uid()::text || '/%'); SELECT for public read or same rule
3. Create component or in edit page: input type file accept image/jpeg,image/png; max size 2MB client check
4. On change: upload file to avatars/{user_id}/avatar (or avatars/{user_id}/{timestamp}.jpg)
5. Get public URL from supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
6. Update profiles: supabase.from('profiles').update({ avatar_url }).eq('user_id', user.id)
7. Show current avatar; after upload show new image
8. Handle errors (size, type, upload failed)
9. Test: upload image; confirm avatar_url updated and image displays
10. Optional: resize/crop on client or server before upload

**Security Considerations**: Restrict upload path to user_id; validate file type and size server-side if possible  
**Testing Checklist**: [ ] Upload works; [ ] Avatar displays; [ ] Only own folder writable

### Sub-Step 2.2.4: Add User Settings Page
**File Path**: `app/(dashboard)/settings/page.tsx`  
**Purpose**: Central place for account settings (email change link, password change, preferences)

**Option A (Using AI Tools)**: *"Create app/(dashboard)/settings/page.tsx: section for account (link to change email/password via Supabase auth UI or custom form). Section for preferences (theme, notifications) if we store them. Use createClient() to load user; protect route. Link from profile or nav."*

**Option B (Manual)**:
1. Create app/(dashboard)/settings/page.tsx
2. Sections: Account (email, password), Preferences (if any)
3. For password change: link to Supabase "Reset password" flow or form that calls supabase.auth.updateUser({ password })
4. For email change: Supabase may require re-auth; document or link to Supabase docs
5. Load user from createClient() or useAuth(); protect route
6. Add link in nav or profile page to /settings
7. Style consistently with profile
8. Optional: danger zone (delete account) with confirmation; implement delete user in Supabase and cascade
9. Test: open settings; change password; confirm login still works
10. Document: "Settings at /settings"

**Testing Checklist**: [ ] Settings page loads; [ ] Password change works if implemented

### Sub-Step 2.2.5: Connect to Supabase User Metadata (Optional)
**File Path**: Profile/settings pages, auth context  
**Purpose**: Store optional preferences (theme, timezone) in user_metadata or profiles

**Option A (Using AI Tools)**: *"Store user preferences (e.g. theme, timezone) in auth.users raw_user_meta_data or in profiles table. On settings page, load and save preferences; use supabase.auth.updateUser({ data: { theme: 'dark' } }) for metadata or PATCH profiles for extra columns. Document where we store what."*

**Option B (Manual)**:
1. Decide: theme/timezone in profiles table (extra columns) or in auth.users user_metadata
2. If profiles: add columns (e.g. theme text); PATCH /api/profile or server action to update
3. If user_metadata: supabase.auth.updateUser({ data: { theme: 'dark' } }); read from session.user.user_metadata
4. Add UI on settings page: dropdown or toggle for theme; save on change
5. Apply theme in layout (e.g. class on html or body from metadata/profile)
6. Document: "Preferences stored in profiles / user_metadata"
7. Test: change preference; reload; confirm persisted
8. Ensure RLS or auth only allows own data; keep PII out of user_metadata if exposed to client

**Testing Checklist**: [ ] Preferences load; [ ] Preferences save; [ ] Theme or preference applied

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 3: Core Features

#### Step 3.1: Main Product Features

Implement the core functionality of your SaaS product.

**Time Estimate**: 1–2 weeks (varies by feature complexity)  
**Prerequisites**: Database schema designed; authentication working  
**Expected Outcome**: Core feature tables, API routes, UI components, validation, and access control

### Sub-Step 3.1.1: Define Core Feature Requirements
**File Path**: Requirements doc or notes  
**Purpose**: List features, user actions, and data needed

**Option A (Using AI Tools)**: *"Help me define requirements for my core feature: [describe feature]. List: what data is stored (e.g. projects with name, description), what actions users can do (create, read, update, delete), any relationships (e.g. projects belong to user, projects have items). Document in a short requirements.md."*

**Option B (Manual)**:
1. List main features (e.g. project management, document editor, task list)
2. For each: data model (fields), actions (CRUD), relationships (user_id, parent_id)
3. List access rules (e.g. user owns projects; can share with others)
4. Document in requirements.md or comments
5. Prioritize MVP features vs nice-to-have

**Testing Checklist**: [ ] Requirements documented; [ ] Data model clear

### Sub-Step 3.1.2: Design Data Models and Relationships
**File Path**: Design doc or migration notes  
**Purpose**: Define tables, columns, foreign keys, and indexes

**Option A (Using AI Tools)**: *"Design data model for [feature]: table [name] with columns (id, user_id, name, description, created_at, updated_at). If there are child tables (e.g. project_items), add foreign key project_id. List indexes needed (user_id, created_at). Document relationships."*

**Option B (Manual)**:
1. Design main table(s): columns, types, defaults, constraints
2. Add user_id foreign key to auth.users (or subscription_id if plan-gated)
3. Design child tables if any (e.g. items, comments) with parent_id FK
4. List indexes: (user_id), (user_id, created_at), foreign keys
5. Document in migration comments or schema.md
6. Consider soft deletes (deleted_at) if needed

**Testing Checklist**: [ ] Tables designed; [ ] Relationships clear

### Sub-Step 3.1.3: Create Database Tables with Migrations
**File Path**: `supabase/migrations/YYYYMMDD_feature_tables.sql`  
**Purpose**: Create tables, RLS policies, and indexes

**Option A (Using AI Tools)**: *"Create migration for [feature] tables: CREATE TABLE with columns, foreign keys, timestamps. Enable RLS. Add policies: SELECT/INSERT/UPDATE/DELETE where auth.uid() = user_id (or appropriate ownership check). Add indexes on user_id and created_at."*

**Option B (Manual)**:
1. Create migration file
2. CREATE TABLE with all columns; add foreign keys
3. ENABLE ROW LEVEL SECURITY
4. Policies: SELECT/INSERT/UPDATE/DELETE USING (auth.uid() = user_id) or ownership check
5. Add indexes: (user_id), (user_id, created_at), foreign keys
6. Run migration: supabase db push or Dashboard
7. Test: insert row as user A; try to select as user B (should fail)

**Security Considerations**: RLS must enforce user ownership; never allow cross-user access  
**Testing Checklist**: [ ] Migration runs; [ ] RLS blocks cross-user access

### Sub-Step 3.1.4: Build API Routes for CRUD Operations
**File Path**: `app/api/[feature]/route.ts`, `app/api/[feature]/[id]/route.ts`  
**Purpose**: REST endpoints for create, read, update, delete

**Option A (Using AI Tools)**: *"Create API routes for [feature]: GET /api/projects (list user's projects), POST /api/projects (create), GET /api/projects/[id] (get one), PATCH /api/projects/[id] (update), DELETE /api/projects/[id] (delete). Use createClient() to get user; enforce auth.uid() = user_id in queries. Return JSON; handle errors."*

**Option B (Manual)**:
1. Create app/api/projects/route.ts: GET (list), POST (create)
2. Create app/api/projects/[id]/route.ts: GET (one), PATCH (update), DELETE (delete)
3. In each: const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return 401
4. GET list: supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
5. POST: validate body (e.g. name required); insert with user_id = user.id
6. GET [id]: select where id and user_id; return 404 if not found
7. PATCH: update where id and user_id; validate body
8. DELETE: delete where id and user_id; return 204 or 200
9. Return JSON with error handling (try/catch; return 500 on error)
10. Test each endpoint with authenticated request

**Security Considerations**: Always check user_id in queries; never trust client-supplied user_id  
**Testing Checklist**: [ ] All CRUD endpoints work; [ ] Only own data accessible

### Sub-Step 3.1.5: Create UI Components for Features
**File Path**: `app/(dashboard)/[feature]/page.tsx`, `components/[feature]/`  
**Purpose**: Pages and components to view and manage feature data

**Option A (Using AI Tools)**: *"Create UI for [feature]: app/(dashboard)/projects/page.tsx with list of projects (fetch from GET /api/projects), link to create and detail. app/(dashboard)/projects/new/page.tsx for create form. app/(dashboard)/projects/[id]/page.tsx for detail and edit. Use Tailwind for styling; show loading and error states."*

**Option B (Manual)**:
1. Create list page: fetch from API; display in table or grid; link to detail and create
2. Create form page: input fields; submit calls POST API; redirect on success
3. Create detail page: fetch by id; display fields; edit button; delete button with confirmation
4. Create edit page: load current data; form with update; submit calls PATCH API
5. Add loading states (skeleton or spinner); error messages
6. Style with Tailwind; make responsive
7. Test: create, view, edit, delete from UI
8. Optional: add search/filter on list page

**Testing Checklist**: [ ] List, create, detail, edit, delete work from UI

### Sub-Step 3.1.6: Implement Data Validation (Zod Schemas)
**File Path**: `lib/validations/[feature].ts`  
**Purpose**: Validate request bodies and form inputs

**Option A (Using AI Tools)**: *"Add validation with Zod: create lib/validations/projects.ts with schema for create (name: string min 1, description: string optional) and update (partial). Use in API routes: const validated = schema.parse(body); if invalid return 400. Use in forms with react-hook-form and zodResolver."*

**Option B (Manual)**:
1. Install zod: `npm install zod`
2. Create lib/validations/projects.ts: export const createProjectSchema = z.object({ name: z.string().min(1).max(100), description: z.string().optional() })
3. Export updateProjectSchema = createProjectSchema.partial()
4. In API POST: const validated = createProjectSchema.parse(body); catch ZodError and return 400
5. In forms: use react-hook-form with zodResolver; show validation errors
6. Test: submit invalid data; confirm 400 and error messages
7. Document validation rules

**Security Considerations**: Validate all user input; never trust client  
**Testing Checklist**: [ ] Invalid data rejected; [ ] Error messages clear

### Sub-Step 3.1.7: Add Error Handling
**File Path**: API routes, components  
**Purpose**: Handle and display errors gracefully

**Option A (Using AI Tools)**: *"Add error handling: in API routes, wrap DB calls in try/catch; return 500 with generic message (log full error server-side). In UI, show user-friendly error messages (e.g. 'Failed to save. Please try again.'). Add error boundaries for React errors."*

**Option B (Manual)**:
1. In API routes: try { ... } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal error' }, { status: 500 }) }
2. In UI: catch fetch errors; show toast or inline message
3. Add error.tsx in route groups for Next.js error boundaries
4. Log errors server-side (e.g. console.error or Sentry if configured)
5. Never expose stack traces or DB errors to client
6. Test: trigger error (e.g. invalid DB query); confirm user sees friendly message
7. Document error handling pattern

**Testing Checklist**: [ ] Errors handled; [ ] User sees friendly messages

### Sub-Step 3.1.8: Create Feature Access Control
**File Path**: API routes, middleware, or helper  
**Purpose**: Restrict features by subscription plan (e.g. free vs paid)

**Option A (Using AI Tools)**: *"Add plan-based access: in API routes, load user's subscription from subscriptions table. Check plan_id (e.g. 'free', 'pro'); if feature requires 'pro' and user has 'free', return 403. Create helper getSubscription(userId) and requirePlan(userId, 'pro'). Use in feature routes."*

**Option B (Manual)**:
1. Create lib/subscriptions/getSubscription.ts: query subscriptions where user_id and status = 'active'; return plan_id
2. Create requirePlan(userId, requiredPlan): get subscription; if plan not in allowed list return false
3. In feature API routes: if (!requirePlan(user.id, 'pro')) return 403 { error: 'Upgrade to Pro' }
4. In UI: check subscription; show upgrade CTA if plan insufficient
5. Document which features require which plans
6. Test: free user tries pro feature; expect 403 or upgrade prompt
7. Optional: usage limits (e.g. free: 10 projects max); check count before create

**Security Considerations**: Check subscription server-side; never trust client  
**Testing Checklist**: [ ] Plan check enforced; [ ] Upgrade prompt shown

### Sub-Step 3.1.9: Add Usage Tracking
**File Path**: DB table or analytics, API routes  
**Purpose**: Track feature usage (e.g. projects created, API calls) for limits and analytics

**Option A (Using AI Tools)**: *"Add usage tracking: table usage_logs (user_id, feature, count, date) or increment counter on feature table. On create/action, increment count. Check against limit (e.g. free: 10 projects) before allowing action. Show usage in dashboard (e.g. '5/10 projects used')."*

**Option B (Manual)**:
1. Option A: count rows in feature table where user_id (e.g. SELECT COUNT(*) FROM projects WHERE user_id = ?)
2. Option B: usage_logs table: user_id, feature, date, count; increment on action
3. Before create: check count < limit; if exceeded return 403 with message
4. Show usage in dashboard: count / limit with progress bar
5. Reset limits on subscription change or monthly (if applicable)
6. Document limits per plan
7. Test: create up to limit; confirm next create is blocked

**Testing Checklist**: [ ] Usage tracked; [ ] Limits enforced; [ ] Dashboard shows usage

### Sub-Step 3.1.10: Implement Feature Flags (Optional)
**File Path**: Env or DB table, feature checks  
**Purpose**: Enable/disable features per user or globally without deploy

**Option A (Using AI Tools)**: *"Add feature flags: env NEXT_PUBLIC_FEATURE_X_ENABLED or table feature_flags (user_id, feature, enabled). In API or UI, check flag before showing/using feature. Allow admins to toggle flags. Document how to add new flags."*

**Option B (Manual)**:
1. Use env: NEXT_PUBLIC_FEATURE_X_ENABLED=true
2. Or DB table: feature_flags (user_id nullable for global, feature, enabled)
3. Create getFeatureFlag(feature, userId?): check env or DB; return boolean
4. In feature code: if (!getFeatureFlag('feature_x', user.id)) return disabled or hide UI
5. Optional: admin UI to toggle flags
6. Document flags in README
7. Test: disable flag; confirm feature hidden/disabled

**Testing Checklist**: [ ] Flags work; [ ] Features can be toggled

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 3.2: User Management

Create user dashboard and management features, including feature access control and usage tracking.

**Time Estimate**: 2–3 days  
**Prerequisites**: Step 3.1 completed; subscriptions working  
**Expected Outcome**: User dashboard, plan-based access control, usage tracking, activity logs, and optional admin panel

### Sub-Step 3.2.1: Create User Dashboard Page
**File Path**: `app/(dashboard)/page.tsx`  
**Purpose**: Main dashboard showing overview, stats, and quick actions

**Option A (Using AI Tools)**: *"Create user dashboard at app/(dashboard)/page.tsx: show welcome message, recent activity, usage stats (e.g. '5/10 projects'), subscription status summary, quick actions (create project, upgrade). Fetch data from API or server component. Style with cards and sections."*

**Option B (Manual)**:
1. Create app/(dashboard)/page.tsx (server component)
2. Fetch: subscription status, recent items (e.g. last 5 projects), usage counts
3. Display: welcome with user name, stats cards (total projects, usage), subscription badge, recent activity list
4. Add quick actions: "Create Project", "Upgrade Plan" (if free)
5. Style with Tailwind grid/cards; make responsive
6. Test: view dashboard; verify all data loads

**Testing Checklist**: [ ] Dashboard loads; [ ] Stats accurate; [ ] Quick actions work

### Sub-Step 3.2.2: Implement Feature Access Control Based on Subscription
**File Path**: `lib/subscriptions/access.ts`, API routes  
**Purpose**: Check subscription plan before allowing feature access

**Option A (Using AI Tools)**: *"Create lib/subscriptions/access.ts: requirePlan(userId, requiredPlan) that checks subscriptions table for active plan. In feature API routes, call requirePlan before allowing action. Return 403 with upgrade message if plan insufficient. Use in UI to show/hide features."*

**Option B (Manual)**:
1. Create lib/subscriptions/access.ts: getSubscription(userId) and requirePlan(userId, plan)
2. In feature API routes: if (!requirePlan(user.id, 'pro')) return 403 { error: 'Upgrade required' }
3. In UI: check subscription; hide pro features or show upgrade CTA
4. Document which features require which plans
5. Test: free user tries pro feature; expect 403 or upgrade prompt

**Security Considerations**: Check server-side; never trust client  
**Testing Checklist**: [ ] Plan check enforced; [ ] Upgrade prompt shown

### Sub-Step 3.2.3: Add Usage Tracking and Limits
**File Path**: API routes, dashboard  
**Purpose**: Track usage and enforce limits per plan

**Option A (Using AI Tools)**: *"Add usage tracking: before create action, count existing items (e.g. SELECT COUNT(*) FROM projects WHERE user_id = ?). Compare to plan limit. If at limit, return 403 with message. Show usage in dashboard (e.g. '5/10 projects'). Update on create/delete."*

**Option B (Manual)**:
1. In create API: count existing items; get plan limit from config
2. If count >= limit: return 403 { error: 'Plan limit reached. Upgrade to create more.' }
3. On dashboard: show usage (count / limit) with progress bar
4. Update count on create/delete (or recalculate on load)
5. Test: create up to limit; verify next create blocked

**Testing Checklist**: [ ] Limits enforced; [ ] Usage displayed

### Sub-Step 3.2.4: Create Activity Logs
**File Path**: `supabase/migrations/` for activity_logs, dashboard  
**Purpose**: Log user actions for history and debugging

**Option A (Using AI Tools)**: *"Create activity_logs table: user_id, action, resource_type, resource_id, created_at. On key actions (create, update, delete), insert log. Show recent activity on dashboard (last 10). Add index on (user_id, created_at)."*

**Option B (Manual)**:
1. Create migration: activity_logs (user_id, action, resource_type, resource_id, metadata jsonb, created_at)
2. Add index: (user_id, created_at)
3. In API routes: after create/update/delete, insert log
4. On dashboard: fetch last 10 logs; display in list
5. Test: perform actions; verify logs appear

**Testing Checklist**: [ ] Logs created; [ ] Dashboard shows activity

### Sub-Step 3.2.5: Build Admin Panel for User Management (Optional)
**File Path**: `app/admin/users/page.tsx`  
**Purpose**: Admin-only page to view and manage users

**Option A (Using AI Tools)**: *"Create admin panel: app/admin/users/page.tsx (protect with admin check). List all users with email, subscription, created_at. Add search/filter. Link to user detail. Only users with admin role can access. Use RLS or server-side check."*

**Option B (Manual)**:
1. Create app/admin/users/page.tsx; check admin role (from user metadata or separate table)
2. Fetch all users (join profiles, subscriptions); paginate
3. Display in table: email, name, plan, status, created
4. Add search by email; filter by plan
5. Link to user detail page (optional)
6. Test: admin can access; non-admin cannot

**Security Considerations**: Only admins can access; enforce server-side  
**Testing Checklist**: [ ] Admin can view users; [ ] Non-admin blocked

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 4: Subscriptions

#### Step 4.1: Stripe Subscription Setup

Set up Stripe subscriptions with multiple pricing tiers.

**Time Estimate**: 2–3 days  
**Prerequisites**: Stripe account; Step 1.3 (subscriptions table exists)  
**Expected Outcome**: Stripe products/prices, checkout flow, webhook handler, and customer linking

### Sub-Step 4.1.1: Create Subscription Products in Stripe Dashboard
**File Path**: Stripe Dashboard  
**Purpose**: Create products and prices for each tier

**Option A (Using AI Tools)**: *"I need to create products in Stripe: go to Products, create products for Free, Pro, Enterprise. For each, add recurring price (monthly/yearly). Note the Price IDs (price_xxx). Document which price_id maps to which plan_id in our app."*

**Option B (Manual)**:
1. Go to Stripe Dashboard > Products; create product (e.g. "Pro Plan")
2. Add price: recurring monthly (or yearly); set amount; save
3. Note Price ID (price_xxx); map to plan_id in app (e.g. 'pro' → 'price_xxx')
4. Repeat for all tiers; document mapping in .env or config
5. Store mapping: lib/stripe/prices.ts or env STRIPE_PRICE_PRO=price_xxx

**Testing Checklist**: [ ] Products created; [ ] Price IDs documented

### Sub-Step 4.1.2: Set Up Pricing Tiers Configuration
**File Path**: `lib/plans.ts` or env  
**Purpose**: Map plan IDs to Stripe price IDs in code

**Option A (Using AI Tools)**: *"Create lib/plans.ts or .env with plan-to-price mapping: { free: null, pro: 'price_xxx', enterprise: 'price_yyy' }. Export getPriceId(planId). Use in checkout creation."*

**Option B (Manual)**:
1. Create lib/stripe/prices.ts: export const priceIds = { pro: process.env.STRIPE_PRICE_PRO, enterprise: process.env.STRIPE_PRICE_ENTERPRISE }
2. Add env vars: STRIPE_PRICE_PRO=price_xxx, STRIPE_PRICE_ENTERPRISE=price_yyy
3. Create getPriceId(planId): return priceIds[planId]
4. Document in README

**Testing Checklist**: [ ] Mapping configured; [ ] getPriceId works

### Sub-Step 4.1.3: Implement Stripe Checkout for Subscriptions
**File Path**: `app/api/create-checkout-session/route.ts`, `app/pricing/page.tsx`  
**Purpose**: Create checkout session and redirect to Stripe

**Option A (Using AI Tools)**: *"Create POST /api/create-checkout-session: get user from session; get price_id from body. Create Stripe checkout session with mode='subscription', price, customer_email, success_url, cancel_url, metadata { user_id }. Return session.url; redirect client to it."*

**Option B (Manual)**:
1. Install stripe: `npm install stripe`
2. Create app/api/create-checkout-session/route.ts
3. Get user from session; get plan_id from body; get price_id from getPriceId(plan_id)
4. const session = await stripe.checkout.sessions.create({ mode: 'subscription', line_items: [{ price: priceId, quantity: 1 }], customer_email: user.email, success_url: `${origin}/subscription/success`, cancel_url: `${origin}/pricing`, metadata: { user_id: user.id } })
5. Return { url: session.url }; client redirects to url
6. Create pricing page with "Subscribe" buttons that call this API
7. Test: click subscribe; verify redirect to Stripe

**Security Considerations**: Verify user is authenticated; validate plan_id  
**Testing Checklist**: [ ] Checkout session created; [ ] Redirect works

### Sub-Step 4.1.4: Handle Subscription Creation Webhook
**File Path**: `app/api/webhooks/stripe/route.ts`  
**Purpose**: Update DB when Stripe subscription is created

**Option A (Using AI Tools)**: *"Create POST /api/webhooks/stripe: verify Stripe signature. On checkout.session.completed event, get customer and subscription from session. Insert or update subscriptions table: user_id (from metadata), stripe_customer_id, stripe_subscription_id, status='active', plan_id. Use Stripe webhook secret from env."*

**Option B (Manual)**:
1. Create app/api/webhooks/stripe/route.ts
2. Get webhook secret from env: STRIPE_WEBHOOK_SECRET
3. Verify signature: const event = stripe.webhooks.constructEvent(body, signature, secret)
4. On checkout.session.completed: get customer_id and subscription_id from session
5. Get user_id from session.metadata.user_id
6. Insert or update subscriptions: user_id, stripe_customer_id, stripe_subscription_id, status='active', plan_id (from price lookup)
7. Return 200
8. Test with Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe

**Security Considerations**: Always verify webhook signature; never process unverified events  
**Testing Checklist**: [ ] Webhook verified; [ ] DB updated on checkout

### Sub-Step 4.1.5: Link Stripe Customer IDs to User Accounts
**File Path**: Webhook handler, subscriptions table  
**Purpose**: Ensure stripe_customer_id is stored and used for future operations

**Option A (Using AI Tools)**: *"In webhook, when customer.created or checkout.session.completed: store stripe_customer_id in subscriptions table. If user already has subscription row, update it. Use customer_id for future Stripe API calls (e.g. update subscription, invoices)."*

**Option B (Manual)**:
1. In webhook: on checkout.session.completed, get customer_id from session.customer
2. Upsert subscriptions: WHERE user_id = metadata.user_id SET stripe_customer_id = customer_id
3. Verify: query subscriptions; confirm customer_id stored
4. Document: "Use stripe_customer_id for Stripe API calls"
5. Test: complete checkout; verify customer_id in DB

**Testing Checklist**: [ ] Customer ID stored; [ ] Can query by customer_id

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 4.2: Subscription Management

Create UI for users to manage their subscriptions, including upgrade, downgrade, and cancellation.

**Time Estimate**: 2–3 days  
**Prerequisites**: Step 4.1 completed; Stripe subscriptions working  
**Expected Outcome**: Subscription status page, upgrade/downgrade flows, cancellation, billing history, plan comparison, usage limits display, and webhook handling

### Sub-Step 4.2.1: Create Subscription Status Page
**File Path**: `app/(dashboard)/subscription/page.tsx`  
**Purpose**: Display current plan, status, renewal date, and key details

**Option A (Using AI Tools)**: *"Create app/(dashboard)/subscription/page.tsx: fetch user's subscription from subscriptions table (join with Stripe if needed). Display: current plan name, status (active/canceled/past_due), current_period_end, billing amount. Show upgrade/downgrade buttons and cancel link. Style clearly with Tailwind."*

**Option B (Manual)**:
1. Create app/(dashboard)/subscription/page.tsx (server or client)
2. Fetch subscription: const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
3. Display: plan_id, status, current_period_end (format as date), amount (from Stripe or plan config)
4. Show status badge (green for active, red for canceled/past_due)
5. Add sections: "Current Plan", "Billing", "Actions" (upgrade, downgrade, cancel)
6. Link to billing history and plan comparison
7. Test: view as user with active subscription

**Testing Checklist**: [ ] Status page shows current plan; [ ] All details visible

### Sub-Step 4.2.2: Display Current Plan Details
**File Path**: `app/(dashboard)/subscription/page.tsx`, plan config  
**Purpose**: Show plan features, limits, and pricing clearly

**Option A (Using AI Tools)**: *"On subscription page, show plan details: list features included (e.g. '10 projects', 'Unlimited storage'), pricing, and usage vs limits (e.g. '5/10 projects used'). Load plan config from env or DB. Make it visually clear what the user gets."*

**Option B (Manual)**:
1. Create lib/plans.ts: export const plans = { free: { name: 'Free', price: 0, features: [...] }, pro: { ... } }
2. On page: get plan config from plans[subscription.plan_id]
3. Display: plan name, price, feature list (checkmarks), usage vs limits (progress bar if applicable)
4. Show "What's included" section with feature list
5. Style with cards or sections; make it scannable
6. Test: verify correct plan details shown

**Testing Checklist**: [ ] Plan details accurate; [ ] Features and limits clear

### Sub-Step 4.2.3: Implement Upgrade Flow with Proration
**File Path**: `app/(dashboard)/subscription/upgrade/page.tsx`, `app/api/subscription/upgrade/route.ts`  
**Purpose**: Let users upgrade to higher tier; handle Stripe proration

**Option A (Using AI Tools)**: *"Create upgrade flow: page showing available higher plans with 'Upgrade' buttons. On click, POST /api/subscription/upgrade with new_plan_id. API: get Stripe subscription; call stripe.subscriptions.update with new price and proration_behavior='always_invoice'. Redirect to Stripe Customer Portal or show success. Update DB via webhook."*

**Option B (Manual)**:
1. Create app/(dashboard)/subscription/upgrade/page.tsx: list plans higher than current; show upgrade button for each
2. Create POST /api/subscription/upgrade: get user subscription; get Stripe subscription by stripe_subscription_id
3. Call stripe.subscriptions.update(subscriptionId, { items: [{ price: newPriceId }], proration_behavior: 'always_invoice' })
4. Return success; webhook will update DB (or update optimistically and let webhook confirm)
5. Redirect to subscription page or show "Upgrade successful"
6. Handle errors (e.g. payment method required); show message
7. Test: upgrade from free to pro; verify Stripe subscription updated and DB synced

**Security Considerations**: Verify user owns subscription before updating; validate plan_id  
**Testing Checklist**: [ ] Upgrade works; [ ] Proration handled; [ ] DB updated

### Sub-Step 4.2.4: Implement Downgrade Flow
**File Path**: `app/(dashboard)/subscription/downgrade/page.tsx`, `app/api/subscription/downgrade/route.ts`  
**Purpose**: Let users downgrade; schedule change at period end or immediate

**Option A (Using AI Tools)**: *"Create downgrade flow: page showing lower plans. On downgrade, POST /api/subscription/downgrade with new_plan_id. API: update Stripe subscription with new price. Option: schedule change at period_end (cancel_at_period_end=false, then update) or immediate. Update DB via webhook. Show confirmation with effective date."*

**Option B (Manual)**:
1. Create downgrade page: list lower plans; "Downgrade" button
2. POST /api/subscription/downgrade: get subscription; update Stripe with new price
3. Option A: immediate (proration); Option B: at period end (set cancel_at_period_end=false first, then update)
4. Show confirmation: "Downgrade scheduled for [date]" or "Downgraded immediately"
5. Update DB via webhook or optimistically
6. Test: downgrade pro to free; verify change
7. Document: immediate vs scheduled downgrade behavior

**Testing Checklist**: [ ] Downgrade works; [ ] Effective date clear

### Sub-Step 4.2.5: Add Cancellation Functionality
**File Path**: `app/(dashboard)/subscription/cancel/page.tsx`, `app/api/subscription/cancel/route.ts`  
**Purpose**: Let users cancel subscription with confirmation

**Option A (Using AI Tools)**: *"Add cancel subscription: page with warning and confirmation. POST /api/subscription/cancel: call stripe.subscriptions.update with cancel_at_period_end=true (or cancel immediately). Update DB status to 'canceled' or 'active' with cancel_at. Show confirmation with cancellation date. Send email confirmation."*

**Option B (Manual)**:
1. Create cancel page: warning message, reason dropdown (optional), confirm button
2. POST /api/subscription/cancel: update Stripe with cancel_at_period_end=true (or cancel())
3. Update DB: set status or cancel_at field; webhook will finalize
4. Show confirmation: "Subscription will cancel on [current_period_end]"
5. Send email (via Resend or similar): "Your subscription is canceled"
6. Optional: "Reactivate" button if cancel_at_period_end (call Stripe to remove cancel_at_period_end)
7. Test: cancel subscription; verify Stripe and DB updated

**Security Considerations**: Confirm cancellation; allow reactivation if canceled at period end  
**Testing Checklist**: [ ] Cancel works; [ ] Confirmation shown; [ ] Email sent

### Sub-Step 4.2.6: Create Billing History Page
**File Path**: `app/(dashboard)/subscription/billing/page.tsx`, Stripe invoices  
**Purpose**: Show past invoices and payments

**Option A (Using AI Tools)**: *"Create billing history page: fetch invoices from Stripe (stripe.invoices.list with customer_id). Display: date, amount, status (paid/open), download link (invoice PDF URL). Show in table or list. Link to Stripe Customer Portal for full history. Cache invoices or fetch on demand."*

**Option B (Manual)**:
1. Create app/(dashboard)/subscription/billing/page.tsx
2. GET /api/subscription/invoices: get user's stripe_customer_id; call stripe.invoices.list({ customer })
3. Return invoices: date, amount, status, invoice_pdf
4. Display in table: date, description, amount, status badge, download button (link to invoice_pdf)
5. Link to Stripe Customer Portal: "View full billing history" (stripe.billingPortal.sessions.create)
6. Cache invoices for 1 hour or fetch fresh
7. Test: view billing history; download invoice PDF

**Testing Checklist**: [ ] Invoices listed; [ ] Download works; [ ] Customer Portal link works

### Sub-Step 4.2.7: Implement Plan Comparison UI
**File Path**: `app/(dashboard)/subscription/plans/page.tsx` or component  
**Purpose**: Compare all plans side-by-side; highlight current plan

**Option A (Using AI Tools)**: *"Create plan comparison page: table or cards showing all plans (Free, Pro, Enterprise) with columns: price, features (checkmarks), limits. Highlight current plan. Add 'Upgrade' or 'Downgrade' buttons. Make it easy to compare and choose."*

**Option B (Manual)**:
1. Create plans comparison page or component
2. Load all plans from lib/plans.ts or config
3. Display in table: Plan name | Price | Feature 1 | Feature 2 | ... | Action
4. Mark current plan with badge or highlight
5. Show "Current" for user's plan; "Upgrade" for higher; "Downgrade" for lower
6. Link buttons to upgrade/downgrade flows
7. Style clearly; make mobile-responsive
8. Test: view comparison; verify current plan highlighted

**Testing Checklist**: [ ] All plans shown; [ ] Current plan highlighted; [ ] Actions work

### Sub-Step 4.2.8: Add Usage Limits Display
**File Path**: Dashboard or subscription page  
**Purpose**: Show current usage vs plan limits (e.g. "5/10 projects")

**Option A (Using AI Tools)**: *"On subscription or dashboard page, show usage vs limits: for each limited feature (e.g. projects, storage), display 'X/Y used' with progress bar. Calculate from DB (count rows) or usage_logs. Show warning if near limit (e.g. 80%). Link to upgrade if limit reached."*

**Option B (Manual)**:
1. Create component or section: "Usage"
2. For each limited feature: count current usage (e.g. SELECT COUNT(*) FROM projects WHERE user_id = ?)
3. Get limit from plan config
4. Display: "Projects: 5/10" with progress bar; percentage
5. If usage >= limit * 0.8: show warning (yellow); if >= limit: show error (red) and upgrade CTA
6. Update usage on feature actions or cache for 5 minutes
7. Test: create items up to limit; verify display updates

**Testing Checklist**: [ ] Usage displayed; [ ] Progress bar accurate; [ ] Warnings shown

### Sub-Step 4.2.9: Create Subscription Change Confirmation
**File Path**: `app/(dashboard)/subscription/confirm/page.tsx` or modal  
**Purpose**: Confirm plan changes with summary and effective date

**Option A (Using AI Tools)**: *"After upgrade/downgrade action, show confirmation page or modal: 'You've upgraded to Pro. Your new plan starts [date]. You'll be charged $X. [Proration details if applicable].' Show 'Continue' or 'Go to Dashboard'. Send confirmation email."*

**Option B (Manual)**:
1. After upgrade/downgrade API success, redirect to /subscription/confirm?action=upgrade&plan=pro
2. Confirmation page: summary of change, effective date, amount, proration if applicable
3. Show "Continue to Dashboard" button
4. Send email: "Your subscription has been updated"
5. Optional: show in modal instead of separate page
6. Test: complete upgrade; verify confirmation and email

**Testing Checklist**: [ ] Confirmation shown; [ ] Details accurate; [ ] Email sent

### Sub-Step 4.2.10: Handle Webhook Updates
**File Path**: `app/api/webhooks/stripe/route.ts` (from Step 4.3)  
**Purpose**: Ensure subscription changes from Stripe update UI immediately

**Option A (Using AI Tools)**: *"In webhook handler (Step 4.3), when subscription.updated event: update subscriptions table (status, plan_id, current_period_end). After update, optionally notify user via email or in-app notification. Ensure UI reflects changes (revalidate or real-time update)."*

**Option B (Manual)**:
1. In webhook (Step 4.3): on subscription.updated, update subscriptions table
2. After DB update, send email: "Your subscription was updated"
3. In UI: use Supabase real-time subscription or polling to refresh subscription data
4. Or: revalidate subscription page on navigation (Next.js revalidatePath)
5. Test: change subscription in Stripe Dashboard; verify webhook updates DB and UI refreshes
6. Document: "Subscription changes sync via webhook within minutes"

**Testing Checklist**: [ ] Webhook updates DB; [ ] UI reflects changes; [ ] Email sent

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 4.3: Webhooks

Set up webhook handling to keep your database in sync with Stripe subscription events.

**Time Estimate**: 1–2 days  
**Prerequisites**: Step 4.1 completed; Stripe account  
**Expected Outcome**: Webhook endpoint handling all subscription events; DB synced; emails sent

### Sub-Step 4.3.1: Create Webhook Endpoint
**File Path**: `app/api/webhooks/stripe/route.ts`  
**Purpose**: POST endpoint that receives and verifies Stripe events

**Option A (Using AI Tools)**: *"Create POST /api/webhooks/stripe: read raw body (req.body as string or Buffer). Get Stripe signature from header 'stripe-signature'. Verify with stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET). Return 200 on success, 400 on invalid signature."*

**Option B (Manual)**:
1. Create app/api/webhooks/stripe/route.ts
2. Export async function POST(req): get raw body (await req.text() or req.arrayBuffer())
3. Get signature from req.headers.get('stripe-signature')
4. Verify: const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
5. On error: return 400; on success: process event and return 200
6. Add STRIPE_WEBHOOK_SECRET to env (get from Stripe Dashboard > Webhooks > Signing secret)

**Security Considerations**: Always verify signature; never process unverified events  
**Testing Checklist**: [ ] Endpoint accepts POST; [ ] Signature verification works

### Sub-Step 4.3.2: Handle Subscription Events
**File Path**: Webhook handler  
**Purpose**: Process subscription.created, updated, deleted, canceled events

**Option A (Using AI Tools)**: *"In webhook, switch on event.type: 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'. Get subscription from event.data.object. Update subscriptions table: status, plan_id (from price), current_period_end. Use stripe_subscription_id to find row."*

**Option B (Manual)**:
1. In webhook: switch (event.type) { case 'customer.subscription.created': case 'customer.subscription.updated': ... }
2. Get subscription = event.data.object
3. Find user: query subscriptions WHERE stripe_subscription_id = subscription.id; get user_id
4. Update subscriptions: status = subscription.status, plan_id = getPlanFromPrice(subscription.items.data[0].price.id), current_period_end = subscription.current_period_end
5. On deleted: set status = 'canceled' or delete row
6. Test: trigger event in Stripe; verify DB updated

**Testing Checklist**: [ ] Events processed; [ ] DB updated correctly

### Sub-Step 4.3.3: Update Database on Subscription Changes
**File Path**: Webhook handler, subscriptions table  
**Purpose**: Keep subscriptions table in sync with Stripe

**Option A (Using AI Tools)**: *"In webhook handler, after getting subscription from event: upsert subscriptions table WHERE stripe_subscription_id = subscription.id. Set: status, plan_id, current_period_end, updated_at. Handle all statuses: active, canceled, past_due, incomplete."*

**Option B (Manual)**:
1. In webhook: const { data: subscription } = event.data.object
2. Upsert: supabase.from('subscriptions').upsert({ stripe_subscription_id: subscription.id, status: subscription.status, plan_id: ..., current_period_end: new Date(subscription.current_period_end * 1000), updated_at: new Date() }, { onConflict: 'stripe_subscription_id' })
3. Handle all statuses; log if status is unexpected
4. Test: change subscription in Stripe; verify webhook updates DB
5. Document: "DB is source of truth; webhook keeps it synced"

**Testing Checklist**: [ ] DB synced on all events; [ ] All statuses handled

### Sub-Step 4.3.4: Send Confirmation Emails
**File Path**: `lib/email/`, webhook handler  
**Purpose**: Email user when subscription changes

**Option A (Using AI Tools)**: *"Add email sending to webhook: on subscription.updated or canceled, get user email from DB. Send email via Resend or similar: 'Your subscription has been updated to [plan]' or 'Your subscription has been canceled'. Use email template component."*

**Option B (Manual)**:
1. Install Resend: `npm install resend` or use existing email service
2. Create lib/email/sendSubscriptionEmail.ts: sendSubscriptionUpdate(userEmail, plan, status)
3. In webhook: after DB update, get user email; call sendSubscriptionUpdate
4. Email templates: "Subscription Updated", "Subscription Canceled"
5. Test: trigger webhook; verify email sent
6. Handle email errors gracefully (log, don't fail webhook)

**Testing Checklist**: [ ] Email sent on update; [ ] Email sent on cancel

### Sub-Step 4.3.5: Test Webhook Locally with Stripe CLI
**File Path**: Terminal, Stripe CLI  
**Purpose**: Test webhook endpoint before deploying

**Option A (Using AI Tools)**: *"Install Stripe CLI. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe. This forwards Stripe events to local endpoint. Trigger test event: stripe trigger customer.subscription.created. Verify webhook receives event and updates DB."*

**Option B (Manual)**:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: stripe login
3. Forward events: stripe listen --forward-to localhost:3000/api/webhooks/stripe
4. Copy webhook signing secret; add to .env.local as STRIPE_WEBHOOK_SECRET
5. Trigger test: stripe trigger customer.subscription.created
6. Verify: check logs; verify DB updated
7. Test other events: updated, deleted
8. Document: "Use Stripe CLI for local testing"

**Testing Checklist**: [ ] CLI forwards events; [ ] Webhook processes events; [ ] DB updates

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 5: Polish & Deploy

#### Step 5.1: Error Handling

Implement comprehensive error handling throughout the application.

**Time Estimate**: 1–2 days  
**Prerequisites**: Core features implemented  
**Expected Outcome**: Error boundaries, form validation, API error handling, error pages, and logging

### Sub-Step 5.1.1: Create Global Error Boundaries
**File Path**: `app/error.tsx`, `app/global-error.tsx`  
**Purpose**: Catch React errors and show fallback UI

**Option A (Using AI Tools)**: *"Add Next.js error boundaries: app/error.tsx for route errors, app/global-error.tsx for root errors. Display user-friendly message, error details (dev only), and 'Try again' button. Log error to console or Sentry."*

**Option B (Manual)**:
1. Create app/error.tsx: export default function Error({ error, reset }) { return <div>Something went wrong. <button onClick={reset}>Try again</button></div> }
2. Create app/global-error.tsx for root errors (similar)
3. Log error: console.error(error) or Sentry.captureException(error)
4. Show error details only in development
5. Test: throw error in component; verify boundary catches it

**Testing Checklist**: [ ] Error boundary catches errors; [ ] Fallback UI shown

### Sub-Step 5.1.2: Add Form Validation with Error Messages
**File Path**: Forms, `lib/validations/`  
**Purpose**: Validate inputs and show clear error messages

**Option A (Using AI Tools)**: *"Ensure all forms use Zod validation with react-hook-form. Show field-level errors below inputs. Show form-level errors at top. Use consistent error styling (red text, border). Test with invalid data."*

**Option B (Manual)**:
1. Review all forms; ensure Zod schemas and react-hook-form
2. Add error display: {errors.fieldName && <span className="text-red-500">{errors.fieldName.message}</span>}
3. Style errors consistently
4. Test: submit invalid data; verify errors shown
5. Document validation rules

**Testing Checklist**: [ ] Validation errors shown; [ ] Messages clear

### Sub-Step 5.1.3: Implement API Error Handling
**File Path**: API routes, client fetch calls  
**Purpose**: Handle API errors gracefully

**Option A (Using AI Tools)**: *"In API routes: wrap logic in try/catch; return 500 with generic message (log full error). In client: catch fetch errors; show toast or inline message. Never expose stack traces to client."*

**Option B (Manual)**:
1. In API routes: try { ... } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal error' }, { status: 500 }) }
2. In client: catch fetch errors; show user-friendly message
3. Handle 400 (validation), 401 (auth), 403 (forbidden), 500 (server)
4. Test: trigger API error; verify user sees friendly message
5. Log errors server-side

**Testing Checklist**: [ ] API errors handled; [ ] User sees friendly messages

### Sub-Step 5.1.4: Create User-Friendly Error Pages
**File Path**: `app/not-found.tsx`, custom error pages  
**Purpose**: 404 and other error pages

**Option A (Using AI Tools)**: *"Create app/not-found.tsx: 404 page with message and link home. Add custom 500 page if needed. Style consistently with app. Add helpful links (home, support)."*

**Option B (Manual)**:
1. Create app/not-found.tsx: "Page not found" message, link to home
2. Style consistently
3. Test: visit invalid URL; verify 404 shown
4. Optional: add 500 page

**Testing Checklist**: [ ] 404 page works; [ ] Links functional

### Sub-Step 5.1.5: Add Error Logging
**File Path**: API routes, error boundaries  
**Purpose**: Log errors for debugging

**Option A (Using AI Tools)**: *"Add error logging: console.error in API routes and error boundaries. Optional: integrate Sentry (install @sentry/nextjs, configure, capture exceptions). Log with context (user_id, request_id)."*

**Option B (Manual)**:
1. Ensure console.error in all catch blocks
2. Optional: install Sentry; configure; capture exceptions
3. Add request context (user_id) to logs
4. Test: trigger error; verify logged
5. Document logging setup

**Testing Checklist**: [ ] Errors logged; [ ] Sentry works if configured

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 5.2: Performance

Optimize the application for performance.

**Time Estimate**: 1–2 days  
**Prerequisites**: Core features complete  
**Expected Outcome**: Optimized queries, caching, code splitting, image optimization, and good Lighthouse scores

### Sub-Step 5.2.1: Optimize Database Queries
**File Path**: API routes, Supabase queries  
**Purpose**: Add indexes and reduce N+1 queries

**Option A (Using AI Tools)**: *"Review all Supabase queries: add indexes on user_id, created_at. Fix N+1 queries (use .select() with joins or batch loads). Run EXPLAIN on slow queries. Document query patterns."*

**Option B (Manual)**:
1. Review queries; add indexes: (user_id), (user_id, created_at)
2. Fix N+1: batch loads or use joins
3. Test query performance
4. Document optimizations

**Testing Checklist**: [ ] Queries use indexes; [ ] No N+1 queries

### Sub-Step 5.2.2: Implement Caching Strategy
**File Path**: `lib/cache/`, React Query or SWR  
**Purpose**: Cache API responses and reduce DB calls

**Option A (Using AI Tools)**: *"Add caching: install @tanstack/react-query. Wrap API calls with useQuery (staleTime 5 min). For server: cache responses with revalidate (Next.js). Cache subscription status, user profile."*

**Option B (Manual)**:
1. Install @tanstack/react-query
2. Wrap API calls: const { data } = useQuery(['key'], fetcher, { staleTime: 5 * 60 * 1000 })
3. Cache subscription, profile data
4. Test: verify cache reduces API calls
5. Document cache strategy

**Testing Checklist**: [ ] Cache works; [ ] API calls reduced

### Sub-Step 5.2.3: Add Code Splitting for Routes
**File Path**: Next.js automatically handles this  
**Purpose**: Lazy load routes to reduce initial bundle

**Option A (Using AI Tools)**: *"Next.js App Router automatically code-splits. Verify: check build output (_next/static/chunks). Ensure dynamic imports for heavy components: const Heavy = dynamic(() => import('./Heavy'))."*

**Option B (Manual)**:
1. Verify build output shows chunks
2. Use dynamic() for heavy components: const Heavy = dynamic(() => import('./Heavy'), { loading: <Spinner /> })
3. Test: check Network tab; verify chunks load on demand
4. Document heavy components

**Testing Checklist**: [ ] Code splitting works; [ ] Chunks load on demand

### Sub-Step 5.2.4: Optimize Images
**File Path**: All image usage  
**Purpose**: Use Next.js Image component

**Option A (Using AI Tools)**: *"Replace all <img> with <Image> from next/image. Add width/height or fill. Use priority for above-fold images. Optimize image formats (WebP)."*

**Option B (Manual)**:
1. Find all <img> tags; replace with <Image>
2. Add width/height or fill prop
3. Use priority for hero images
4. Test: verify images optimized
5. Check Lighthouse image score

**Testing Checklist**: [ ] Images use Next.js Image; [ ] Lighthouse score improved

### Sub-Step 5.2.5: Run Lighthouse Audits and Fix Issues
**File Path**: Browser DevTools  
**Purpose**: Measure and improve performance

**Option A (Using AI Tools)**: *"Run Lighthouse audit (Chrome DevTools > Lighthouse). Fix issues: reduce unused JS, optimize images, add meta tags, improve LCP/FID/CLS. Target: 90+ performance score."*

**Option B (Manual)**:
1. Run Lighthouse on key pages
2. Fix issues: remove unused code, optimize images, add meta tags
3. Target: 90+ performance, accessibility, best practices
4. Re-run; verify improvements
5. Document optimizations

**Testing Checklist**: [ ] Lighthouse score 90+; [ ] Issues fixed

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 5.3: Security

Conduct a security audit and implement security best practices.

**Time Estimate**: 1–2 days  
**Prerequisites**: All features implemented  
**Expected Outcome**: RLS tested, input validation, secure API routes, rate limiting, and env review

### Sub-Step 5.3.1: Review and Test RLS Policies
**File Path**: Supabase Dashboard, tests  
**Purpose**: Verify RLS blocks cross-user access

**Option A (Using AI Tools)**: *"Test RLS: as User A, try to read/update User B's data via Supabase client. Should fail. Review all policies: ensure every table has RLS enabled and policies use auth.uid(). Document any exceptions."*

**Option B (Manual)**:
1. List all tables; verify RLS enabled
2. Test: User A tries to access User B's data; expect failure
3. Review policies; ensure auth.uid() checks
4. Fix any gaps
5. Document RLS summary

**Security Considerations**: RLS is critical; any gap is a vulnerability  
**Testing Checklist**: [ ] RLS blocks cross-user access; [ ] All tables protected

### Sub-Step 5.3.2: Validate All User Inputs
**File Path**: API routes, forms  
**Purpose**: Use Zod for all inputs

**Option A (Using AI Tools)**: *"Audit all API routes and forms: ensure every input uses Zod validation. Check: body params, query params, path params. Reject invalid input with 400. Document validation rules."*

**Option B (Manual)**:
1. List all API routes; check for Zod validation
2. Add validation where missing
3. Test: send invalid data; expect 400
4. Document validation rules

**Security Considerations**: Never trust client input  
**Testing Checklist**: [ ] All inputs validated; [ ] Invalid data rejected

### Sub-Step 5.3.3: Secure API Routes with Authentication Checks
**File Path**: All API routes  
**Purpose**: Verify user is authenticated

**Option A (Using AI Tools)**: *"Review all API routes: ensure each checks authentication (getUser() or requireAuth()). Return 401 if not authenticated. Verify user_id in queries (never trust client)."*

**Option B (Manual)**:
1. List all API routes; check for auth
2. Add auth check where missing: const { data: { user } } = await supabase.auth.getUser(); if (!user) return 401
3. Ensure user_id from session, not body
4. Test: call API without auth; expect 401

**Security Considerations**: Always verify auth server-side  
**Testing Checklist**: [ ] All routes protected; [ ] 401 on unauthenticated

### Sub-Step 5.3.4: Add Rate Limiting
**File Path**: API routes, middleware  
**Purpose**: Prevent abuse

**Option A (Using AI Tools)**: *"Add rate limiting: use Upstash Redis or similar. Limit: 100 requests per user per minute. Apply to auth routes (login, signup) and API routes. Return 429 with Retry-After on limit."*

**Option B (Manual)**:
1. Install rate limit library or use Upstash
2. Add middleware or route-level limit
3. Limit: 100/min per user (or IP for public routes)
4. Return 429 on limit
5. Test: make many requests; verify limit enforced

**Testing Checklist**: [ ] Rate limit enforced; [ ] 429 returned

### Sub-Step 5.3.5: Review Environment Variables and Secrets
**File Path**: `.env.local`, `.env.example`  
**Purpose**: Ensure secrets are secure

**Option A (Using AI Tools)**: *"Review .env files: ensure .env.local in .gitignore. Check .env.example has placeholders (no real keys). Verify production secrets in Vercel (not in code). Document required env vars."*

**Option B (Manual)**:
1. Verify .env.local in .gitignore
2. Check .env.example has placeholders
3. Document required vars in README
4. Verify production secrets in Vercel
5. Never commit secrets

**Security Considerations**: Secrets must never be in git  
**Testing Checklist**: [ ] .env.local not committed; [ ] Production secrets secure

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 5.4: Deployment

Deploy the application to production.

**Time Estimate**: 1 day  
**Prerequisites**: All previous steps complete; Vercel account  
**Expected Outcome**: App deployed to production; env vars set; monitoring configured

### Sub-Step 5.4.1: Set Up Production Environment Variables in Vercel
**File Path**: Vercel Dashboard  
**Purpose**: Add all required env vars

**Option A (Using AI Tools)**: *"In Vercel project settings > Environment Variables, add all vars from .env.local: Supabase URL/key, Stripe keys, webhook secret, etc. Use Production environment. Document which vars are needed."*

**Option B (Manual)**:
1. Go to Vercel project > Settings > Environment Variables
2. Add each var from .env.local (Supabase, Stripe, etc.)
3. Set environment to Production
4. Verify all vars added
5. Document in README

**Testing Checklist**: [ ] All vars added; [ ] Production environment set

### Sub-Step 5.4.2: Configure Supabase for Production
**File Path**: Supabase Dashboard  
**Purpose**: Update redirect URLs and settings

**Option A (Using AI Tools)**: *"In Supabase Dashboard: Authentication > URL Configuration, add production URL to Site URL and Redirect URLs. Update RLS if needed for production. Test connection from production."*

**Option B (Manual)**:
1. Update Site URL to production domain
2. Add redirect URLs (production domain)
3. Verify RLS policies
4. Test auth from production
5. Document production config

**Testing Checklist**: [ ] Supabase configured; [ ] Auth works in production

### Sub-Step 5.4.3: Deploy to Vercel
**File Path**: GitHub, Vercel  
**Purpose**: Deploy app

**Option A (Using AI Tools)**: *"Push code to GitHub. In Vercel, import repository (or connect existing). Vercel will auto-detect Next.js. Deploy. Verify build succeeds. Check deployment URL."*

**Option B (Manual)**:
1. Push code to GitHub
2. In Vercel: Import repository or connect existing
3. Vercel auto-detects Next.js; deploy
4. Verify build succeeds
5. Check deployment URL works

**Testing Checklist**: [ ] Deployed; [ ] Build succeeds; [ ] App accessible

### Sub-Step 5.4.4: Set Up Monitoring and Error Tracking
**File Path**: Sentry or similar  
**Purpose**: Monitor production errors

**Option A (Using AI Tools)**: *"If using Sentry: configure production DSN in Vercel env. Verify errors appear in Sentry dashboard. Set up alerts for critical errors. Optional: add uptime monitoring."*

**Option B (Manual)**:
1. Configure Sentry DSN in Vercel env
2. Verify errors appear in Sentry
3. Set up alerts
4. Test: trigger error; verify in Sentry
5. Document monitoring setup

**Testing Checklist**: [ ] Monitoring configured; [ ] Errors tracked

### Sub-Step 5.4.5: Test Production Deployment Thoroughly
**File Path**: Production URL  
**Purpose**: Verify everything works

**Option A (Using AI Tools)**: *"Test production: visit all pages, test auth (signup, login), test core features, test payments (use Stripe test mode), check mobile. Fix any issues. Document known issues."*

**Option B (Manual)**:
1. Test all pages load
2. Test auth flows
3. Test core features
4. Test payments (test mode)
5. Test mobile
6. Fix issues
7. Document test results

**Testing Checklist**: [ ] All features work; [ ] Mobile works; [ ] Payments work

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

## AI-Assisted Development Workflow

### How AI Can Help Your Development

Whether you're new to programming or an experienced developer, AI tools can accelerate your workflow:

**For Non-Technical Users**:
- AI can handle code generation, implementation, and debugging
- You provide vision, make decisions, and review the work
- AI follows best practices and coding standards automatically

**For Technical Users**:
- AI assists with boilerplate code, suggestions, and repetitive tasks
- You maintain control over architecture and implementation
- AI helps you learn new technologies faster and debug issues

### Effective AI Prompting (for Non-Technical Users)

**Good prompts**:
- *"Create a subscription management page where users can see their current plan, upgrade to Pro, or cancel. Make it clear which features are included in each tier."*
- *"Set up Supabase authentication with email and password. Create login and signup pages that look professional."*
- *"Help me design a database schema for tracking user subscriptions and feature usage."*

**Less effective prompts**:
- *"Do the database thing"* (too vague)
- *"Make it work"* (doesn't specify what needs to work)
- *"Add subscriptions"* (not specific enough about requirements)

### When to Provide More Detail

Provide more detail when:
- You have specific feature requirements
- You want particular user flows
- You have design preferences
- You need specific integrations

Let AI or your own expertise handle:
- Technical implementation details
- Code structure and organization
- Best practices and optimizations
- Security and error handling approaches

## Success Criteria

Your Level 2 implementation is complete when you can verify:

1. ✅ Users can sign up and log in securely
2. ✅ User data is stored securely in Supabase
3. ✅ Core product features are functional
4. ✅ Subscriptions work end-to-end (signup, upgrade, downgrade, cancel)
5. ✅ Webhooks update database correctly when subscriptions change
6. ✅ Application is deployed and accessible in production
7. ✅ Performance is optimized (fast page loads, efficient queries)
8. ✅ Security best practices are implemented (RLS, input validation, etc.)

**Note**: Focus on whether the application works well for your users. If using AI tools, they can help with performance optimization and security. If coding manually, consider running security audits and performance tests.

## Next Steps

After completing Level 2:

1. Monitor your application - watch for user signups, subscriptions, and usage
2. Gather feedback from early users
3. Iterate on features based on feedback (use AI tools if helpful)
4. Scale infrastructure as you grow
5. Consider upgrading to Level 3 for advanced features (multi-tenancy, AI integration, enterprise capabilities)

## Resources

### AI Prompts (for non-technical users)
- [Web Apps Level 2 AI Prompts](web-apps-level-2-ai-prompts.md) - Ready-to-use prompts for each step. Download this file and copy-paste prompts directly into your AI tool.

### Documentation
Reference documentation for the technologies used:
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [Supabase Documentation](https://supabase.com/docs) - Database and authentication guide
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) - Subscription integration guide
- [Vercel Documentation](https://vercel.com/docs) - Deployment guide

## Troubleshooting

If you encounter issues:

**Option A (Using AI Tools)**: 
1. Describe the problem clearly to your AI tool: "When I try to create a subscription, I see an error message that says..."
2. Show AI any error messages: Copy and paste error text
3. Ask AI to explain: "Can you explain what this error means and how to fix it?"
4. Request step-by-step help: "Walk me through fixing this issue"

**Option B (Manual)**: 
1. Check browser console for error messages
2. Review the troubleshooting guide: `web-apps-level-2-troubleshooting-debugging-guide.md`
3. Check documentation for the specific technology causing issues
4. Verify environment variables and configuration are correct
5. Review Supabase logs and Stripe webhook logs

Common issues and solutions are covered in the troubleshooting guide. Refer to `web-apps-level-2-troubleshooting-debugging-guide.md` for detailed help.

---

**Remember**: Whether you're coding yourself or using AI tools, focus on clear communication, making informed decisions, and thoroughly testing your application. Level 2 is about building a real SaaS product - take time to understand the architecture and make it scalable. This foundation will support your growth to Level 3!
