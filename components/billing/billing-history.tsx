'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, ExternalLink } from 'lucide-react';

interface BillingHistoryProps {
  invoices?: any[];
}

export function BillingHistory({ invoices = [] }: BillingHistoryProps) {
  const handleViewInvoice = async () => {
    // Redirect to Stripe Customer Portal for invoice history
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>
          View and download your invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              No invoices found. Your billing history will appear here after you make a purchase.
            </p>
            <Button variant="outline" onClick={handleViewInvoice}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Customer Portal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Invoice #{invoice.number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(invoice.amount_paid / 100).toFixed(2)}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

