import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";
import { Calendar, User } from "lucide-react";

interface BlogHeaderProps {
  post: BlogPost;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <div className="mb-8">
      {post.featured_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted mb-6">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4 lg:text-5xl">{post.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {post.author}
        </div>
        {post.published_at && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(post.published_at)}
          </div>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

