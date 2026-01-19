'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import type { NotificationPreferences } from '@/lib/db/notifications';

interface NotificationPreferencesFormProps {
  initialPreferences?: NotificationPreferences | null;
  onSave?: (preferences: NotificationPreferences) => void;
}

export function NotificationPreferencesForm({
  initialPreferences,
  onSave,
}: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] = useState({
    email_order_confirmation: true,
    email_order_shipped: true,
    email_promotional: true,
    email_product_updates: true,
    email_newsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setPreferences({
        email_order_confirmation: initialPreferences.email_order_confirmation,
        email_order_shipped: initialPreferences.email_order_shipped,
        email_promotional: initialPreferences.email_promotional,
        email_product_updates: initialPreferences.email_product_updates,
        email_newsletter: initialPreferences.email_newsletter,
      });
    }
  }, [initialPreferences]);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        const data = await response.json();
        onSave?.(data.preferences);
        // Optionally show success toast
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: 'email_order_confirmation' as const,
      title: 'Order Confirmations',
      description: 'Receive emails when you place an order',
    },
    {
      key: 'email_order_shipped' as const,
      title: 'Order Updates',
      description: 'Get notified when your order status changes',
    },
    {
      key: 'email_product_updates' as const,
      title: 'Product Updates',
      description: 'Notifications about products you own or are interested in',
    },
    {
      key: 'email_promotional' as const,
      title: 'Promotional Emails',
      description: 'Special offers, discounts, and marketing communications',
    },
    {
      key: 'email_newsletter' as const,
      title: 'Newsletter',
      description: 'Weekly newsletter with tips, updates, and news',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>
          Choose which emails you'd like to receive from us
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={option.key} className="text-base font-medium cursor-pointer">
                {option.title}
              </Label>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Switch
              id={option.key}
              checked={preferences[option.key]}
              onCheckedChange={() => handleToggle(option.key)}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
}

