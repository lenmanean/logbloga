export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number; // in cents
  image_url: string | null;
  file_path: string | null;
  file_size: number | null;
  category: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

