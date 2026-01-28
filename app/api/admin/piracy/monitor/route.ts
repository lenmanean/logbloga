/**
 * POST /api/admin/piracy/monitor
 * Admin endpoint to trigger piracy monitoring scan
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { monitorPiracyPlatforms, getPendingPiracyReports } from '@/lib/piracy/monitoring';

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

export async function POST() {
  try {
    await requireAdmin();

    // Run monitoring scan
    const reports = await monitorPiracyPlatforms();

    return NextResponse.json({
      success: true,
      reportsFound: reports.length,
      reports,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: err.message },
        { status: 401 }
      );
    }
    console.error('Error in piracy monitoring:', err);
    return NextResponse.json(
      { error: 'Failed to run monitoring scan' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();

    // Get pending reports
    const pendingReports = await getPendingPiracyReports();

    return NextResponse.json({
      success: true,
      pendingReports,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: err.message },
        { status: 401 }
      );
    }
    console.error('Error fetching pending reports:', err);
    return NextResponse.json(
      { error: 'Failed to fetch pending reports' },
      { status: 500 }
    );
  }
}
