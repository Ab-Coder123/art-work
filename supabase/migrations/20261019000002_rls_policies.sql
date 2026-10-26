-- =============================================================================
-- Phase 04: Row-Level Security (RLS) & Storage Access Policies
-- =============================================================================
-- Enforcement model:
--   * API layer (Next.js route handlers) is the primary authorization boundary.
--   * RLS is defense-in-depth for every request executed with a USER-scoped JWT
--     (anon key + user access token). The service-role key BYPASSES RLS and is
--     never exposed to browsers; queries using it are authorized by the API only.
--   * Admin identity is derived from public.admin_users (membership table),
--     never from a client-editable role/metadata claim.
-- =============================================================================

-- 1. Authorization helpers ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = (SELECT auth.uid())
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = (SELECT auth.uid())
      AND is_active = true
      AND role = 'super_admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated, service_role;

-- 2. Enable + force RLS on every application table ----------------------------
ALTER TABLE public.admin_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. admin_users: members read own row; super admins manage everyone ----------
DROP POLICY IF EXISTS admin_users_select_self ON public.admin_users;
CREATE POLICY admin_users_select_self ON public.admin_users
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_super_admin());

DROP POLICY IF EXISTS admin_users_super_admin_write ON public.admin_users;
CREATE POLICY admin_users_super_admin_write ON public.admin_users
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- 4. projects: public reads published; admins full access ---------------------
DROP POLICY IF EXISTS projects_public_read_published ON public.projects;
CREATE POLICY projects_public_read_published ON public.projects
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS projects_admin_select_all ON public.projects;
CREATE POLICY projects_admin_select_all ON public.projects
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS projects_admin_insert ON public.projects;
CREATE POLICY projects_admin_insert ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS projects_admin_update ON public.projects;
CREATE POLICY projects_admin_update ON public.projects
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS projects_admin_delete ON public.projects;
CREATE POLICY projects_admin_delete ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 5. site_content: public reads published; admins full access -----------------
DROP POLICY IF EXISTS site_content_public_read_published ON public.site_content;
CREATE POLICY site_content_public_read_published ON public.site_content
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS site_content_admin_select_all ON public.site_content;
CREATE POLICY site_content_admin_select_all ON public.site_content
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS site_content_admin_insert ON public.site_content;
CREATE POLICY site_content_admin_insert ON public.site_content
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS site_content_admin_update ON public.site_content;
CREATE POLICY site_content_admin_update ON public.site_content
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS site_content_admin_delete ON public.site_content;
CREATE POLICY site_content_admin_delete ON public.site_content
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 6. inquiries: anyone may submit (pending only); only admins read/manage -----
DROP POLICY IF EXISTS inquiries_public_insert ON public.inquiries;
CREATE POLICY inquiries_public_insert ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS inquiries_admin_select ON public.inquiries;
CREATE POLICY inquiries_admin_select ON public.inquiries
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS inquiries_admin_update ON public.inquiries;
CREATE POLICY inquiries_admin_update ON public.inquiries
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS inquiries_admin_delete ON public.inquiries;
CREATE POLICY inquiries_admin_delete ON public.inquiries
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 7. content_audit_logs: admins read only; writes happen exclusively through
--    SECURITY DEFINER audit triggers (immutable history, no client writes) -----
DROP POLICY IF EXISTS audit_logs_admin_select ON public.content_audit_logs;
CREATE POLICY audit_logs_admin_select ON public.content_audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- 8. Table privileges: least privilege for client roles -----------------------
REVOKE ALL ON public.admin_users, public.projects, public.site_content,
              public.inquiries, public.content_audit_logs FROM anon, authenticated;

GRANT SELECT ON public.projects, public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects, public.site_content TO authenticated;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT SELECT ON public.content_audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;

-- 9. Storage bucket + policies (only when the Supabase storage schema exists) -
DO $storage$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'artwork-media', 'artwork-media', true, 8388608,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
    )
    ON CONFLICT (id) DO UPDATE
      SET public = EXCLUDED.public,
          file_size_limit = EXCLUDED.file_size_limit,
          allowed_mime_types = EXCLUDED.allowed_mime_types;

    DROP POLICY IF EXISTS artwork_media_public_read ON storage.objects;
    CREATE POLICY artwork_media_public_read ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'artwork-media');

    DROP POLICY IF EXISTS artwork_media_admin_insert ON storage.objects;
    CREATE POLICY artwork_media_admin_insert ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'artwork-media' AND public.is_admin());

    DROP POLICY IF EXISTS artwork_media_admin_update ON storage.objects;
    CREATE POLICY artwork_media_admin_update ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'artwork-media' AND public.is_admin())
      WITH CHECK (bucket_id = 'artwork-media' AND public.is_admin());

    DROP POLICY IF EXISTS artwork_media_admin_delete ON storage.objects;
    CREATE POLICY artwork_media_admin_delete ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'artwork-media' AND public.is_admin());
  END IF;
END
$storage$;
