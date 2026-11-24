import {
  CANONICAL_BILINGUAL_CONTENT,
  CANONICAL_SITE_CONTENT,
  CANONICAL_SITE_CONTENT_AR,
} from "@/lib/siteContent";
import { unstable_cache } from "next/cache";
import {
  createBrowserClient,
  createSupabaseContentRepository,
  createSupabaseProjectsRepository,
  fetchBilingualSiteContent,
  listPublicProjects,
  normalizeSiteContent,
  listCompanies,
} from "@art-work/database";
import {
  DEFAULT_COMPANIES,
  type BilingualSiteContent,
  type CompanyRecord,
  type ContactSectionContent,
  type HomeShowcaseSectionContent,
  type LayoutSectionContent,
  type Locale,
  type ProjectRecord,
  type ServicesSectionContent,
} from "@art-work/types";
import { SEED_PROJECTS } from "@/data/seedContent";
import type { HeroContentData, WhyUsContentData } from "./types";

export interface InitialHomeData {
  locale?: Locale;
  bilingualContent?: BilingualSiteContent;
  heroContent: HeroContentData;
  whyUsContent: WhyUsContentData;
  servicesContent: ServicesSectionContent;
  homeShowcaseContent: HomeShowcaseSectionContent;
  contactContent: ContactSectionContent;
  layoutContent: LayoutSectionContent;
  companies: CompanyRecord[];
  projects: ProjectRecord[];
}

/**
 * Server-side data pre-fetcher for RSC Shell.
 * Fetches full 8-section bilingual CMS content (EN + AR), partner network, and public projects
 * with Next.js Data Cache tag binding and deterministic fallback guarantees.
 */
async function fetchInitialHomeDataRaw(locale: Locale = "en"): Promise<InitialHomeData> {
  let bilingualContent: BilingualSiteContent = CANONICAL_BILINGUAL_CONTENT;
  let companiesData: CompanyRecord[] = DEFAULT_COMPANIES;
  let projectsData: ProjectRecord[] = SEED_PROJECTS;

  try {
    const supabase = createBrowserClient();
    const contentRepo = createSupabaseContentRepository(supabase);
    const projectsRepo = createSupabaseProjectsRepository(supabase);

    const [contentRes, companiesRes, projectsRes] = await Promise.allSettled([
      fetchBilingualSiteContent(contentRepo),
      listCompanies(supabase, { category: "all", q: "", activeOnly: true }),
      listPublicProjects({ limit: 500 }, projectsRepo),
    ]);

    if (contentRes.status === "fulfilled" && contentRes.value.ok) {
      bilingualContent = {
        en: normalizeSiteContent(
          {
            ...CANONICAL_SITE_CONTENT,
            ...contentRes.value.data.en,
          },
          "en"
        ),
        ar: normalizeSiteContent(
          {
            ...CANONICAL_SITE_CONTENT_AR,
            ...contentRes.value.data.ar,
          },
          "ar"
        ),
      };
    }

    if (
      companiesRes.status === "fulfilled" &&
      companiesRes.value.ok &&
      Array.isArray(companiesRes.value.data) &&
      companiesRes.value.data.length > 0
    ) {
      companiesData = companiesRes.value.data;
    }

    if (
      projectsRes.status === "fulfilled" &&
      projectsRes.value.ok &&
      Array.isArray(projectsRes.value.data.items) &&
      projectsRes.value.data.items.length > 0
    ) {
      projectsData = projectsRes.value.data.items;
    }
  } catch {
    // Graceful offline fallback to defaults
  }

  const contentData = locale === "ar" ? bilingualContent.ar : bilingualContent.en;

  return {
    locale,
    bilingualContent,
    heroContent: contentData.manifesto,
    whyUsContent: contentData.whyUsTeaser,
    servicesContent: contentData.services,
    homeShowcaseContent: contentData.homeShowcase,
    contactContent: contentData.contact,
    layoutContent: contentData.layout,
    companies: companiesData,
    projects: projectsData,
  };
}

export const getInitialHomeData = unstable_cache(
  fetchInitialHomeDataRaw,
  ["home-initial-data-v3"],
  {
    tags: ["site-content", "companies", "projects"],
    revalidate: 60,
  }
);
