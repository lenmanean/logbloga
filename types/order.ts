import { Product } from "./product";

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  total_amount: number; // in cents
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number; // in cents
  download_key: string;
  downloads_count: number;
  expires_at: string;
  created_at: string;
  product?: Product;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

