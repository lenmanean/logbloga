import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CaseStudy } from '@/lib/resources/types';
import { cn } from '@/lib/utils';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface ResourceCardProps {
  resource: CaseStudy;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const getHref = () => {
    return `/resources/case-studies/${resource.slug}`;
  };

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 flex flex-col h-full', className)}>
      <CardHeader className="pb-4">
        {resource.featuredImage && (
          <Link href={getHref()} className="block relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-4">
            <Image
              src={resource.featuredImage}
              alt={resource.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {resource.category}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Case Study
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Link href={getHref()}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {resource.description}
        </p>
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <Link href={getHref()} className="w-full">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary group-hover:underline">
            View Case Study
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
