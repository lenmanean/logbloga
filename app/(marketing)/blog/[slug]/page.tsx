import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/db/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { SocialShare } from "@/components/blog/social-share";
import { serialize } from "next-mdx-remote/serialize";
import { MDXContent } from "@/components/blog/mdx-content";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { readFile } from "fs/promises";
import { join } from "path";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | LogBloga",
    };
  }

  return {
    title: `${post.seo_title || post.title} | LogBloga`,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Read MDX file
  let mdxSource;
  let headings: { id: string; text: string; level: number }[] = [];
  
  try {
    const filePath = join(process.cwd(), "content", "blog", post.mdx_file_path);
    const fileContent = await readFile(filePath, "utf-8");
    
    // Extract headings for table of contents
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = Array.from(fileContent.matchAll(headingRegex));
    headings = matches.map((match) => ({
      level: match[1].length,
      text: match[2],
      id: match[2]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));

    mdxSource = await serialize(fileContent, {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"],
              },
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error reading MDX file:", error);
    return (
      <Container className="py-12">
        <p className="text-destructive">Error loading blog post content.</p>
      </Container>
    );
  }

  // Get related posts
  const relatedPosts = await getBlogPosts({
    published: true,
    limit: 4,
  }).then((posts) => {
    // Filter by tags or category, exclude current post
    return posts
      .filter((p) => {
        if (p.id === post.id) return false;
        // Match if shares any tag
        if (post.tags.length > 0 && p.tags.length > 0) {
          return post.tags.some((tag) => p.tags.includes(tag));
        }
        return true;
      })
      .slice(0, 3);
  });

  return (
    <>
      <ReadingProgress />
      <Container variant="content" className="py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Table of Contents */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents headings={headings} />
            </aside>
          )}

          {/* Main Content */}
          <div>
            <BlogHeader post={post} />

            {/* Social Share */}
            <div className="mb-8 pb-8 border-b">
              <SocialShare
                title={post.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
                description={post.excerpt || undefined}
              />
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
              <MDXContent source={mdxSource} />
            </article>

            {/* Social Share Footer */}
            <div className="mt-12 pt-8 border-t">
              <SocialShare
                title={post.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
                description={post.excerpt || undefined}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section variant="muted" padding="lg">
          <Container variant="content">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Related Posts</h2>
              <p className="text-muted-foreground">
                Continue reading with these related articles
              </p>
            </div>
            <BlogGrid posts={relatedPosts} />
          </Container>
        </Section>
      )}
    </>
  );
}

