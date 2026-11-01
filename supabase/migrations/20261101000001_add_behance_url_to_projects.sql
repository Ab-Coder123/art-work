-- Migration: 20261101000001_add_behance_url_to_projects.sql
-- Description: Adds behance_url column to public.projects table for booth showcases and portfolio links

-- 1. Add behance_url column to public.projects
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS behance_url TEXT;

-- 2. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
