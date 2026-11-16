import rawSiteContent from "@/data/siteContent.json";
import { normalizeSiteContent } from "@art-work/database/content/contract";
import type {
  SiteContent,
  HeroManifestoContent,
  WhyUsTeaserContent,
  ServicesSectionContent,
  HomeShowcaseSectionContent,
  ContactSectionContent,
  WhyUsPageContent,
  GalleryPageContent,
  LayoutSectionContent,
} from "@art-work/types";

/**
 * CANONICAL_SITE_CONTENT
 * Single Source of Truth for all static and default content across Art Work.
 * Directly parsed and normalized from `apps/artwork-app/src/data/siteContent.json`.
 */
export const CANONICAL_SITE_CONTENT: SiteContent = normalizeSiteContent(rawSiteContent);

export const getHeroContent = (): HeroManifestoContent => CANONICAL_SITE_CONTENT.manifesto;
export const getWhyUsContent = (): WhyUsTeaserContent => CANONICAL_SITE_CONTENT.whyUsTeaser;
export const getServicesContent = (): ServicesSectionContent => CANONICAL_SITE_CONTENT.services;
export const getHomeShowcaseContent = (): HomeShowcaseSectionContent => CANONICAL_SITE_CONTENT.homeShowcase;
export const getContactContent = (): ContactSectionContent => CANONICAL_SITE_CONTENT.contact;
export const getWhyUsPageContent = (): WhyUsPageContent => CANONICAL_SITE_CONTENT.whyUsPage;
export const getGalleryPageContent = (): GalleryPageContent => CANONICAL_SITE_CONTENT.galleryPage;
export const getLayoutContent = (): LayoutSectionContent => CANONICAL_SITE_CONTENT.layout;

export default CANONICAL_SITE_CONTENT;
