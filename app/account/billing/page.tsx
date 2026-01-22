'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, ExternalLink } from 'lucide-react';
import { PaymentMethodCard } from '@/components/billing/payment-method-card';
import { AddPaymentMethodForm } from '@/components/billing/add-payment-method-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type Stripe from 'stripe';

export default function BillingPage() {
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/stripe/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
        
        // Get default payment method
        if (data.customerId) {
          // Fetch customer to get default payment method
          // For now, we'll check if any payment method is marked as default
          // In a full implementation, you'd fetch the customer object
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`/api/stripe/payment-methods/${paymentMethodId}/set-default`, {
        method: 'POST',
      });

      if (response.ok) {
        setDefaultPaymentMethodId(paymentMethodId);
        await fetchPaymentMethods(); // Refresh
      } else {
        throw new Error('Failed to set default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleDelete = (paymentMethodId: string) => {
    setDeletingPaymentMethodId(paymentMethodId);
  };

  const confirmDelete = async () => {
    if (!deletingPaymentMethodId) return;

    try {
      const response = await fetch(`/api/stripe/payment-methods/${deletingPaymentMethodId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPaymentMethods(paymentMethods.filter((pm) => pm.id !== deletingPaymentMethodId));
        setDeletingPaymentMethodId(null);
      } else {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleOpenCustomerPortal = async () => {
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground mt-2">
              Manage your payment methods. View transaction history in <a href="/account/orders" className="text-primary hover:underline">Orders</a>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenCustomerPortal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Customer Portal
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Your saved payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">
                      No payment methods saved. Add one to get started.
                    </p>
                    <Button onClick={() => setIsFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {paymentMethods.map((pm) => (
                      <PaymentMethodCard
                        key={pm.id}
                        paymentMethod={pm}
                        isDefault={pm.id === defaultPaymentMethodId}
                        onSetDefault={handleSetDefault}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  Your payment methods are securely stored and managed by Stripe. We never store your full card details.
                </p>
                <p className="text-muted-foreground">
                  View your order history and transaction details in the <a href="/account/orders" className="text-primary hover:underline">Orders</a> tab.
                </p>
                <p className="text-muted-foreground">
                  Use the Customer Portal to view invoices, update billing information, and manage subscriptions.
                </p>
                <Button variant="outline" className="w-full" onClick={handleOpenCustomerPortal}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Customer Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Payment Method Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account
              </DialogDescription>
            </DialogHeader>
            <AddPaymentMethodForm
              onSuccess={(paymentMethodId) => {
                setIsFormOpen(false);
                fetchPaymentMethods();
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingPaymentMethodId} onOpenChange={(open) => !open && setDeletingPaymentMethodId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Payment Method?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This payment method will be removed from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}

