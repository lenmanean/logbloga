import { createClient } from "@/lib/supabase/server";
import { BlogPost } from "@/types/blog";

export async function getBlogPosts(options?: {
  published?: boolean;
  limit?: number;
  tag?: string;
}): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase.from("blog_posts").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.tag) {
    query = query.contains("tags", [options.tag]);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  query = query.order("published_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  return (data as BlogPost[]) || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data as BlogPost;
}

export async function getBlogTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("tags")
    .eq("published", true);

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  const tagSet = new Set<string>();
  (data || []).forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet);
}

