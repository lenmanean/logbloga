# Web Apps Level 2: AI Prompts for Implementation

## How to Use This File

**IMPORTANT UPDATE**: The Web Apps Level 2 implementation plan has been enhanced with detailed sub-steps. Each major step now includes 5-10 sub-steps with specific **Option A (Using AI Tools)** prompts that are more detailed and comprehensive than the prompts in this file.

**Recommended Approach**: 
1. Refer to the enhanced [Web Apps Level 2 Implementation Plan](web-apps-level-2-plan.md) for the most up-to-date, detailed prompts
2. Each sub-step in the plan includes an **Option A (Using AI Tools)** prompt that you can copy directly
3. These enhanced prompts include specific file paths, code structure examples, security considerations, and testing checklists

**This file** contains simplified prompts for quick reference, but the enhanced plan provides more comprehensive guidance.

---

## Quick Reference Prompts

For detailed, step-by-step prompts with file paths and implementation details, please refer to the enhanced implementation plan. Below are simplified prompts for quick reference:

---

## Phase 1: Project Setup

### Step 1.1: Initialize Next.js SaaS Project

**When to use**: At the start of Phase 1, when setting up your SaaS project for the first time.

**Prompt to paste into your AI tool**:
```
Create a new Next.js SaaS project with TypeScript and Tailwind CSS. Name it 'my-saas-app'. Use the latest version of Next.js with the App Router. Set up the project structure for a SaaS application with authentication and database integration. Install Supabase client libraries (@supabase/supabase-js and @supabase/ssr) and configure the basic project structure. After creating the project, start the development server so I can verify it's working at http://localhost:3000.
```

**What the AI will do**:
- Initialize Next.js project with TypeScript and Tailwind CSS
- Set up the project structure with App Router
- Install Supabase client libraries
- Configure basic project structure for SaaS
- Start the development server
- Guide you through verification

---

### Step 1.2: Set Up Supabase

**When to use**: After creating your Next.js project, when you're ready to connect it to Supabase.

**Before using this prompt**: Create a Supabase project at supabase.com and get your Supabase URL and anon key from the dashboard.

**Prompt to paste into your AI tool** (replace `[your-url]` and `[your-key]` with your actual Supabase credentials):
```
I've created a Supabase project. Help me configure the Supabase client in this Next.js project. My Supabase URL is [your-url] and my anon key is [your-key]. Set up both client-side and server-side Supabase clients following Next.js App Router best practices. Create the necessary configuration files and environment variable setup.
```

**What the AI will do**:
- Create Supabase client configuration files
- Set up environment variables for Supabase URL and keys
- Create client-side Supabase client
- Create server-side Supabase client
- Test the connection
- Explain how to use the clients

---

### Step 1.3: Design Database Schema

**When to use**: After setting up Supabase, when you're ready to design your database schema.

**Before using this prompt**: Think about what core features your SaaS product will have and what data you need to store.

**Prompt to paste into your AI tool** (customize with your specific features):
```
Help me design a database schema for my SaaS application. I need tables for: users (with profiles linked to Supabase auth), subscriptions (linked to Stripe customer IDs), and [describe your core features - e.g., projects, tasks, documents, etc.]. Create the SQL migration files with proper relationships, indexes, and set up Row Level Security (RLS) policies to ensure users can only access their own data.
```

**What the AI will do**:
- Design database schema with proper relationships
- Create SQL migration files
- Set up Row Level Security policies
- Add appropriate indexes for performance
- Explain the schema structure
- Guide you on running migrations

---

## Phase 2: Authentication

### Step 2.1: Implement Supabase Auth

**When to use**: After setting up your database schema, when you're ready to add user authentication.

**Prompt to paste into your AI tool**:
```
Set up Supabase authentication in this Next.js project. Create login and signup pages with email and password authentication. Implement session management using Supabase auth, add protected route middleware that requires authentication, and create an authentication context/provider for managing user state throughout the application.
```

**What the AI will do**:
- Create login page component
- Create signup page component
- Set up Supabase auth session management
- Create protected route middleware
- Create authentication context/provider
- Handle authentication state
- Guide you through testing

---

### Step 2.2: User Profile

**When to use**: After implementing authentication, when you're ready to add user profile functionality.

**Prompt to paste into your AI tool**:
```
Create a user profile page where users can view and edit their profile information. Include fields for name, email, and avatar upload. Implement avatar upload to Supabase Storage. Make it look professional and user-friendly with proper form validation and error handling.
```

**What the AI will do**:
- Create user profile page component
- Add profile editing functionality
- Implement avatar upload to Supabase Storage
- Connect to Supabase user metadata
- Add form validation
- Create user settings page
- Handle errors gracefully

---

## Phase 3: Core Features

### Step 3.1: Main Product Features

**When to use**: After setting up authentication, when you're ready to implement your core SaaS features.

**Before using this prompt**: Have a clear idea of what your main product features are (e.g., project management, content creation, analytics, etc.).

**Prompt to paste into your AI tool** (customize with your specific features):
```
Help me implement the main features of my SaaS product. The core functionality should include: [describe your main features - e.g., users can create and manage projects, add tasks to projects, collaborate with team members, etc.]. Create the necessary database tables, API routes for data operations, and UI components. Add proper data validation and error handling.
```

**What the AI will do**:
- Create database tables for your features
- Build API routes for CRUD operations
- Create UI components for features
- Add data validation
- Implement error handling
- Set up proper relationships between data
- Guide you through testing

---

### Step 3.2: User Management

**When to use**: After implementing core features, when you're ready to add user management and access control.

**Prompt to paste into your AI tool**:
```
Create a user dashboard that shows [describe what users should see - e.g., overview of their projects, recent activity, subscription status, etc.]. Add feature access control based on subscription tier, usage tracking to monitor how much users are using features, and activity logs to track user actions. Also create a basic admin panel for managing users.
```

**What the AI will do**:
- Create user dashboard page
- Implement feature access control based on subscription
- Add usage tracking system
- Create activity logging
- Build basic admin panel
- Set up role-based access control
- Guide you through testing

---

## Phase 4: Subscriptions

### Step 4.1: Stripe Subscription Setup

**When to use**: After implementing core features, when you're ready to add subscription functionality.

**Before using this prompt**: Create subscription products in your Stripe Dashboard with pricing tiers (e.g., Basic, Pro, Enterprise).

**Prompt to paste into your AI tool** (replace with your pricing tiers):
```
Set up Stripe subscription integration for this SaaS application. I have 3 pricing tiers: Basic ($29/month), Pro ($79/month), and Enterprise ($199/month). Create the checkout flow using Stripe Checkout, handle subscription creation, link Stripe customer IDs to user accounts in the database, and update user subscription status when subscriptions are created.
```

**What the AI will do**:
- Create Stripe Checkout integration
- Set up subscription creation flow
- Link Stripe customers to user accounts
- Update database with subscription information
- Create subscription status management
- Handle subscription metadata
- Guide you through testing

---

### Step 4.2: Subscription Management

**When to use**: After setting up subscriptions, when you're ready to let users manage their subscriptions.

**Prompt to paste into your AI tool**:
```
Create a subscription management page where users can view their current plan, see what features are included in their tier, upgrade or downgrade to different tiers, and cancel their subscription. Make it clear and easy to use with proper handling of proration when changing plans.
```

**What the AI will do**:
- Create subscription status page
- Implement upgrade/downgrade flows
- Add cancel subscription functionality
- Handle proration for plan changes
- Create billing history page
- Update feature access when plans change
- Guide you through testing

---

### Step 4.3: Webhooks

**When to use**: After setting up subscriptions, when you need to keep your database in sync with Stripe events.

**Before using this prompt**: Set up a Stripe webhook endpoint URL in your Stripe Dashboard (you'll need your deployed URL or use Stripe CLI for local testing).

**Prompt to paste into your AI tool**:
```
Set up a webhook endpoint at /api/webhooks/stripe to handle Stripe subscription events. When a subscription is created, updated, canceled, or payment fails, update the user's subscription status in the database accordingly. Send confirmation emails when subscriptions change. Make sure to verify webhook signatures for security.
```

**What the AI will do**:
- Create webhook endpoint
- Handle Stripe subscription events
- Update database on subscription changes
- Verify webhook signatures
- Send confirmation emails
- Handle errors gracefully
- Guide you through testing with Stripe CLI

---

## Phase 5: Polish & Deploy

### Step 5.1: Error Handling

**When to use**: Before deployment, to ensure your application handles errors gracefully.

**Prompt to paste into your AI tool**:
```
Add comprehensive error handling to this application. Include global error boundaries for React components, form validation with clear error messages, API error handling that provides user-friendly messages, and error pages for common error scenarios (404, 500, etc.).
```

**What the AI will do**:
- Create global error boundaries
- Add form validation with error messages
- Implement API error handling
- Create error pages
- Add error logging
- Make error messages user-friendly
- Guide you through testing

---

### Step 5.2: Performance

**When to use**: Before deployment, to optimize your application's performance.

**Prompt to paste into your AI tool**:
```
Help me optimize this application for performance. Review database queries and add indexes where needed, implement caching strategy using React Query or SWR, add code splitting for routes to reduce bundle size, and optimize images using Next.js Image component. Run a performance audit and fix any issues.
```

**What the AI will do**:
- Review and optimize database queries
- Add database indexes
- Implement caching strategy
- Add code splitting
- Optimize images
- Run performance audits
- Fix performance issues
- Guide you through improvements

---

### Step 5.3: Security

**When to use**: Before deployment, to ensure your application is secure.

**Prompt to paste into your AI tool**:
```
Review the security of this application. Check that Row Level Security policies in Supabase are properly configured and tested, validate all user inputs using Zod or similar, secure all API routes with authentication checks, and add rate limiting to prevent abuse. Review environment variables and ensure secrets are properly secured.
```

**What the AI will do**:
- Review RLS policies
- Test data isolation
- Add input validation
- Secure API routes
- Add rate limiting
- Review security best practices
- Guide you through security improvements

---

### Step 5.4: Deployment

**When to use**: When you're ready to deploy your application to production.

**Before using this prompt**: Make sure all your code is committed and pushed to GitHub.

**Prompt to paste into your AI tool**:
```
Help me prepare this application for production deployment to Vercel. Ensure all environment variables are documented in a .env.example file, the build succeeds without errors, all sensitive files are in .gitignore, and everything is ready for deployment. Also set up error tracking with Sentry or similar service.
```

**What the AI will do**:
- Review environment variables
- Create .env.example file
- Verify build succeeds
- Check .gitignore
- Set up error tracking
- Prepare for deployment
- Guide you through Vercel deployment

---

## Additional Helpful Prompts

### General Error Fixing

**When to use**: Whenever you encounter an error or issue.

**Prompt to paste into your AI tool** (describe the specific error):
```
I'm getting this error: [paste error message here]

Can you explain what this error means and help me fix it? Show me the specific steps to resolve it.
```

### Code Review and Optimization

**When to use**: When you want your AI assistant to review and improve existing code.

**Prompt to paste into your AI tool**:
```
Review the [component/file name] and suggest improvements for:
1. Code quality and best practices
2. Performance optimization
3. Security considerations
4. User experience
5. Accessibility

Implement any critical improvements.
```

### Adding New Features

**When to use**: When you want to add functionality beyond the basic implementation.

**Prompt to paste into your AI tool** (describe the feature):
```
I want to add [feature description] to my SaaS application. Help me implement this feature following the same patterns and best practices used in the rest of the codebase. Make sure it integrates well with the existing authentication, subscription system, and database structure.
```

### Database Query Optimization

**When to use**: When you notice slow database queries or want to optimize data fetching.

**Prompt to paste into your AI tool**:
```
Help me optimize this database query: [paste query or describe the slow operation]. Review it for performance issues, suggest indexes if needed, and optimize it to run faster.
```

### Subscription Feature Access

**When to use**: When you need to implement feature gating based on subscription tiers.

**Prompt to paste into your AI tool**:
```
Help me implement feature access control based on subscription tiers. Users on the Basic plan should have access to [list features], Pro plan users should have access to [list features], and Enterprise users should have access to [list features]. Create a system to check subscription tiers and restrict access accordingly.
```

---

## Tips for Using These Prompts

1. **Copy the entire prompt**: Don't edit it unless you need to add specific information (like API keys, feature lists, or pricing tiers)
2. **Provide context**: If your AI assistant asks for clarification, provide additional details about your specific needs
3. **Review the output**: Always review what the AI creates and test it before moving to the next step
4. **Ask for help**: If something doesn't work, paste the error message and ask for help
5. **Customize when needed**: Feel free to modify prompts to match your specific product or design preferences

---

**Remember**: These prompts are designed to work with AI tools as your coding assistant. You're the director - provide vision, make decisions, and review the work. The AI handles all the technical implementation!
