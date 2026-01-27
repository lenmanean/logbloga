# Web Apps Level 2: Troubleshooting & Debugging Guide

## Overview

This guide covers common issues you'll encounter when building a SaaS MVP and how to debug them effectively.

## Database Issues

### Issue: RLS Blocking Queries

**Symptoms**:
- Queries return empty results
- "Permission denied" errors
- Data exists but can't access

**Debugging**:
1. Check RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
2. Verify policies exist: Check Supabase Dashboard → Authentication → Policies
3. Test with service role key (bypasses RLS) to verify data exists
4. Check user authentication: `SELECT auth.uid();`

**Solutions**:
```sql
-- Example policy
CREATE POLICY "Users can read own data"
ON your_table
FOR SELECT
USING (auth.uid() = user_id);
```

### Issue: Slow Queries

**Symptoms**:
- Pages load slowly
- Timeouts
- High database CPU

**Debugging**:
1. Check query execution time in Supabase logs
2. Use EXPLAIN ANALYZE in SQL editor
3. Check for missing indexes
4. Review query patterns

**Solutions**:
- Add indexes on frequently queried columns
- Optimize JOINs
- Use pagination
- Cache frequently accessed data

## Authentication Issues

### Issue: Session Not Persisting

**Symptoms**:
- User logged out on refresh
- Session expires immediately
- Cookies not set

**Debugging**:
1. Check browser cookies (DevTools → Application → Cookies)
2. Verify middleware configuration
3. Check Supabase client setup
4. Review cookie settings

**Solutions**:
- Ensure middleware is configured correctly
- Check cookie domain and path settings
- Verify Supabase client uses SSR package
- Check CORS settings

### Issue: Redirect Loops

**Symptoms**:
- Infinite redirects
- Can't access protected routes
- Browser shows redirect error

**Debugging**:
1. Check middleware logic
2. Verify redirect URLs
3. Check authentication state
4. Review route protection

**Solutions**:
- Fix middleware conditions
- Ensure proper redirect paths
- Check authentication checks
- Add logging to debug flow

## Stripe Integration Issues

### Issue: Webhook Not Receiving Events

**Symptoms**:
- Payments succeed but database not updated
- No webhook logs
- Subscription status incorrect

**Debugging**:
1. Check webhook endpoint is accessible
2. Verify webhook secret matches
3. Check Stripe Dashboard → Webhooks → Events
4. Test with Stripe CLI locally

**Solutions**:
```bash
# Test locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Issue: Subscription Status Mismatch

**Symptoms**:
- Database shows different status than Stripe
- Users can't access features
- Billing issues

**Debugging**:
1. Compare database vs Stripe Dashboard
2. Check webhook processing
3. Review event handling logic
4. Check for missed events

**Solutions**:
- Sync subscription status from Stripe
- Replay missed webhook events
- Add reconciliation job
- Improve error handling

## Performance Issues

### Issue: Slow Page Loads

**Symptoms**:
- Pages take > 3 seconds
- Poor Lighthouse scores
- User complaints

**Debugging**:
1. Use Next.js Analytics
2. Check Network tab in DevTools
3. Review database query times
4. Check bundle size

**Solutions**:
- Optimize database queries
- Implement caching
- Code splitting
- Image optimization
- Reduce bundle size

### Issue: High API Latency

**Symptoms**:
- API routes slow
- Timeouts
- Poor user experience

**Debugging**:
1. Check Vercel function logs
2. Review database query performance
3. Check third-party API calls
4. Monitor function execution time

**Solutions**:
- Optimize database queries
- Add caching layer
- Use edge functions where possible
- Optimize third-party calls

## Deployment Issues

### Issue: Build Fails on Vercel

**Symptoms**:
- Deployment fails
- Build errors in logs
- Environment issues

**Debugging**:
1. Check build logs in Vercel
2. Test build locally: `npm run build`
3. Verify environment variables
4. Check Node version compatibility

**Solutions**:
- Fix TypeScript errors
- Update dependencies
- Set correct Node version
- Add missing environment variables

### Issue: Environment Variables Not Working

**Symptoms**:
- Variables undefined
- API calls fail
- Features not working

**Debugging**:
1. Verify variables in Vercel dashboard
2. Check variable names (case-sensitive)
3. Ensure `NEXT_PUBLIC_` prefix for client-side
4. Redeploy after adding variables

**Solutions**:
- Double-check variable names
- Add all required variables
- Redeploy application
- Test in preview deployment first

## Common Debugging Techniques

### 1. Add Logging

```typescript
console.log('Debug:', { variable1, variable2 });
// Or use proper logging library
```

### 2. Use Debugger

```typescript
debugger; // Pause execution
// Or use VS Code debugger
```

### 3. Check Network Tab

- Inspect API requests
- Check response status
- Review request/response data
- Verify headers

### 4. Database Queries

```sql
-- Check data exists
SELECT * FROM table_name LIMIT 10;

-- Check user permissions
SELECT auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

## Getting Help

### When to Ask for Help

- Issue persists after trying solutions
- Error messages unclear
- Critical functionality broken
- Security concerns

### Where to Get Help

1. **Documentation**: Official docs first
2. **Stack Overflow**: Search for similar issues
3. **GitHub Issues**: Check project repositories
4. **Community Forums**: Reddit, Discord
5. **AI Tools**: ChatGPT, Cursor for explanations

### How to Ask

**Include**:
- Error messages (full text)
- Steps to reproduce
- What you've tried
- Environment details
- Code snippets

## Prevention

### Best Practices

1. **Test locally first**: Always test before deploying
2. **Use version control**: Commit frequently
3. **Monitor errors**: Set up error tracking
4. **Review logs**: Check regularly
5. **Document issues**: Keep notes on solutions

---

**Remember**: Most issues have solutions. Take breaks, read error messages carefully, and don't hesitate to ask for help!
