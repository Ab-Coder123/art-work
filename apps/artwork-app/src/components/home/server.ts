import {
  createBrowserClient,
  createSupabaseContentRepository,
  fetchSiteContent,
  DEFAULT_SITE_CONTENT,
  normalizeSiteContent,
  listCompanies,
} from "@art-work/database";
import {
  DEFAULT_COMPANIES,
  type CompanyRecord,
  type ContactSectionContent,
} from "@art-work/types";
import {
  DEFAULT_HERO_CONTENT,
  DEFAULT_WHY_US_CONTENT,
  type HeroContentData,
  type WhyUsContentData,
} from "./types";

export interface InitialHomeData {
  heroContent: HeroContentData;
  whyUsContent: WhyUsContentData;
  contactContent: ContactSectionContent;
  companies: CompanyRecord[];
}

/**
 * Server-side data pre-fetcher for RSC Shell (Phase 2).
 * Fetches content and partner network on the server with graceful fallback guarantees.
 */
export async function getInitialHomeData(): Promise<InitialHomeData> {
  let contentData = normalizeSiteContent(DEFAULT_SITE_CONTENT);
  let companiesData: CompanyRecord[] = DEFAULT_COMPANIES;

  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseContentRepository(supabase);

    const [contentRes, companiesRes] = await Promise.allSettled([
      fetchSiteContent(repo),
      listCompanies(supabase, { category: "all", q: "", activeOnly: true }),
    ]);

    if (contentRes.status === "fulfilled" && contentRes.value.ok) {
      contentData = normalizeSiteContent(contentRes.value.data);
    }

    if (
      companiesRes.status === "fulfilled" &&
      companiesRes.value.ok &&
      Array.isArray(companiesRes.value.data) &&
      companiesRes.value.data.length > 0
    ) {
      companiesData = companiesRes.value.data;
    }
  } catch {
    // Graceful offline fallback to defaults
  }

  const manifesto = contentData.manifesto;
  const teaser = contentData.whyUsTeaser;
  const contact = contentData.contact;

  const metrics = Array.isArray(manifesto?.metrics)
    ? manifesto.metrics
        .filter((item): item is { num: string; label: string } =>
          Boolean(item && typeof item === "object" && "num" in item && "label" in item)
        )
        .map((item) => ({ num: String(item.num), label: String(item.label) }))
    : DEFAULT_HERO_CONTENT.metrics;

  const heroRecord = manifesto as unknown as Record<string, unknown> | undefined;

  const heroContent: HeroContentData = {
    announcementBadge: String(
      manifesto?.announcementBadge ||
      heroRecord?.banner_badge ||
      DEFAULT_HERO_CONTENT.announcementBadge
    ),
    editionBadge: String(manifesto?.editionBadge || DEFAULT_HERO_CONTENT.editionBadge),
    headlinePart1: String(
      manifesto?.headlinePart1 ||
      heroRecord?.headline_highlight ||
      DEFAULT_HERO_CONTENT.headlinePart1
    ),
    headlinePart2: String(
      manifesto?.headlinePart2 ||
      heroRecord?.headline_suffix ||
      DEFAULT_HERO_CONTENT.headlinePart2
    ),
    introParagraph: String(
      manifesto?.introParagraph ||
      heroRecord?.subheadline ||
      DEFAULT_HERO_CONTENT.introParagraph
    ),
    metrics: metrics.length ? metrics.slice(0, 3) : DEFAULT_HERO_CONTENT.metrics,
  };

  let whyUsContent: WhyUsContentData = DEFAULT_WHY_US_CONTENT;
  if (teaser?.bentoCards && teaser.bentoCards.length >= 3 && teaser.blueprint) {
    const isLegacy = teaser.bentoCards.some((c: { title?: string }) =>
      c.title?.includes("Arena & Stage") ||
      c.title?.includes("Event Planning & Project") ||
      c.title?.includes("Dynamic Motion")
    );
    whyUsContent = {
      ...DEFAULT_WHY_US_CONTENT,
      ...teaser,
      bentoCards: isLegacy ? DEFAULT_WHY_US_CONTENT.bentoCards : teaser.bentoCards.slice(0, 3),
      blueprint: { ...DEFAULT_WHY_US_CONTENT.blueprint, ...teaser.blueprint },
    };
  }

  const contactContent: ContactSectionContent = {
    ...DEFAULT_SITE_CONTENT.contact,
    ...(contact || {}),
  };

  return {
    heroContent,
    whyUsContent,
    contactContent,
    companies: companiesData,
  };
}
