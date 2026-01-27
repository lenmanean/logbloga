# Vercel Deployment Guide

## Overview

This guide walks you through deploying your Next.js application to Vercel. Vercel is the platform created by the Next.js team and provides the best deployment experience for Next.js apps.

**Current Documentation**: [vercel.com/docs](https://vercel.com/docs)
**Free Tier**: Includes unlimited personal projects, 100GB bandwidth, and automatic HTTPS

## Prerequisites

- A Next.js project ready to deploy
- A GitHub, GitLab, or Bitbucket account
- Your code pushed to a Git repository

## Step 1: Prepare Your Project

### 1.1 Push to GitHub

If you haven't already:

1. Create a new repository on GitHub
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### 1.2 Check Your `.gitignore`

Ensure `.gitignore` includes:
```
.env.local
.env*.local
node_modules
.next
.vercel
```

### 1.3 Verify Build Works Locally

Test your production build:
```bash
npm run build
```

If this fails, fix errors before deploying.

## Step 2: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your GitHub account

## Step 3: Deploy Your Project

### Option A: Import from GitHub (Recommended)

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

   Follow the prompts:
   - Link to existing project? → No (first time)
   - Project name? → Your project name
   - Directory? → ./
   - Override settings? → No

## Step 4: Configure Environment Variables

### 4.1 Add Environment Variables

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Value**: Your Stripe publishable key
   - **Environment**: Production, Preview, Development (select all)

4. Repeat for all environment variables:
   - `STRIPE_SECRET_KEY` (Production only)
   - `NEXT_PUBLIC_API_URL` (if needed)
   - Any other variables your app needs

### 4.2 Redeploy After Adding Variables

After adding environment variables, trigger a new deployment:
- Go to "Deployments" tab
- Click the three dots on latest deployment
- Click "Redeploy"

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain

1. Go to "Settings" → "Domains"
2. Enter your domain name
3. Follow DNS configuration instructions

### 5.2 Configure DNS

Vercel will provide DNS records to add:
- **A Record**: Point to Vercel's IP
- **CNAME Record**: Point to Vercel's domain

**Note**: DNS changes can take 24-48 hours to propagate.

## Step 6: Verify Deployment

### 6.1 Check Build Logs

1. Go to "Deployments" tab
2. Click on your deployment
3. Review build logs for any errors

### 6.2 Test Your Site

1. Visit your deployment URL (e.g., `your-app.vercel.app`)
2. Test all functionality
3. Verify environment variables are working

## Step 7: Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and pull requests

### 7.1 Branch Protection

To require manual approval:
1. Go to "Settings" → "Git"
2. Enable "Production Branch Protection"
3. Require approval before deploying to production

## Step 8: Performance Optimization

### 8.1 Enable Analytics

1. Go to "Analytics" tab
2. Enable Web Analytics (free tier available)
3. Monitor Core Web Vitals

### 8.2 Enable Speed Insights

1. Go to "Speed Insights" tab
2. Enable to track performance metrics

### 8.3 Image Optimization

Next.js Image component is automatically optimized on Vercel:
```typescript
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
/>
```

## Step 9: Monitoring and Logs

### 9.1 View Logs

1. Go to "Deployments" tab
2. Click on a deployment
3. View "Build Logs" and "Function Logs"

### 9.2 Set Up Alerts

1. Go to "Settings" → "Notifications"
2. Configure email alerts for:
   - Failed deployments
   - Successful deployments
   - Domain status changes

## Common Issues and Solutions

### Build Fails

**Error**: Module not found
**Solution**: Ensure all dependencies are in `package.json`, not just installed locally

**Error**: Environment variable missing
**Solution**: Add all required variables in Vercel dashboard

### Deployment Works But App Doesn't

**Check**:
1. Environment variables are set correctly
2. API routes are working
3. External API keys are valid
4. Check browser console for errors

### Slow Builds

**Optimize**:
1. Reduce bundle size
2. Use dynamic imports for large libraries
3. Enable build caching in `vercel.json`

## Advanced Configuration

### vercel.json

Create `vercel.json` in project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Headers and Redirects

Configure in `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}
```

## Best Practices

1. **Always test locally first**: `npm run build` should succeed
2. **Use environment variables**: Never commit secrets
3. **Monitor deployments**: Check logs after each deploy
4. **Use preview deployments**: Test changes before production
5. **Set up error tracking**: Integrate Sentry or similar

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## Next Steps

After deployment:
1. Test your live site thoroughly
2. Set up monitoring and analytics
3. Configure custom domain (if desired)
4. Set up CI/CD workflows
5. Move on to Stripe integration guide

---

**Congratulations!** Your app is now live on the internet. Share your deployment URL and start getting users!
