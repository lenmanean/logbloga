/**
 * GET /api/cron/abandoned-cart
 * Enqueues abandoned cart reminder emails for users with non-empty cart
 * whose oldest cart item is older than the configured window (e.g. 1 hour).
 *
 * Runs via Vercel Cron. Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/abandoned-cart",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 * (e.g. hourly). Secure with CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 */

import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { queueEmail } from '@/lib/email/queue';
import type { AbandonedCartEmailData } from '@/lib/email/types';

const ABANDONED_WINDOW_HOURS = 1;

function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createServiceRoleClient();
    const windowStart = new Date(Date.now() - ABANDONED_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    // Users who have at least one cart item older than the window
    const { data: cartRows, error: cartError } = await supabase
      .from('cart_items')
      .select('user_id, created_at')
      .lt('created_at', windowStart);

    if (cartError) {
      console.error('Abandoned cart cron: error fetching cart_items', cartError);
      return NextResponse.json(
        { error: 'Failed to fetch cart data' },
        { status: 500 }
      );
    }

    const userIds = [...new Set((cartRows || []).map((r) => r.user_id).filter(Boolean))] as string[];
    if (userIds.length === 0) {
      return NextResponse.json({ enqueued: 0, message: 'No abandoned carts' });
    }

    let enqueued = 0;
    for (const userId of userIds) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single();

        if (!profile?.email) continue;

        const { data: items, error: itemsError } = await supabase
          .from('cart_items')
          .select(`
            quantity,
            product:products(title, slug, price)
          `)
          .eq('user_id', userId);

        if (itemsError || !items?.length) continue;

        const cartItems = items
          .map((row: { quantity: number; product: { title?: string; slug?: string; price?: number } | null }) => {
            const p = row.product;
            const title = p?.title ?? 'Product';
            const slug = p?.slug ?? '';
            const price = typeof p?.price === 'number' ? p.price : parseFloat(String(p?.price ?? 0));
            return {
              productName: title,
              productSlug: slug,
              quantity: row.quantity || 1,
              price,
            };
          })
          .filter((item: { productName: string }) => item.productName);

        if (cartItems.length === 0) continue;

        const data: AbandonedCartEmailData = {
          user: {
            email: profile.email,
            name: profile.full_name ?? null,
          },
          cartItems,
        };

        await queueEmail(userId, 'abandoned-cart', data);
        enqueued++;
      } catch (err) {
        console.error(`Abandoned cart cron: error for user ${userId}`, err);
      }
    }

    return NextResponse.json({ enqueued, totalCandidates: userIds.length });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron failed' },
      { status: 500 }
    );
  }
}
