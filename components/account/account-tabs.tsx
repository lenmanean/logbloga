'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    id: 'library',
    label: 'Library',
    href: '/account/library',
    icon: BookOpen,
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/account/orders',
    icon: ShoppingBag,
  },
  {
    id: 'billing',
    label: 'Billing',
    href: '/account/billing',
    icon: CreditCard,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/account/settings',
    icon: Settings,
  },
  {
    id: 'profile',
    label: 'Account Info',
    href: '/account/profile',
    icon: User,
  },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border">
      <nav className="flex space-x-1 overflow-x-auto" aria-label="Account tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = 
            tab.href === pathname || 
            (tab.href !== '/account' && pathname?.startsWith(tab.href));
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                'border-b-2 border-transparent hover:text-primary hover:border-primary/50',
                isActive
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
