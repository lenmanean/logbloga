# Supabase Database Setup

This directory contains SQL scripts for setting up the LogBloga database schema.

## Setup Instructions

1. **Create a Supabase Project**
   - Go to https://supabase.com and create a new project
   - Wait for the project to be fully provisioned

2. **Run the Schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `schema.sql`
   - Execute the SQL script

3. **Create Storage Buckets**
   - Go to Storage in your Supabase dashboard
   - Create the following buckets:
     - `digital-products` (Private bucket)
     - `blog-images` (Public bucket)
     - `product-images` (Public bucket)

4. **Set Storage Policies**
   - For `digital-products` (private): Files are accessed via API endpoint only
   - For `blog-images` (public): Allow public read access
   - For `product-images` (public): Allow public read access

5. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy the following:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

6. **Add to Environment Variables**
   - Create a `.env.local` file in the project root
   - Add the credentials from step 5

## Database Schema Overview

- **products**: Digital product catalog
- **orders**: Customer orders
- **order_items**: Order line items with download keys
- **blog_posts**: Blog post metadata (content in MDX files)
- **download_logs**: Analytics for file downloads

All tables have Row Level Security (RLS) enabled with appropriate policies.

