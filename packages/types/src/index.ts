/**
 * Art Work Unified Domain & Content Types
 * Shared across @art-work/web and @art-work/admin
 */

export type ProjectCategory =
  | "all"
  | "stage"
  | "conferences"
  | "booths"
  | "branding"
  | "tech"
  | "led";

export type PublicationStatus = "published" | "draft";

export interface ProjectRecord {
  id: string; // Stable slug identifier (e.g. "neon-horizon")
  title: string;
  stamp: string; // e.g. "STAMP_PASS: ARENA_01"
  metaBadge: string; // e.g. "OCT 2025"
  cadId: string; // e.g. "CAD_ID: NH_TOUR_V4"
  image: string; // e.g. "/assets/images/gallery/project_01_neon_horizon.jpg"
  altText: string;
  category: "stage" | "conferences" | "booths" | "branding" | "tech" | "led";
  tags: string[];
  stats: string; // e.g. "⚡ 52,000 Fans / Night"
  statsSub: string; // e.g. "0.0s DMX Latency • 100% Custom Rig"
  description: string;
  client: string;
  specs: string[];
  status: PublicationStatus;
  order: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricItem {
  num: string;
  label: string;
}

export interface BentoCard {
  number: string;
  title: string;
  description: string;
  badge: string;
  iconName?: string;
}

export interface BlueprintContent {
  badge: string;
  title: string;
  description: string;
  image: string;
  altText: string;
}

export interface HeroManifestoContent {
  announcementBadge: string;
  editionBadge: string;
  stickyNote: string;
  headlinePart1: string;
  headlinePart2: string;
  starburstText: {
    top: string;
    middle: string;
    bottom: string;
  };
  introParagraph: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  metrics: MetricItem[];
  canvasHeader: string;
  canvasTag: string;
  heroImage: string;
  heroImageAlt: string;
}

export interface WhyUsTeaserContent {
  eyebrow: string;
  headline: string;
  exploreCtaText: string;
  bentoCards: BentoCard[];
  blueprint: BlueprintContent;
}

export interface ContactFormField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "textarea" | "select";
  required?: boolean;
}

export interface ContactSectionContent {
  stageTag: string;
  headline: string;
  description: string;
  intakeLabel: string;
  intakeImage: string;
  intakeImageAlt: string;
  email: string;
  phone: string;
  studioLocations: string;
  submitButtonText: string;
  formFields: ContactFormField[];
}

export interface WhyUsPageContent {
  sceneBadge: string;
  sceneTitle: string;
  statusBadge: string;
  heroHeadlineRow1: string;
  heroHeadlineRow2: string;
  roiBadge: string;
  contentCreationBadge: string;
  doodleStickers: string[];
  presentationTitle: string;
  presentationSubtitle: string;
  presentationImage: string;
  presentationImageAlt: string;
  metrics: MetricItem[];
}

export interface SiteContent {
  version: string;
  updatedAt: string;
  manifesto: HeroManifestoContent;
  whyUsTeaser: WhyUsTeaserContent;
  contact: ContactSectionContent;
  whyUsPage: WhyUsPageContent;
}
