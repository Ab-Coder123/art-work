import type { SiteContent } from "@art-work/types";

export const SITE_MEDIA = {
  heroCollective: "/assets/images/hero_studio_collective.webp",
  stageBlueprint: "/assets/images/blueprint_stage_scenography.webp",
  creativeChiefIntake: "/assets/images/creative_chief_intake.webp",
} as const;

const LEGACY_SITE_MEDIA: Record<string, string> = {
  "/assets/images/stage_design_architect.webp": SITE_MEDIA.stageBlueprint,
  "/assets/images/why_us_architect_presentation.png": SITE_MEDIA.stageBlueprint,
  "/assets/images/creative_chief_on_call.webp": SITE_MEDIA.creativeChiefIntake,
};

export function normalizeSiteMediaPath(value: string, fallback: string): string {
  const path = value.trim();
  return LEGACY_SITE_MEDIA[path] || path || fallback;
}

/**
 * Canonical default site content for the Art Work marketing platform.
 * Used as high-fidelity fallback if the database is unreachable or newly initialized.
 */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  version: "1.0.0",
  updatedAt: new Date().toISOString(),

  manifesto: {
    announcementBadge: "MARKETING SOLUTIONS FOR KINETIC BRANDS",
    editionBadge: "EDITION 2026",
    stickyNote: "DIRECTOR NOTE: UNCONVENTIONAL EXPERIENCES ONLY",
    headlinePart1: "CREATIVE IDEAS.",
    headlinePart2: "REAL IMPACT.",
    starburstText: {
      top: "KINETIC",
      middle: "STAGE",
      bottom: "2026",
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
    heroImage: SITE_MEDIA.heroCollective,
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
          "Kinetic typography, 3D broadcast packages, real-time reactive shaders, and frame-accurate visual sync.",
        badge: "01",
      },
      {
        number: "02",
        title: "Brand Spatial Identity",
        description:
          "Tactile print collateral, custom architectural booths, bespoke typography, and physical touchpoints.",
        badge: "02",
      },
      {
        number: "03",
        title: "Event Technology & DMX",
        description:
          "Multi-camera broadcast direction, interactive lighting protocols, timecode audio, and stage production.",
        badge: "03",
      },
    ],
    blueprint: {
      badge: "BLUEPRINT // REV 4.2",
      title: "FROM SKETCHBOARD TO LIVE VENUE IN 72 HOURS.",
      description:
        "We prototype spatial structures, truss configurations, projector lines of sight, and booth flows in real-time.",
      image: SITE_MEDIA.stageBlueprint,
      altText: "Art Work Stage Design Blueprint and Architectural Scenography",
    },
  },

  contact: {
    stageTag: "STAGE 04 // LAUNCH YOUR CAMPAIGN",
    headline: "LET’S INK SOMETHING HISTORIC.",
    description:
      "Whether you need a dynamic stage package for an arena tour or an unforgettable brand identity, our sketchpad is open.",
    intakeLabel: "DIRECT INTAKE // CREATIVE CHIEF ON-CALL",
    intakeImage: SITE_MEDIA.creativeChiefIntake,
    intakeImageAlt: "Art Work Creative Chief On-Call Concept Intake",
    email: "studio@artwork-solutions.stage",
    phone: "+1 (800) ART-WORK // DMX-EXT: 04",
    studioLocations: "BERLIN // NEW YORK // TOKYO",
    submitButtonText: "TRANSMIT BRIEF // LAUNCH STAGE",
    formFields: [
      {
        name: "fullName",
        label: "01 YOUR NAME / ALIAS",
        placeholder: "e.g. Alex Mercer, Studio Lead",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "02 DIRECT COMM SIGNAL (EMAIL)",
        placeholder: "alex@enterprise.stage",
        type: "email",
        required: true,
      },
      {
        name: "serviceType",
        label: "03 MISSION OBJECTIVE",
        placeholder: "Arena Scenography / Kinetic Stage Direction",
        type: "select",
        required: true,
      },
      {
        name: "brief",
        label: "04 PROJECT BRIEF / STAGE SPEC",
        placeholder: "Tell us about your stage dimensions, vision, and timeline...",
        type: "textarea",
        required: true,
      },
    ],
  },

  whyUsPage: {
    sceneBadge: "SCENE // 02",
    sceneTitle: "02 / WHY ART WORK",
    statusBadge: "STATUS: 100% UNAPOLOGETIC",
    heroHeadlineRow1: "WHY",
    heroHeadlineRow2: "US?",
    roiBadge: "PERFORMANCE MARKETING (+340% ROI)",
    contentCreationBadge: "EXPERIENTIAL PRODUCTION",
    doodleStickers: [
      "DMX_SYNCED",
      "ARENA_TESTED",
      "ZERO_TEMPLATES",
      "TACTILE_INK",
    ],
    presentationTitle: "CREATIVE CHIEF ON-CALL // CONCEPT INTAKE",
    presentationSubtitle:
      "From wet fountain pen on raw grid paper to arena execution.",
    presentationImage: SITE_MEDIA.stageBlueprint,
    presentationImageAlt: "Creative Architecture Blueprint",
    metrics: [
      { num: "450+", label: "Arena Shows" },
      { num: "99.4%", label: "Cue Accuracy" },
      { num: "1.2M+", label: "Live Reach" },
    ],
  },
};
