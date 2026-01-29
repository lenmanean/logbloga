# SaaS Starter Template

A Next.js SaaS starter template with Supabase (auth + database) and Stripe subscriptions.

## Features

- Next.js 15 with App Router
- TypeScript
- Supabase (Auth + Database)
- Stripe Subscriptions
- Tailwind CSS
- User dashboard
- Subscription management
- Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- Supabase account (free tier)
- Stripe account with subscription features enabled

### Installation

1. Extract this template to your project directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase and Stripe values to `.env.local` (see `.env.example` for required keys). Include `STRIPE_PRICE_ID` (create a subscription price in Stripe Dashboard and paste the price ID).

4. Run database migrations in Supabase:
   - Open your Supabase project → SQL Editor.
   - Run the SQL in `supabase/migrations/20250128000001_profiles.sql`, then `supabase/migrations/20250128000002_subscriptions.sql`.
   - Or, if using Supabase CLI: `supabase db push` from the project root.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── app/
│   ├── (auth)/
│   │   ├── login/           # Login page
│   │   └── signup/          # Sign up page
│   ├── (dashboard)/         # Protected dashboard
│   │   ├── page.tsx
│   │   └── subscribe/       # Subscription checkout
│   ├── api/
│   │   ├── auth/signout/    # Sign out
│   │   └── stripe/          # Checkout session, webhook
│   ├── layout.tsx
│   ├── page.tsx             # Home (redirects)
│   └── globals.css
├── lib/
│   └── supabase/            # Browser and server clients
├── supabase/
│   └── migrations/          # Profiles, subscriptions tables
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Customization

### Stripe

- Create a product and recurring price in Stripe Dashboard.
- Set `STRIPE_PRICE_ID` in `.env.local`.
- Configure the webhook in Stripe Dashboard: point it to `https://your-domain.com/api/stripe/webhook` (or use Stripe CLI for local testing) and set `STRIPE_WEBHOOK_SECRET`.

### Supabase

- Enable Email auth in Supabase Dashboard (Authentication → Providers).
- Optionally add more tables and migrations; keep RLS policies so users only access their own data.

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Import the project in Vercel.
3. Add environment variables (same as `.env.local`).
4. Deploy.

See the Vercel deployment guide in the Web Apps Level 2 guides for detailed instructions.

## Next Steps

1. Add your product features and pages under `app/(dashboard)/`.
2. Customize profiles and subscription plans.
3. Set up Stripe Customer Portal for “Manage subscription” if desired.
4. Deploy to production and run through signup, login, and checkout.

## Support

Refer to the Web Apps Level 2 guides for:

- Detailed setup instructions
- Troubleshooting help
- Best practices

## License

This template is provided as-is for use with the Web Apps package.
