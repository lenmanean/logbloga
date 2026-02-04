/**
 * GET /api/products/[id]/reviews — List approved reviews (public)
 * POST /api/products/[id]/reviews — Submit a review (authenticated, one per user per product)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/utils';
import { getProductById } from '@/lib/db/products';
import { productReviewSubmitSchema } from '@/lib/security/validation';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Public: list approved reviews for a product with pagination */
export async function GET(request: Request, { params }: RouteParams) {
  return withRateLimit(request, { type: 'public' }, async () => {
    try {
      const { id: productId } = await params;
      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }

      const product = await getProductById(productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const { searchParams } = new URL(request.url);
      const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
      const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

      const supabase = await createClient();
      const { data: rows, error } = await supabase
        .from('reviews')
        .select('id, rating, content, title, reviewer_display_name, created_at')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
      }

      return NextResponse.json({
        reviews: rows || [],
        limit,
        offset,
      });
    } catch (err) {
      if (err instanceof Error && (err as any).status === 401) {
        throw err;
      }
      console.error('GET /api/products/[id]/reviews:', err);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
  });
}

/** Authenticated: submit a review (one per user per product; 409 if already reviewed) */
export async function POST(request: Request, { params }: RouteParams) {
  return withRateLimit(request, { type: 'authenticated' }, async () => {
    try {
      const user = await requireAuth();
      const { id: productId } = await params;
      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }

      const product = await getProductById(productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const body = await request.json().catch(() => ({}));
      const parsed = productReviewSubmitSchema.safeParse(body);
      if (!parsed.success) {
        const msg = parsed.error.flatten().fieldErrors?.content?.[0]
          || parsed.error.flatten().fieldErrors?.rating?.[0]
          || parsed.error.flatten().fieldErrors?.reviewer_display_name?.[0]
          || 'Invalid request';
        return NextResponse.json({ error: msg }, { status: 400 });
      }

      const { rating, reviewer_display_name, content } = parsed.data;

      const supabase = await createClient();

      const { data: existing } = await supabase
        .from('reviews')
        .select('id, status')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'You have already submitted a review for this product. You can edit it from your account.' },
          { status: 409 }
        );
      }

      const { data: completedOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(50);
      const orderIds = (completedOrders || []).map((o) => o.id);
      let orderId: string | null = null;
      if (orderIds.length > 0) {
        const { data: item } = await supabase
          .from('order_items')
          .select('order_id')
          .eq('product_id', productId)
          .in('order_id', orderIds)
          .limit(1)
          .maybeSingle();
        orderId = item?.order_id ?? null;
      }

      const { data: inserted, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          order_id: orderId,
          rating,
          content: content.trim(),
          reviewer_display_name: reviewer_display_name?.trim() || null,
          status: 'pending',
          verified_purchase: !!orderId,
        })
        .select('id, status, created_at')
        .single();

      if (error) {
        console.error('Error inserting review:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
      }

      const slug = product.slug ?? productId;
      revalidatePath(`/ai-to-usd/packages/${slug}`);
      revalidatePath('/ai-to-usd');

      return NextResponse.json({
        success: true,
        review: { id: inserted.id, status: inserted.status, created_at: inserted.created_at },
        message: 'Thank you! Your review has been submitted and is pending approval.',
      });
    } catch (err) {
      if (err instanceof Error && (err as any).status === 401) {
        throw err;
      }
      console.error('POST /api/products/[id]/reviews:', err);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
  });
}
