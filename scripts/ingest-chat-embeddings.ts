/**
 * Ingest Chat Embeddings
 *
 * Chunks package markdown and platform docs, embeds with OpenAI text-embedding-3-small,
 * and inserts into chat_embeddings. Idempotent: skips chunks whose content_hash already exists.
 *
 * Run: tsx scripts/ingest-chat-embeddings.ts
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import crypto from 'crypto';
import OpenAI from 'openai';
import { getAllowedFilenamesForPackage } from '../lib/data/package-level-content';

if (existsSync(join(process.cwd(), '.env.local'))) {
  config({ path: join(process.cwd(), '.env.local') });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error('Missing: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_MAX_CHARS = 2400;
const CHUNK_OVERLAP_CHARS = 400;

const PACKAGE_DIRS: Record<string, string> = {
  'web-apps': 'web-apps-content',
  'social-media': 'social-media-content',
  'agency': 'agency-content',
  'freelancing': 'freelancing-content',
};

function contentHash(content: string): string {
  return crypto.createHash('sha256').update(content.trim()).digest('hex');
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return chunks;

  const sections = normalized.split(/(?=^##\s)/m).filter(Boolean);
  for (const section of sections) {
    if (section.length <= CHUNK_MAX_CHARS) {
      chunks.push(section.trim());
      continue;
    }
    let start = 0;
    while (start < section.length) {
      let end = start + CHUNK_MAX_CHARS;
      if (end < section.length) {
        const lastNewline = section.lastIndexOf('\n', end);
        if (lastNewline > start) end = lastNewline + 1;
      }
      chunks.push(section.slice(start, end).trim());
      start = end - CHUNK_OVERLAP_CHARS;
      if (start >= section.length) break;
    }
  }
  return chunks.filter((c) => c.length > 0);
}

async function embedChunks(chunks: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < chunks.length; i += 20) {
    const batch = chunks.slice(i, i + 20);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    const sorted = response.data.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    for (const d of sorted) {
      if (d.embedding) results.push(d.embedding);
    }
  }
  return results;
}

async function ingestPackage(slug: string): Promise<{ files: number; chunks: number }> {
  const dir = PACKAGE_DIRS[slug];
  if (!dir) return { files: 0, chunks: 0 };
  const dirPath = join(process.cwd(), dir);
  if (!existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return { files: 0, chunks: 0 };
  }

  const allowed = getAllowedFilenamesForPackage(slug);
  const mdFiles = [...allowed].filter((f) => f.endsWith('.md'));
  let totalChunks = 0;

  for (const file of mdFiles) {
    const filePath = join(dirPath, file);
    if (!existsSync(filePath)) continue;

    const raw = readFileSync(filePath, 'utf-8');
    const chunks = chunkText(raw);
    if (chunks.length === 0) continue;

    const embeddings = await embedChunks(chunks);

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const hash = contentHash(content);
      const embedding = embeddings[i];
      if (!embedding) continue;

      const { data: existing } = await supabase
        .from('chat_embeddings')
        .select('id')
        .eq('content_hash', hash)
        .eq('package_slug', slug)
        .eq('source_id', file)
        .eq('chunk_index', i)
        .maybeSingle();

      if (existing) continue;

      await supabase.from('chat_embeddings').insert({
        content_hash: hash,
        package_slug: slug,
        source_type: 'package_md',
        source_id: file,
        chunk_index: i,
        content,
        embedding: `[${embedding.join(',')}]`,
      });
      totalChunks++;
    }
  }
  return { files: mdFiles.length, chunks: totalChunks };
}

async function ingestPlatformDocs(): Promise<{ files: number; chunks: number }> {
  const dirPath = join(process.cwd(), 'docs', 'chat-platforms');
  if (!existsSync(dirPath)) return { files: 0, chunks: 0 };

  const files = readdirSync(dirPath).filter((f) => f.endsWith('.md'));
  let totalChunks = 0;

  for (const file of files) {
    const filePath = join(dirPath, file);
    const raw = readFileSync(filePath, 'utf-8');
    const chunks = chunkText(raw);
    if (chunks.length === 0) continue;

    const embeddings = await embedChunks(chunks);

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const hash = contentHash(content);
      const embedding = embeddings[i];
      if (!embedding) continue;

      const { data: existing } = await supabase
        .from('chat_embeddings')
        .select('id')
        .eq('content_hash', hash)
        .eq('package_slug', 'shared')
        .eq('source_id', file)
        .eq('chunk_index', i)
        .maybeSingle();

      if (existing) continue;

      await supabase.from('chat_embeddings').insert({
        content_hash: hash,
        package_slug: 'shared',
        source_type: 'platform_doc',
        source_id: file,
        chunk_index: i,
        content,
        embedding: `[${embedding.join(',')}]`,
      });
      totalChunks++;
    }
  }
  return { files: files.length, chunks: totalChunks };
}

async function main() {
  console.log('Ingesting chat embeddings...');

  for (const slug of Object.keys(PACKAGE_DIRS)) {
    const result = await ingestPackage(slug);
    console.log(`  ${slug}: ${result.files} files, ${result.chunks} new chunks`);
  }

  const platformResult = await ingestPlatformDocs();
  console.log(`  platform docs: ${platformResult.files} files, ${platformResult.chunks} new chunks`);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
