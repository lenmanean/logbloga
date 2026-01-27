# Advanced Supabase Setup

## Overview

This guide covers advanced Supabase configurations for enterprise SaaS applications, including complex schemas, advanced RLS, database functions, and performance optimization.

## Advanced Database Design

### Multi-Tenant Architecture

**Schema Pattern**:

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tenant_id to all tables
ALTER TABLE your_table ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Index for performance
CREATE INDEX idx_your_table_tenant_id ON your_table(tenant_id);
```

### Advanced RLS Policies

**Multi-Tenant Policy**:

```sql
CREATE POLICY "Users can only access their tenant's data"
ON your_table
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members 
    WHERE user_id = auth.uid()
  )
);
```

**Role-Based Policy**:

```sql
CREATE POLICY "Admins can manage all data"
ON your_table
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

## Database Functions

### Custom Functions

**Example: Calculate Metrics**:

```sql
CREATE OR REPLACE FUNCTION calculate_user_metrics(user_uuid UUID)
RETURNS TABLE (
  total_items BIGINT,
  active_items BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_items,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_items,
    COALESCE(SUM(amount), 0) as revenue
  FROM items
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Triggers

**Audit Logging Trigger**:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW),
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_audit
AFTER INSERT OR UPDATE OR DELETE ON items
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

## Performance Optimization

### Indexing Strategy

**Common Indexes**:

```sql
-- Single column index
CREATE INDEX idx_items_user_id ON items(user_id);

-- Composite index
CREATE INDEX idx_items_user_status ON items(user_id, status);

-- Partial index (for active items only)
CREATE INDEX idx_items_active ON items(user_id) WHERE status = 'active';

-- Full-text search index
CREATE INDEX idx_items_search ON items USING gin(to_tsvector('english', content));
```

### Query Optimization

**Use EXPLAIN ANALYZE**:

```sql
EXPLAIN ANALYZE
SELECT * FROM items
WHERE user_id = '...'
AND status = 'active'
ORDER BY created_at DESC
LIMIT 10;
```

**Optimization Tips**:
- Add indexes on WHERE and JOIN columns
- Use LIMIT to reduce data transfer
- Avoid SELECT * (specify columns)
- Use pagination for large datasets

## Real-Time Features

### Enable Realtime

```sql
-- Enable realtime for a table
ALTER PUBLICATION supabase_realtime ADD TABLE items;

-- Subscribe in client
const channel = supabase
  .channel('items')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'items' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

## Storage Advanced Usage

### File Upload with Processing

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('uploads')
  .upload(`${userId}/${filename}`, file);

// Generate signed URL
const { data: urlData } = await supabase.storage
  .from('uploads')
  .createSignedUrl(`${userId}/${filename}`, 3600);
```

### Storage Policies

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Advanced Authentication

### Custom Claims

```sql
-- Add custom claim to JWT
CREATE OR REPLACE FUNCTION custom_claims(user_id UUID)
RETURNS JSONB AS $$
  SELECT jsonb_build_object(
    'tenant_id', (SELECT tenant_id FROM tenant_members WHERE user_id = $1),
    'role', (SELECT role FROM user_roles WHERE user_id = $1)
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### Row Level Security Best Practices

1. **Always enable RLS**: Never expose data without policies
2. **Test policies**: Verify with different user roles
3. **Use SECURITY DEFINER carefully**: Only for trusted functions
4. **Audit policies**: Review regularly for security

## Monitoring & Maintenance

### Database Monitoring

**Check Query Performance**:

```sql
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Maintenance Tasks

**Regular Tasks**:
- [ ] Review slow queries
- [ ] Update statistics: `ANALYZE;`
- [ ] Vacuum database: `VACUUM;`
- [ ] Review RLS policies
- [ ] Check storage usage
- [ ] Monitor API usage

## Security Hardening

### Additional Security

1. **Enable SSL**: Always use SSL connections
2. **Rotate keys**: Regularly rotate API keys
3. **Monitor access**: Review access logs
4. **Limit service role**: Only use when necessary
5. **Review policies**: Regular security audits

## Resources

- [Supabase Advanced Docs](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

**Advanced Supabase setup enables enterprise-grade features. Take time to design your schema and policies correctly!**
