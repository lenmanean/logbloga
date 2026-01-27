/**
 * Upload Web Apps Package Files to Supabase Storage
 * 
 * This script uploads all 42 files for the Web Apps package to Supabase Storage
 * at the path: digital-products/{productId}/{filename}
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { getAllowedFilenamesForPackage } from '../lib/data/package-level-content';

// Load environment variables from .env.local
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

async function getWebAppsProductId(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', 'web-apps')
      .eq('active', true)
      .single();
    
    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Web Apps product not found in database. Please create it first.');
    }
    
    return data.id;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

function getAllFiles(directory: string): string[] {
  const files: string[] = [];
  
  function traverseDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip template directories (they're already zipped)
        if (!entry.name.includes('template') && !entry.name.includes('examples')) {
          traverseDir(fullPath);
        }
      } else {
        // Only include .md and .zip files in root
        const ext = entry.name.split('.').pop()?.toLowerCase();
        if (ext === 'md' || ext === 'zip') {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverseDir(directory);
  return files;
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'md': 'text/plain', // Supabase Storage accepts text/plain for markdown
    'markdown': 'text/plain',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    
    // For markdown files, use application/octet-stream to bypass MIME type restrictions
    // The content API will serve them as text/plain when needed
    const finalContentType = filename.endsWith('.md') || filename.endsWith('.markdown')
      ? 'application/octet-stream'
      : getContentType(filename);
    
    const { data, error } = await supabase.storage
      .from('digital-products')
      .upload(storagePath, fileContent, {
        contentType: finalContentType,
        upsert: true, // Overwrite if exists
      });
    
    if (error) {
      return {
        filename,
        success: false,
        error: error.message,
        size: stats.size,
      };
    }
    
    return {
      filename,
      success: true,
      size: stats.size,
    };
  } catch (error) {
    return {
      filename,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function main() {
  console.log('🚀 Starting Web Apps package file upload...\n');
  
  // Get product ID
  console.log('📦 Fetching Web Apps product ID...');
  const productId = await getWebAppsProductId();
  console.log(`✅ Product ID: ${productId}\n`);
  
  // Get allowed filenames
  const allowedFilenames = getAllowedFilenamesForPackage('web-apps');
  console.log(`📋 Allowed filenames: ${allowedFilenames.size} files\n`);
  
  // Get all files from web-apps-content directory
  const contentDir = join(process.cwd(), 'web-apps-content');
  console.log(`📁 Reading files from: ${contentDir}\n`);
  
  const allFiles = getAllFiles(contentDir);
  const filesToUpload: Array<{ filePath: string; filename: string }> = [];
  
  // Filter files to only include allowed filenames
  // Only get files directly in web-apps-content root (not in subdirectories)
  const rootFiles = readdirSync(contentDir, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name);
  
  for (const filename of rootFiles) {
    if (allowedFilenames.has(filename)) {
      const filePath = join(contentDir, filename);
      filesToUpload.push({ filePath, filename });
    }
  }
  
  console.log(`📤 Found ${filesToUpload.length} files to upload\n`);
  
  if (filesToUpload.length === 0) {
    console.error('❌ No files found to upload. Check that files are in web-apps-content/');
    process.exit(1);
  }
  
  // Upload files
  const results: UploadResult[] = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const { filePath, filename } of filesToUpload) {
    console.log(`📤 Uploading: ${filename}...`);
    const result = await uploadFile(productId, filePath, filename);
    results.push(result);
    
    if (result.success) {
      console.log(`   ✅ Success (${(result.size! / 1024).toFixed(2)} KB)`);
      successCount++;
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
      failCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Upload Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total: ${filesToUpload.length}`);
  
  if (failCount > 0) {
    console.log('\n❌ Failed files:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   - ${r.filename}: ${r.error}`));
  }
  
  // Verify against allowlist
  const uploadedFilenames = new Set(
    results.filter(r => r.success).map(r => r.filename)
  );
  const missingFiles = Array.from(allowedFilenames).filter(
    f => !uploadedFilenames.has(f)
  );
  
  if (missingFiles.length > 0) {
    console.log('\n⚠️  Files in allowlist but not uploaded:');
    missingFiles.forEach(f => console.log(`   - ${f}`));
  }
  
  console.log('\n✨ Upload complete!');
  
  if (failCount > 0 || missingFiles.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
