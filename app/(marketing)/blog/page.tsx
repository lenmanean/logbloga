import { Metadata } from "next";
import { getBlogPosts, getBlogTags } from "@/lib/db/blog";
import { BlogGrid } from "@/components/blog/blog-grid";

export const metadata: Metadata = {
  title: "Blog | LogBloga",
  description: "Technology insights, AI tutorials, and productivity tips",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const posts = await getBlogPosts({
    published: true,
    tag: searchParams.tag || undefined,
  });
  const tags = await getBlogTags();

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Technology insights, AI tutorials, and productivity tips
        </p>
      </div>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/blog"
            className={`px-4 py-2 rounded-md border transition-colors ${
              !searchParams.tag
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            All
          </a>
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`px-4 py-2 rounded-md border transition-colors ${
                searchParams.tag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {tag}
            </a>
          ))}
        </div>
      )}

      <BlogGrid posts={posts} />
    </div>
  );
}

