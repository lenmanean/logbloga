import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/types/database';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 flex flex-col h-full', className)}>
      <CardHeader className="pb-4">
        {post.featured_image && (
          <Link href={`/blog/${post.slug}`} className="block relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-4">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {excerpt && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{post.author}</span>
            </div>
          )}
          {publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={publishedDate.toISOString()}>
                {format(publishedDate, 'MMM d, yyyy')}
              </time>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <Link href={`/blog/${post.slug}`} className="w-full">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary group-hover:underline">
            Read More
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
