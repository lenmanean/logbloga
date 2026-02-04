import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PackageProduct } from '@/lib/products';
import { cn } from '@/lib/utils';

interface PackageHeroProps {
  package: PackageProduct;
  className?: string;
}

export function PackageHero({ package: pkg, className }: PackageHeroProps) {

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Image */}
        <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0">
          <Image
            src={pkg.packageImage}
            alt={`${pkg.title} - 3D Package Box`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {pkg.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {pkg.contentHours}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {pkg.title}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground">
              {pkg.tagline}
            </p>
          </div>

          {/* Pricing */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-bold">${pkg.price.toLocaleString()}</span>
              {pkg.originalPrice != null && pkg.originalPrice > pkg.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${pkg.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {pkg.originalPrice != null && pkg.originalPrice > pkg.price && (
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                Save ${(pkg.originalPrice - pkg.price).toLocaleString()} ({(Math.round((1 - pkg.price / pkg.originalPrice) * 100))}% off)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



