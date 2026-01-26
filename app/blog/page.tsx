import type { Metadata } from 'next';
import { getAllBlogPostsCached } from '@/lib/db/blog';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogTags } from '@/components/blog/blog-tags';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Suspense } from 'react';
import { BlogListingClient } from '@/components/blog/blog-listing-client';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Blog | Logbloga',
  description: 'Read our latest articles, insights, and guides about AI, technology, and digital products.',
  openGraph: {
    title: 'Blog | Logbloga',
    description: 'Read our latest articles, insights, and guides about AI, technology, and digital products.',
    type: 'website',
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Fetch all published posts
  const allPosts = await getAllBlogPostsCached({
    published: true,
    orderBy: 'published_at',
    orderDirection: 'desc',
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap(post => post.tags || [])
        .filter(Boolean)
    )
  ).sort();

  // Filter by tag if provided
  let filteredPosts = allPosts;
  if (params.tag) {
    filteredPosts = allPosts.filter(post => 
      post.tags && post.tags.includes(params.tag!)
    );
  }

  // Filter by search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const paginatedPosts = filteredPosts.slice(offset, offset + pageSize);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Read our latest articles, insights, and guides about AI, technology, and digital products.
          </p>
        </div>

        {/* Search and Filters */}
        <Suspense fallback={<div className="h-20 animate-pulse bg-muted rounded-lg mb-8" />}>
          <BlogListingClient 
            initialSearch={params.search}
            initialTag={params.tag}
            allTags={allTags}
          />
        </Suspense>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedPosts.length} of {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}
            {params.tag && ` tagged "${params.tag}"`}
            {params.search && ` matching "${params.search}"`}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a href={`/blog?page=${page - 1}${params.tag ? `&tag=${params.tag}` : ''}${params.search ? `&search=${encodeURIComponent(params.search)}` : ''}`}>
                      Previous
                    </a>
                  </Button>
                )}
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a href={`/blog?page=${page + 1}${params.tag ? `&tag=${params.tag}` : ''}${params.search ? `&search=${encodeURIComponent(params.search)}` : ''}`}>
                      Next
                    </a>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No blog posts found.
              {params.tag && ` Try removing the tag filter.`}
              {params.search && ` Try a different search term.`}
            </p>
            {(params.tag || params.search) && (
              <Button variant="outline" asChild>
                <a href="/blog">View All Posts</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
