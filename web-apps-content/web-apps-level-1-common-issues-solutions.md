# Web Apps Level 1: Common Issues & Solutions

## Overview

This guide covers the most common issues you'll encounter when building and deploying your Level 1 web app, along with proven solutions.

## Development Issues

### Issue: "Module not found" Errors

**Symptoms**:
- Error: `Cannot find module 'xyz'`
- Build fails with missing dependencies

**Solutions**:
1. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check package.json**: Ensure the package is listed
3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Issue: Port 3000 Already in Use

**Symptoms**:
- Error: `Port 3000 is already in use`
- Dev server won't start

**Solutions**:
1. **Use different port**:
   ```bash
   npm run dev -- -p 3001
   ```

2. **Kill process on port 3000**:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

### Issue: TypeScript Errors

**Symptoms**:
- Type errors in IDE
- Build fails with type errors

**Solutions**:
1. **Install missing types**:
   ```bash
   npm install -D @types/node @types/react @types/react-dom
   ```

2. **Check tsconfig.json**: Ensure proper configuration
3. **Restart TypeScript server**: In VS Code, Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

### Issue: Styling Not Working (Tailwind)

**Symptoms**:
- Tailwind classes not applying
- Styles not updating

**Solutions**:
1. **Check tailwind.config.js**: Ensure content paths are correct
2. **Restart dev server**: Sometimes needed after config changes
3. **Verify globals.css**: Ensure Tailwind directives are imported
4. **Clear cache**: `rm -rf .next`

## Stripe Integration Issues

### Issue: "Invalid API Key"

**Symptoms**:
- Error: `Invalid API Key provided`
- Payments fail

**Solutions**:
1. **Check environment variables**:
   - Verify keys in `.env.local`
   - Ensure no extra spaces
   - Use correct test/live keys

2. **Verify key format**:
   - Publishable: `pk_test_...` or `pk_live_...`
   - Secret: `sk_test_...` or `sk_live_...`

3. **Check Stripe Dashboard**: Ensure keys match account

### Issue: Payment Form Not Loading

**Symptoms**:
- Stripe Elements not rendering
- Blank payment form

**Solutions**:
1. **Check Stripe.js loading**:
   ```typescript
   const stripePromise = loadStripe(
     process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
   );
   ```

2. **Verify environment variable**: Check it's prefixed with `NEXT_PUBLIC_`
3. **Check browser console**: Look for JavaScript errors
4. **Verify Elements wrapper**: Ensure `<Elements>` wraps payment form

### Issue: Payment Succeeds But No Webhook

**Symptoms**:
- Payment processes but backend doesn't know
- No confirmation email sent

**Solutions**:
1. **Set up webhook endpoint**: Create API route for webhooks
2. **Use Stripe CLI for testing**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```

3. **Verify webhook signature**: Always verify in production
4. **Check webhook logs**: In Stripe Dashboard → Developers → Events

## Deployment Issues

### Issue: Build Fails on Vercel

**Symptoms**:
- Deployment fails
- Build errors in Vercel logs

**Solutions**:
1. **Test build locally first**:
   ```bash
   npm run build
   ```

2. **Check environment variables**: Ensure all are set in Vercel
3. **Review build logs**: Look for specific error messages
4. **Check Node version**: Ensure compatible version in `package.json`

### Issue: Environment Variables Not Working

**Symptoms**:
- Variables undefined in production
- API calls fail

**Solutions**:
1. **Verify in Vercel**: Settings → Environment Variables
2. **Check naming**: Must match exactly (case-sensitive)
3. **Redeploy after adding**: Variables only apply to new deployments
4. **Use correct prefix**: `NEXT_PUBLIC_` for client-side variables

### Issue: Site Works Locally But Not on Vercel

**Symptoms**:
- Everything works in development
- Production site has errors

**Solutions**:
1. **Check build output**: Look for warnings
2. **Verify API routes**: Ensure they're in `app/api/` directory
3. **Check server/client components**: Ensure proper usage
4. **Review Vercel function logs**: Check for runtime errors

## Performance Issues

### Issue: Slow Page Loads

**Symptoms**:
- Pages take > 3 seconds to load
- Poor Lighthouse scores

**Solutions**:
1. **Optimize images**: Use Next.js Image component
2. **Reduce bundle size**: Remove unused dependencies
3. **Enable caching**: Use appropriate cache headers
4. **Use Vercel Analytics**: Monitor performance

### Issue: Large Bundle Size

**Symptoms**:
- Slow initial load
- Large JavaScript bundles

**Solutions**:
1. **Analyze bundle**:
   ```bash
   npm run build
   # Check .next/analyze for breakdown
   ```

2. **Use dynamic imports**: Lazy load heavy components
3. **Remove unused code**: Tree-shaking helps
4. **Optimize dependencies**: Use lighter alternatives

## Git & GitHub Issues

### Issue: "Authentication Failed" When Pushing

**Symptoms**:
- Can't push to GitHub
- Authentication errors

**Solutions**:
1. **Use Personal Access Token**: Instead of password
2. **Check SSH keys**: If using SSH authentication
3. **Verify remote URL**: `git remote -v`
4. **Re-authenticate**: `git credential-manager-core erase`

### Issue: Merge Conflicts

**Symptoms**:
- Can't pull/push
- Conflicting changes

**Solutions**:
1. **Pull latest first**: `git pull origin main`
2. **Resolve conflicts**: Edit conflicted files
3. **Stage resolved files**: `git add .`
4. **Complete merge**: `git commit`

## Common Next.js Errors

### Issue: "Hydration Mismatch"

**Symptoms**:
- Warning in console
- Content doesn't match server/client

**Solutions**:
1. **Check for browser-only code**: Use `useEffect` for client-side
2. **Avoid `Date.now()` in render**: Causes mismatches
3. **Check for conditional rendering**: Ensure consistency
4. **Use `suppressHydrationWarning`**: Only as last resort

### Issue: API Route Returns 404

**Symptoms**:
- API calls fail
- Route not found

**Solutions**:
1. **Check file location**: Must be in `app/api/route-name/route.ts`
2. **Verify export**: Must export `GET`, `POST`, etc.
3. **Check file naming**: Must be exactly `route.ts`
4. **Restart dev server**: Sometimes needed

## Getting Help

### When to Seek Help

- Issue persists after trying solutions
- Error messages are unclear
- Critical functionality broken
- Security concerns

### Where to Get Help

1. **Documentation**: Check official docs first
2. **Stack Overflow**: Search for similar issues
3. **GitHub Issues**: Check project issue trackers
4. **Community Forums**: Reddit, Discord, etc.
5. **AI Tools**: ChatGPT, Cursor for explanations

### How to Ask for Help

**Include**:
- Error messages (full text)
- Steps to reproduce
- What you've tried
- Environment details (OS, Node version, etc.)
- Code snippets (relevant parts)

## Prevention Tips

### Best Practices

1. **Test locally first**: Always test before deploying
2. **Use version control**: Commit frequently
3. **Read error messages**: They usually tell you what's wrong
4. **Keep dependencies updated**: But test after updates
5. **Document your setup**: Helps when issues arise

### Regular Maintenance

- **Weekly**: Update dependencies, check for security issues
- **Monthly**: Review and optimize performance
- **Quarterly**: Major dependency updates, architecture review

---

**Remember**: Most issues have simple solutions. Take a break, read the error message carefully, and try the solutions above. You've got this!
