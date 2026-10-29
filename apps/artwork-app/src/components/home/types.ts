import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import type { CompanyRecord, ContactSectionContent } from "@art-work/types";

export type StageId = "stage-01" | "stage-02" | "stage-03" | "stage-gallery" | "stage-04";

export const STAGE_ORDER: StageId[] = [
  "stage-01",
  "stage-02",
  "stage-03",
  "stage-gallery",
  "stage-04",
];

export const resolveHashToStage = (hash: string): StageId | null => {
  if (!hash) return null;
  const clean = hash.replace(/^#\/?/, "").toLowerCase().trim();
  if (clean === "stage-04" || clean === "brief-inquiry" || clean === "contact" || clean === "brief") {
    return "stage-04";
  }
  if (clean === "stage-gallery" || clean === "gallery" || clean === "work") {
    return "stage-gallery";
  }
  if (clean === "stage-03" || clean === "services" || clean === "capabilities") {
    return "stage-03";
  }
  if (clean === "stage-02" || clean === "why-us" || clean === "about") {
    return "stage-02";
  }
  if (clean === "stage-01" || clean === "hero") {
    return "stage-01";
  }
  return null;
};

export const DEFAULT_HERO_CONTENT = {
  announcementBadge: DEFAULT_SITE_CONTENT.manifesto.announcementBadge,
  editionBadge: DEFAULT_SITE_CONTENT.manifesto.editionBadge,
  headlinePart1: DEFAULT_SITE_CONTENT.manifesto.headlinePart1,
  headlinePart2: DEFAULT_SITE_CONTENT.manifesto.headlinePart2,
  introParagraph: DEFAULT_SITE_CONTENT.manifesto.introParagraph,
  metrics: DEFAULT_SITE_CONTENT.manifesto.metrics,
};

export const DEFAULT_WHY_US_CONTENT = DEFAULT_SITE_CONTENT.whyUsTeaser;

export type HeroContentData = typeof DEFAULT_HERO_CONTENT;
export type WhyUsContentData = typeof DEFAULT_WHY_US_CONTENT;

export interface ManifestoHeroProps {
  onViewCapabilities: () => void;
  onExploreShowreel?: () => void;
  onViewGallery?: () => void;
  content: HeroContentData;
  companies?: CompanyRecord[];
}

export interface PartnerLogoCardProps {
  company: CompanyRecord;
  isSelected: boolean;
  onToggle: () => void;
  tiltDirection?: "left" | "right";
}

export interface PartnersMarqueeProps {
  companies?: CompanyRecord[];
}

export interface WhyUsTeaserProps {
  content?: WhyUsContentData;
}

export interface ContactSectionProps {
  content: ContactSectionContent;
}

export interface StudioHeaderProps {
  activeStage: StageId;
  scrollToStage: (stage: StageId) => void;
  onInkBurst: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface StudioFooterProps {
  scrollToStage: (stage: StageId) => void;
}

export interface TheaterStageIndicatorProps {
  activeStage: StageId;
  scrollToStage: (stage: StageId) => void;
}
