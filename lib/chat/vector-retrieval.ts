/**
 * Vector retrieval for chat RAG
 * Queries chat_embeddings by similarity (cosine) and returns chunks from owned packages + shared.
 */

import OpenAI from 'openai';
import { createServiceRoleClient } from '@/lib/supabase/server';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const DEFAULT_LIMIT = 15;

export interface VectorChunk {
  content: string;
  source_id?: string | null;
}

/**
 * Get embedding for text using OpenAI text-embedding-3-small (1536 dimensions)
 */
async function embedQuery(query: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  const openai = new OpenAI({ apiKey });
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query.slice(0, 8000),
  });
  const embedding = response.data?.[0]?.embedding;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Failed to get embedding from OpenAI');
  }
  return embedding;
}

/**
 * Query the vector store for chunks matching the query, scoped to owned packages and shared.
 * Returns chunks ordered by cosine similarity (most relevant first).
 */
export async function queryVectorStore(
  query: string,
  ownedPackageSlugs: string[],
  limit: number = DEFAULT_LIMIT
): Promise<VectorChunk[]> {
  const slugs = ownedPackageSlugs.length > 0 ? ownedPackageSlugs : ['shared'];
  const queryEmbedding = await embedQuery(query);
  const supabase = await createServiceRoleClient();
  // RPC added in migration 000058; types will include it after next `supabase gen types`
  const { data, error } = await (supabase as { rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> }).rpc('match_chat_embeddings', {
    query_embedding: `[${queryEmbedding.join(',')}]`,
    package_slugs: slugs,
    match_count: limit,
  });
  if (error) {
    console.error('Vector retrieval error:', error);
    return [];
  }
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((row: { content?: string; source_id?: string | null }) => ({
    content: row.content ?? '',
    source_id: row.source_id ?? undefined,
  }));
}
