/**
 * POST /api/admin/piracy/takedown
 * Admin endpoint to submit DMCA takedown request
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { submitDMCATakedown } from '@/lib/piracy/dmca';

/**
 * Check if user is admin
 */
async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createServiceRoleClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Submit DMCA takedown
    const dmcaRequestId = await submitDMCATakedown(reportId);

    return NextResponse.json({
      success: true,
      dmcaRequestId,
      message: 'DMCA takedown request submitted',
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: err.message },
        { status: 401 }
      );
    }
    console.error('Error submitting DMCA takedown:', err);
    const msg = err instanceof Error ? err.message : 'Failed to submit DMCA takedown';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
