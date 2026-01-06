import { createClient } from "@/lib/supabase/server";
import { Order, OrderItem, OrderWithItems } from "@/types/order";

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return (data as Order[]) || [];
}

export async function getOrderById(
  orderId: string,
  userId: string
): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        product:products (*)
      )
    `
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data as OrderWithItems;
}

export async function getOrderItemsByUserId(
  userId: string
): Promise<OrderItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      *,
      product:products (*),
      order:orders!inner (user_id)
    `
    )
    .eq("order.user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch order items: ${error.message}`);
  }

  return (data as OrderItem[]) || [];
}

export async function getOrderItemByDownloadKey(
  downloadKey: string,
  userId: string
): Promise<OrderItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      *,
      product:products (*),
      order:orders!inner (user_id)
    `
    )
    .eq("download_key", downloadKey)
    .eq("order.user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch order item: ${error.message}`);
  }

  // Check if download has expired
  if (new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data as OrderItem;
}

export async function logDownload(
  orderItemId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("download_logs").insert({
    order_item_id: orderItemId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    console.error("Failed to log download:", error);
    // Don't throw - logging failures shouldn't break downloads
  }
}

export async function incrementDownloadCount(orderItemId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_download_count", {
    item_id: orderItemId,
  });

  if (error) {
    // Fallback if RPC doesn't exist
    const { data } = await supabase
      .from("order_items")
      .select("downloads_count")
      .eq("id", orderItemId)
      .single();

    if (data) {
      await supabase
        .from("order_items")
        .update({ downloads_count: (data.downloads_count || 0) + 1 })
        .eq("id", orderItemId);
    }
  }
}

