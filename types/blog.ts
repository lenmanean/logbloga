export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  mdx_file_path: string;
  featured_image: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

