/**
 * Upload Social Media Package Files to Supabase Storage
 *
 * This script uploads all 39 files for the Social Media package to Supabase Storage
 * at the path: digital-products/{productId}/{filename}
 *
 * File list is derived from getAllowedFilenamesForPackage('social-media'), which
 * includes all files from package-level-content.ts (implementation plans,
 * platform guides, creative frameworks, templates, launch/marketing,
 * troubleshooting, planning).
 *
 * Supported types: MD, PDF, ZIP, XLSX, DOCX. Generate PDFs via build-package-pdfs.ts,
 * XLSX/DOCX via build-social-media-xlsx.ts and build-social-media-docx.ts, ZIP via
 * build-social-media-zips.ts (or add real files); the script uploads whatever exists
 * in social-media-content/ and reports any allowlist files not found.
 *
 * Usage: npx tsx scripts/upload-social-media-files.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { getAllowedFilenamesForPackage } from '../lib/data/package-level-content';

if (existsSync(join(process.cwd(), '.env.local'))) {
  config({ path: join(process.cwd(), '.env.local') });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface UploadResult {
  filename: string;
  success: boolean;
  error?: string;
  size?: number;
}

async function getSocialMediaProductId(): Promise<string> {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'social-media')
    .eq('active', true)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
  if (!data) {
    throw new Error('Social Media product not found in database. Please create it first.');
  }
  return data.id;
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    md: 'text/plain',
    markdown: 'text/plain',
    pdf: 'application/pdf',
    zip: 'application/zip',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

async function uploadFile(
  productId: string,
  filePath: string,
  filename: string
): Promise<UploadResult> {
  try {
    const fileContent = readFileSync(filePath);
    const stats = statSync(filePath);
    const storagePath = `${productId}/${filename}`;
    const finalContentType =
      filename.endsWith('.md') || filename.endsWith('.markdown')
        ? 'application/octet-stream'
        : getContentType(filename);

    const { error } = await supabase.storage
      .from('digital-products')
      .upload(storagePath, fileContent, {
        contentType: finalContentType,
        upsert: true,
      });

    if (error) {
      return { filename, success: false, error: error.message, size: stats.size };
    }
    return { filename, success: true, size: stats.size };
  } catch (error) {
    return {
      filename,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function main() {
  console.log('Starting Social Media package file upload...\n');

  console.log('Fetching Social Media product ID...');
  const productId = await getSocialMediaProductId();
  console.log(`Product ID: ${productId}\n`);

  const allowedFilenames = getAllowedFilenamesForPackage('social-media');
  console.log(`Allowed filenames: ${allowedFilenames.size} files\n`);

  const contentDir = join(process.cwd(), 'social-media-content');
  if (!existsSync(contentDir)) {
    console.error('social-media-content/ not found. Create it and add the 39 files first.');
    process.exit(1);
  }

  const rootFiles = readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const filesToUpload: Array<{ filePath: string; filename: string }> = [];
  for (const filename of rootFiles) {
    if (allowedFilenames.has(filename)) {
      filesToUpload.push({ filePath: join(contentDir, filename), filename });
    }
  }

  console.log(`Found ${filesToUpload.length} files to upload\n`);

  if (filesToUpload.length === 0) {
    console.error('No files found to upload. Ensure social-media-content/ contains the 39 package files.');
    process.exit(1);
  }

  const results: UploadResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const { filePath, filename } of filesToUpload) {
    process.stdout.write(`Uploading: ${filename}... `);
    const result = await uploadFile(productId, filePath, filename);
    results.push(result);
    if (result.success) {
      console.log(`OK (${((result.size ?? 0) / 1024).toFixed(2)} KB)`);
      successCount++;
    } else {
      console.log(`FAILED: ${result.error}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Upload Summary');
  console.log('='.repeat(50));
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${filesToUpload.length}`);

  const uploadedFilenames = new Set(
    results.filter((r) => r.success).map((r) => r.filename)
  );
  const missingFiles = Array.from(allowedFilenames).filter((f) => !uploadedFilenames.has(f));
  if (missingFiles.length > 0) {
    console.log('\nFiles in allowlist but not uploaded (run build scripts or add to social-media-content/):');
    missingFiles.forEach((f) => console.log(`  - ${f}`));
  }

  console.log('\nUpload complete.');

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
