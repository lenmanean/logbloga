import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export async function getProducts(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
  search?: string;
  maxPrice?: number;
  sort?: string;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  if (options?.maxPrice) {
    query = query.lte("price", options.maxPrice);
  }

  // Sorting
  switch (options?.sort) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as Product;
}

export async function getProductCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("published", true)
    .not("category", "is", null);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories = new Set(
    (data || []).map((item) => item.category).filter(Boolean)
  );
  return Array.from(categories) as string[];
}

