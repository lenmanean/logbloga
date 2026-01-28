# Web Apps Level 1: AI Prompts for Implementation

## How to Use This File

This file contains ready-to-use prompts you can copy and paste directly into your AI coding assistant (such as Cursor, GitHub Copilot, or ChatGPT) for each step of the Web Apps Level 1 implementation plan. Each prompt is designed to be:

- **Copy-paste ready**: No editing required
- **Context-aware**: Includes all necessary information for your AI tool
- **Specific**: Clear instructions for what should be done
- **Complete**: Contains everything needed to complete the task

Simply find the step you're working on, copy the prompt, and paste it into your AI assistant. The AI will handle all the technical implementation.

---

## Phase 1: Project Setup

### Step 1.1: Initialize Next.js Project

**When to use**: At the start of Phase 1, when setting up your project for the first time.

**Prompt to paste into your AI tool**:
```
Create a new Next.js project with TypeScript and Tailwind CSS. Name it 'my-saas-app'. Use the latest version of Next.js with the App Router. After creating the project, start the development server so I can verify it's working at http://localhost:3000.
```

**What the AI will do**:
- Initialize Next.js project with TypeScript and Tailwind CSS
- Set up the project structure with App Router
- Configure Tailwind CSS
- Start the development server
- Guide you through verification

---

### Step 1.2: Set Up GitHub Repository

**When to use**: After creating your Next.js project, when you're ready to connect it to GitHub.

**Before using this prompt**: Create a new repository on GitHub first (private or public), then copy the repository URL.

**Prompt to paste into your AI tool** (replace `[your-repo-url]` with your actual GitHub repository URL):
```
Initialize git in this project and connect it to my GitHub repository at [your-repo-url]. Set up the remote, make an initial commit with all current files, and push to the main branch. Use a commit message like "Initial commit: Next.js project setup".
```

**What the AI will do**:
- Initialize git repository
- Add remote origin
- Stage all files
- Create initial commit
- Push to GitHub main branch

---

### Step 1.3: Install Dependencies

**When to use**: After setting up the project and GitHub, before starting Stripe integration.

**Prompt to paste into your AI tool**:
```
Install the Stripe packages needed for payment processing in this Next.js project. Install both the client-side and server-side Stripe packages, and make sure they're compatible with Next.js App Router and TypeScript.
```

**What the AI will do**:
- Install `@stripe/stripe-js` for client-side
- Install `@stripe/react-stripe-js` for React components
- Install `stripe` for server-side API routes
- Update package.json with correct dependencies
- Ensure TypeScript types are available

---

## Phase 2: Stripe Integration

### Step 2.1: Stripe Account Setup (Environment Variables)

**When to use**: After you've created your Stripe account and obtained your API keys (Publishable key and Secret key in test mode).

**Before using this prompt**: Have your Stripe Publishable key and Secret key ready from the Stripe Dashboard.

**Prompt to paste into your AI tool** (replace `[publishable-key]` and `[secret-key]` with your actual keys):
```
I have my Stripe API keys. Help me store them securely as environment variables in this Next.js project. My publishable key is [publishable-key] and my secret key is [secret-key]. Create a .env.local file with these keys using the proper naming convention for Next.js (NEXT_PUBLIC_ for client-side keys). Also create a .env.example file as a template, and make sure .env.local is in .gitignore so it's not committed to the repository.
```

**What the AI will do**:
- Create `.env.local` file with your Stripe keys
- Use proper Next.js environment variable naming (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`)
- Create `.env.example` template file
- Ensure `.env.local` is in `.gitignore`
- Explain how to use these variables in your code

---

### Step 2.2: Create Stripe Product Integration

**When to use**: After creating a product in your Stripe Dashboard and obtaining the Product ID and Price ID.

**Before using this prompt**: Create a product in Stripe Dashboard and note the Product ID and Price ID.

**Prompt to paste into your AI tool** (replace `[product-id]` and `[price-id]` with your actual IDs):
```
I've created a product in Stripe with Product ID [product-id] and Price ID [price-id]. Set up the code to use these IDs in the payment integration. Store them as environment variables or constants where appropriate, and make sure they're ready to be used in the payment flow.
```

**What the AI will do**:
- Store Product ID and Price ID appropriately
- Set up constants or environment variables for these IDs
- Prepare them for use in payment integration
- Explain where and how they'll be used

---

### Step 2.3: Implement Payment Page

**When to use**: When you're ready to create the payment page component with Stripe Elements.

**Prompt to paste into your AI tool**:
```
Create a payment page component that uses Stripe Elements to collect payment information. The page should be located at app/payment/page.tsx. Include:

1. A clean, modern design with proper form fields for card information
2. Stripe Elements integration using @stripe/react-stripe-js
3. Proper error handling and user feedback
4. Loading states during payment processing
5. Success and error message display
6. Responsive design that works on mobile devices

Use the Stripe publishable key from environment variables. Make sure the component is a client component and follows Next.js App Router best practices.
```

**What the AI will do**:
- Create `app/payment/page.tsx` with Stripe Elements
- Set up proper Stripe configuration
- Implement form with card input fields
- Add error handling and user feedback
- Include loading states
- Make it responsive
- Follow Next.js App Router patterns

---

### Step 2.4: Create API Route for Payment

**When to use**: After creating the payment page, when you need the server-side API to handle payment processing.

**Prompt to paste into your AI tool**:
```
Create an API route at app/api/create-checkout-session/route.ts that handles Stripe checkout session creation. The route should:

1. Use the Stripe secret key from environment variables
2. Create a checkout session with the product and price IDs
3. Handle errors properly with appropriate error messages
4. Return the session ID to the client
5. Include proper TypeScript types
6. Follow Next.js App Router API route conventions
7. Include security best practices (validate input, handle errors securely)

Make sure it's secure and handles all error cases appropriately.
```

**What the AI will do**:
- Create API route with proper structure
- Set up Stripe server-side client
- Implement checkout session creation
- Add comprehensive error handling
- Include TypeScript types
- Follow security best practices
- Return appropriate responses

---

## Phase 3: Landing Page Design

### Step 3.1: Design Hero Section

**When to use**: When you're ready to create the main hero section of your landing page.

**Prompt to paste into your AI tool** (customize the product description):
```
Create a hero section for the landing page at app/page.tsx. The hero section should include:

1. A compelling headline that clearly communicates the value proposition
2. A subheading that explains the benefits
3. A prominent call-to-action button that links to the payment page
4. Professional, modern styling using Tailwind CSS
5. Responsive design that looks great on all screen sizes
6. Optional: Placeholder for professional imagery or graphics

Make it visually appealing and conversion-focused. Use a clean, modern design with good spacing and typography. The CTA button should stand out and encourage clicks.
```

**Alternative prompt for generating copy**:
```
Generate 5 headline and value proposition options for my [product/service description]. Make them compelling, clear, and focused on the benefits to the customer. Each should be suitable for a hero section of a landing page.
```

**What the AI will do**:
- Create or update hero section in `app/page.tsx`
- Design compelling layout with headline and CTA
- Apply modern styling with Tailwind CSS
- Make it responsive
- Ensure it's conversion-focused

---

### Step 3.2: Add Features Section

**When to use**: After the hero section, when you want to showcase your product's key benefits.

**Before using this prompt**: Have a list of your key features/benefits ready to share.

**Prompt to paste into your AI tool** (replace with your actual features):
```
Add a features section to the landing page that displays the key benefits of my product. The features are:
- [Feature 1: Brief description]
- [Feature 2: Brief description]
- [Feature 3: Brief description]
- [Add more as needed]

The section should:
1. Display features in an attractive grid or list layout
2. Use icons or images to make it visually appealing
3. Be easy to scan and read
4. Use consistent styling with the rest of the page
5. Be fully responsive for mobile devices
6. Include brief descriptions for each feature

Make it visually engaging with good use of spacing, typography, and optional icons.
```

**What the AI will do**:
- Create features section component
- Design attractive layout (grid or list)
- Add icons or visual elements
- Make it scannable and readable
- Ensure responsive design
- Match overall page styling

---

### Step 3.3: Implement Responsive Design

**When to use**: After creating the landing page sections, to ensure everything works well on mobile devices.

**Prompt to paste into your AI tool**:
```
Review the entire landing page and ensure it's fully responsive for mobile devices. Check and fix:

1. Text sizes are readable on small screens
2. Buttons are large enough and easy to tap on mobile
3. Layout adapts properly to different screen sizes
4. Images scale appropriately
5. Spacing works well on mobile
6. Navigation (if any) is mobile-friendly
7. Forms and inputs are mobile-optimized

Test the responsive design and fix any issues with buttons, layout, or text on smaller screens. Use Tailwind CSS responsive utilities appropriately.
```

**What the AI will do**:
- Review all components for mobile responsiveness
- Fix text sizing issues
- Ensure buttons are touch-friendly
- Adjust layouts for mobile
- Optimize spacing and images
- Test and fix any mobile-specific issues

---

## Phase 4: Deployment

### Step 4.1: Prepare for Vercel

**When to use**: Before deploying to Vercel, to ensure the project is ready.

**Prompt to paste into your AI tool**:
```
Prepare this project for deployment to Vercel. Ensure:

1. All code is committed and pushed to GitHub
2. The .env.local file is in .gitignore (so sensitive keys aren't committed)
3. There's a .env.example file showing what environment variables are needed
4. The project builds successfully (run a build check)
5. All dependencies are properly listed in package.json
6. There are no build errors or warnings
7. The next.config.ts (or next.config.js) is properly configured

Verify everything is ready for deployment and fix any issues.
```

**What the AI will do**:
- Check git status and ensure code is committed
- Verify .gitignore includes .env.local
- Check for .env.example
- Run build check
- Verify package.json
- Fix any build issues
- Ensure proper configuration

---

### Step 4.2: Deploy to Vercel (Environment Variables Help)

**When to use**: When you're setting up environment variables in Vercel and need to understand what's required.

**Before using this prompt**: You'll be adding environment variables in the Vercel dashboard manually, but this prompt helps you understand what's needed.

**Prompt to paste into your AI tool**:
```
Help me understand what environment variables I need to add in Vercel for Stripe to work in production. List all the environment variables required, their exact names (matching what we use in the code), and explain what each one is for. Also explain the difference between test mode and live mode keys, and when I should switch to live mode.
```

**What the AI will do**:
- List all required environment variables
- Provide exact variable names
- Explain each variable's purpose
- Explain test vs. live mode
- Guide on when to switch to live mode

---

### Step 4.3: Test Production (Troubleshooting)

**When to use**: After deployment, if you encounter any issues with the production site.

**Prompt to paste into your AI tool** (describe the specific issue):
```
I've deployed the site to Vercel, but I'm experiencing [describe the issue]. The payment flow [or other functionality] isn't working as expected. Help me troubleshoot this issue. Check:

1. Environment variables are set correctly in Vercel
2. The build completed successfully
3. API routes are working
4. Client-side code is loading properly
5. Stripe keys are correct and in the right mode (test/live)

Help me identify and fix the problem.
```

**What the AI will do**:
- Analyze the described issue
- Check common deployment problems
- Verify environment variable setup
- Check API route configuration
- Provide specific fixes
- Guide through resolution

---

## Phase 5: Launch Preparation

### Step 5.1: Final Testing

**When to use**: Before going live, to thoroughly test the entire application.

**Prompt to paste into your AI tool**:
```
Help me test the entire application thoroughly. Check all the important user flows:

1. Payment flow - test with Stripe test card (4242 4242 4242 4242)
2. Success scenarios - verify success pages work
3. Error scenarios - test what happens when payment fails
4. Mobile experience - verify everything works on mobile devices
5. Page loading - check that pages load quickly
6. Error handling - verify error messages are clear and helpful
7. Navigation - ensure all links and buttons work correctly
8. Responsive design - check all screen sizes

Identify any issues and fix them. Provide a testing checklist of what to verify.
```

**What the AI will do**:
- Guide through comprehensive testing
- Test payment flows
- Verify mobile experience
- Check error handling
- Identify and fix issues
- Provide testing checklist

---

### Step 5.2: Switch to Live Mode

**When to use**: When you're ready to switch from Stripe test mode to live mode for real payments.

**Before using this prompt**: Complete Stripe account verification and obtain your live mode API keys.

**Prompt to paste into your AI tool** (replace with your live keys):
```
Update the environment variables to use live Stripe keys instead of test keys. My new live publishable key is [live-publishable-key] and my live secret key is [live-secret-key]. 

Update:
1. The .env.local file with the new live keys
2. The Vercel environment variables (guide me on how to update them)
3. Verify the code is ready for live mode
4. Ensure all references to test mode are updated appropriately

Make sure everything is configured correctly for live payments.
```

**What the AI will do**:
- Update .env.local with live keys
- Guide on updating Vercel environment variables
- Verify code configuration
- Ensure proper live mode setup
- Provide deployment instructions

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
I want to add [feature description] to my application. Help me implement this feature following the same patterns and best practices used in the rest of the codebase. Make sure it integrates well with the existing Stripe payment flow and landing page design.
```

---

## Tips for Using These Prompts

1. **Copy the entire prompt**: Don't edit it unless you need to add specific information (like API keys or feature lists)
2. **Provide context**: If your AI assistant asks for clarification, provide additional details about your specific needs
3. **Review the output**: Always review what the AI creates and test it before moving to the next step
4. **Ask for help**: If something doesn't work, paste the error message and ask for help
5. **Customize when needed**: Feel free to modify prompts to match your specific product or design preferences

---

**Remember**: These prompts are designed to work with AI tools as your coding assistant. You're the director - provide vision, make decisions, and review the work. The AI handles all the technical implementation!
