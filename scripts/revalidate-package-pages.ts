/**
 * Revalidate Package Pages
 * 
 * This script revalidates all package pages and clears product cache
 * to ensure UI reflects updated pricing immediately.
 * 
 * Usage:
 *   npx tsx scripts/revalidate-package-pages.ts
 * 
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 *   - REVALIDATE_SECRET: Secret token for revalidation API (optional, for production)
 *   - NEXT_PUBLIC_APP_URL: Your app URL (defaults to http://localhost:3000)
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Also try .env as fallback
config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/types/supabase';
import { deleteByTag } from '../lib/cache/redis-cache';

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing', 'master-bundle'];

/**
 * Create Supabase client for script usage
 */
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your .env.local file.'
    );
  }

  if (!supabaseKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Please add it to your .env.local file.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Revalidate a path via API route
 */
async function revalidatePath(path: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  try {
    const response = await fetch(`${appUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(revalidateSecret && { 'x-revalidate-secret': revalidateSecret }),
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`  ⚠️  Failed to revalidate ${path}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`  ⚠️  Error revalidating ${path}:`, error);
    return false;
  }
}

/**
 * Revalidate by cache tag
 */
async function revalidateTag(tag: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  try {
    const response = await fetch(`${appUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(revalidateSecret && { 'x-revalidate-secret': revalidateSecret }),
      },
      body: JSON.stringify({ tag }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`  ⚠️  Failed to revalidate tag ${tag}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`  ⚠️  Error revalidating tag ${tag}:`, error);
    return false;
  }
}

/**
 * Main revalidation function
 */
async function revalidatePackagePages() {
  console.log('🚀 Starting package page revalidation...\n');

  try {
    // Clear cache for products
    console.log('Clearing product cache...');
    try {
      await deleteByTag('products');
      console.log('  ✓ Cleared cache for products tag\n');
    } catch (error) {
      console.log('  ⚠️  Could not clear cache:', error);
      console.log('  ℹ️  Cache will expire naturally within TTL\n');
    }

    // Revalidate package pages
    console.log('Revalidating package pages...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const slug of PACKAGE_SLUGS) {
      const path = `/ai-to-usd/packages/${slug}`;
      console.log(`Revalidating: ${path}`);
      
      const success = await revalidatePath(path);
      if (success) {
        console.log(`  ✓ Revalidated: ${path}\n`);
        successCount++;
      } else {
        errorCount++;
        console.log('');
      }
    }

    // Also revalidate the packages listing page
    console.log('Revalidating packages listing page...');
    const listingSuccess = await revalidatePath('/ai-to-usd');
    if (listingSuccess) {
      console.log('  ✓ Revalidated: /ai-to-usd\n');
      successCount++;
    } else {
      errorCount++;
      console.log('');
    }

    // Revalidate products tag (for any components using cached products)
    console.log('Revalidating products cache tag...');
    const tagSuccess = await revalidateTag('products');
    if (tagSuccess) {
      console.log('  ✓ Revalidated products tag\n');
    } else {
      console.log('  ⚠️  Could not revalidate tag (API may not be available)\n');
    }

    // Summary
    console.log('='.repeat(50));
    console.log('📊 Revalidation Summary:');
    console.log(`  ✅ Successfully revalidated: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📦 Total pages: ${PACKAGE_SLUGS.length + 1}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount > 0) {
      console.log('ℹ️  Note: Some revalidations failed. This may be normal if:');
      console.log('   - The app is not running locally');
      console.log('   - REVALIDATE_SECRET is not set');
      console.log('   - Pages will still update via ISR within 1 hour\n');
    }

    console.log('✓ Revalidation completed');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit package pages to verify new prices are displayed');
    console.log('   2. Check that savings calculations are correct');
    console.log('   3. Test checkout flow with new prices\n');
  } catch (error) {
    console.error('❌ Fatal error during revalidation:', error);
    process.exit(1);
  }
}

// Run the revalidation
if (require.main === module) {
  revalidatePackagePages()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Revalidation failed:', error);
      process.exit(1);
    });
}

export { revalidatePackagePages };
