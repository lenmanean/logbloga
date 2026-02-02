/**
 * Shared logic for abandoned-cart cron.
 * Used by /api/cron/abandoned-cart and /api/cron/daily.
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import { queueEmail } from '@/lib/email/queue';
import type { AbandonedCartEmailData } from '@/lib/email/types';

const ABANDONED_WINDOW_HOURS = 1;

export type AbandonedCartResult = {
  enqueued: number;
  totalCandidates: number;
};

export async function runAbandonedCart(): Promise<AbandonedCartResult> {
  const supabase = await createServiceRoleClient();
  const windowStart = new Date(
    Date.now() - ABANDONED_WINDOW_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: cartRows, error: cartError } = await supabase
    .from('cart_items')
    .select('user_id, created_at')
    .lt('created_at', windowStart);

  if (cartError) {
    console.error('Abandoned cart cron: error fetching cart_items', cartError);
    throw new Error('Failed to fetch cart data');
  }

  const userIds = [
    ...new Set((cartRows || []).map((r) => r.user_id).filter(Boolean)),
  ] as string[];
  if (userIds.length === 0) {
    return { enqueued: 0, totalCandidates: 0 };
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
        .map(
          (row: {
            quantity: number;
            product: { title?: string; slug?: string; price?: number } | null;
          }) => {
            const p = row.product;
            const title = p?.title ?? 'Product';
            const slug = p?.slug ?? '';
            const price =
              typeof p?.price === 'number' ? p.price : parseFloat(String(p?.price ?? 0));
            return {
              productName: title,
              productSlug: slug,
              quantity: row.quantity || 1,
              price,
            };
          }
        )
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

  return { enqueued, totalCandidates: userIds.length };
}
