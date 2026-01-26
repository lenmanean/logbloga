import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckoutSuccessContent } from './success-content';

export const metadata = {
  title: 'Order Confirmed | Logbloga',
  description: 'Your order has been confirmed',
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Loading order confirmation...</CardTitle>
            </CardHeader>
          </Card>
        }>
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </main>
  );
}

