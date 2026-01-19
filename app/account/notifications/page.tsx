'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationPreferencesForm } from '@/components/account/notification-preferences-form';
import { NotificationList } from '@/components/notifications/notification-list';
import { Bell } from 'lucide-react';
import type { NotificationPreferences } from '@/lib/db/notifications';

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Manage your notifications and preferences
          </p>
        </div>

        <Tabs defaultValue="in-app" className="space-y-6">
          <TabsList>
            <TabsTrigger value="in-app">In-App Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Email Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="in-app" className="space-y-4">
            <NotificationList />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <NotificationPreferencesForm
              initialPreferences={preferences}
              onSave={(updatedPreferences) => {
                setPreferences(updatedPreferences);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

