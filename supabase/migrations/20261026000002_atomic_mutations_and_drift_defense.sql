-- ============================================================================
-- Migration: 20261026000002_atomic_mutations_and_drift_defense.sql
-- Description: Atomic PostgreSQL functions for project reordering & content concurrency
-- Target: PostgreSQL 15+ via Supabase
-- ============================================================================

-- 1. Atomic Project Reorder Function (Transaction Boundary)
CREATE OR REPLACE FUNCTION public.reorder_projects(
    p_items JSONB,
    p_actor_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    item JSONB;
    target_id TEXT;
    target_order INT;
BEGIN
    -- Authorization guard: require admin rights
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only active administrators can reorder projects';
    END IF;

    -- Validate array input
    IF jsonb_typeof(p_items) <> 'array' THEN
        RAISE EXCEPTION 'Invalid argument: p_items must be a JSONB array';
    END IF;

    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        target_id := item->>'id';
        target_order := (item->>'order_index')::INT;

        IF target_id IS NOT NULL AND target_order IS NOT NULL THEN
            IF target_id ~ '^[0-9a-fA-F-]{36}$' THEN
                UPDATE public.projects
                SET order_index = target_order,
                    updated_by = COALESCE(p_actor_id, updated_by),
                    updated_at = NOW()
                WHERE id = target_id::UUID;
            ELSE
                UPDATE public.projects
                SET order_index = target_order,
                    updated_by = COALESCE(p_actor_id, updated_by),
                    updated_at = NOW()
                WHERE slug = target_id;
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- Grant execution to authenticated users (internal check guards role)
GRANT EXECUTE ON FUNCTION public.reorder_projects(JSONB, UUID) TO authenticated;

-- 2. Atomic Content Save & Optimistic Concurrency Function
CREATE OR REPLACE FUNCTION public.save_site_content(
    p_section_key TEXT,
    p_data JSONB,
    p_actor_email TEXT DEFAULT 'admin@art-work.agency',
    p_expected_version INT DEFAULT NULL
)
RETURNS TABLE (
    version INT,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_version INT;
    v_next_version INT;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- Authorization guard: require admin rights
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only active administrators can modify site content';
    END IF;

    -- Row-level lock to prevent concurrent save races
    SELECT sc.version INTO v_current_version
    FROM public.site_content sc
    WHERE sc.section_key = p_section_key
    FOR UPDATE;

    -- Optimistic concurrency conflict detection
    IF p_expected_version IS NOT NULL AND v_current_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'CONCURRENCY_CONFLICT: Content was modified by another editor (expected version %, found %)',
            p_expected_version, v_current_version;
    END IF;

    v_next_version := COALESCE(v_current_version, 0) + 1;

    INSERT INTO public.site_content (section_key, data, status, version, updated_at)
    VALUES (p_section_key, p_data, 'published', v_next_version, v_now)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data,
        status = EXCLUDED.status,
        version = v_next_version,
        updated_at = v_now;

    RETURN QUERY SELECT v_next_version, v_now;
END;
$$;

-- Grant execution to authenticated users (internal check guards role)
GRANT EXECUTE ON FUNCTION public.save_site_content(TEXT, JSONB, TEXT, INT) TO authenticated;
