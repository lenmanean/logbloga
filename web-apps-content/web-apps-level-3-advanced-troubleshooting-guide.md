# Web Apps Level 3: Advanced Troubleshooting Guide

## Overview

This guide covers advanced troubleshooting for enterprise SaaS applications, including complex issues, performance problems, and system-level debugging.

## System-Level Issues

### Issue: Database Performance Degradation

**Symptoms**:
- Slow queries (> 1 second)
- High CPU usage
- Connection timeouts
- User complaints

**Debugging**:
1. Check slow query log
2. Use EXPLAIN ANALYZE
3. Review connection pool
4. Check for locks
5. Monitor resource usage

**Solutions**:
```sql
-- Find slow queries
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_table_column ON table(column);

-- Analyze tables
ANALYZE table_name;

-- Vacuum if needed
VACUUM ANALYZE table_name;
```

### Issue: Memory Leaks

**Symptoms**:
- Increasing memory usage
- Application crashes
- Slow performance over time

**Debugging**:
1. Monitor memory usage
2. Use profiling tools
3. Check for unclosed connections
4. Review caching strategies
5. Check for circular references

**Solutions**:
- Close database connections properly
- Clear caches periodically
- Use weak references where appropriate
- Monitor and limit cache sizes
- Restart services if needed

## AI Integration Issues

### Issue: High AI Costs

**Symptoms**:
- Unexpected API costs
- Budget overruns
- Rate limit errors

**Debugging**:
1. Review usage logs
2. Check for inefficient prompts
3. Identify high-cost users
4. Review caching implementation

**Solutions**:
- Implement prompt caching
- Add usage limits per user
- Optimize prompt length
- Use cheaper models when appropriate
- Cache common responses

### Issue: AI Rate Limiting

**Symptoms**:
- API errors (429)
- Failed requests
- User complaints

**Debugging**:
1. Check rate limit headers
2. Review request patterns
3. Identify peak usage times
4. Check for retry storms

**Solutions**:
- Implement exponential backoff
- Add request queuing
- Distribute load across time
- Use multiple API keys (if allowed)
- Cache aggressively

## Multi-Tenancy Issues

### Issue: Data Leakage Between Tenants

**Symptoms**:
- Users seeing wrong data
- Security concerns
- Data integrity issues

**Debugging**:
1. Review RLS policies
2. Test with different tenants
3. Check for policy gaps
4. Review application code
5. Audit data access

**Solutions**:
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Review policies
SELECT * FROM pg_policies 
WHERE tablename = 'your_table';

-- Test policy
SET ROLE authenticated;
SET request.jwt.claim.sub = 'user-id';
SELECT * FROM your_table; -- Should only see own data
```

### Issue: Tenant Isolation Performance

**Symptoms**:
- Slow queries with tenant filter
- High database load
- Scalability concerns

**Solutions**:
- Add composite indexes on (tenant_id, other_columns)
- Use partial indexes
- Consider tenant-specific schemas (advanced)
- Optimize RLS policy expressions

## Integration Issues

### Issue: Third-Party API Failures

**Symptoms**:
- Integration errors
- Data sync issues
- User complaints

**Debugging**:
1. Check API status pages
2. Review error logs
3. Test API directly
4. Check authentication
5. Review rate limits

**Solutions**:
- Implement circuit breakers
- Add retry logic with backoff
- Use fallback providers
- Cache responses
- Monitor API health

### Issue: Webhook Delivery Failures

**Symptoms**:
- Missing events
- Data inconsistencies
- Integration issues

**Debugging**:
1. Check webhook logs
2. Verify endpoint accessibility
3. Review signature verification
4. Check for timeouts
5. Review event processing

**Solutions**:
- Implement webhook retries
- Add idempotency keys
- Use webhook queues
- Monitor delivery rates
- Set up alerts

## Performance Issues

### Issue: Slow Page Loads

**Symptoms**:
- High load times
- Poor user experience
- High bounce rates

**Debugging**:
1. Use Lighthouse
2. Check Network tab
3. Review server logs
4. Check database queries
5. Monitor Core Web Vitals

**Solutions**:
- Optimize database queries
- Implement caching
- Use edge functions
- Optimize images
- Code splitting
- Lazy loading

### Issue: API Latency

**Symptoms**:
- Slow API responses
- Timeouts
- Poor user experience

**Debugging**:
1. Check function logs
2. Review database queries
3. Check third-party calls
4. Monitor cold starts
5. Review caching

**Solutions**:
- Optimize database queries
- Add caching layers
- Use edge functions
- Optimize third-party calls
- Implement connection pooling

## Security Issues

### Issue: Unauthorized Access

**Symptoms**:
- Security alerts
- Unusual access patterns
- Data breaches

**Debugging**:
1. Review access logs
2. Check authentication
3. Review RLS policies
4. Check for vulnerabilities
5. Audit permissions

**Solutions**:
- Review and fix RLS policies
- Rotate API keys
- Review access logs
- Implement MFA
- Security audit

### Issue: SQL Injection Risks

**Symptoms**:
- Security warnings
- Potential vulnerabilities

**Solutions**:
- Always use parameterized queries
- Never concatenate user input
- Validate all inputs
- Use ORM/query builders
- Regular security audits

## Monitoring & Alerting

### Key Metrics to Monitor

**Application**:
- Response times
- Error rates
- Request volume
- Active users

**Database**:
- Query performance
- Connection count
- Storage usage
- CPU/Memory usage

**Infrastructure**:
- Server resources
- Network traffic
- CDN performance
- Edge function performance

### Alerting Setup

**Critical Alerts**:
- [ ] Error rate > 1%
- [ ] Response time > 2s
- [ ] Database CPU > 80%
- [ ] Uptime < 99.9%

**Warning Alerts**:
- [ ] Error rate > 0.5%
- [ ] Response time > 1s
- [ ] Storage > 80%
- [ ] API costs > threshold

## Debugging Tools

### Application Monitoring

- **Vercel Analytics**: Performance metrics
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Full-stack monitoring

### Database Tools

- **Supabase Dashboard**: Query performance
- **pgAdmin**: Database management
- **EXPLAIN ANALYZE**: Query analysis

### Development Tools

- **VS Code Debugger**: Step-through debugging
- **React DevTools**: Component debugging
- **Network Tab**: API debugging
- **Console Logging**: Strategic logging

## Best Practices

1. **Monitor proactively**: Don't wait for issues
2. **Log strategically**: Not too much, not too little
3. **Test thoroughly**: Before and after changes
4. **Document solutions**: For future reference
5. **Automate responses**: Where possible

---

**Advanced troubleshooting requires systematic approach. Use monitoring, logging, and debugging tools effectively!**
