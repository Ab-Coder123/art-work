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
    'neon-horizon',
    'Neon Horizon World Tour',
    'Global Music Collective',
    'stage',
    2025,
    'A massive arena tour stage scenography bathed in canary yellow laser arrays, kinetic ceiling hoists, and curved volumetric 8K LED walls.',
    ARRAY['Stage, Sound & Lighting', 'LED Screens & Audiovisual', 'Concept Creation'],
    'STAMP_PASS: ARENA_01',
    'OCT 2025',
    'CAD_ID: NH_TOUR_V4',
    '/assets/images/gallery/project_01_neon_horizon.jpg',
    'Neon Horizon World Tour Arena Scenography and Laser Rig',
    '⚡ 52,000 Fans / Night',
    '0.0s DMX Latency • 100% Custom Rig',
    ARRAY['40m x 22m Custom Truss Grid', '180 DMX Controlled Moving Heads', 'Notch Real-time Audio-Reactive Shaders', 'SMPTE Timecode Precision Sync'],
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Neon Horizon Arena Stage — Live Timecode Showreel (4K)',
    'Full arena rehearsal capture showcasing the 40m parametric truss rig, 180 moving heads, and zero-latency SMPTE timecode laser synchronization.',
    false,
    'published',
    1,
    true
),
(
    'medtech-summit',
    'Global MedTech Summit 2025',
    'World Medical Technology Forum',
    'conferences',
    2025,
    'Ultra-sleek double-decker medical conference pavilion with interactive digital demo kiosks, glass railings, and precision LED strip illumination.',
    ARRAY['Conference & Medical Event Management', 'Registration & Event Staffing', 'On-site Logistics'],
    'SUMMIT_ID: MED_25',
    'VENUE: GENEVA EXPO',
    'REV: PAVILION_STAGE3',
    '/assets/images/gallery/project_02_medtech_summit.jpg',
    'Global MedTech Summit Multi-tier Interactive Conference Pavilion',
    '🏥 14,000 Delegates',
    '6 Plenary Stages • 99.8% Sync Score',
    ARRAY['6 Simultaneous Plenary Streams', 'Full RFID Registration Badge Flow', '45 Multilingual Host Team', 'Custom Medical Demo Staging'],
    'aqz-KE-bpKQ',
    'https://www.youtube.com/shorts/aqz-KE-bpKQ',
    '60-Second Behind-The-Scenes Reel: Geneva MedTech Pavilion Build',
    'Vertical 9:16 time-lapse Reel capturing our 72-hour rapid structural build and interactive kiosk calibration in Geneva.',
    true,
    'published',
    2,
    true
),
(
    'cybertruss-pavilion',
    'CyberTruss Spatial Pavilion',
    'Industrial Tech Conglomerate',
    'booths',
    2025,
    'Grand geometric trade expo pavilion built from heavy industrial stage trusses, cantilevered VIP mezzanine lounge, and volumetric lighting.',
    ARRAY['Exhibition Booth Design & Production', 'Interactive Activities & Engagement', 'On-site Management'],
    'PATENT_ARCH: EXPO_08',
    'FAB: CNC MILLWORK',
    'FRAME: 40m x 25m',
    '/assets/images/gallery/project_03_cybertruss.jpg',
    'CyberTruss Trade Expo Structural Pavilion Architecture',
    '📐 1,200 m² Footprint',
    '72-Hour Rapid Build • German Spec Steel',
    ARRAY['German-Spec CNC Steel Beams', 'Cantilevered VIP Hospitality Deck', 'Interactive Floor Tracking Projections', 'Full Fire & Wind Safety Compliance'],
    NULL,
    NULL,
    NULL,
    NULL,
    false,
    'published',
    3,
    true
),
(
    'prism-brand-suite',
    'Prism Brand Identity & Merch',
    'Creative Arts Festival',
    'branding',
    2025,
    'Tactile event branding system: matte black foil-stamped VIP laminate passes, woven canary yellow lanyards, screenprinted hoodies, and signage.',
    ARRAY['Branding, Printing & Event Branding', 'Promotional Giveaways & Merchandise'],
    'SYSTEM_SYS: ID_99',
    'BATCH: LIMITED EDITION',
    'PANTONE: #FACC15',
    '/assets/images/gallery/project_04_prism_merch.jpg',
    'Prism Brand Merch Suite and VIP Credential System',
    '🎨 35 Custom Swatches',
    '20k Screenprints • Pantone Canary Yellow',
    ARRAY['Embossed Foil Laminate VIP Badges', 'Heavy-Duty Custom Woven Lanyards', 'Screenprinted Organic Cotton Merch', 'Wayfinding Architectural Signage'],
    NULL,
    NULL,
    NULL,
    NULL,
    false,
    'published',
    4,
    false
),
(
    'arena-genesis',
    'Arena Genesis Live Broadcast',
    'Global Esports Arena',
    'tech',
    2025,
    'Multi-camera broadcast production studio and stadium stage with anamorphic 3D LED screens and automated robotic spotlight rigs.',
    ARRAY['Photography & Videography', 'Stage, Sound & Lighting', 'Event Planning & Project Management'],
    'BROADCAST: 4K_60FPS',
    'GLOBAL SYNC',
    'LATENCY: 1.2MS',
    '/assets/images/gallery/project_05_arena_genesis.jpg',
    'Arena Genesis Multi-camera Broadcast Arena and Anamorphic Stage',
    '🎥 18 Ultra-HD Cameras',
    '1.4M Stream Peak • Zero Dropped Frames',
    ARRAY['18 4K HDR Broadcast Cameras', 'Robotic Jib & Wire-Cam Tracking', 'Instant Multi-Angle Replay Servers', 'Worldwide Satellite Relay Sync'],
    'M7lc1UVf-VE',
    'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    'Arena Genesis Esports Finals — Multi-Cam Broadcast Highlights',
    'Anamorphic 3D LED stage reveal and robotic wire-cam tracking during the live Championship opening ceremony.',
    false,
    'published',
    5,
    true
),
(
    'sensory-expo',
    'Sensory Kinetic Expo Booth',
    'Next-Gen Telecommunications',
    'led',
    2025,
    'Sensorial experiential booth with holographic transparent mesh screens, motion-reactive LED light pillars, and kinetic chandeliers.',
    ARRAY['Exhibition Booth Design', 'LED Screens & Audiovisual', 'Concept Creation & Creative Development'],
    'INTERACTION: SENSOR_V2',
    'MWC BARCELONA',
    'CUES: 880 SENSOR_TRIG',
    '/assets/images/gallery/project_06_sensory_expo.jpg',
    'Sensory Kinetic Expo Booth with Holographic LED Mesh and Sensors',
    '✨ 880 Interactive Cues',
    '4.9/5 Visitor Rating • Viral Social Surge',
    ARRAY['Transparent Micro-LED Glass Walls', 'LiDAR Audience Motion Sensing', 'Kinetic Ceiling Lighting Matrix', 'Spatial Surround Sound Arrays'],
    NULL,
    NULL,
    NULL,
    NULL,
    false,
    'published',
    6,
    false
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
