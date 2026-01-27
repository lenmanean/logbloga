# Web Apps Level 1: Landing Page / Simple Web App Implementation Plan

## Overview

This implementation plan guides you (as the director) in working with **Cursor as your lead developer** to build a simple single-page application or landing page SaaS with Stripe payment integration. **You don't need any coding knowledge** - Cursor will handle all the technical implementation. Your role is to provide vision, make decisions, and direct Cursor to build your application.

**Your Role**: Director - Provide vision, make decisions, review work, give feedback  
**Cursor's Role**: Lead Developer - Handles all code generation, implementation, debugging, and technical execution

Working together, Cursor will build your application in **2-4 weeks** instead of the traditional 6-8 weeks, reaching market faster.

**Expected Outcome**: A functional, deployed web application with payment processing that can generate $500-$2,000/month in revenue.

## Prerequisites

Before starting, ensure you have:

- **Cursor installed and configured** on your computer (this is your primary development tool)
- A **GitHub account** (free tier is sufficient)
- A **Vercel account** (free tier is sufficient)
- A **Stripe account** (test mode to start)
- **Node.js 18+ installed** (Cursor can help you install this if needed)
- Basic computer skills (opening applications, using a web browser)
- Willingness to communicate clearly with Cursor

**You do NOT need**:
- Knowledge of HTML, CSS, or JavaScript
- Understanding of React or Next.js
- Programming experience
- Technical coding skills

## Timeline

**Week 1**: Direct Cursor to set up the project, basic structure, and Stripe integration  
**Week 2**: Work with Cursor to implement UI/UX and test functionality  
**Week 3**: Guide Cursor through deployment and launch preparation  
**Week 4**: Direct Cursor on marketing setup and optimization

## Milestones

### Milestone 1: Project Foundation (Days 1-3)
- [ ] Direct Cursor to initialize Next.js project
- [ ] Work with Cursor to set up GitHub repository
- [ ] Guide Cursor to configure development environment
- [ ] Review Cursor's work on basic project structure

### Milestone 2: Core Features (Days 4-7)
- [ ] Describe your vision to Cursor for the landing page design
- [ ] Set up Stripe account and provide API keys to Cursor
- [ ] Direct Cursor to integrate Stripe payment processing
- [ ] Ask Cursor to create payment success/failure pages

### Milestone 3: Polish & Testing (Days 8-10)
- [ ] Request Cursor to add error handling
- [ ] Direct Cursor to implement responsive design
- [ ] Test payment flows with Cursor's help
- [ ] Ask Cursor to optimize performance

### Milestone 4: Deployment (Days 11-12)
- [ ] Guide Cursor through Vercel deployment process
- [ ] Provide environment variables to Cursor for configuration
- [ ] Test production deployment with Cursor
- [ ] Optionally direct Cursor to set up custom domain

### Milestone 5: Launch (Days 13-14)
- [ ] Review final testing with Cursor
- [ ] Complete launch checklist
- [ ] Go live!

## Director's Guide: Working with Cursor

### Effective Communication

**Be Specific**: Instead of "make it better," say "make the button larger and change the color to blue"

**Provide Context**: Share your vision and goals. For example: "I want a landing page that converts visitors into paying customers"

**Give Feedback**: Review what Cursor creates and provide specific feedback: "The headline is good, but make it more compelling"

**Ask Questions**: If you don't understand something Cursor suggests, ask for clarification

### What to Direct Cursor On

- **What to build**: Describe features, pages, and functionality you want
- **How it should look**: Share design preferences, colors, layout ideas
- **What it should do**: Explain user flows and business logic
- **When to test**: Request testing at key milestones

### What Cursor Handles

- **All code writing**: Cursor generates all the code
- **Technical implementation**: Cursor handles all technical details
- **Error fixing**: Cursor debugs and fixes issues
- **Best practices**: Cursor follows coding standards and best practices

### Reviewing Cursor's Work

1. **Test the functionality**: Try using what Cursor built
2. **Check the appearance**: Review how it looks
3. **Provide feedback**: Tell Cursor what works and what needs changes
4. **Request improvements**: Ask Cursor to refine or adjust as needed

## Step-by-Step Roadmap

### Phase 1: Project Setup (Days 1-3)

#### Step 1.1: Initialize Next.js Project

1. Open Cursor on your computer
2. Direct Cursor to initialize a Next.js project. You can say: *"Create a new Next.js project with TypeScript and Tailwind CSS. Name it 'my-saas-app'"*
3. Ask Cursor to start the development server
4. Review the result - Cursor should show you a running application at `http://localhost:3000`

**Note**: If Cursor encounters any errors, simply describe the error to Cursor and ask it to fix it.

#### Step 1.2: Set Up GitHub Repository

1. Create a new repository on GitHub (private or public) - you'll do this manually in your browser
2. Direct Cursor to initialize git in your project. Say: *"Initialize git and connect this project to my GitHub repository"*
3. Provide Cursor with your repository URL when it asks
4. Ask Cursor to make the initial commit and push to GitHub

**Example directive**: *"Set up git, connect to my GitHub repo at [your-repo-url], and make an initial commit"*

#### Step 1.3: Install Dependencies

Direct Cursor to install Stripe dependencies. You can say: *"Install the Stripe packages needed for payment processing"*

Cursor will handle the technical details of which packages to install and how to configure them.

### Phase 2: Stripe Integration (Days 4-7)

#### Step 2.1: Stripe Account Setup

1. Sign up at [stripe.com](https://stripe.com) - you'll do this manually
2. Complete account verification in Stripe Dashboard
3. Navigate to Developers > API keys in Stripe
4. Copy your **Publishable key** and **Secret key** (test mode)
5. Tell Cursor: *"I have my Stripe API keys. Help me store them securely as environment variables"*

Cursor will guide you on where to store these keys and how to use them securely.

#### Step 2.2: Create Stripe Product

1. In Stripe Dashboard, go to Products (you'll do this manually)
2. Click "Add product"
3. Set name, description, and price for your product
4. Note the Product ID and Price ID
5. Share these IDs with Cursor: *"Here are my Stripe Product ID and Price ID: [your-ids]. Use these in the payment integration"*

#### Step 2.3: Implement Payment Page

Direct Cursor to create a payment page. You can say: *"Create a payment page that uses Stripe Elements to collect payment information. Make it user-friendly and secure."*

**Reference for Cursor** (you can show this to Cursor if needed):
```typescript
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

Tell Cursor: *"I want a payment page similar to this example. Build it with proper error handling and user feedback."*

#### Step 2.4: Create API Route for Payment

Direct Cursor: *"Create an API route that handles Stripe checkout session creation. Make sure it's secure and handles errors properly."*

Cursor will create the server-side code needed to process payments securely.

### Phase 3: Landing Page Design (Days 8-10)

#### Step 3.1: Design Hero Section

Describe your vision to Cursor: *"I want a hero section with a compelling headline, value proposition, call-to-action button, and professional imagery. Make it visually appealing and conversion-focused."*

You can also ask Cursor: *"Generate some headline and value proposition options for my [product/service description]"*

#### Step 3.2: Add Features Section

Direct Cursor: *"Add a features section that lists the key benefits of my product. Use icons or images to make it visually appealing and easy to scan."*

Share your key features with Cursor, and it will create an attractive section to display them.

#### Step 3.3: Implement Responsive Design

Ask Cursor: *"Make sure the entire landing page works well on mobile devices. Test it and fix any issues with buttons or layout on smaller screens."*

Cursor will ensure your site looks great on all devices.

### Phase 4: Deployment (Days 11-12)

#### Step 4.1: Prepare for Vercel

Direct Cursor: *"Prepare the project for deployment. Make sure all code is pushed to GitHub and that sensitive files like .env.local are not included in the repository."*

Cursor will handle the technical details of preparing for deployment.

#### Step 4.2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import your GitHub repository (Vercel will detect it automatically)
3. When Vercel asks for environment variables, add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (from your Stripe dashboard)
   - `STRIPE_SECRET_KEY` (from your Stripe dashboard)
4. Click Deploy!

Ask Cursor: *"Help me understand what environment variables I need to add in Vercel for Stripe to work."*

#### Step 4.3: Test Production

1. Visit your deployed URL (Vercel will provide this)
2. Test the payment flow using Stripe's test card: `4242 4242 4242 4242`
3. If anything doesn't work, describe the issue to Cursor and ask it to fix it

### Phase 5: Launch Preparation (Days 13-14)

#### Step 5.1: Final Testing

Work with Cursor to test everything:
- [ ] Test all payment scenarios (success, failure, cancellation)
- [ ] Verify mobile experience works correctly
- [ ] Check that pages load quickly
- [ ] Test error handling (what happens if something goes wrong?)

Direct Cursor: *"Help me test the entire application thoroughly. Check all the important user flows and fix any issues you find."*

#### Step 5.2: Switch to Live Mode

1. Complete Stripe account verification (you'll do this in Stripe Dashboard)
2. Get your live mode API keys from Stripe
3. Direct Cursor: *"Update the environment variables to use live Stripe keys instead of test keys"*
4. Redeploy on Vercel with the new keys

## Working with Cursor: Your Development Workflow

### Cursor as Your Lead Developer

**Cursor handles**:
- Writing all code (React components, API routes, styling)
- Implementing features based on your descriptions
- Debugging and fixing errors
- Following best practices and coding standards
- Optimizing performance
- Ensuring security best practices

**You handle**:
- Providing vision and direction
- Making business and design decisions
- Reviewing what Cursor builds
- Testing functionality
- Giving feedback for improvements
- Managing the overall project timeline

### Effective Prompting Examples

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

Let Cursor decide when:
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

**Note**: You don't need to check technical metrics like Lighthouse scores - Cursor handles performance optimization. Focus on whether the site works well for your users.

## Next Steps

After completing Level 1:

1. Monitor your application - watch for user signups and payments
2. Gather feedback from early users
3. Work with Cursor to iterate on design and functionality based on feedback
4. Consider upgrading to Level 2 for more advanced features (user accounts, subscriptions, etc.)

## Resources

While you don't need to read these, you can share them with Cursor if needed:
- [Next.js Documentation](https://nextjs.org/docs) - Share with Cursor for reference
- [Stripe Documentation](https://stripe.com/docs) - Cursor uses this for payment integration
- [Vercel Documentation](https://vercel.com/docs) - Cursor references this for deployment
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Cursor uses this for styling

## Troubleshooting

If you encounter issues:

1. **Describe the problem clearly to Cursor**: "When I try to make a payment, I see an error message that says..."
2. **Show Cursor any error messages**: Copy and paste error text to Cursor
3. **Ask Cursor to explain**: "Can you explain what this error means and how to fix it?"
4. **Request step-by-step help**: "Walk me through fixing this issue"

Common issues and solutions are also covered in the troubleshooting guide. Refer to `web-apps-level-1-common-issues-solutions.md` for detailed help, or ask Cursor to reference it.

---

**Remember**: You're the director, Cursor is your developer. Focus on communicating your vision clearly, making decisions, and reviewing the work. Cursor will handle all the technical implementation. This collaborative approach makes building web applications accessible to everyone, regardless of technical background!
