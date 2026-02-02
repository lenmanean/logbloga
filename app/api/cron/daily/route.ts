/**
 * GET /api/cron/daily
 * Single daily cron for Hobby accounts (Vercel allows only one cron per day on Hobby).
 * Runs: piracy monitoring + abandoned-cart reminders.
 *
 * Schedule: Daily at 2 AM UTC (vercel.json: "0 2 * * *")
 * Secure with CRON_SECRET (Authorization: Bearer <CRON_SECRET>) or x-vercel-cron.
 */

import { NextResponse } from 'next/server';
import { runPiracyMonitor } from '@/lib/cron/run-piracy-monitor';
import { runAbandonedCart } from '@/lib/cron/run-abandoned-cart';

function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  if (request.headers.get('x-vercel-cron') === '1') {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  const results: {
    success: boolean;
    piracy?: Awaited<ReturnType<typeof runPiracyMonitor>>;
    abandonedCart?: Awaited<ReturnType<typeof runAbandonedCart>>;
    error?: string;
    timestamp: string;
  } = { success: true, timestamp };

  try {
    results.piracy = await runPiracyMonitor();
  } catch (error) {
    console.error('Daily cron: piracy monitor failed', error);
    results.success = false;
    results.error =
      (error instanceof Error ? error.message : 'Piracy monitor failed') +
      (results.error ? `; ${results.error}` : '');
  }

  try {
    results.abandonedCart = await runAbandonedCart();
  } catch (error) {
    console.error('Daily cron: abandoned-cart failed', error);
    results.success = false;
    results.error =
      (error instanceof Error ? error.message : 'Abandoned-cart failed') +
      (results.error ? `; ${results.error}` : '');
  }

  const status = results.success ? 200 : 500;
  return NextResponse.json(results, { status });
}
