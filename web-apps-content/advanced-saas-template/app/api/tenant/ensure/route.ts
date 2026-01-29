import { createServiceRoleClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Ensure the current user has at least one organization.
 * Creates a default org and adds the user if they have none.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createServiceRoleClient();
  const { data: existing } = await admin
    .from('organization_members')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, message: 'Already has org' });
  }

  const slug = `org-${user.id.slice(0, 8)}`;
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({ name: 'My Organization', slug })
    .select('id')
    .single();

  if (orgError || !org) {
    console.error(orgError);
    return NextResponse.json({ error: 'Failed to create org' }, { status: 500 });
  }

  const { error: memberError } = await admin.from('organization_members').insert({
    user_id: user.id,
    organization_id: org.id,
    role: 'owner',
  });

  if (memberError) {
    console.error(memberError);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
