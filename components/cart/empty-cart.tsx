'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyCart() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Looks like you haven't added any items to your cart yet. Start shopping to add products!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/ai-to-usd">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

