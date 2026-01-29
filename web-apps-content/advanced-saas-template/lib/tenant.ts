import { createClient } from '@/lib/supabase/server';

/**
 * Get the current user's first organization (tenant) for this starter.
 * In a full app you might resolve tenant from subdomain, header, or org switcher.
 */
export async function getCurrentTenant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(id, name, slug)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!row) return null;
  const org = (row as { organizations: { id: string; name: string; slug: string } | null }).organizations;
  return org ? { id: org.id, name: org.name, slug: org.slug } : null;
}
