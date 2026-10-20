-- ============================================================================
-- Seed: seed.sql
-- Description: Art Work Digital Platform baseline development seed
-- Entities: admin_users, site_content, projects
-- ============================================================================

-- 1. Baseline Administrator Account (Development / Local)
INSERT INTO public.admin_users (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'chief@artwork.stage',
    'Chief Creative Director',
    'super_admin',
    true
) ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- 2. Core Site Content Seed
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
            jsonb_build_object('label', 'Global Arenas', 'value', '120+', 'caption', 'Designed and executed'),
            jsonb_build_object('label', 'Avg Fan Impact', 'value', '50k/night', 'caption', 'Direct engagement'),
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
        'phone', '+971 4 000 0000',
        'address', 'Creative Media Free Zone, Studio 04',
        'office_hours', 'Sun - Thu, 09:00 - 18:00 GST'
    ),
    'published',
    1
)
ON CONFLICT (section_key) DO UPDATE SET
    data = EXCLUDED.data,
    status = EXCLUDED.status,
    version = public.site_content.version + 1;

-- 3. Showcase Projects Seed
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
    status,
    order_index,
    featured
) VALUES
(
    'neon-horizon',
    'Neon Horizon World Tour',
    'Global Live Nation',
    'stage',
    2026,
    'Parametric LED curved stage rig with 360-degree kinetic motion and synchronized laser mapping.',
    ARRAY['Stage', 'LED', 'Kinetic'],
    'ARENA // 2026',
    'IMMERSIVE LED',
    'CAD-REV-04',
    '/assets/images/gallery/project_01_neon_horizon.webp',
    'Neon Horizon arena stage scenography',
    '52,000',
    'FANS / NIGHT',
    ARRAY['100% Custom Rig', '0.0s DMX Latency', 'Kinetic LED Rings'],
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'published',
    1,
    true
),
(
    'hyper-dome',
    'HyperDome Esports Grand Finals',
    'Riot Esports',
    'tech',
    2025,
    'Octagonal holographic canopy suspended over stadium center with instant replay LED floors.',
    ARRAY['Esports', 'Tech', 'Arena'],
    'STADIUM // 2025',
    'HOLOMESH',
    'CAD-HD-08',
    '/assets/images/gallery/project_02_hyper_dome.webp',
    'HyperDome esports arena center canopy',
    '34,000',
    'CONCURRENT LIVE',
    ARRAY['Holographic Mesh', '8K Center Cube', 'Sub-millimeter Tracking'],
    NULL,
    NULL,
    'published',
    2,
    true
),
(
    'cyber-truss',
    'CyberTruss Soundwave Festival',
    'Ultra Festival Worldwide',
    'stage',
    2025,
    'Industrial steel trussing structure featuring kinetic robotic lighting arms and pyrotechnic safety baffles.',
    ARRAY['Truss', 'Lighting', 'Kinetic'],
    'OUTDOOR // 2025',
    'PARAMETRIC RIG',
    'CAD-CT-12',
    '/assets/images/gallery/project_03_cyber_truss.webp',
    'CyberTruss soundwave festival main stage',
    '75,000',
    'ATTENDEES',
    ARRAY['Parametric Steel', '32 Kinetic Winches', 'Flame Cannons DMX'],
    NULL,
    NULL,
    'published',
    3,
    false
),
(
    'lumina-kinetic',
    'Lumina Kinetic Brand Pavilion',
    'Polestar Automotive',
    'booths',
    2025,
    'Sculptural automotive booth with suspended undulating light rods reacting to visitor proximity.',
    ARRAY['Brand', 'Interactive', 'LED'],
    'EXPO // 2025',
    'RESPONSIVE RIG',
    'CAD-LK-02',
    '/assets/images/gallery/project_04_lumina_kinetic.webp',
    'Lumina kinetic interactive brand pavilion',
    '18,000',
    'INTERACTIONS / DAY',
    ARRAY['Proximity LiDAR', 'Dynamic Spatial Audio', 'Mirror Black Glass'],
    NULL,
    NULL,
    'published',
    4,
    false
),
(
    'monolith-stage',
    'Monolith Electronic Night',
    'Awakenings Worldwide',
    'led',
    2024,
    'Monumental brutalist LED towers towering 24 meters high with strobe matrix arrays.',
    ARRAY['Techno', 'Brutalism', 'LED'],
    'INDOOR // 2024',
    'BRUTALIST MONOLITH',
    'CAD-MN-01',
    '/assets/images/gallery/project_05_monolith_stage.webp',
    'Monolith electronic stage towers',
    '22,000',
    'RAVERS',
    ARRAY['24m LED Monoliths', 'Custom Strobe Blades', 'Sub-bass Rigging'],
    NULL,
    NULL,
    'published',
    5,
    false
),
(
    'prism-arena',
    'Prism Summit Keynote Theatre',
    'TechGlobal Conference',
    'conferences',
    2024,
    'Curved panoramic ultra-fine pitch LED wall with broadcast-grade tracking cameras for keynote talks.',
    ARRAY['Keynote', 'LED', 'Broadcast'],
    'SUMMIT // 2024',
    'KEYNOTE THEATRE',
    'CAD-PA-07',
    '/assets/images/gallery/project_06_prism_arena.webp',
    'Prism keynote stage with curved LED backdrop',
    '8,500',
    'C-SUITE DELEGATES',
    ARRAY['0.9mm MicroLED', 'Broadcast Unreal Studio', 'Discreet Audio Array'],
    NULL,
    NULL,
    'published',
    6,
    false
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    client = EXCLUDED.client,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;
