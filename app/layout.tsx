import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/cart-context";
import { AuthModalProvider } from "@/contexts/auth-modal-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { CookieConsent } from "@/components/legal/cookie-consent";
import ServiceWorkerRegistration from "@/components/pwa/service-worker-registration";
import AnalyticsProvider from "@/components/analytics/analytics-provider";
import { ChatWidget } from "@/components/chat/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logbloga - Digital Products & Tech Insights",
  description: "Your destination for digital products, technology insights, and productivity tools.",
  manifest: "/manifest.json",
  themeColor: "#ef4444",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Logbloga",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Logbloga" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <AuthModalProvider>
              <Header />
              {children}
              <CookieConsent />
              <ServiceWorkerRegistration />
              <AnalyticsProvider />
              <ChatWidget />
              <AuthModal />
              <Analytics />
              <SpeedInsights />
            </AuthModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
