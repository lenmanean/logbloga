/**
 * GET /api/cron/abandoned-cart
 * Enqueues abandoned-cart reminder emails. Can be run manually from Vercel dashboard.
 * On Hobby, the scheduled run is via /api/cron/daily (single daily cron).
 */

import { NextResponse } from 'next/server';
import { runAbandonedCart } from '@/lib/cron/run-abandoned-cart';

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
    const result = await runAbandonedCart();
    return NextResponse.json({
      enqueued: result.enqueued,
      totalCandidates: result.totalCandidates,
      message: result.enqueued === 0 ? 'No abandoned carts' : undefined,
    });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron failed' },
      { status: 500 }
    );
  }
}
