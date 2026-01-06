import Image from "next/image";
import { Product } from "@/types/product";
import { formatAmountForDisplay } from "@/lib/stripe/utils";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/checkout/checkout-button";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <div>
          {product.category && (
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
          )}
          <h1 className="text-4xl font-bold lg:text-5xl">{product.name}</h1>
        </div>
        <div className="text-3xl font-bold">
          {formatAmountForDisplay(product.price)}
        </div>
        {product.description && (
          <p className="text-lg text-muted-foreground">
            {product.description}
          </p>
        )}
        <CheckoutButton productId={product.id} />
      </div>
    </div>
  );
}

