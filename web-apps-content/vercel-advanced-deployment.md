# Vercel Advanced Deployment Guide

## Overview

This guide covers advanced Vercel deployment configurations for SaaS applications, including environment variables, edge functions, custom domains, and performance optimization.

**Documentation**: [vercel.com/docs](https://vercel.com/docs)

## Advanced Configuration

### Environment Variables Management

#### Per-Environment Variables

1. Go to Project Settings → Environment Variables
2. Set variables for:
   - **Production**: Live environment
   - **Preview**: All preview deployments
   - **Development**: Local development (optional)

#### Variable Groups

Organize variables:
- `STRIPE_*`: Payment-related
- `SUPABASE_*`: Database-related
- `NEXT_PUBLIC_*`: Client-side variables

### Custom Build Settings

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Edge Functions

### Create Edge Function

Create `app/api/edge/route.ts`:

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({ message: 'Hello from Edge!' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
```

### Edge Function Benefits

- Lower latency (runs closer to users)
- Faster cold starts
- Global distribution
- Cost-effective

## Custom Domains

### Add Domain

1. Go to Settings → Domains
2. Enter your domain
3. Follow DNS configuration:
   - **A Record**: Point to Vercel IP
   - **CNAME**: Point to Vercel domain

### SSL Certificate

- Automatic with Vercel
- Renews automatically
- Supports custom domains

## Performance Optimization

### Image Optimization

Next.js Image component is automatically optimized:

```typescript
import Image from 'next/image';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

### Caching Strategy

Configure in `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};
```

## Monitoring & Analytics

### Vercel Analytics

1. Go to Analytics tab
2. Enable Web Analytics (free tier available)
3. Monitor:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers

### Speed Insights

1. Enable Speed Insights
2. Track:
   - Core Web Vitals
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

## Deployment Strategies

### Branch-Based Deployments

- **main branch**: Production
- **feature branches**: Preview deployments
- **Pull requests**: Automatic previews

### Deployment Protection

1. Go to Settings → Git
2. Enable "Production Branch Protection"
3. Require approval before deploying

### Rollback

1. Go to Deployments tab
2. Find previous deployment
3. Click three dots → "Promote to Production"

## Environment-Specific Configs

### Production Checklist

- [ ] All environment variables set
- [ ] Stripe in live mode
- [ ] Supabase production project
- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Error tracking set up
- [ ] Monitoring active

## Advanced Features

### Serverless Functions

Vercel automatically converts API routes to serverless functions:

```typescript
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' });
}
```

### Incremental Static Regeneration (ISR)

```typescript
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

## Troubleshooting

### Build Failures

**Check**:
- Build logs for specific errors
- Environment variables are set
- Dependencies are compatible
- Node version matches

### Slow Deployments

**Optimize**:
- Reduce build time
- Use build caching
- Optimize dependencies
- Split large builds

## Best Practices

1. **Use preview deployments**: Test before production
2. **Monitor performance**: Track Core Web Vitals
3. **Set up alerts**: Get notified of issues
4. **Version control**: Use Git for all changes
5. **Documentation**: Keep deployment docs updated

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)

---

**Your advanced deployment setup is complete!** Monitor and optimize continuously.
