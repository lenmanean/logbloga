# Advanced SaaS Template

Enterprise-grade Next.js SaaS template with multi-tenancy, AI integration, and third-party integration example.

## Features

- Next.js 15 with App Router
- Multi-tenant architecture (organizations + members)
- Supabase (Auth + Database, RLS)
- Stripe (keys in env; extend with subscriptions as needed)
- AI integration (OpenAI) — example route and dashboard demo
- Third-party integration example — outgoing API call pattern
- Tailwind CSS
- Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- OpenAI API key (for AI example)
- Optional: Stripe and external API keys for full features

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
   Add your Supabase URL and anon key, and optionally `OPENAI_API_KEY`, Stripe keys, and `EXTERNAL_API_URL` / `EXTERNAL_API_KEY` for the integration example.

4. Run database migrations in Supabase:
   - Open your Supabase project → SQL Editor.
   - Run the SQL in `supabase/migrations/20250128000001_organizations.sql`.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── app/
│   ├── (auth)/              # Login, signup
│   ├── (dashboard)/         # Protected dashboard, AI demo, integration demo
│   ├── api/
│   │   ├── ai/example/       # AI completion route
│   │   ├── auth/signout/
│   │   ├── integrations/example/  # Outgoing API example
│   │   └── tenant/ensure/   # Optional: ensure default org
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── supabase/            # Browser and server clients
│   ├── tenant.ts             # Current tenant helper
│   └── ai/service.ts         # OpenAI wrapper
├── supabase/migrations/     # Organizations, members, profiles
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Customization

### Multi-tenancy

- First dashboard visit creates a default organization for the user.
- Extend `lib/tenant.ts` to resolve tenant from subdomain, header, or org switcher.

### AI integration

- `lib/ai/service.ts` uses OpenAI; add Anthropic or other providers as needed.
- `app/api/ai/example/route.ts` is a minimal POST route; add streaming or other models as needed.

### Third-party integration

- `app/api/integrations/example/route.ts` shows an outgoing API call. Set `EXTERNAL_API_URL` and optionally `EXTERNAL_API_KEY` in `.env.local` to call a real API.

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Import the project in Vercel.
3. Add environment variables.
4. Deploy.

See the Web Apps Level 3 guides for detailed setup instructions.

## Next Steps

1. Add Stripe subscriptions (reuse patterns from SaaS Starter Template).
2. Add more AI models or Anthropic.
3. Add org switcher and invite flow.
4. Deploy to production.

## Support

Refer to the Web Apps Level 3 guides for:

- Detailed setup instructions
- Troubleshooting help
- Best practices

## License

This template is provided as-is for use with the Web Apps package.
