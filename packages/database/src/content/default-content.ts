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
    announcementBadge: "EVENTS, EXHIBITIONS & BRAND EXPERIENCES",
    editionBadge: "CONCEPT TO DELIVERY",
    stickyNote: "ONE TEAM FROM FIRST IDEA TO EVENT DAY",
    headlinePart1: "WE TURN IDEAS",
    headlinePart2: "INTO LIVE EXPERIENCES.",
    starburstText: {
      top: "LIVE",
      middle: "EVENTS",
      bottom: "2026",
    },
    introParagraph:
      "From the initial concept to the final execution, we create memorable experiences that bring brands to life. Our team plans, designs and delivers events with the details, production and coordination needed to make every moment count.",
    primaryCtaText: "VIEW OUR PROJECTS",
    secondaryCtaText: "EXPLORE OUR SERVICES",
    metrics: [
      { num: "12", label: "Service Areas" },
      { num: "1", label: "Connected Team" },
      { num: "360°", label: "Concept to Delivery" },
    ],
    canvasHeader: "EVENT_PRODUCTION_CANVAS.V4",
    canvasTag: "LIVE_DELIVERY_ACTIVE",
    heroImage: SITE_MEDIA.heroCollective,
    heroImageAlt: "Art Work Event Planning and Production Studio Collective",
  },

  whyUsTeaser: {
    eyebrow: "WHY WORK WITH ART WORK",
    headline: "ONE TEAM FROM FIRST IDEA TO FINAL MOMENT.",
    exploreCtaText: "HOW WE WORK",
    bentoCards: [
      {
        number: "01",
        title: "Event Planning & Project Management",
        description:
          "Clear plans, schedules and coordination keep the moving parts of your event working together.",
        badge: "PLANNED AROUND YOUR BRIEF",
      },
      {
        number: "02",
        title: "Creative Design & Brand Experience",
        description:
          "We shape the concept, environment and event branding into an experience that feels connected to your brand.",
        badge: "MADE FOR YOUR BRAND",
      },
      {
        number: "03",
        title: "Production & On-Site Delivery",
        description:
          "We coordinate event production, suppliers, staffing and logistics through setup, live delivery and close-out.",
        badge: "FROM SETUP TO SHOWTIME",
      },
    ],
    blueprint: {
      badge: "OUR APPROACH",
      title: "A PLAN THAT TAKES SHAPE.",
      description:
        "We develop the creative direction, production plan and event details with you, then coordinate delivery through the live event.",
      image: SITE_MEDIA.stageBlueprint,
      altText: "Art Work Event Planning & Architectural Scenography Blueprint",
    },
  },

  contact: {
    stageTag: "TELL US WHAT YOU’RE PLANNING",
    headline: "LET’S PLAN YOUR NEXT EVENT.",
    description:
      "Tell us about your event, audience and timing. We’ll follow up to discuss the right creative, planning and production support for your brief.",
    intakeLabel: "DIRECT INTAKE // EVENT PRODUCTION BRIEF",
    intakeImage: SITE_MEDIA.creativeChiefIntake,
    intakeImageAlt: "Art Work Event Producer On-Call Intake",
    email: "ahmed.artwork2026@gmail.com",
    phone: "+20 (2) 2794-0000",
    studioLocations: "CAIRO // REGIONAL EVENT DELIVERY",
    submitButtonText: "SEND YOUR EVENT BRIEF",
    formFields: [
      {
        name: "fullName",
        label: "YOUR NAME",
        placeholder: "e.g. Alex Mercer",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "WORK EMAIL",
        placeholder: "alex@company.com",
        type: "email",
        required: true,
      },
      {
        name: "serviceType",
        label: "SERVICE NEEDED",
        placeholder: "Select service needed...",
        type: "select",
        required: true,
      },
      {
        name: "brief",
        label: "TELL US ABOUT YOUR EVENT",
        placeholder: "Tell us about your event format, audience, objectives, and timing...",
        type: "textarea",
        required: true,
      },
    ],
  },

  whyUsPage: {
    sceneBadge: "HOW WE WORK",
    sceneTitle: "OUR APPROACH",
    statusBadge: "ONE TEAM // LIVE DELIVERY",
    heroHeadlineRow1: "ONE TEAM.",
    heroHeadlineRow2: "FROM FIRST IDEA TO FINAL MOMENT.",
    roiBadge: "CREATIVE DEVELOPMENT & PLANNING",
    contentCreationBadge: "ON-SITE EVENT PRODUCTION",
    doodleStickers: [
      "CREATIVE",
      "PLANNING",
      "PRODUCTION",
      "LIVE_DELIVERY",
    ],
    presentationTitle: "A THOUGHTFUL PROCESS. A WELL-RUN EVENT.",
    presentationSubtitle:
      "We listen to the brief, shape the right experience, coordinate the details and stay close to delivery - so clients know what is happening at every step.",
    presentationImage: SITE_MEDIA.stageBlueprint,
    presentationImageAlt: "Creative Architecture Blueprint",
    metrics: [
      { num: "12", label: "Service Areas" },
      { num: "1", label: "Connected Team" },
      { num: "360°", label: "Live Delivery" },
    ],
  },
};
