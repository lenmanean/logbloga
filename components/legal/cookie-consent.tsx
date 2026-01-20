'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
  const { preferences, savePreferences, acceptAll, rejectAll, requiresConsent } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    if (requiresConsent) {
      setShowBanner(true);
    }
    setLocalPreferences(preferences);
  }, [requiresConsent, preferences]);

  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
    setShowDialog(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowBanner(false);
    setShowDialog(false);
  };

  const handleSavePreferences = () => {
    savePreferences({
      essential: true, // Always true
      analytics: localPreferences.analytics,
      marketing: localPreferences.marketing,
    });
    setShowBanner(false);
    setShowDialog(false);
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  if (!showBanner && !showDialog) {
    return null;
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 shadow-lg">
          <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Cookie className="mt-1 h-5 w-5 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">We Use Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience, analyze site usage, and assist in our 
                  marketing efforts. By clicking &quot;Accept All&quot;, you consent to our use of cookies. 
                  <Link href="/legal/cookies" className="text-primary underline ml-1">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenDialog}
              >
                Manage Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are required for the site to function 
              properly and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Essential Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="essential-cookies" className="text-base font-semibold">
                    Essential Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function properly. These cookies cannot be disabled.
                  </p>
                </div>
                <Switch
                  id="essential-cookies"
                  checked={true}
                  disabled
                  className="opacity-50"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 mr-4">
                  <Label htmlFor="analytics-cookies" className="text-base font-semibold">
                    Analytics Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously.
                  </p>
                </div>
                <Switch
                  id="analytics-cookies"
                  checked={localPreferences.analytics}
                  onCheckedChange={(checked) => {
                    setLocalPreferences(prev => ({ ...prev, analytics: checked }));
                  }}
                />
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 mr-4">
                  <Label htmlFor="marketing-cookies" className="text-base font-semibold">
                    Marketing Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Used to track visitors across websites to display relevant advertisements and 
                    measure the effectiveness of advertising campaigns.
                  </p>
                </div>
                <Switch
                  id="marketing-cookies"
                  checked={localPreferences.marketing}
                  onCheckedChange={(checked) => {
                    setLocalPreferences(prev => ({ ...prev, marketing: checked }));
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                For more information about how we use cookies, please see our{' '}
                <Link href="/legal/cookies" className="text-primary underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
