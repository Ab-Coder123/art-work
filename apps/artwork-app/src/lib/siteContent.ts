import rawSiteContent from "@/data/siteContent.json";
import { normalizeSiteContent } from "@art-work/database/content/contract";
import { DEFAULT_SITE_CONTENT_AR } from "@art-work/database/content/default-content-ar";
import type {
  BilingualSiteContent,
  Locale,
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
export const CANONICAL_SITE_CONTENT: SiteContent = normalizeSiteContent(rawSiteContent, "en");
export const CANONICAL_SITE_CONTENT_AR: SiteContent = normalizeSiteContent(
  (rawSiteContent as { ar?: unknown }).ar ?? DEFAULT_SITE_CONTENT_AR,
  "ar"
);

export const CANONICAL_BILINGUAL_CONTENT: BilingualSiteContent = {
  en: CANONICAL_SITE_CONTENT,
  ar: CANONICAL_SITE_CONTENT_AR,
};

export function getCanonicalSiteContent(locale: Locale = "en"): SiteContent {
  return locale === "ar" ? CANONICAL_SITE_CONTENT_AR : CANONICAL_SITE_CONTENT;
}

export const getHeroContent = (): HeroManifestoContent => CANONICAL_SITE_CONTENT.manifesto;
export const getWhyUsContent = (): WhyUsTeaserContent => CANONICAL_SITE_CONTENT.whyUsTeaser;
export const getServicesContent = (): ServicesSectionContent => CANONICAL_SITE_CONTENT.services;
export const getHomeShowcaseContent = (): HomeShowcaseSectionContent => CANONICAL_SITE_CONTENT.homeShowcase;
export const getContactContent = (): ContactSectionContent => CANONICAL_SITE_CONTENT.contact;
export const getWhyUsPageContent = (): WhyUsPageContent => CANONICAL_SITE_CONTENT.whyUsPage;
export const getGalleryPageContent = (): GalleryPageContent => CANONICAL_SITE_CONTENT.galleryPage;
export const getLayoutContent = (): LayoutSectionContent => CANONICAL_SITE_CONTENT.layout;

export default CANONICAL_SITE_CONTENT;
