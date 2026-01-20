import { getBlogPostsByTag } from '@/lib/db/blog';
import { BlogPost } from '@/lib/types/database';
import { BlogPostCard } from './blog-post-card';

interface RelatedPostsProps {
  currentPost: BlogPost;
  limit?: number;
}

/**
 * Related posts component
 * Shows posts with matching tags
 */
export async function RelatedPosts({ currentPost, limit = 3 }: RelatedPostsProps) {
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return null;
  }

  // Get posts with matching tags (excluding current post)
  const relatedPosts = await getBlogPostsByTag(currentPost.tags[0], limit + 1);
  const filtered = relatedPosts.filter(post => post.id !== currentPost.id).slice(0, limit);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
