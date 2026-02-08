'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === '/ai-to-usd') return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/ai-to-usd') return null;
  return <Footer />;
}
