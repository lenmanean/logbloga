# Basic Starter Template

A minimal Next.js starter template for building a simple landing page SaaS with Stripe integration.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Stripe payment integration setup
- Responsive design
- Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Extract this template to your project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables: Copy `.env.example` to `.env.local` and add your Stripe keys (see below).
   ```bash
   cp .env.example .env.local
   ```

4. Add your Stripe keys to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── create-payment-intent/
│   │       └── route.ts          # Stripe payment API
│   ├── payment/
│   │   ├── page.tsx              # Payment page
│   │   └── success/
│   │       └── page.tsx          # Success page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   └── CheckoutForm.tsx          # Stripe checkout form
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## Customization

### Landing Page

Edit `app/page.tsx` to customize your landing page:
- Update hero section
- Add your features
- Modify call-to-action

### Styling

Styles are in `app/globals.css` using Tailwind CSS. Customize colors and spacing as needed.

### Stripe Integration

Payment processing is set up in:
- `app/api/create-payment-intent/route.ts` - Server-side payment creation
- `components/CheckoutForm.tsx` - Client-side payment form

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See the Vercel deployment guide for detailed instructions.

## Next Steps

1. Customize the landing page
2. Set up your Stripe products
3. Test payment flow
4. Deploy to production
5. Start marketing!

## Support

Refer to the Web Apps Level 1 guides for:
- Detailed setup instructions
- Troubleshooting help
- Best practices

## License

This template is provided as-is for use with the Web Apps package.
