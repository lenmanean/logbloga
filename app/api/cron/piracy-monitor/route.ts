/**
 * GET /api/cron/piracy-monitor
 * Daily piracy monitoring. Can be run manually from Vercel dashboard.
 * On Hobby, the scheduled run is via /api/cron/daily (single daily cron).
 */

import { NextResponse } from 'next/server';
import { runPiracyMonitor } from '@/lib/cron/run-piracy-monitor';

function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get('x-vercel-cron') === '1') return true;
  return false;
}

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await runPiracyMonitor();
    return NextResponse.json({
      success: true,
      ...result,
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
