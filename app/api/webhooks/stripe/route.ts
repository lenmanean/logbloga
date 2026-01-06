import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/utils";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed:`, error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const userId = session.metadata?.userId;
      const productId = session.metadata?.productId;

      if (!userId || !productId) {
        console.error("Missing metadata in session:", session.id);
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      // Get product details
      const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError || !product) {
        console.error("Product not found:", productId);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Create order
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          stripe_session_id: session.id,
          total_amount: session.amount_total || product.price,
          status: "completed",
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Failed to create order:", orderError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }

      // Create order item with download key
      const { error: orderItemError } = await supabaseAdmin
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: productId,
          price: session.amount_total || product.price,
          expires_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
        });

      if (orderItemError) {
        console.error("Failed to create order item:", orderItemError);
        return NextResponse.json(
          { error: "Failed to create order item" },
          { status: 500 }
        );
      }

      // TODO: Send confirmation email here
      // You can use Resend or another email service

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

