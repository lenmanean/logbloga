"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { formatAmountForDisplay } from "@/lib/stripe/utils";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { Separator } from "@/components/ui/separator";

interface ProductDetailStickyProps {
  product: Product;
}

export function ProductDetailSticky({ product }: ProductDetailStickyProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isSticky) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-xl font-bold">{formatAmountForDisplay(product.price)}</p>
          </div>
          <div className="flex-shrink-0">
            <CheckoutButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

