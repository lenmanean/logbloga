# Web Apps Level 3: AI Prompts for Implementation

## How to Use This File

**IMPORTANT UPDATE**: The Web Apps Level 3 implementation plan has been enhanced with detailed sub-steps. Each major step now includes 5-10 sub-steps with specific **Option A (Using AI Tools)** prompts that are more detailed and comprehensive than the prompts in this file.

**Recommended Approach**: 
1. Refer to the enhanced [Web Apps Level 3 Implementation Plan](web-apps-level-3-plan.md) for the most up-to-date, detailed prompts
2. Each sub-step in the plan includes an **Option A (Using AI Tools)** prompt that you can copy directly
3. These enhanced prompts include specific file paths, code structure examples, security considerations, and testing checklists
4. **Step 4.2 (Enterprise Support)** has been fully overhauled with 10 detailed sub-steps

**This file** contains simplified prompts for quick reference, but the enhanced plan provides more comprehensive guidance.

---

## Quick Reference Prompts

For detailed, step-by-step prompts with file paths and implementation details, please refer to the enhanced implementation plan. Below are simplified prompts for quick reference:

---

## Phase 1: Advanced Architecture

### Step 1.1: Database Architecture

**When to use**: At the start of Phase 1, when setting up the multi-tenant database architecture.

**Before using this prompt**: Think about your multi-tenant requirements - how organizations will be structured, what data needs isolation, etc.

**Prompt to paste into your AI tool**:
```
Help me design a multi-tenant database schema for my enterprise SaaS platform. Each organization (tenant) should have completely isolated data. Users can belong to multiple organizations and switch between them. Create SQL migrations with proper tenant isolation, set up advanced Row Level Security (RLS) policies to ensure data isolation, create database functions for tenant operations, implement an audit logging system, and optimize the database for scale with proper indexes and partitioning strategies.
```

**What the AI will do**:
- Design multi-tenant schema with proper isolation
- Create SQL migration files
- Set up advanced RLS policies
- Create database functions
- Implement audit logging
- Add performance optimizations
- Guide you through testing isolation

---

### Step 1.2: AI Integration Framework

**When to use**: After setting up the database, when you're ready to integrate AI capabilities.

**Before using this prompt**: Get your OpenAI API key and Anthropic API key from their respective dashboards.

**Prompt to paste into your AI tool** (replace with your API keys):
```
Create an AI integration framework for this application. Set up OpenAI API client with API key [your-openai-key], set up Anthropic API client with API key [your-anthropic-key], create a service abstraction layer that can switch between providers, implement a prompt management system for storing and versioning prompts, and add feature flags for AI features so we can gradually roll them out.
```

**What the AI will do**:
- Set up OpenAI API client
- Set up Anthropic API client
- Create AI service abstraction layer
- Implement prompt management
- Add feature flags
- Handle rate limits and errors
- Guide you through testing

---

### Step 1.3: Multi-Tenant Architecture

**When to use**: After setting up the database schema, when you're ready to implement multi-tenant functionality in the application.

**Prompt to paste into your AI tool**:
```
Implement multi-tenant architecture for this SaaS platform. Each organization should have complete data isolation. Users can belong to multiple organizations and switch between them. Create tenant context management in the application, set up tenant switching functionality with a UI component, implement tenant management system for creating and managing organizations, and test data isolation to ensure users can only access data from organizations they belong to.
```

**What the AI will do**:
- Implement tenant context system
- Create tenant switching UI
- Set up tenant management
- Ensure data isolation
- Test tenant boundaries
- Handle multi-tenant queries
- Guide you through testing

---

## Phase 2: AI Features

### Step 2.1: AI-Powered Features

**When to use**: After setting up the AI integration framework, when you're ready to add AI-powered features to your platform.

**Before using this prompt**: Have a clear idea of what AI features you want (content generation, analysis, recommendations, chat, etc.).

**Prompt to paste into your AI tool** (customize with your specific AI features):
```
Implement AI-powered features for this platform. Add AI content generation capabilities, AI analysis features that can analyze user data and provide insights, AI recommendations system, an AI chat interface for users to interact with AI, and AI customization options. Make sure all AI features are integrated with the multi-tenant architecture so each organization's AI usage is tracked and isolated.
```

**What the AI will do**:
- Implement AI content generation
- Add AI analysis features
- Create AI recommendation system
- Build AI chat interface
- Add AI customization
- Integrate with multi-tenant system
- Track AI usage per organization
- Guide you through testing

---

### Step 2.2: Workflow Automation

**When to use**: After implementing AI features, when you're ready to add workflow automation.

**Prompt to paste into your AI tool**:
```
Create a workflow automation system for this platform. Build a workflow builder UI where users can visually create workflows, implement a trigger system (time-based, event-based, webhook-based), create an action system (send email, update data, call API, etc.), and build a system to execute workflows. Add testing capabilities so users can test their automations before activating them.
```

**What the AI will do**:
- Design automation system architecture
- Create workflow builder UI
- Implement trigger system
- Build action system
- Create workflow execution engine
- Add testing capabilities
- Handle errors and retries
- Guide you through testing

---

## Phase 3: Enterprise Features

### Step 3.1: Advanced Integrations

**When to use**: After implementing core features, when you're ready to add third-party integrations.

**Before using this prompt**: Think about what third-party services you want to integrate with (Slack, Zapier, webhooks, etc.).

**Prompt to paste into your AI tool** (customize with your integrations):
```
Set up an API gateway and integration system for this platform. Create a webhook system for both incoming and outgoing webhooks, implement OAuth integrations for [list services you want to integrate - e.g., Slack, Google Workspace, etc.], add data sync capabilities to keep data in sync with third-party services, and build an integration marketplace UI where users can discover and connect integrations.
```

**What the AI will do**:
- Set up API gateway
- Create webhook system
- Implement OAuth integrations
- Add data sync capabilities
- Build integration marketplace
- Handle authentication for integrations
- Guide you through testing

---

### Step 3.2: Enterprise Security

**When to use**: When you're ready to add enterprise security features like SSO and advanced permissions.

**Before using this prompt**: If implementing SSO, you'll need to set up your identity provider (Okta, Auth0, etc.) or use Supabase's SSO features.

**Prompt to paste into your AI tool**:
```
Implement enterprise security features for this platform. Add SSO integration supporting both SAML and OAuth protocols, create an advanced permissions system with fine-grained access control, build a role management UI for creating and assigning roles, set up comprehensive audit logging to track all user actions, and add compliance features for GDPR and SOC2 considerations.
```

**What the AI will do**:
- Implement SSO integration (SAML/OAuth)
- Create advanced permissions system
- Build role management system
- Set up audit logging
- Add compliance features
- Test security measures
- Guide you through configuration

---

## Phase 4: Scale & Deploy

### Step 4.1: Performance

**When to use**: Before deployment, to optimize your platform for performance and scale.

**Prompt to paste into your AI tool**:
```
Help me optimize this platform for performance and scale. Review all database queries and add indexes where needed, implement a comprehensive caching strategy using Redis or similar, configure CDN for static assets, optimize all API routes for performance, and run load testing to identify bottlenecks. Fix any performance issues found.
```

**What the AI will do**:
- Review and optimize database queries
- Add database indexes
- Implement caching strategy
- Configure CDN
- Optimize API routes
- Run load testing
- Fix performance bottlenecks
- Guide you through improvements

---

### Step 4.2: Enterprise Support

**When to use**: Before deployment, to add enterprise support features.

**Prompt to paste into your AI tool**:
```
Create enterprise support features for this platform. Build a comprehensive admin dashboard for managing organizations, users, and system settings. Add support tools for customer management, implement monitoring and alerting using Sentry or Datadog, set up error tracking and logging, and create comprehensive enterprise documentation for onboarding and support.
```

**What the AI will do**:
- Create admin dashboard
- Add support tools
- Implement monitoring
- Set up alerting
- Add error tracking
- Create documentation
- Guide you through setup

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
4. Scalability
5. Multi-tenant isolation

Implement any critical improvements.
```

### Adding New Features

**When to use**: When you want to add functionality beyond the basic implementation.

**Prompt to paste into your AI tool** (describe the feature):
```
I want to add [feature description] to my enterprise SaaS platform. Help me implement this feature following the same patterns and best practices used in the rest of the codebase. Make sure it integrates well with the existing multi-tenant architecture, AI integration framework, and enterprise security features.
```

### Multi-Tenant Data Isolation

**When to use**: When you need to ensure data is properly isolated between tenants.

**Prompt to paste into your AI tool**:
```
Help me verify and fix data isolation in this multi-tenant application. Review all database queries to ensure they properly filter by tenant ID, test that users from one organization cannot access data from another organization, and fix any data leakage issues found.
```

### AI Feature Implementation

**When to use**: When you want to add a new AI-powered feature.

**Prompt to paste into your AI tool** (describe the AI feature):
```
Help me implement an AI feature that [describe what the AI should do]. Use the existing AI integration framework, make sure it works with the multi-tenant architecture, track AI usage per organization, and add proper error handling and rate limiting.
```

### Enterprise Integration

**When to use**: When you need to integrate with an enterprise service.

**Prompt to paste into your AI tool** (describe the integration):
```
Help me integrate [service name] with this platform. Set up the OAuth flow, create the necessary API routes, sync data between the services, and make sure the integration works with the multi-tenant architecture.
```

---

## Tips for Using These Prompts

1. **Copy the entire prompt**: Don't edit it unless you need to add specific information (like API keys, service names, or feature descriptions)
2. **Provide context**: If your AI assistant asks for clarification, provide additional details about your specific needs
3. **Review the output**: Always review what the AI creates and test it before moving to the next step
4. **Ask for help**: If something doesn't work, paste the error message and ask for help
5. **Customize when needed**: Feel free to modify prompts to match your specific product, integrations, or design preferences
6. **Test thoroughly**: Enterprise features require thorough testing - always test multi-tenant isolation, security, and performance

---

**Remember**: These prompts are designed to work with AI tools as your coding assistant. You're the director - provide vision, make decisions, and review the work. The AI handles all the technical implementation. Level 3 is about building a platform, so focus on architecture, scalability, and enterprise needs!
