# Blog Posts

This directory contains MDX blog post files.

## Creating a Blog Post

1. Create a new `.mdx` file in this directory (e.g., `my-post.mdx`)
2. Add the blog post metadata to the Supabase `blog_posts` table:

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  mdx_file_path,
  author,
  published,
  published_at,
  seo_title,
  seo_description,
  tags
) VALUES (
  'My Blog Post Title',
  'my-post-slug',
  'A brief excerpt of the post',
  'my-post.mdx',
  'Your Name',
  true,
  NOW(),
  'SEO Optimized Title',
  'SEO description',
  ARRAY['technology', 'ai']
);
```

3. Write your content in the MDX file using standard Markdown syntax

## Example Blog Post

```mdx
# My Blog Post

This is an example blog post written in MDX.

## Section Title

You can use standard Markdown syntax, code blocks, and more.

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

## Images

You can reference images that are stored in Supabase Storage (blog-images bucket) or use external URLs.

![Alt text](https://example.com/image.jpg)
```

## MDX Features

- Standard Markdown syntax
- Code blocks with syntax highlighting
- Images
- Links (external links open in new tab automatically)
- Custom components (defined in `components/blog/mdx-components.tsx`)

