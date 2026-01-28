/**
 * GET /api/cron/piracy-monitor
 * Daily automated piracy monitoring
 * Runs via Vercel Cron (free tier)
 * 
 * Schedule: Daily at 2 AM UTC
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/piracy-monitor",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextResponse } from 'next/server';
import { monitorPiracyPlatforms, getPendingPiracyReports } from '@/lib/piracy/monitoring';
import { notifyDailySummary } from '@/lib/piracy/notifications';

/**
 * Verify cron request is from Vercel
 */
function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Vercel sends Authorization header with cron secret
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Also allow Vercel's internal cron header
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') {
    return true;
  }

  return false;
}

export async function GET(request: Request) {
  // Verify this is a legitimate cron request
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('Starting daily piracy monitoring...');

    // 1. Search for new piracy
    const newReports = await monitorPiracyPlatforms();
    console.log(`Found ${newReports.length} new piracy reports`);

    // 2. Get pending reports count
    const pendingReports = await getPendingPiracyReports();
    const pendingCount = pendingReports.length;

    // 3. Count DMCA requests submitted today
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    const today = new Date().toISOString().split('T')[0];
    const { count: submittedToday } = await supabase
      .from('dmca_takedown_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted')
      .gte('submitted_at', `${today}T00:00:00Z`);

    // 4. Send daily summary email
    await notifyDailySummary(
      newReports.length,
      pendingCount,
      submittedToday || 0
    );

    return NextResponse.json({
      success: true,
      newReports: newReports.length,
      pendingReports: pendingCount,
      submittedToday: submittedToday || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in piracy monitoring cron:', error);
    return NextResponse.json(
      {
        error: 'Monitoring failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
