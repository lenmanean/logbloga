import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogTagsProps {
  tags: string[];
  selectedTag?: string;
  className?: string;
}

export function BlogTags({ tags, selectedTag, className }: BlogTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => {
        const isSelected = selectedTag === tag;
        const href = isSelected ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`;
        
        return (
          <Link key={tag} href={href}>
            <Badge
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                isSelected && 'bg-red-500 text-white border-red-500'
              )}
            >
              {tag}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
