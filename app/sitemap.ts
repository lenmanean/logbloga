import { MetadataRoute } from "next";
import { getProducts } from "@/lib/db/products";
import { getBlogPosts } from "@/lib/db/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logbloga.com";

  // Get all published products and blog posts
  const [products, blogPosts] = await Promise.all([
    getProducts({ published: true }),
    getBlogPosts({ published: true }),
  ]);

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at
      ? new Date(post.published_at)
      : new Date(post.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
    ...blogUrls,
  ];
}

