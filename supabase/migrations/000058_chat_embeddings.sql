-- Migration: Chat embeddings table for vector RAG
-- Stores chunked package and platform doc content with OpenAI text-embedding-3-small (1536 dims)

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chat_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash TEXT NOT NULL,
  package_slug TEXT NOT NULL CHECK (package_slug IN ('web-apps', 'social-media', 'agency', 'freelancing', 'shared')),
  source_type TEXT NOT NULL CHECK (source_type IN ('package_md', 'platform_doc', 'shared')),
  source_id TEXT,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_embeddings_package_source
  ON chat_embeddings (package_slug, source_id, chunk_index);

CREATE INDEX IF NOT EXISTS idx_chat_embeddings_embedding_hnsw
  ON chat_embeddings USING hnsw (embedding vector_cosine_ops);

ALTER TABLE chat_embeddings ENABLE ROW LEVEL SECURITY;

-- No policies: only service role / server-side API should read/write (no direct public access)
COMMENT ON TABLE chat_embeddings IS 'Vector embeddings for chat RAG; package and platform doc chunks.';

-- RPC for similarity search: returns chunks from owned packages or shared, ordered by cosine distance
CREATE OR REPLACE FUNCTION match_chat_embeddings(
  query_embedding vector(1536),
  package_slugs text[],
  match_count int DEFAULT 15
)
RETURNS TABLE (content text, source_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ce.content, ce.source_id
  FROM chat_embeddings ce
  WHERE ce.package_slug = 'shared' OR ce.package_slug = ANY(package_slugs)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
