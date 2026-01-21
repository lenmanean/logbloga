import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getBlogPostBySlugCached } from '@/lib/db/blog';
import { BlogContent } from '@/components/blog/blog-content';
import { BlogTags } from '@/components/blog/blog-tags';
import { AdPlacement } from '@/components/blog/ad-placement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Lazy load related posts (below fold, non-critical)
const RelatedPostsLazy = dynamic(() => import('@/components/blog/related-posts').then(mod => ({ default: mod.RelatedPosts })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});

// Enable ISR - revalidate every hour
export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all published blog posts at build time
 * This enables static generation with ISR
 */
export async function generateStaticParams() {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase environment variables not available during build - static params will be generated on-demand');
      return [];
    }

    // Use service role client for build-time static generation
    const supabase = await createServiceRoleClient();
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);
    
    if (error || !posts) {
      console.error('Error generating static params:', error);
      return [];
    }
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array on error - pages will be generated on demand
    return [];
  }
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugCached(slug);

  if (!post) {
    return {
      title: 'Post Not Found | LogBloga',
    };
  }

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  const modifiedDate = post.updated_at ? new Date(post.updated_at) : null;

  return {
    title: `${title} | LogBloga`,
    description,
    openGraph: {
      title,
      description,
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article' as const,
      publishedTime: publishedDate?.toISOString(),
      modifiedTime: modifiedDate?.toISOString(),
      authors: post.author ? [post.author] : undefined,
      tags: post.tags || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Fetch post from database
  const post = await getBlogPostBySlugCached(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  const modifiedDate = post.updated_at ? new Date(post.updated_at) : null;

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featured_image || undefined,
    datePublished: publishedDate?.toISOString(),
    dateModified: modifiedDate?.toISOString(),
    author: post.author ? {
      '@type': 'Person',
      name: post.author,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'LogBloga',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://logbloga.com'}/logo.png`,
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Header Ad Zone */}
          <div className="mb-6">
            <AdPlacement zone="header" className="w-full" />
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Post Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {post.excerpt}
                  </p>
                )}

                {/* Post Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  {publishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={publishedDate.toISOString()}>
                        {format(publishedDate, 'MMMM d, yyyy')}
                      </time>
                    </div>
                  )}
                  {modifiedDate && modifiedDate.getTime() !== publishedDate?.getTime() && (
                    <div className="text-xs">
                      Updated {format(modifiedDate, 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6">
                    <BlogTags tags={post.tags} />
                  </div>
                )}

                {/* Featured Image */}
                {post.featured_image && (
                  <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted mb-8">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </header>

              {/* Post Content */}
              <div className="prose-wrapper">
                <BlogContent 
                  content={post.content} 
                  mdxFilePath={post.mdx_file_path}
                />
              </div>

              {/* Footer Ad Zone */}
              <div className="mt-12">
                <AdPlacement zone="footer" className="w-full" />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad Zone */}
              <div className="sticky top-24">
                <AdPlacement zone="sidebar" className="w-full" />
              </div>
            </aside>
          </div>

          <Separator className="my-12" />

          {/* Related Posts */}
          <RelatedPostsLazy currentPost={post} limit={3} />
        </div>
      </main>
    </>
  );
}
