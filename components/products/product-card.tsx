import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { formatAmountForDisplay } from "@/lib/stripe/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden card-hover" hover interactive>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute right-2 top-2">Featured</Badge>
          )}
        </div>
      </Link>
      <CardHeader>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <Badge variant="outline">{product.category}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {formatAmountForDisplay(product.price)}
        </span>
        <Button asChild>
          <Link href={`/products/${product.slug}`}><span>View Details</span></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

