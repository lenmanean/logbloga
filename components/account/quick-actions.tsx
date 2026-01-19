'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  BookOpen,
  Key,
  UserCircle,
  Settings,
  Heart,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'View Orders',
      description: 'Order history',
      href: '/account/orders',
      icon: Package,
      variant: 'outline' as const,
    },
    {
      title: 'Access Library',
      description: 'Your products',
      href: '/account/library',
      icon: BookOpen,
      variant: 'outline' as const,
    },
    {
      title: 'Manage Licenses',
      description: 'License keys',
      href: '/account/licenses',
      icon: Key,
      variant: 'outline' as const,
    },
    {
      title: 'Edit Profile',
      description: 'Profile settings',
      href: '/account/profile',
      icon: UserCircle,
      variant: 'outline' as const,
    },
    {
      title: 'Account Settings',
      description: 'Security & preferences',
      href: '/account/settings',
      icon: Settings,
      variant: 'outline' as const,
    },
    {
      title: 'Wishlist',
      description: 'Saved products',
      href: '/account/wishlist',
      icon: Heart,
      variant: 'outline' as const,
    },
    {
      title: 'Manage Billing',
      description: 'Payment methods',
      href: '/account/billing',
      icon: CreditCard,
      variant: 'outline' as const,
    },
    {
      title: 'Continue Shopping',
      description: 'Browse products',
      href: '/ai-to-usd',
      icon: ShoppingBag,
      variant: 'default' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Quick access to key account areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto flex-col gap-2 py-4"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

