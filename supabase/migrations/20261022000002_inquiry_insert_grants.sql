-- The RLS policy allows anonymous submissions, but PostgreSQL table grants
-- are also required before that policy can be evaluated. Keep anonymous
-- access limited to INSERT; RLS still restricts new inquiries to pending.
GRANT INSERT ON TABLE public.inquiries TO anon;

-- Dashboard inquiry reads and lifecycle updates are authenticated and remain
-- constrained by the admin-only RLS policies in 20261019000002.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO authenticated;
