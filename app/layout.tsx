import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Logbloga | Digital Products & Technology Blog",
    template: "%s | Logbloga",
  },
  description:
    "Logbloga - Your destination for digital products, technology insights, AI tutorials, and productivity tips. Discover innovative tools and resources.",
  keywords: [
    "digital products",
    "technology blog",
    "AI tutorials",
    "productivity",
    "software development",
    "web development",
  ],
  authors: [{ name: "Logbloga Team" }],
  creator: "Logbloga",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://logbloga.com",
    siteName: "Logbloga",
    title: "Logbloga | Digital Products & Technology Blog",
    description:
      "Your destination for digital products, technology insights, AI tutorials, and productivity tips.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logbloga | Digital Products & Technology Blog",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
