-- ============================================================================
-- Migration: 20261019000001_core_schemas.sql
-- Description: Core relational schemas, constraints, indexes & audit log engine
-- Entities: admin_users, projects, site_content, inquiries, content_audit_logs
-- Target: PostgreSQL 15+ via Supabase
-- ============================================================================

-- 1. Custom PostgreSQL Enum Types
DO $$ BEGIN
  CREATE TYPE public.admin_role_enum AS ENUM ('super_admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.project_category_enum AS ENUM ('stage', 'conferences', 'booths', 'branding', 'tech', 'led');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.inquiry_status_enum AS ENUM ('pending', 'reviewed', 'contacted', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.audit_action_enum AS ENUM ('create', 'update', 'delete', 'publish', 'archive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.audit_entity_enum AS ENUM ('project', 'site_content');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Timestamp Trigger Helper
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Dedicated Admin Users Membership Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role public.admin_role_enum NOT NULL DEFAULT 'editor',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_lookup ON public.admin_users (user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 4. Projects Showcase Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    category public.project_category_enum NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2035),
    description TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    stamp TEXT NOT NULL,               -- e.g. "ARENA // 2026"
    meta_badge TEXT NOT NULL,          -- e.g. "IMMERSIVE LED"
    cad_id TEXT NOT NULL,              -- e.g. "CAD-REV-04"
    cover_image_url TEXT NOT NULL,
    cover_image_alt TEXT NOT NULL,
    stats_primary TEXT NOT NULL,       -- e.g. "12,000+"
    stats_secondary TEXT NOT NULL,     -- e.g. "ATTENDEES"
    specs TEXT[] NOT NULL DEFAULT '{}',
    youtube_video_id VARCHAR(11) CHECK (youtube_video_id IS NULL OR youtube_video_id ~ '^[a-zA-Z0-9_-]{11}$'),
    youtube_url TEXT,
    status public.content_status_enum NOT NULL DEFAULT 'draft',
    order_index INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_public_listing ON public.projects (order_index ASC) 
    WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category, order_index ASC) 
    WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_projects_tags ON public.projects USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 5. Dynamic Site Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT PRIMARY KEY,       -- 'hero' | 'manifesto' | 'capabilities' | 'why_us' | 'scrollytelling' | 'contact'
    data JSONB NOT NULL,
    status public.content_status_enum NOT NULL DEFAULT 'published',
    version INTEGER NOT NULL DEFAULT 1,
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_content_status ON public.site_content (status);

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON public.site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 6. Client Intake Leads Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT NOT NULL,
    brief TEXT NOT NULL,
    status public.inquiry_status_enum NOT NULL DEFAULT 'pending',
    ip_hash TEXT,                       -- SHA256 hashed IP for spam defense without storing raw PII
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

-- 7. Content Audit History Table
CREATE TABLE IF NOT EXISTS public.content_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type public.audit_entity_enum NOT NULL,
    entity_id TEXT NOT NULL,
    action public.audit_action_enum NOT NULL,
    actor_id UUID,
    actor_email TEXT NOT NULL,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.content_audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.content_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.content_audit_logs (actor_email);

-- 8. Automated Audit Logging Trigger Functions
CREATE OR REPLACE FUNCTION public.audit_project_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor_id UUID;
  v_actor_email TEXT := 'system@art-work.internal';
  v_action public.audit_action_enum;
  v_entity_id TEXT;
  v_before JSONB := NULL;
  v_after JSONB := NULL;
BEGIN
  -- Determine current authenticated user if in Supabase context
  BEGIN
    v_actor_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  IF v_actor_id IS NOT NULL THEN
    SELECT email INTO v_actor_email FROM public.admin_users WHERE user_id = v_actor_id;
    IF v_actor_email IS NULL THEN
      v_actor_email := 'admin@art-work.internal';
    END IF;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    v_action := 'create'::public.audit_action_enum;
    v_entity_id := NEW.id::text;
    v_after := to_jsonb(NEW);
  ELSIF (TG_OP = 'UPDATE') THEN
    v_entity_id := NEW.id::text;
    v_before := to_jsonb(OLD);
    v_after := to_jsonb(NEW);

    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      IF (NEW.status = 'published') THEN
        v_action := 'publish'::public.audit_action_enum;
      ELSIF (NEW.status = 'archived') THEN
        v_action := 'archive'::public.audit_action_enum;
      ELSE
        v_action := 'update'::public.audit_action_enum;
      END IF;
    ELSE
      v_action := 'update'::public.audit_action_enum;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    v_action := 'delete'::public.audit_action_enum;
    v_entity_id := OLD.id::text;
    v_before := to_jsonb(OLD);
  END IF;

  INSERT INTO public.content_audit_logs (
    entity_type,
    entity_id,
    action,
    actor_id,
    actor_email,
    before_state,
    after_state,
    created_at
  ) VALUES (
    'project'::public.audit_entity_enum,
    v_entity_id,
    v_action,
    v_actor_id,
    COALESCE(v_actor_email, 'system@art-work.internal'),
    v_before,
    v_after,
    now()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_projects ON public.projects;
CREATE TRIGGER trg_audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.audit_project_mutation();

-- Audit trigger for site_content
CREATE OR REPLACE FUNCTION public.audit_site_content_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor_id UUID;
  v_actor_email TEXT := 'system@art-work.internal';
  v_action public.audit_action_enum;
  v_entity_id TEXT;
  v_before JSONB := NULL;
  v_after JSONB := NULL;
BEGIN
  BEGIN
    v_actor_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  IF v_actor_id IS NOT NULL THEN
    SELECT email INTO v_actor_email FROM public.admin_users WHERE user_id = v_actor_id;
    IF v_actor_email IS NULL THEN
      v_actor_email := 'admin@art-work.internal';
    END IF;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    v_action := 'create'::public.audit_action_enum;
    v_entity_id := NEW.section_key;
    v_after := to_jsonb(NEW);
  ELSIF (TG_OP = 'UPDATE') THEN
    v_entity_id := NEW.section_key;
    v_before := to_jsonb(OLD);
    v_after := to_jsonb(NEW);

    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      IF (NEW.status = 'published') THEN
        v_action := 'publish'::public.audit_action_enum;
      ELSIF (NEW.status = 'archived') THEN
        v_action := 'archive'::public.audit_action_enum;
      ELSE
        v_action := 'update'::public.audit_action_enum;
      END IF;
    ELSE
      v_action := 'update'::public.audit_action_enum;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    v_action := 'delete'::public.audit_action_enum;
    v_entity_id := OLD.section_key;
    v_before := to_jsonb(OLD);
  END IF;

  INSERT INTO public.content_audit_logs (
    entity_type,
    entity_id,
    action,
    actor_id,
    actor_email,
    before_state,
    after_state,
    created_at
  ) VALUES (
    'site_content'::public.audit_entity_enum,
    v_entity_id,
    v_action,
    v_actor_id,
    COALESCE(v_actor_email, 'system@art-work.internal'),
    v_before,
    v_after,
    now()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_site_content ON public.site_content;
CREATE TRIGGER trg_audit_site_content
  AFTER INSERT OR UPDATE OR DELETE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.audit_site_content_mutation();
