import { requireAdmin } from '@/lib/admin/permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings | Admin Dashboard | Logbloga',
  description: 'Admin settings',
};

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure system settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            View system configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Environment</span>
            <p className="font-medium">{process.env.NODE_ENV || 'development'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Supabase URL</span>
            <p className="font-mono text-sm">{process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Stripe</span>
            <p className="font-mono text-sm">{process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

