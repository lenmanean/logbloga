# Deployment Guide for LogBloga

This guide will walk you through deploying LogBloga to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Supabase project set up
- Stripe account configured
- Domain name (logbloga.com) configured

## Step 1: Prepare Your Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a GitHub repository and push:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the script from `supabase/schema.sql`
3. Go to Storage and create these buckets:
   - `digital-products` (Private bucket)
   - `blog-images` (Public bucket)
   - `product-images` (Public bucket)
4. Note your project URL and API keys from Project Settings > API

## Step 3: Configure Stripe

1. Create a Stripe account or use existing one
2. Get your API keys from Stripe Dashboard > Developers > API keys
3. Set up a webhook endpoint:
   - In Stripe Dashboard, go to Developers > Webhooks
   - Click "Add endpoint"
   - Use your production URL: `https://logbloga.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret

## Step 4: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
   - `NEXT_PUBLIC_APP_URL` - https://logbloga.com (or your domain)

6. Click "Deploy"

## Step 5: Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your domain: `logbloga.com`
3. Follow Vercel's instructions to configure DNS:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to Vercel's domain
4. Wait for DNS propagation (can take up to 48 hours)

## Step 6: Update Stripe Webhook

1. Go back to Stripe Dashboard > Webhooks
2. Update your webhook endpoint URL to use your custom domain:
   - `https://logbloga.com/api/webhooks/stripe`
3. Verify the webhook is working by testing a checkout

## Step 7: Verify Deployment

Test the following:
- [ ] Homepage loads correctly
- [ ] Product pages display
- [ ] Blog pages display
- [ ] User registration/login works
- [ ] Stripe checkout creates sessions
- [ ] Webhook processes payments correctly
- [ ] Downloads work for purchased products
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] RSS feed is accessible at `/feed.xml`

## Step 8: Post-Deployment Tasks

1. **Add Sample Content**:
   - Add products via Supabase dashboard or create an admin interface
   - Create blog posts in the `content/blog/` directory and add metadata to database

2. **Set Up Analytics**:
   - Consider adding Vercel Analytics or Google Analytics
   - Configure in your project settings

3. **Email Setup** (Optional):
   - Set up Resend or SendGrid for transaction emails
   - Add `RESEND_API_KEY` to environment variables

4. **SEO**:
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Set up Google Analytics

## Troubleshooting

### Webhook Not Working
- Verify webhook URL is correct in Stripe dashboard
- Check webhook secret matches environment variable
- Check Vercel function logs for errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check RLS policies are set correctly
- Ensure service role key is used for server-side operations

### File Downloads Not Working
- Verify storage buckets exist and are configured correctly
- Check file paths in product records
- Verify signed URL generation is working

## Support

If you encounter issues during deployment, check:
- Vercel deployment logs
- Stripe webhook logs
- Supabase logs
- Browser console for client-side errors

