import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LogBloga | Digital Products & Technology Blog",
    template: "%s | LogBloga",
  },
  description:
    "LogBloga - Your destination for digital products, technology insights, AI tutorials, and productivity tips. Discover innovative tools and resources.",
  keywords: [
    "digital products",
    "technology blog",
    "AI tutorials",
    "productivity",
    "software development",
    "web development",
  ],
  authors: [{ name: "LogBloga Team" }],
  creator: "LogBloga",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://logbloga.com",
    siteName: "LogBloga",
    title: "LogBloga | Digital Products & Technology Blog",
    description:
      "Your destination for digital products, technology insights, AI tutorials, and productivity tips.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogBloga | Digital Products & Technology Blog",
    description:
      "Your destination for digital products, technology insights, AI tutorials, and productivity tips.",
    creator: "@logbloga",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
