import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SaaS Starter',
  description: 'Next.js SaaS starter with Supabase and Stripe',
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
