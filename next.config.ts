import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

// Validate environment variables at build time (only on server side)
if (typeof window === 'undefined') {
  try {
    const { validateEnv } = require('./lib/security/env-validation');
    validateEnv();
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    console.error('Environment variable validation failed:', errorMessage);
    // Don't throw in build - just warn
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Warning: Some environment variables may be missing. This may cause issues in production.');
    }
  }
}

// Bundle analyzer configuration (only enabled when ANALYZE=true)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Redirect /cart to / (cart is now a panel opened from header)
  async redirects() {
    return [{ source: '/cart', destination: '/', permanent: false }];
  },

  // Security headers (additional ones not set in middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
    ];
  },
};

// Wrap with Sentry configuration
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  
  // Suppresses source map uploading logs during build
  silent: true,
  
  // Only upload source maps in production
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // Only upload source maps if SENTRY_AUTH_TOKEN is set
  // This prevents uploads in development and CI without the token
  widenClientFileUpload: true,
  
  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: false,
  
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: '/monitoring',
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size (deprecated, handled by webpack)
  // disableLogger: true, // Deprecated - removed
  
  // Enables automatic instrumentation of Vercel Cron Monitors (deprecated, handled by webpack)
  // automaticVercelMonitors: true, // Deprecated - removed
};

// Only wrap with Sentry if DSN is configured
const configWithSentry = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(
      withBundleAnalyzer(nextConfig),
      sentryWebpackPluginOptions
    )
  : withBundleAnalyzer(nextConfig);

export default configWithSentry;
