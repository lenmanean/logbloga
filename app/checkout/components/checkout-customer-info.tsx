'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckout } from '@/contexts/checkout-context';
import { useAuth } from '@/hooks/useAuth';
import { customerInfoSchema, type CustomerInfo } from '@/lib/checkout/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddressSelector } from '@/components/addresses/address-selector';
import type { SavedAddress } from '@/lib/db/addresses';

interface CheckoutCustomerInfoProps {
  /** When true, form syncs to context on change and does not show step navigation (single-page checkout). */
  singlePage?: boolean;
}

export function CheckoutCustomerInfo({ singlePage }: CheckoutCustomerInfoProps = {}) {
  const { customerInfo, setCustomerInfo, setCurrentStep } = useCheckout();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo || {
      name: '',
      email: user?.email || '',
      phone: '',
    },
  });

  // In single-page mode, sync form values to context so "Continue to payment" can validate
  useEffect(() => {
    if (!singlePage) return;
    const subscription = watch((data) => {
      const parsed = customerInfoSchema.safeParse(data);
      if (parsed.success) {
        setCustomerInfo(parsed.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [singlePage, watch, setCustomerInfo]);

  // Pre-fill email from auth when user is signed in
  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user?.email, setValue]);

  // Fetch saved addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/addresses')
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses) {
            setSavedAddresses(data.addresses);
            // Auto-select default billing address if available
            const defaultBilling = data.addresses.find(
              (addr: SavedAddress) => addr.is_default_billing && (addr.type === 'billing' || addr.type === 'both')
            );
            if (defaultBilling) {
              handleAddressSelect(defaultBilling.id);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching addresses:', error);
        });
    }
  }, [isAuthenticated]);

  const handleAddressSelect = (addressId: string | null) => {
    setSelectedBillingAddressId(addressId);
    if (addressId) {
      const address = savedAddresses.find((addr) => addr.id === addressId);
      if (address) {
        setValue('billingAddress.street', address.street || '');
        setValue('billingAddress.city', address.city || '');
        setValue('billingAddress.state', address.state || '');
        setValue('billingAddress.zipCode', address.zip_code || '');
        setValue('billingAddress.country', address.country || 'United States');
        if (address.full_name) {
          setValue('name', address.full_name);
        }
        if (address.phone) {
          setValue('phone', address.phone);
        }
      }
    }
  };

  const onSubmit = async (data: CustomerInfo) => {
    setIsLoading(true);
    try {
      setCustomerInfo(data);
      if (!singlePage) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error saving customer info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>
          Please provide your information to complete your order
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Personal Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                {...register('phone')}
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-base">Billing Address</h3>
            </div>

            {/* Saved Address Selector (if authenticated) */}
            {isAuthenticated && savedAddresses.length > 0 && (
              <div className="space-y-2">
                <AddressSelector
                  addresses={savedAddresses}
                  selectedAddressId={selectedBillingAddressId || undefined}
                  onSelect={handleAddressSelect}
                  type="billing"
                  label="Use Saved Address"
                />
                <p className="text-xs text-muted-foreground">
                  Or fill in the form below to use a different address
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                {...register('billingAddress.street')}
                aria-invalid={errors.billingAddress?.street ? 'true' : 'false'}
              />
              {errors.billingAddress?.street && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.billingAddress.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  {...register('billingAddress.city')}
                  aria-invalid={errors.billingAddress?.city ? 'true' : 'false'}
                />
                {errors.billingAddress?.city && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.billingAddress.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  {...register('billingAddress.state')}
                  aria-invalid={errors.billingAddress?.state ? 'true' : 'false'}
                />
                {errors.billingAddress?.state && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.billingAddress.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  {...register('billingAddress.zipCode')}
                  aria-invalid={errors.billingAddress?.zipCode ? 'true' : 'false'}
                />
                {errors.billingAddress?.zipCode && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.billingAddress.zipCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  {...register('billingAddress.country', { value: 'United States' })}
                  aria-invalid={errors.billingAddress?.country ? 'true' : 'false'}
                />
                {errors.billingAddress?.country && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.billingAddress.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {!singlePage && (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Continue to Review'}
              </Button>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}

