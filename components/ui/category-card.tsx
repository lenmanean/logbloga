import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Globe, Share2, Building2, Briefcase } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe: Globe,
  Share2: Share2,
  Building2: Building2,
  Briefcase: Briefcase,
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Globe;

  return (
    <Link href={category.href}>
      <Card className={cn(
        'group hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full',
        className
      )}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
            <div className="p-3 md:p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

