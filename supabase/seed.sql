-- ============================================================================
-- Seed: seed.sql
-- Description: Art Work Digital Platform baseline development & cloud seed
-- Entities: site_content, projects
-- ============================================================================

-- 1. Core Site Content Seed
INSERT INTO public.site_content (section_key, data, status, version) VALUES
(
    'hero',
    jsonb_build_object(
        'headline_highlight', 'KINETIC STAGES.',
        'headline_suffix', 'UNFORGETTABLE EXPERIENCES.',
        'subheadline', 'We engineer architectural scenography, immersive concert stages, and interactive physical-digital brand activations.',
        'tags', jsonb_build_array('Scenography', 'Lighting Architecture', '3D Trussing', 'Creative Direction'),
        'cta_primary_text', 'Explore Showcase',
        'cta_primary_href', '/gallery',
        'cta_secondary_text', 'Our Philosophy',
        'cta_secondary_href', '/why-us',
        'banner_badge', 'WORLD TOUR 2026 PRODUCTION'
    ),
    'published',
    1
),
(
    'capabilities',
    jsonb_build_object(
        'heading', 'TECHNICAL CAPABILITIES MATRIX',
        'subheading', 'Comprehensive creative and spatial engineering disciplines',
        'cards', jsonb_build_array(
            jsonb_build_object(
                'id', 'stage-arch',
                'title', 'Stage Architecture',
                'category', 'Spatial',
                'description', 'Parametric truss design, acoustic engineering, and modular stage rigs.',
                'icon_name', 'Layers',
                'order_index', 1
            ),
            jsonb_build_object(
                'id', 'lighting-cinematics',
                'title', 'Lighting Cinematics',
                'category', 'Lighting',
                'description', 'Synchronized timecode lighting, DMX universe routing, and laser mapping.',
                'icon_name', 'Sparkles',
                'order_index', 2
            ),
            jsonb_build_object(
                'id', 'kinetic-mechanics',
                'title', 'Kinetic Rigging',
                'category', 'Automation',
                'description', 'Motorized winches, rotating LED columns, and dynamic ceiling grids.',
                'icon_name', 'Cpu',
                'order_index', 3
            )
        )
    ),
    'published',
    1
),
(
    'why_us',
    jsonb_build_object(
        'heading', 'WHY ART WORK',
        'manifesto_lead', 'We bridge raw architectural geometry with cinematic motion.',
        'paragraphs', jsonb_build_array(
            'Our studio unites spatial designers, lighting directors, and creative technologists under one roof.',
            'Every stage we craft is an instrument of rhythm and architecture, built for world-class touring.'
        ),
        'metrics', jsonb_build_array(
            jsonb_build_object('label', 'Global Arenas', 'value', '450+', 'caption', 'Designed and executed'),
            jsonb_build_object('label', 'Avg Fan Impact', 'value', '52k/night', 'caption', 'Direct engagement'),
            jsonb_build_object('label', 'DMX Latency', 'value', '0.0ms', 'caption', 'Real-time telemetry')
        )
    ),
    'published',
    1
),
(
    'scrollytelling',
    jsonb_build_object(
        'stage_01_label', 'GENESIS // THINKER',
        'stage_02_label', 'COLLECTIVE // STUDIO',
        'stage_03_label', 'ARCHITECTURE // BLUEPRINT',
        'sound_fx_default', true
    ),
    'published',
    1
),
(
    'contact',
    jsonb_build_object(
        'email', 'studio@artwork-solutions.stage',
        'phone', '+1 (800) ART-WORK // DMX-EXT: 04',
        'address', 'BERLIN // NEW YORK // TOKYO',
        'office_hours', 'Sun - Thu, 09:00 - 18:00 GST'
    ),
    'published',
    1
)
ON CONFLICT (section_key) DO UPDATE SET
    data = EXCLUDED.data,
    status = EXCLUDED.status,
    version = public.site_content.version + 1;

-- 2. Showcase Projects Seed (Unified with SEED_PROJECTS)
INSERT INTO public.projects (
    slug,
    title,
    client,
    category,
    year,
    description,
    tags,
    stamp,
    meta_badge,
    cad_id,
    cover_image_url,
    cover_image_alt,
    stats_primary,
    stats_secondary,
    specs,
    youtube_video_id,
    youtube_url,
    youtube_title,
    youtube_description,
    youtube_is_short,
    status,
    order_index,
    featured
) VALUES
(
    'rameda-event',
    'Rameda Event',
    'Rameda Pharmaceuticals',
    'conferences',
    2025,
    'Relive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.',
    ARRAY['Corporate Gathering', 'Annual Event', 'Stage & Production', 'Event Management'],
    'EVENT_PASS: RAMEDA_01',
    'ANNUAL GATHERING',
    'PROD_ID: RAMEDA_EVENT',
    '/assets/images/gallery/rameda_event.jpg',
    'Rameda Annual Company Gathering & Event Production',
    '✨ 1,000+ Guests',
    'Annual Gathering • 100% Custom Stage',
    ARRAY['Custom Branded Stage & Lighting Rig', 'High-Definition LED Screen Choreography', 'Multi-Camera Live Broadcast & Showreel', 'Seamless On-site Event Logistics'],
    '7SkcdZ7CcGI',
    'https://www.youtube.com/watch?v=7SkcdZ7CcGI',
    'Rameda Event',
    'A day filled with unforgettable moments, positive energy, and team spirit! 🎉

Relive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.

From memorable moments to the smiles and energy of our people, this event reflects the strong culture, teamwork, and passion that drive us forward every day.',
    false,
    'published',
    1,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    client = EXCLUDED.client,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    stamp = EXCLUDED.stamp,
    meta_badge = EXCLUDED.meta_badge,
    cad_id = EXCLUDED.cad_id,
    cover_image_url = EXCLUDED.cover_image_url,
    cover_image_alt = EXCLUDED.cover_image_alt,
    stats_primary = EXCLUDED.stats_primary,
    stats_secondary = EXCLUDED.stats_secondary,
    specs = EXCLUDED.specs,
    youtube_video_id = EXCLUDED.youtube_video_id,
    youtube_url = EXCLUDED.youtube_url,
    youtube_title = EXCLUDED.youtube_title,
    youtube_description = EXCLUDED.youtube_description,
    youtube_is_short = EXCLUDED.youtube_is_short,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index,
    featured = EXCLUDED.featured;
