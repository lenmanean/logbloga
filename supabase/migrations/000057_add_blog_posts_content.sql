-- Add content column to blog_posts if it does not exist
-- Some deployments may have created blog_posts without this column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT;
