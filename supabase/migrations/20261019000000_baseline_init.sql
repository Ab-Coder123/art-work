-- ============================================================================
-- Migration: 20261019000000_baseline_init.sql
-- Description: Baseline PostgreSQL environment initialization for Art Work platform
-- Target: PostgreSQL 15+ via Supabase (Direct: 5432, Supavisor Pooler: 6543)
-- ============================================================================

-- 1. Ensure extensions and auth schemas exist
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure Supabase-compatible roles exist for local/CI PostgreSQL test environments
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END
$$;

-- Ensure auth.uid() function mock exists for RLS evaluation in standard PostgreSQL
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- Enable Core Cryptographic and UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- 2. Configure Default Permissions & Search Path
SET search_path = public, extensions;

-- 3. Deterministic System Health Check Function (Stable, No Side-Effects)
CREATE OR REPLACE FUNCTION public.system_health_check()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT jsonb_build_object(
    'status', 'healthy',
    'database', current_database(),
    'version', current_setting('server_version'),
    'now', now(),
    'pooler_compatible', true
  );
$$;

COMMENT ON FUNCTION public.system_health_check() IS 'Deterministic database handshake and connection pooler health check';
