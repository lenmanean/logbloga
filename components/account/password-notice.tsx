import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * Notice encouraging users (especially OTP-only) to add a password for easier sign-in.
 * Rendered on Profile page above the Add/Change password card.
 */
export function PasswordNotice() {
  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
      <CardContent className="flex gap-3 pt-6">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
          <p className="font-medium">Sign in with a password for easier access.</p>
          <p className="text-muted-foreground">
            If you signed up with a one-time code, add a password below to use email and password next time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
