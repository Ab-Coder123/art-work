import type { SiteContent, ProjectRecord } from "@art-work/types";
import { SITE_MEDIA } from "@art-work/database/content/default-content";

export const SEED_PROJECTS: ProjectRecord[] = [
  {
    id: "rameda-event",
    title: "Rameda Event",
    stamp: "EVENT_PASS: RAMEDA_01",
    metaBadge: "ANNUAL GATHERING",
    cadId: "PROD_ID: RAMEDA_EVENT",
    image: "/assets/images/gallery/rameda_event.jpg",
    altText: "Rameda Annual Company Gathering & Event Production",
    category: "conferences",
    tags: [
      "Corporate Gathering",
      "Annual Event",
      "Stage & Production",
      "Event Management",
    ],
    stats: "✨ 1,000+ Guests",
    statsSub: "Annual Gathering • 100% Custom Stage",
    description:
      "Relive the highlights of Rameda’s Annual Company Gathering, bringing together the team for a special day of celebration, connection, and shared achievements.",
    client: "Rameda Pharmaceuticals",
    specs: [
      "Custom Branded Stage & Lighting Rig",
      "High-Definition LED Screen Choreography",
      "Multi-Camera Live Broadcast & Showreel",
      "Seamless On-site Event Logistics",
    ],
    status: "published",
    order: 1,
    featured: true,
    youtubeVideoId: "7SkcdZ7CcGI",
    youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
    youtubeTitle: "Rameda Event",
    youtubeDescription:
      "A day filled with unforgettable moments, positive energy, and team spirit! 🎉\n\nRelive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.\n\nFrom memorable moments to the smiles and energy of our people, this event reflects the strong culture, teamwork, and passion that drive us forward every day.",
    isShort: false,
  },
];

export const SEED_SITE_CONTENT: SiteContent = {
  version: "1.0.0",
  updatedAt: "2026-10-19T10:00:00.000Z",
  manifesto: {
    announcementBadge: "MARKETING SOLUTIONS FOR KINETIC BRANDS",
    editionBadge: "EDITION 2025",
    stickyNote: 'STICKY_NOTE_01.CAD: "Zero cookie-cutter templates."',
    headlinePart1: "CREATIVE IDEAS.",
    headlinePart2: "REAL IMPACT.",
    starburstText: {
      top: "100% RAW",
      middle: "UNAPOLOGETIC",
      bottom: "CREATIVE",
    },
    introParagraph:
      "We are Art Work: an interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    primaryCtaText: "EXPLORE SHOWREEL",
    secondaryCtaText: "VIEW CAPABILITIES",
    metrics: [
      { num: "450+", label: "Arena Shows" },
      { num: "99.4%", label: "Cue Accuracy" },
      { num: "1.2M+", label: "Live Reach" },
    ],
    canvasHeader: "STUDIO_COLLECTIVE_CANVAS.V4",
    canvasTag: "INK_LAYER_ACTIVE",
    heroImage: "/assets/images/hero_studio_collective.png",
    heroImageAlt: "Art Work Creative Marketing Studio Collective",
  },
  whyUsTeaser: {
    eyebrow: "02 WHY ART WORK",
    headline: "ENGINEERED FOR STAGE & SCALE.",
    exploreCtaText: "EXPLORE FULL WHY US",
    bentoCards: [
      {
        number: "01",
        title: "Arena & Stage Scenography",
        description:
          "Stage blueprints, LED mapping rigs, lighting cue choreographies, and large-format structural storytelling.",
        badge: "PRODUCTION READY",
        iconName: "layers",
      },
      {
        number: "02",
        title: "Dynamic Motion Systems",
        description:
          "Kinetic typography, 3D broadcast packages, real-time reactive shaders, and frame-accurate visual sync.",
        badge: "60 FPS FIDELITY",
        iconName: "sparkles",
      },
      {
        number: "03",
        title: "Brand Architecture",
        description:
          "Custom hand-drawn vector doodle suites, physical merch design, stage passes, and total campaign cohesion.",
        badge: "TACTILE & DIGITAL",
        iconName: "palette",
      },
    ],
    blueprint: {
      badge: "BLUEPRINT & STAGE PREVIEW",
      title: "FROM SKETCHBOARD TO LIVE VENUE IN 72 HOURS.",
      description:
        "We prototype spatial structures, truss configurations, projector lines of sight, and booth flows in real-time.",
      image: "/assets/images/blueprint_stage_scenography.png",
      altText: "Stage Architecture Blueprints and Scenography",
    },
  },
  contact: {
    stageTag: "STAGE 04 // LAUNCH YOUR CAMPAIGN",
    headline: "LET’S INK SOMETHING HISTORIC.",
    description:
      "Whether you need a dynamic stage package for an arena tour or an unforgettable brand identity, our sketchpad is open.",
    intakeLabel: "DIRECT INTAKE // CREATIVE CHIEF ON-CALL",
    intakeImage: "/assets/images/creative_chief_intake.png",
    intakeImageAlt: "Creative Chief on call ready for brief intake",
    email: "ahmed.artwork2026@gmail.com",
    phone: "+1 (800) ART-WORK // DMX-EXT: 04",
    studioLocations: "BERLIN // NEW YORK // TOKYO",
    submitButtonText: "TRANSMIT BRIEF // LAUNCH STAGE",
    formFields: [
      {
        name: "fullName",
        label: "PRODUCER / LEAD NAME",
        placeholder: "Your name or production alias",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "DIRECT INBOX",
        placeholder: "director@brand.com",
        type: "email",
        required: true,
      },
      {
        name: "serviceType",
        label: "TARGET DISCIPLINE",
        placeholder: "Select Discipline",
        type: "select",
        required: true,
      },
      {
        name: "brief",
        label: "STAGE PARAMETERS & VISION",
        placeholder: "Brief your stage vision, arena dates, or design needs...",
        type: "textarea",
        required: true,
      },
    ],
  },
  whyUsPage: {
    sceneBadge: "SCENE // 02",
    sceneTitle: "AGENCY PROPOSITION & EXPERIENTIAL PROOF",
    statusBadge: "STATUS: 100% UNAPOLOGETIC",
    heroHeadlineRow1: "WHY",
    heroHeadlineRow2: "US?",
    roiBadge: "PERFORMANCE MARKETING",
    contentCreationBadge: "CONTENT CREATION",
    doodleStickers: [
      "★ BRANDING",
      "CONTENT STRATEGY // 360°",
      "DESIGNING",
      "WEB DEV",
    ],
    presentationTitle: "CREATIVE CHIEF ON-CALL // CONCEPT INTAKE",
    presentationSubtitle:
      "From wet fountain pen on raw grid paper to arena execution.",
    presentationImage: SITE_MEDIA.stageBlueprint,
    presentationImageAlt:
      "Art Work Creative Director presenting stage CAD schematics",
    metrics: [
      { num: "450+", label: "Arena Shows Executed" },
      { num: "99.4%", label: "Live Cue Accuracy" },
      { num: "1.2M+", label: "Audience Footprint" },
      { num: "72h", label: "Rapid Spatial Turnaround" },
    ],
  },
};
