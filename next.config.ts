import type { NextConfig } from "next";

// Validate environment variables at build time (only on server side)
if (typeof window === 'undefined') {
  try {
    const { validateEnv } = require('./lib/security/env-validation');
    validateEnv();
  } catch (error: any) {
    console.error('Environment variable validation failed:', error.message);
    // Don't throw in build - just warn
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Warning: Some environment variables may be missing. This may cause issues in production.');
    }
  }
}

const nextConfig: NextConfig = {
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

export default nextConfig;
