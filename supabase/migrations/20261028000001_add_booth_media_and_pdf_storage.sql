-- Migration: 20261028000001_add_booth_media_and_pdf_storage.sql
-- Description: Adds images array, pdf_url, and pdf_title columns to projects table and enables PDF uploads in artwork-media bucket

-- 1. Add booth images and PDF columns to public.projects
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_title TEXT;

-- 2. Ensure storage bucket 'artwork-media' supports PDF documents & 25MB limit
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    UPDATE storage.buckets
    SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        file_size_limit = 26214400
    WHERE id = 'artwork-media';
  END IF;
END $$;

-- 3. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
