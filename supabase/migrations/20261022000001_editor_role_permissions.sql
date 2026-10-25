-- Keep viewer accounts read-only at both the API and database boundaries.
-- Existing project/content mutation policies call is_admin(), so changing its
-- membership predicate applies the role rule consistently to those policies.
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
      AND role IN ('super_admin', 'editor')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
