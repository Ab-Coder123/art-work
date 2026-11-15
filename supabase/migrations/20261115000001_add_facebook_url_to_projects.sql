-- Migration: 20261115000001_add_facebook_url_to_projects.sql
-- Description: Adds facebook_url column to public.projects table for Facebook video and reel integration

-- 1. Add facebook_url column to public.projects
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS facebook_url TEXT;

COMMENT ON COLUMN public.projects.facebook_url IS 'Canonical URL for attached Facebook video, reel, or watch link';

-- 2. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
