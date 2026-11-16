import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import type {
  CompanyRecord,
  ContactSectionContent,
  HeroManifestoContent,
  HomeShowcaseSectionContent,
  LayoutSectionContent,
  ProjectRecord,
  ServicesSectionContent,
  WhyUsTeaserContent,
  StageId,
} from "@art-work/types";

export type { StageId };
export {
  STAGE_ORDER,
  STAGE_HASH_MAP,
  resolveHashToStage,
  getNextStage,
  getPrevStage,
  calculateActiveStageFromTops,
} from "@art-work/types";

export const DEFAULT_HERO_CONTENT: HeroManifestoContent = DEFAULT_SITE_CONTENT.manifesto;
export const DEFAULT_WHY_US_CONTENT: WhyUsTeaserContent = DEFAULT_SITE_CONTENT.whyUsTeaser;
export const DEFAULT_SERVICES_CONTENT: ServicesSectionContent = DEFAULT_SITE_CONTENT.services;
export const DEFAULT_HOME_SHOWCASE_CONTENT: HomeShowcaseSectionContent = DEFAULT_SITE_CONTENT.homeShowcase;
export const DEFAULT_LAYOUT_CONTENT: LayoutSectionContent = DEFAULT_SITE_CONTENT.layout;

export type HeroContentData = HeroManifestoContent;
export type WhyUsContentData = WhyUsTeaserContent;

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
  partnersBadge?: string;
  partnersHeadlinePrefix?: string;
  partnersHeadlineHighlight?: string;
  starburstText?: {
    top: string;
    middle: string;
    bottom: string;
  };
}

export interface WhyUsTeaserProps {
  content?: WhyUsContentData;
}

export interface ServicesStageProps {
  content?: ServicesSectionContent;
}

export interface GalleryShowcaseStageProps {
  content?: HomeShowcaseSectionContent;
  initialProjects?: ProjectRecord[];
}

export interface ContactSectionProps {
  content: ContactSectionContent;
}

export interface StudioHeaderProps {
  activeStage?: StageId;
  scrollToStage?: (stage: StageId) => void;
  onInkBurst?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  layout?: LayoutSectionContent;
  whatsappPhone?: string;
}

export interface StudioFooterProps {
  scrollToStage?: (stage: StageId) => void;
  layout?: LayoutSectionContent;
}

export interface TheaterStageIndicatorProps {
  activeStage: StageId;
  scrollToStage: (stage: StageId) => void;
}
