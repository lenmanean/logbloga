'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Profile } from '@/lib/types/database';
import { format } from 'date-fns';

interface CustomerDetailsProps {
  customer: Profile;
  stats: {
    totalOrders: number;
    totalSpent: number;
    activeLicenses: number;
  };
}

export function CustomerDetails({ customer, stats }: CustomerDetailsProps) {
  const role = (customer as any).role || 'user';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{customer.full_name || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Role</span>
            <div className="mt-1">
              <Badge variant={role === 'admin' ? 'default' : 'outline'}>
                {role}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Member Since</span>
            <p className="font-medium">
              {customer.created_at ? format(new Date(customer.created_at), 'PP') : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Spent</span>
            <p className="text-2xl font-bold">
              ${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Active Licenses</span>
            <p className="text-2xl font-bold">{stats.activeLicenses}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

