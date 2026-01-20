'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering for this client component
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { AddressCard } from '@/components/addresses/address-card';
import { AddressForm, type AddressFormData } from '@/components/addresses/address-form';
import type { SavedAddress } from '@/lib/db/addresses';
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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (addressId: string) => {
    setDeletingAddressId(addressId);
  };

  const confirmDelete = async () => {
    if (!deletingAddressId) return;

    try {
      const response = await fetch(`/api/addresses/${deletingAddressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr.id !== deletingAddressId));
        setDeletingAddressId(null);
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (addressId: string, type: 'billing' | 'shipping') => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        await fetchAddresses(); // Refresh addresses
      } else {
        throw new Error('Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleSubmit = async (formData: AddressFormData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        // Update existing address
        const response = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchAddresses();
          setIsFormOpen(false);
          setEditingAddress(null);
        } else {
          throw new Error('Failed to update address');
        }
      } else {
        // Create new address
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchAddresses();
          setIsFormOpen(false);
        } else {
          throw new Error('Failed to create address');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold">Saved Addresses</h1>
            <p className="text-muted-foreground mt-2">
              Manage your billing and shipping addresses
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No addresses saved</CardTitle>
              <CardDescription className="text-center mb-6">
                Add an address to speed up your checkout process.
              </CardDescription>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Address Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? 'Update your address information'
                  : 'Save a new address for faster checkout'}
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingAddress(null);
              }}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingAddressId} onOpenChange={(open) => !open && setDeletingAddressId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Address?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}

