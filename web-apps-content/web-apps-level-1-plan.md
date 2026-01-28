# Web Apps Level 1: Landing Page / Simple Web App Implementation Plan

## Overview

This implementation plan guides you through building a simple single-page application or landing page SaaS with Stripe payment integration. Whether you're coding yourself or using AI tools to assist, this plan provides a clear roadmap to success.

**AI-Assisted Development**: If you're using AI tools (like Cursor, ChatGPT, or GitHub Copilot), they can significantly accelerate development, reducing build time from 6-8 weeks to 2-4 weeks. AI tools can handle code generation, provide suggestions, and assist with debugging.

**Traditional Development**: If you prefer to code manually, this plan provides all the steps and technical details you need. You can still use AI tools for assistance with specific tasks, boilerplate code, or when you get stuck.

**Expected Outcome**: A functional, deployed web application with payment processing that can generate $500-$2,000/month in revenue.

## Prerequisites

Before starting, ensure you have:

- A **GitHub account** (free tier is sufficient)
- A **Vercel account** (free tier is sufficient)
- A **Stripe account** (test mode to start)
- **Node.js 18+ installed** (or use AI tools to help with installation)
- A code editor (VS Code, Cursor, or your preferred editor)
- Basic computer skills (opening applications, using a web browser)

**AI Tools (Optional but Recommended)**: AI tools like Cursor, ChatGPT, or GitHub Copilot can significantly accelerate development. If you're new to programming or want to speed up your workflow, consider using one of these tools.

**AI Prompts Available (for non-technical users)**: If you're using AI tools like Cursor to build your application, download the [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) file for ready-to-use prompts you can copy and paste into your AI tool for each step.

## Milestones

### Milestone 1: Project Foundation (Days 1-3)
- [ ] Initialize Next.js project
- [ ] Set up GitHub repository
- [ ] Configure development environment
- [ ] Review basic project structure

### Milestone 2: Core Features (Days 4-7)
- [ ] Design and implement landing page
- [ ] Set up Stripe account and configure API keys
- [ ] Integrate Stripe payment processing
- [ ] Create payment success/failure pages

### Milestone 3: Polish & Testing (Days 8-10)
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Test payment flows thoroughly
- [ ] Optimize performance

### Milestone 4: Deployment (Days 11-12)
- [ ] Prepare project for Vercel deployment
- [ ] Configure environment variables
- [ ] Test production deployment
- [ ] Optionally set up custom domain

### Milestone 5: Launch (Days 13-14)
- [ ] Complete final testing
- [ ] Complete launch checklist
- [ ] Go live!

## Working with AI Tools

AI tools can significantly accelerate your development process, whether you're new to programming or an experienced developer. Here's how to effectively incorporate AI into your workflow.

### For Non-Technical Users

If you're using AI tools as your primary development method:

**Effective Communication with AI**:
- **Be Specific**: Instead of "make it better," say "make the button larger and change the color to blue"
- **Provide Context**: Share your vision and goals. For example: "I want a landing page that converts visitors into paying customers"
- **Give Feedback**: Review what AI creates and provide specific feedback: "The headline is good, but make it more compelling"
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
For each step in this implementation plan, we've created ready-to-use prompts you can copy and paste directly into your AI tool. Download the [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) file to have all prompts in one place. These prompts are designed to save you time and ensure clear, effective communication with AI tools.

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

### Phase 1: Project Setup (Days 1-3)

#### Step 1.1: Initialize Next.js Project

**Time Estimate**: 30 minutes  
**Prerequisites**: Node.js 18+ installed  
**Expected Outcome**: Next.js project with TypeScript and Tailwind CSS running locally

### Sub-Step 1.1.1: Create Next.js Project
**File Path**: Project root (e.g. `my-saas-app/`)  
**Purpose**: Bootstrap Next.js with TypeScript and Tailwind

**Option A (Using AI Tools)**: *"Create a new Next.js project named my-saas-app with TypeScript, Tailwind CSS, and App Router. Use the latest create-next-app."*

**Option B (Manual)**:
1. Run: `npx create-next-app@latest my-saas-app --typescript --tailwind --app`
2. Choose options: TypeScript Yes, ESLint Yes, Tailwind Yes, App Router, src/ No, import alias @/*
3. Wait for installation
4. `cd my-saas-app`

**Testing Checklist**: [ ] Project created; [ ] No errors

### Sub-Step 1.1.2: Start Development Server
**File Path**: Terminal  
**Purpose**: Verify project runs

**Option A (Using AI Tools)**: *"Start the Next.js development server and verify it runs at http://localhost:3000."*

**Option B (Manual)**:
1. Run: `npm run dev`
2. Open http://localhost:3000 in browser
3. Verify default Next.js page loads
4. Check terminal for "Ready" message

**Testing Checklist**: [ ] Server runs; [ ] Page loads at localhost:3000

### Sub-Step 1.1.3: Verify Project Structure
**File Path**: Project folder  
**Purpose**: Confirm folder structure is correct

**Option A (Using AI Tools)**: *"Verify the project has app/ folder, app/layout.tsx, app/page.tsx, and public/ folder. Check package.json has next, react, typescript dependencies."*

**Option B (Manual)**:
1. Check folders: app/, public/, node_modules/
2. Check files: app/layout.tsx, app/page.tsx, package.json, tsconfig.json
3. Verify package.json has next, react, react-dom, typescript
4. Document structure if needed

**Testing Checklist**: [ ] Structure correct; [ ] Dependencies present

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.2: Set Up GitHub Repository

**Time Estimate**: 15 minutes  
**Prerequisites**: GitHub account; Step 1.1 completed  
**Expected Outcome**: Project connected to GitHub; initial commit pushed

### Sub-Step 1.2.1: Create GitHub Repository
**File Path**: GitHub.com  
**Purpose**: Create empty repository

**Option A (Using AI Tools)**: *"I need to create a GitHub repository. Walk me through: go to github.com, click New repository, name it my-saas-app, choose private or public, create. Copy the repository URL."*

**Option B (Manual)**:
1. Go to github.com; sign in
2. Click "+" > New repository
3. Name: my-saas-app (or your choice)
4. Choose private or public
5. Do not initialize with README
6. Click Create repository
7. Copy repository URL (e.g. https://github.com/username/my-saas-app.git)

**Testing Checklist**: [ ] Repository created; [ ] URL copied

### Sub-Step 1.2.2: Initialize Git and Connect to Repository
**File Path**: Terminal, project root  
**Purpose**: Initialize git and add remote

**Option A (Using AI Tools)**: *"Initialize git in this project and connect to my GitHub repository at [your-repo-url]. Make an initial commit and push to main branch."*

**Option B (Manual)**:
1. Run: `git init`
2. Run: `git remote add origin [your-repo-url]`
3. Run: `git add .`
4. Run: `git commit -m "Initial commit: Next.js project setup"`
5. Run: `git branch -M main`
6. Run: `git push -u origin main`
7. Verify: check GitHub; files should appear

**Testing Checklist**: [ ] Git initialized; [ ] Code pushed to GitHub

### Sub-Step 1.2.3: Verify .gitignore
**File Path**: `.gitignore`  
**Purpose**: Ensure sensitive files are not committed

**Option A (Using AI Tools)**: *"Check .gitignore includes node_modules/, .env*.local, .next/, and other Next.js defaults. Add .env.local if not present."*

**Option B (Manual)**:
1. Check .gitignore exists
2. Verify it includes: node_modules/, .env*.local, .next/, .vercel/
3. Add .env.local if missing
4. Test: create .env.local; verify git status doesn't show it

**Security Considerations**: Never commit .env.local with API keys  
**Testing Checklist**: [ ] .gitignore correct; [ ] .env.local ignored

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 1.3: Install Dependencies

**Time Estimate**: 5 minutes  
**Prerequisites**: Step 1.1 completed  
**Expected Outcome**: Stripe packages installed

### Sub-Step 1.3.1: Install Stripe Packages
**File Path**: Terminal, `package.json`  
**Purpose**: Add Stripe client and server packages

**Option A (Using AI Tools)**: *"Install Stripe packages: @stripe/stripe-js for client, @stripe/react-stripe-js for React components, stripe for server-side. Run npm install."*

**Option B (Manual)**:
1. Run: `npm install @stripe/stripe-js @stripe/react-stripe-js stripe`
2. Wait for installation
3. Verify package.json includes all three packages
4. Check node_modules/ has stripe folders

**Testing Checklist**: [ ] Packages installed; [ ] No errors

### Sub-Step 1.3.2: Verify Installation
**File Path**: `package.json`  
**Purpose**: Confirm packages are in dependencies

**Option A (Using AI Tools)**: *"Check package.json: verify @stripe/stripe-js, @stripe/react-stripe-js, and stripe are in dependencies. Version numbers should be present."*

**Option B (Manual)**:
1. Open package.json
2. Check dependencies section
3. Verify all three Stripe packages listed
4. Note versions (should be latest)
5. Document if needed

**Testing Checklist**: [ ] All packages in package.json

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 2: Stripe Integration (Days 4-7)

#### Step 2.1: Stripe Account Setup

1. Sign up at [stripe.com](https://stripe.com) and complete account verification
2. Navigate to Developers > API keys in Stripe Dashboard
3. Copy your **Publishable key** and **Secret key** (test mode)
4. Store them securely as environment variables:

**Option A (Using AI Tools)**: Prompt your AI tool: *"I have my Stripe API keys. Help me store them securely as environment variables. My publishable key is [key] and my secret key is [key]."*

**Option B (Manual)**: Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```
Add `.env.local` to your `.gitignore` file to keep keys secure.

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 2.2: Create Stripe Product

1. In Stripe Dashboard, go to Products and click "Add product"
2. Set name, description, and price for your product
3. Note the Product ID and Price ID

**Option A (Using AI Tools)**: Share these IDs with your AI tool: *"Here are my Stripe Product ID and Price ID: [your-ids]. Use these in the payment integration."*

**Option B (Manual)**: Store these IDs as environment variables or constants in your code for use in the payment integration.

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 2.3: Implement Payment Page

Create a payment page that uses Stripe Elements to collect payment information.

**Time Estimate**: 2–3 hours  
**Prerequisites**: Steps 2.1 and 2.2 completed; Stripe keys configured  
**Expected Outcome**: Payment page with Stripe Elements, form validation, error handling, loading states, and success/failure pages

### Sub-Step 2.3.1: Create Payment Page Route
**File Path**: `app/payment/page.tsx`  
**Purpose**: Create page that wraps Stripe Elements provider

**Option A (Using AI Tools)**: *"Create app/payment/page.tsx: use 'use client'. Import loadStripe from @stripe/stripe-js and Elements from @stripe/react-stripe-js. Create stripePromise with NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Wrap CheckoutForm in <Elements stripe={stripePromise}>."*

**Option B (Manual)**:
1. Create app/payment/page.tsx
2. Add 'use client' at top
3. Import loadStripe, Elements
4. const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
5. Return <Elements stripe={stripePromise}><CheckoutForm /></Elements>
6. Test: visit /payment; verify no errors

**Code Structure Example**:
```typescript
'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

**Testing Checklist**: [ ] Page loads; [ ] No console errors

### Sub-Step 2.3.2: Set Up Stripe Elements Provider
**File Path**: `app/payment/page.tsx`  
**Purpose**: Initialize Stripe with publishable key

**Option A (Using AI Tools)**: *"In payment page, ensure stripePromise is created with loadStripe and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Verify the key is in .env.local. Elements provider should wrap the form."*

**Option B (Manual)**:
1. Verify .env.local has NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
2. Ensure loadStripe is called once (not in component render)
3. Wrap form in <Elements stripe={stripePromise}>
4. Test: check browser console for Stripe initialization

**Security Considerations**: Use publishable key (pk_test_) only; never secret key in client  
**Testing Checklist**: [ ] Stripe initializes; [ ] No key errors

### Sub-Step 2.3.3: Create CheckoutForm Component
**File Path**: `components/CheckoutForm.tsx`  
**Purpose**: Form with Stripe Elements (CardElement, etc.)

**Option A (Using AI Tools)**: *"Create components/CheckoutForm.tsx: use 'use client'. Import useStripe, useElements, CardElement from @stripe/react-stripe-js. Create form with CardElement, email input, submit button. Handle form submission."*

**Option B (Manual)**:
1. Create components/CheckoutForm.tsx
2. Import useStripe, useElements, CardElement
3. const stripe = useStripe(); const elements = useElements()
4. Form: email input, <CardElement />, submit button
5. onSubmit: e.preventDefault(); if (!stripe || !elements) return
6. Test: render form; verify CardElement appears

**Code Structure Example**:
```typescript
'use client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  // ... form implementation
}
```

**Testing Checklist**: [ ] Form renders; [ ] CardElement visible

### Sub-Step 2.3.4: Add Form Validation
**File Path**: `components/CheckoutForm.tsx`  
**Purpose**: Validate email and card before submit

**Option A (Using AI Tools)**: *"Add validation: email format check, card completeness check (use CardElement onChange). Show error messages below inputs. Disable submit if invalid."*

**Option B (Manual)**:
1. Add email validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
2. Add CardElement onChange: setCardError if incomplete
3. Show error messages: {emailError && <span>{emailError}</span>}
4. Disable submit if !emailValid || cardError
5. Test: submit invalid email; verify error shown

**Testing Checklist**: [ ] Validation works; [ ] Errors displayed

### Sub-Step 2.3.5: Implement Error Handling
**File Path**: `components/CheckoutForm.tsx`  
**Purpose**: Handle Stripe errors and display messages

**Option A (Using AI Tools)**: *"Add error handling: catch errors from stripe.confirmCardPayment or API calls. Display user-friendly messages (e.g. 'Card declined', 'Payment failed'). Show errors in UI, not console."*

**Option B (Manual)**:
1. Add error state: const [error, setError] = useState<string | null>(null)
2. In try/catch: catch (err) { setError(err.message || 'Payment failed') }
3. Display: {error && <div className="text-red-500">{error}</div>}
4. Map Stripe errors to friendly messages
5. Test: use test card 4000000000000002 (declined); verify error shown

**Testing Checklist**: [ ] Errors caught; [ ] User-friendly messages shown

### Sub-Step 2.3.6: Add Loading States
**File Path**: `components/CheckoutForm.tsx`  
**Purpose**: Show loading during payment processing

**Option A (Using AI Tools)**: *"Add loading state: const [loading, setLoading] = useState(false). Set loading=true on submit, false on complete. Disable submit button when loading. Show spinner or 'Processing...' text."*

**Option B (Manual)**:
1. Add loading state
2. On submit: setLoading(true)
3. Disable button: disabled={loading || !stripe}
4. Show: {loading ? 'Processing...' : 'Pay'}
5. After payment: setLoading(false)
6. Test: submit payment; verify loading state

**Testing Checklist**: [ ] Loading state shown; [ ] Button disabled during processing

### Sub-Step 2.3.7: Create Success Page
**File Path**: `app/payment/success/page.tsx`  
**Purpose**: Thank you page after successful payment

**Option A (Using AI Tools)**: *"Create app/payment/success/page.tsx: thank you message, order confirmation, link to home. Check URL params for session_id if needed. Style with Tailwind."*

**Option B (Manual)**:
1. Create app/payment/success/page.tsx
2. Display: "Payment successful! Thank you."
3. Optional: show session_id or order details
4. Add link to home page
5. Style with Tailwind
6. Test: complete payment; verify redirect to success

**Testing Checklist**: [ ] Success page loads; [ ] Message clear

### Sub-Step 2.3.8: Add Failure Handling
**File Path**: `app/payment/cancel/page.tsx` or error handling  
**Purpose**: Handle canceled or failed payments

**Option A (Using AI Tools)**: *"Create app/payment/cancel/page.tsx for canceled payments. Or handle in CheckoutForm: if payment fails, show error and allow retry. Add 'Try again' button."*

**Option B (Manual)**:
1. Create cancel page: "Payment canceled"
2. Or: in CheckoutForm, on error show retry button
3. Allow user to fix card and resubmit
4. Test: cancel payment; verify cancel page or error handling

**Testing Checklist**: [ ] Cancel handled; [ ] Retry works

### Sub-Step 2.3.9: Implement Payment Confirmation
**File Path**: `components/CheckoutForm.tsx`  
**Purpose**: Call API to create session, then redirect to Stripe Checkout or confirm card payment

**Option A (Using AI Tools)**: *"In CheckoutForm onSubmit: call POST /api/create-checkout-session (or handle card payment with stripe.confirmCardPayment). On success, redirect to success page. Handle errors."*

**Option B (Manual)**:
1. On submit: fetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify({ priceId }) })
2. Get session.url from response
3. Redirect: window.location.href = session.url (for Checkout) or handle card payment
4. On error: show error message
5. Test: submit payment; verify redirect or confirmation

**Security Considerations**: Never handle card data directly; use Stripe Checkout or Elements  
**Testing Checklist**: [ ] Payment flow works; [ ] Redirects correctly

### Sub-Step 2.3.10: Test with Stripe Test Cards
**File Path**: Browser, Stripe test cards  
**Purpose**: Verify payment flow with test cards

**Option A (Using AI Tools)**: *"Test payment page with Stripe test cards: 4242 4242 4242 4242 (success), 4000000000000002 (declined), 4000000000009995 (insufficient funds). Verify success, error handling, and redirects work."*

**Option B (Manual)**:
1. Use test card: 4242 4242 4242 4242, any future date, any CVC
2. Test success: complete payment; verify success page
3. Test declined: use 4000000000000002; verify error shown
4. Test other scenarios if needed
5. Document test cards in README

**Testing Checklist**: [ ] Success card works; [ ] Declined card shows error; [ ] All flows tested

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 2.4: Create API Route for Payment

Create an API route that handles Stripe checkout session creation securely.

**Time Estimate**: 1–2 hours  
**Prerequisites**: Step 2.3 completed; Stripe secret key in env  
**Expected Outcome**: Secure API route that creates checkout sessions, validates requests, handles errors, and returns session URL

### Sub-Step 2.4.1: Create API Route File
**File Path**: `app/api/create-checkout-session/route.ts`  
**Purpose**: POST endpoint for creating Stripe checkout sessions

**Option A (Using AI Tools)**: *"Create app/api/create-checkout-session/route.ts: export async function POST(req). Get request body (await req.json()). Import Stripe from 'stripe' and initialize with STRIPE_SECRET_KEY from env."*

**Option B (Manual)**:
1. Create app/api/create-checkout-session/route.ts
2. Export async function POST(req: Request)
3. Import Stripe from 'stripe'
4. const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
5. Get body: const { priceId } = await req.json()
6. Test: verify route exists

**Code Structure Example**:
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  // ... implementation
}
```

**Security Considerations**: Never expose secret key; use env variable only  
**Testing Checklist**: [ ] Route file created; [ ] Stripe initialized

### Sub-Step 2.4.2: Set Up Stripe Client Initialization
**File Path**: `app/api/create-checkout-session/route.ts`  
**Purpose**: Initialize Stripe with secret key from env

**Option A (Using AI Tools)**: *"In API route, initialize Stripe client: const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' }). Verify STRIPE_SECRET_KEY is in .env.local (not committed)."*

**Option B (Manual)**:
1. Check .env.local has STRIPE_SECRET_KEY=sk_test_...
2. Initialize: const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
3. Use latest API version (optional)
4. Verify: console.log('Stripe initialized') (remove after test)
5. Test: call API; verify no key errors

**Security Considerations**: Secret key must never be in code or git  
**Testing Checklist**: [ ] Stripe client initialized; [ ] No key errors

### Sub-Step 2.4.3: Implement Authentication Check (Optional)
**File Path**: API route  
**Purpose**: Verify user is authenticated if needed

**Option A (Using AI Tools)**: *"If payment requires auth: check for session or token in request. Return 401 if not authenticated. For public payments, skip this step."*

**Option B (Manual)**:
1. If auth needed: get session from cookies or headers
2. If !session: return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
3. For public: skip this step
4. Test: call without auth (if required); expect 401

**Testing Checklist**: [ ] Auth check works if needed

### Sub-Step 2.4.4: Create Checkout Session with Metadata
**File Path**: API route  
**Purpose**: Create Stripe checkout session with product/price

**Option A (Using AI Tools)**: *"Create checkout session: const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price: priceId, quantity: 1 }], success_url: `${origin}/payment/success`, cancel_url: `${origin}/payment`, metadata: { userId: user.id } }). Return { url: session.url }."*

**Option B (Manual)**:
1. Get priceId from body
2. Get origin from headers or env
3. const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price: priceId, quantity: 1 }], success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/payment`, metadata: {} })
4. Return NextResponse.json({ url: session.url })
5. Test: call API; verify session.url returned

**Testing Checklist**: [ ] Session created; [ ] URL returned

### Sub-Step 2.4.5: Add Error Handling
**File Path**: API route  
**Purpose**: Handle Stripe errors and return user-friendly messages

**Option A (Using AI Tools)**: *"Wrap Stripe calls in try/catch. On error: log full error server-side; return 500 with generic message to client. Handle specific errors (invalid price, network) if needed."*

**Option B (Manual)**:
1. Wrap in try/catch
2. catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to create session' }, { status: 500 }) }
3. Never expose Stripe error details to client
4. Log errors for debugging
5. Test: use invalid priceId; verify error handled

**Testing Checklist**: [ ] Errors caught; [ ] User-friendly message returned

### Sub-Step 2.4.6: Implement Request Validation
**File Path**: API route  
**Purpose**: Validate request body (priceId required, etc.)

**Option A (Using AI Tools)**: *"Validate request: check priceId exists and is string. If invalid, return 400 with error message. Use Zod schema if preferred."*

**Option B (Manual)**:
1. Check body has priceId
2. If !priceId: return NextResponse.json({ error: 'priceId required' }, { status: 400 })
3. Validate priceId format (starts with price_)
4. Test: call without priceId; expect 400

**Security Considerations**: Validate all inputs; never trust client  
**Testing Checklist**: [ ] Validation works; [ ] 400 on invalid input

### Sub-Step 2.4.7: Add Rate Limiting (Optional)
**File Path**: API route or middleware  
**Purpose**: Prevent abuse

**Option A (Using AI Tools)**: *"Add rate limiting: limit to 10 requests per IP per minute. Use library or simple counter. Return 429 with Retry-After on limit."*

**Option B (Manual)**:
1. Install rate limit library or implement simple counter
2. Check IP request count
3. If > limit: return 429 { error: 'Too many requests', retryAfter: 60 }
4. Test: make many requests; verify limit enforced
5. Optional: skip for MVP

**Testing Checklist**: [ ] Rate limit works if implemented

### Sub-Step 2.4.8: Create Response Handling
**File Path**: API route  
**Purpose**: Return proper JSON response

**Option A (Using AI Tools)**: *"Return response: NextResponse.json({ url: session.url }, { status: 200 }). Set proper headers (Content-Type: application/json). Handle CORS if needed."*

**Option B (Manual)**:
1. Return NextResponse.json({ url: session.url })
2. Ensure status 200
3. Headers set automatically by Next.js
4. Test: call API; verify JSON response with url

**Testing Checklist**: [ ] Response format correct; [ ] URL in response

### Sub-Step 2.4.9: Add Logging
**File Path**: API route  
**Purpose**: Log successful sessions for debugging

**Option A (Using AI Tools)**: *"Add logging: console.log('Checkout session created', { sessionId: session.id, priceId }). Log errors. Optional: send to logging service."*

**Option B (Manual)**:
1. Log success: console.log('Session created', session.id)
2. Log errors in catch block
3. Optional: structured logging
4. Test: create session; verify logged
5. Remove sensitive data from logs

**Testing Checklist**: [ ] Logging works; [ ] No sensitive data logged

### Sub-Step 2.4.10: Test Webhook Integration (Optional)
**File Path**: Stripe Dashboard, webhook endpoint  
**Purpose**: Verify webhook receives payment events

**Option A (Using AI Tools)**: *"Set up webhook in Stripe Dashboard: endpoint /api/webhooks/stripe, events checkout.session.completed. Test with Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe. Trigger test event."*

**Option B (Manual)**:
1. Create webhook endpoint (optional for Level 1)
2. In Stripe Dashboard: Webhooks > Add endpoint
3. URL: https://yoursite.com/api/webhooks/stripe
4. Events: checkout.session.completed
5. Test locally with Stripe CLI
6. Document webhook setup

**Testing Checklist**: [ ] Webhook receives events if implemented

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 3: Landing Page Design (Days 8-10)

#### Step 3.1: Design Hero Section

Create a hero section with a compelling headline, value proposition, call-to-action button, and professional imagery.

**Option A (Using AI Tools)**: Prompt your AI tool: *"Create a hero section for the landing page with a compelling headline, value proposition, call-to-action button, and professional styling. Make it visually appealing and conversion-focused."* You can also ask AI to generate headline options for your product/service.

**Option B (Manual)**: Design and implement the hero section in `app/page.tsx` with:
- Compelling headline and subheading
- Value proposition
- Prominent CTA button linking to payment page
- Modern styling using Tailwind CSS
- Responsive design

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 3.2: Add Features Section

Add a features section that displays the key benefits of your product.

**Option A (Using AI Tools)**: Prompt your AI tool: *"Add a features section that lists these key benefits: [list your features]. Use icons or images to make it visually appealing and easy to scan."*

**Option B (Manual)**: Create a features section component that:
- Displays your key features/benefits in a grid or list layout
- Uses icons or images for visual appeal
- Is easy to scan and read
- Matches your overall design

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 3.3: Implement Responsive Design

Ensure the entire landing page works well on mobile devices and all screen sizes.

**Option A (Using AI Tools)**: Prompt your AI tool: *"Review the landing page and ensure it's fully responsive for mobile devices. Check text sizes, button sizes, layout, and spacing. Fix any issues with buttons or layout on smaller screens."*

**Option B (Manual)**: 
- Test the page on various screen sizes
- Use Tailwind CSS responsive utilities (sm:, md:, lg:)
- Ensure buttons are touch-friendly (minimum 44x44px)
- Verify text is readable on mobile
- Test navigation and interactions on mobile devices

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

### Phase 4: Deployment (Days 11-12)

#### Step 4.1: Prepare for Vercel

Prepare the project for deployment to Vercel.

**Option A (Using AI Tools)**: Prompt your AI tool: *"Prepare this project for deployment to Vercel. Ensure all code is pushed to GitHub and that sensitive files like .env.local are in .gitignore."*

**Option B (Manual)**: 
- Ensure all code is committed and pushed to GitHub
- Verify `.env.local` is in `.gitignore`
- Create a `.env.example` file showing required environment variables
- Run `npm run build` to verify the project builds successfully

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 4.2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import your GitHub repository (Vercel will detect it automatically)
3. When Vercel asks for environment variables, add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (from your Stripe dashboard)
   - `STRIPE_SECRET_KEY` (from your Stripe dashboard)
4. Click Deploy!

**Option A (Using AI Tools)**: If you need help understanding environment variables, ask your AI tool: *"What environment variables do I need to add in Vercel for Stripe to work in production?"*

**Option B (Manual)**: Add the environment variables listed above in Vercel's project settings.

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 4.3: Test Production

1. Visit your deployed URL (Vercel will provide this)
2. Test the payment flow using Stripe's test card: `4242 4242 4242 4242`
3. If anything doesn't work:

**Option A (Using AI Tools)**: Describe the issue to your AI tool and ask for help fixing it.

**Option B (Manual)**: Check browser console for errors, verify environment variables are set correctly in Vercel, and review the troubleshooting guide.

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for troubleshooting prompts if you encounter issues.

### Phase 5: Launch Preparation (Days 13-14)

#### Step 5.1: Final Testing

Test everything thoroughly:
- [ ] Test all payment scenarios (success, failure, cancellation)
- [ ] Verify mobile experience works correctly
- [ ] Check that pages load quickly
- [ ] Test error handling (what happens if something goes wrong?)

**Option A (Using AI Tools)**: Prompt your AI tool: *"Help me test the entire application thoroughly. Check all the important user flows and fix any issues you find."*

**Option B (Manual)**: Manually test each scenario, check mobile responsiveness, verify page load times, and test error cases.

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

#### Step 5.2: Switch to Live Mode

1. Complete Stripe account verification in Stripe Dashboard
2. Get your live mode API keys from Stripe
3. Update environment variables to use live keys:

**Option A (Using AI Tools)**: Prompt your AI tool: *"Update the environment variables to use live Stripe keys instead of test keys. My live publishable key is [key] and live secret key is [key]."*

**Option B (Manual)**: Update environment variables in Vercel with your live Stripe keys:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
- `STRIPE_SECRET_KEY` (live key)

4. Redeploy on Vercel with the new keys

**AI Prompt Available (for non-technical users)**: See [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) for a ready-to-use prompt you can copy and paste into your AI tool for this step.

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
- *"Create a payment page with a clean, modern design. Include fields for email, card number, expiry, and CVC. Add a submit button and show loading state while processing."*
- *"The hero section needs to be more compelling. Make the headline larger and add a gradient background. The CTA button should be more prominent."*
- *"Fix the mobile layout - the text is too small and buttons are hard to tap on phones."*

**Less effective prompts**:
- *"Make it better"* (too vague)
- *"Fix the code"* (doesn't specify what's wrong)
- *"Do the Stripe thing"* (not specific enough)

### When to Provide More Detail

Provide more detail when:
- You have specific design preferences (colors, fonts, layout)
- You want particular functionality (specific user flows)
- You have brand guidelines to follow
- You want to match an existing design

Let AI or your own expertise handle:
- Technical implementation details
- Code structure and organization
- Best practices and optimizations
- Error handling approaches

## Success Criteria

Your implementation is complete when you can verify:

1. ✅ Application is deployed and accessible at your custom URL
2. ✅ Stripe payments process successfully (test with test card, then real card)
3. ✅ Landing page looks professional and works on mobile devices
4. ✅ All links and buttons work correctly when clicked
5. ✅ Error messages are clear and helpful (if something goes wrong)
6. ✅ Website loads quickly and feels responsive

**Note**: Focus on whether the site works well for your users. If using AI tools, they can help with performance optimization. If coding manually, consider running Lighthouse audits for performance insights.

## Next Steps

After completing Level 1:

1. Monitor your application - watch for user signups and payments
2. Gather feedback from early users
3. Iterate on design and functionality based on feedback (use AI tools if helpful)
4. Consider upgrading to Level 2 for more advanced features (user accounts, subscriptions, etc.)

## Resources

### AI Prompts (for non-technical users)
- [Web Apps Level 1 AI Prompts](web-apps-level-1-ai-prompts.md) - Ready-to-use prompts for each step. Download this file and copy-paste prompts directly into your AI tool.

### Documentation
Reference documentation for the technologies used:
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [Stripe Documentation](https://stripe.com/docs) - Payment integration guide
- [Vercel Documentation](https://vercel.com/docs) - Deployment guide
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styling framework

## Troubleshooting

If you encounter issues:

**Option A (Using AI Tools)**: 
1. Describe the problem clearly to your AI tool: "When I try to make a payment, I see an error message that says..."
2. Show AI any error messages: Copy and paste error text
3. Ask AI to explain: "Can you explain what this error means and how to fix it?"
4. Request step-by-step help: "Walk me through fixing this issue"

**Option B (Manual)**: 
1. Check browser console for error messages
2. Review the troubleshooting guide: `web-apps-level-1-common-issues-solutions.md`
3. Check documentation for the specific technology causing issues
4. Verify environment variables and configuration are correct

Common issues and solutions are covered in the troubleshooting guide. Refer to `web-apps-level-1-common-issues-solutions.md` for detailed help.

---

**Remember**: Whether you're coding yourself or using AI tools, focus on clear communication, making informed decisions, and thoroughly testing your application. This plan provides a flexible roadmap that works for both technical and non-technical users, making web application development accessible to everyone!
