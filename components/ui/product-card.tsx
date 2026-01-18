import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 flex flex-col', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabels[product.category]}
          </Badge>
          {product.featured && (
            <Badge className="bg-red-500 text-white border-0">
              Featured
            </Badge>
          )}
        </div>
        <div className="mt-4 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
          <div className="text-4xl opacity-20">📦</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {product.difficulty && (
            <Badge variant="outline" className={cn('text-xs', difficultyColors[product.difficulty])}>
              {product.difficulty}
            </Badge>
          )}
          {product.duration && (
            <Badge variant="outline" className="text-xs">
              {product.duration}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex items-center gap-2 w-full">
          <span className="text-2xl font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <Link href={`/products/${product.id}`} className="w-full">
          <Button className="w-full rounded-full" variant={product.featured ? 'default' : 'outline'}>
            {product.featured ? 'Get Started' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}



