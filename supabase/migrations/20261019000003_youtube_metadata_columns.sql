-- =============================================================================
-- Migration: 20261019000003_youtube_metadata_columns.sql
-- Description: Adds YouTube video & Reel/Shorts headline, paragraph, and aspect
--              metadata columns to public.projects for rich showcase display.
-- =============================================================================

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS youtube_title TEXT,
  ADD COLUMN IF NOT EXISTS youtube_description TEXT,
  ADD COLUMN IF NOT EXISTS youtube_is_short BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.projects.youtube_title IS 'Headline extracted or customized for the attached YouTube video or Reel/Short';
COMMENT ON COLUMN public.projects.youtube_description IS 'Paragraph / narrative description for the attached YouTube video or Reel/Short';
COMMENT ON COLUMN public.projects.youtube_is_short IS 'True when the YouTube media is a vertical 9:16 Reel / Short';
