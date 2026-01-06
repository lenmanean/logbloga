import { Metadata } from "next";
import { getBlogPosts, getBlogTags } from "@/lib/db/blog";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogFilters } from "@/components/blog/blog-filters";
import { Container } from "@/components/layout/container";
import { Suspense } from "react";
import { BlogCardSkeleton } from "@/components/blog/blog-card-skeleton";

export const metadata: Metadata = {
  title: "Blog | LogBloga",
  description: "Technology insights, AI tutorials, and productivity tips",
};

async function getAuthors(): Promise<string[]> {
  // This would typically come from database, for now return empty
  return [];
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    tag?: string;
    search?: string;
    author?: string;
    date?: string;
  }>;
}) {
  const params = await searchParams;
  const [posts, tags, authors] = await Promise.all([
    getBlogPosts({
      published: true,
      tag: params.tag || undefined,
      search: params.search || undefined,
      author: params.author || undefined,
      dateFilter: params.date || undefined,
    }),
    getBlogTags(),
    getAuthors(),
  ]);

  // Get featured posts (first 2 if any exist)
  const featuredPosts = posts.slice(0, 2);
  const regularPosts = posts.slice(2);

  return (
    <Container variant="content" className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Technology insights, AI tutorials, and productivity tips
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <div key={post.id} className="card-hover">
                <BlogGrid posts={[post]} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            }
          >
            <BlogFilters tags={tags} authors={authors} />
          </Suspense>
        </aside>

        {/* Blog Posts */}
        <div>
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {regularPosts.length === 0 && featuredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No blog posts found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                {regularPosts.length > 0 && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    {regularPosts.length} post{regularPosts.length !== 1 ? "s" : ""}
                  </div>
                )}
                <BlogGrid posts={regularPosts} />
              </>
            )}
          </Suspense>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden mt-8">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded" />
            </div>
          }
        >
          <BlogFilters tags={tags} authors={authors} />
        </Suspense>
      </div>
    </Container>
  );
}

