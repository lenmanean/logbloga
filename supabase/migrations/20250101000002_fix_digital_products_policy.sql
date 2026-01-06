-- Fix: Remove any existing public policy on digital-products bucket
-- Digital products should only be accessible via API with signed URLs
-- No public policies needed - access is validated at the API level

DROP POLICY IF EXISTS "Digital products are only accessible via API" ON storage.objects;

