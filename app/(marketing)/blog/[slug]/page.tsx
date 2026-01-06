import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/db/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { serialize } from "next-mdx-remote/serialize";
import { MDXContent } from "@/components/blog/mdx-content";
import { readFile } from "fs/promises";
import { join } from "path";

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
  try {
    const filePath = join(process.cwd(), "content", "blog", post.mdx_file_path);
    const fileContent = await readFile(filePath, "utf-8");
    mdxSource = await serialize(fileContent);
  } catch (error) {
    console.error("Error reading MDX file:", error);
    return (
      <div className="container px-4 py-12">
        <p className="text-destructive">Error loading blog post content.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-4xl">
      <BlogHeader post={post} />
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MDXContent source={mdxSource} />
      </article>
    </div>
  );
}

