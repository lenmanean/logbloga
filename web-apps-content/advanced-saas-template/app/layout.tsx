import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Advanced SaaS Template',
  description: 'Next.js multi-tenant SaaS with AI and integrations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
