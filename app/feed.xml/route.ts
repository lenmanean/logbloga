import { getBlogPosts } from "@/lib/db/blog";

export async function GET() {
  const posts = await getBlogPosts({ published: true, limit: 20 });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logbloga.com";

  const rssItems = posts.map((post) => {
    return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <description>${escapeXml(post.excerpt || "")}</description>
    <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
    <guid>${baseUrl}/blog/${post.slug}</guid>
  </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>LogBloga Blog</title>
    <link>${baseUrl}</link>
    <description>Technology insights, AI tutorials, and productivity tips</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

