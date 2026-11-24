-- Migration: 20261124000001_add_bilingual_ar_support.sql
-- Description: Adds Arabic bilingual storage columns (site_content.data_ar, projects.translations, companies.translations)

-- 1. Arabic JSONB payload for each canonical section in public.site_content
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS data_ar JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.site_content.data_ar IS 'Arabic localized JSONB payload matching the section structure in data';

-- 2. Multilingual translations JSONB map for public.projects (e.g. {"ar": {...}})
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.projects.translations IS 'Localized field overrides keyed by locale (e.g. ar: title, client, description, specs, tags, etc.)';

-- 3. Multilingual translations JSONB map for public.companies (e.g. {"ar": {...}})
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.companies.translations IS 'Localized field overrides keyed by locale (e.g. ar: name, highlight, description)';

-- 4. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
