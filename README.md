# LogBloga

A modern digital product store and technology blog built with Next.js 14, TypeScript, Supabase, and Stripe.

## Features

- 🛍️ **Digital Product Store** - Sell digital products with secure file delivery
- 📝 **Blog System** - MDX-based blog with SEO optimization
- 🔐 **Authentication** - User accounts with Supabase Auth
- 💳 **Payment Processing** - Stripe Checkout integration
- 📦 **Secure Downloads** - Protected file downloads with expiration
- 📱 **Responsive Design** - Mobile-first, modern UI with Tailwind CSS
- 🔍 **SEO Optimized** - Sitemap, RSS feed, and metadata support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: MDX for blog posts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd logbloga
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL script from `supabase/schema.sql` in the SQL Editor
   - Create storage buckets:
     - `digital-products` (Private)
     - `blog-images` (Public)
     - `product-images` (Public)

6. Configure Stripe:
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Use webhook secret in environment variables

7. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
logbloga/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── blog/             # Blog components
│   └── account/          # Account components
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── stripe/           # Stripe utilities
│   └── db/               # Database queries
├── content/              # MDX blog posts
├── supabase/             # Database schema
└── types/                # TypeScript types
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See `DEPLOYMENT.md` for detailed deployment instructions.

## Environment Variables

Required environment variables are listed in `.env.example`. Make sure to set all of them before deploying.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
