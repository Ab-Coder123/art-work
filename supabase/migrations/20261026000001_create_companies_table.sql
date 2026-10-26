-- ============================================================================
-- Migration: 20261026000001_create_companies_table.sql
-- Description: Companies & client partner showcase table with RLS & seed data
-- Entities: companies
-- Target: PostgreSQL 15+ via Supabase
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    category TEXT NOT NULL DEFAULT 'corporate',
    description TEXT NOT NULL DEFAULT '',
    highlight TEXT NOT NULL DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_companies_order_active ON public.companies (is_active, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_companies_category ON public.companies (category);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_companies_updated_at ON public.companies;
CREATE TRIGGER trg_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: anyone can read active companies
DROP POLICY IF EXISTS "Public can view active companies" ON public.companies;
CREATE POLICY "Public can view active companies"
ON public.companies
FOR SELECT
USING (is_active = true);

-- 2. Admin Full Access Policy: editors and super admins can manage companies
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
CREATE POLICY "Admins can manage companies"
ON public.companies
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Seed Initial High-Profile Partners
INSERT INTO public.companies (slug, name, logo_url, website_url, category, description, highlight, order_index, featured, is_active)
VALUES
  ('rameda-pharmaceuticals', 'Rameda Pharmaceuticals', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80', 'https://www.rameda.com', 'pharma', 'Annual corporate gathering with custom branded stage, LED choreographies, and arena live broadcast.', 'Annual Gathering & Production', 1, true, true),
  ('red-bull', 'Red Bull', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&auto=format&fit=crop&q=80', 'https://www.redbull.com', 'entertainment', 'High-voltage brand activations, customized kinetic truss motion, and extreme sporting soundscapes.', 'Kinetic Arena Activation', 2, true, true),
  ('mdlbeast', 'MDLBEAST Soundstorm', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80', 'https://www.mdlbeast.com', 'festivals', 'Multi-acre festival arenas with synced lasers, kinetic LED kinetic rings, and 120-cue accuracy.', 'Mega Festival Scenography', 3, true, true),
  ('vodafone', 'Vodafone', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&auto=format&fit=crop&q=80', 'https://www.vodafone.com', 'tech', 'Ultra-wide panoramic LED displays, interactive experiential booths, and 5G network launch arenas.', 'Telecom Keynote & Holographic Expo', 4, true, true),
  ('emaar', 'Emaar Properties', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80', 'https://www.emaar.com', 'real_estate', 'Luxury landmark unveilings with 4K laser projection mapping and synchronized symphonic light show.', 'Architectural Projection Mapping', 5, true, true),
  ('spotify', 'Spotify', 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=300&auto=format&fit=crop&q=80', 'https://www.spotify.com', 'entertainment', 'Custom experiential audio rooms, neon art installations, and creator awards soundstages.', 'Live Fan Soundstage', 6, true, true),
  ('novartis', 'Novartis', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', 'https://www.novartis.com', 'pharma', 'Arena medical conferences with holographic 3D molecular visualization and VIP plenaries.', 'Medical Innovation Summit', 7, false, true),
  ('samsung', 'Samsung', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop&q=80', 'https://www.samsung.com', 'tech', 'Interactive curved display tunnels, tactile device testing zones, and robotic stage arms.', 'Galaxy Global Unpack Booth', 8, false, true)
ON CONFLICT (slug) DO NOTHING;
