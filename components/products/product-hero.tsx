import { Product } from "@/types/product";
import { formatAmountForDisplay } from "@/lib/stripe/utils";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductFeatures } from "./product-features";
import { Separator } from "@/components/ui/separator";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || undefined,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Image Gallery */}
        <ProductImageGallery mainImage={product.image_url} />

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            {product.category && (
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
            )}
            <h1 className="text-4xl font-bold lg:text-5xl">{product.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">
              {formatAmountForDisplay(product.price)}
            </span>
            {product.featured && (
              <Badge className="bg-product-featured">Featured</Badge>
            )}
          </div>
          {product.description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <Separator />

          {/* Features */}
          <ProductFeatures
            fileSize={product.file_size}
            fileFormat={product.file_path?.split(".").pop()?.toUpperCase()}
          />

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <CheckoutButton productId={product.id} />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Product
            </Button>
          </div>
        </div>
      </div>

      {/* Extended Description Section */}
      {product.description && product.description.length > 200 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">About This Product</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

