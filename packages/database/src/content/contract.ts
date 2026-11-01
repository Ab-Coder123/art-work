import type {
  ContactSectionContent,
  GalleryPageContent,
  HeroManifestoContent,
  HomeShowcaseSectionContent,
  LayoutSectionContent,
  ServicesSectionContent,
  SiteContent,
  WhyUsPageContent,
  WhyUsTeaserContent,
} from "@art-work/types";
import { DEFAULT_SITE_CONTENT, normalizeSiteMediaPath } from "./default-content";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function readString(record: UnknownRecord, key: string, fallback: string): string {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readStringArray(record: UnknownRecord, key: string, fallback: string[]): string[] {
  const value = record[key];
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
  return cleaned.length > 0 ? cleaned : fallback;
}

function normalizeMetrics(value: unknown): HeroManifestoContent["metrics"] {
  if (!Array.isArray(value)) return DEFAULT_SITE_CONTENT.manifesto.metrics;
  const metrics = value
    .map(asRecord)
    .filter(
      (item) =>
        typeof item.num === "string" &&
        item.num.trim().length > 0 &&
        typeof item.label === "string" &&
        item.label.trim().length > 0
    )
    .map((item) => ({ num: item.num as string, label: item.label as string }));
  return metrics.length ? metrics : DEFAULT_SITE_CONTENT.manifesto.metrics;
}

/**
 * Converts both persisted Hero payload generations into the dashboard/public
 * SiteContent contract. The old `manifesto` shape remains the API DTO while
 * legacy rows are migrated incrementally.
 */
export function normalizeHeroManifestoContent(value: unknown): HeroManifestoContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.manifesto;
  const modernShape =
    "headline_highlight" in raw ||
    "headline_suffix" in raw ||
    "banner_badge" in raw;

  if (modernShape) {
    return {
      ...defaults,
      announcementBadge: readString(raw, "banner_badge", defaults.announcementBadge),
      headlinePart1: readString(raw, "headline_highlight", defaults.headlinePart1),
      headlinePart2: readString(raw, "headline_suffix", defaults.headlinePart2),
      introParagraph: readString(raw, "subheadline", defaults.introParagraph),
      primaryCtaText: readString(raw, "cta_primary_text", defaults.primaryCtaText),
      secondaryCtaText: readString(raw, "cta_secondary_text", defaults.secondaryCtaText),
    };
  }

  const legacy = { ...defaults, ...raw } as HeroManifestoContent;
  const starburst = asRecord(raw.starburstText);
  return {
    ...legacy,
    announcementBadge: readString(raw, "announcementBadge", defaults.announcementBadge),
    editionBadge: readString(raw, "editionBadge", defaults.editionBadge),
    headlinePart1: readString(raw, "headlinePart1", defaults.headlinePart1),
    headlinePart2: readString(raw, "headlinePart2", defaults.headlinePart2),
    introParagraph: readString(raw, "introParagraph", defaults.introParagraph),
    primaryCtaText: readString(raw, "primaryCtaText", defaults.primaryCtaText),
    secondaryCtaText: readString(raw, "secondaryCtaText", defaults.secondaryCtaText),
    proofTagline: readString(raw, "proofTagline", defaults.proofTagline || ""),
    performanceBadge: readString(raw, "performanceBadge", defaults.performanceBadge || ""),
    partnersBadge: readString(raw, "partnersBadge", defaults.partnersBadge || ""),
    partnersHeadlinePrefix: readString(raw, "partnersHeadlinePrefix", defaults.partnersHeadlinePrefix || ""),
    partnersHeadlineHighlight: readString(raw, "partnersHeadlineHighlight", defaults.partnersHeadlineHighlight || ""),
    stickyNote: readString(raw, "stickyNote", defaults.stickyNote),
    heroImage: normalizeSiteMediaPath(
      readString(raw, "heroImage", defaults.heroImage),
      defaults.heroImage
    ),
    heroImageAlt: readString(raw, "heroImageAlt", defaults.heroImageAlt),
    starburstText: {
      top: readString(starburst, "top", defaults.starburstText.top),
      middle: readString(starburst, "middle", defaults.starburstText.middle),
      bottom: readString(starburst, "bottom", defaults.starburstText.bottom),
    },
    metrics: normalizeMetrics(raw.metrics),
  };
}

function normalizeWhyUsTeaser(value: unknown): WhyUsTeaserContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.whyUsTeaser;
  const modernShape = "manifesto_lead" in raw || "paragraphs" in raw;
  if (modernShape) {
    return {
      ...defaults,
      headline: readString(raw, "heading", defaults.headline),
      blueprint: {
        ...defaults.blueprint,
        title: readString(raw, "manifesto_lead", defaults.blueprint.title),
        description:
          Array.isArray(raw.paragraphs) && typeof raw.paragraphs[0] === "string"
            ? raw.paragraphs[0]
            : defaults.blueprint.description,
      },
    };
  }

  const legacy = { ...defaults, ...raw } as WhyUsTeaserContent;
  const blueprint = asRecord(raw.blueprint);
  return {
    ...legacy,
    eyebrow: readString(raw, "eyebrow", defaults.eyebrow),
    headline: readString(raw, "headline", defaults.headline),
    exploreCtaText: readString(raw, "exploreCtaText", defaults.exploreCtaText),
    bentoCards:
      Array.isArray(raw.bentoCards) &&
      raw.bentoCards.length >= 1 &&
      !raw.bentoCards.some(
        (c: unknown) =>
          typeof c === "object" &&
          c !== null &&
          "title" in c &&
          typeof (c as { title: unknown }).title === "string" &&
          ((c as { title: string }).title.includes("Arena & Stage") ||
            (c as { title: string }).title.includes("Event Planning & Project") ||
            (c as { title: string }).title.includes("Dynamic Motion"))
      )
        ? (raw.bentoCards as WhyUsTeaserContent["bentoCards"])
        : defaults.bentoCards,
    blueprint: {
      ...defaults.blueprint,
      ...blueprint,
      badge: readString(blueprint, "badge", defaults.blueprint.badge),
      title: readString(blueprint, "title", defaults.blueprint.title),
      description: readString(blueprint, "description", defaults.blueprint.description),
      image: normalizeSiteMediaPath(
        readString(blueprint, "image", defaults.blueprint.image),
        defaults.blueprint.image
      ),
      altText: readString(blueprint, "altText", defaults.blueprint.altText),
    },
  };
}

export function normalizeServicesContent(value: unknown): ServicesSectionContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.services;
  const disciplines =
    Array.isArray(raw.disciplines) && raw.disciplines.length > 0
      ? raw.disciplines
          .map(asRecord)
          .filter((d) => typeof d.title === "string" && d.title.trim().length > 0)
          .map((d, idx) => {
            const fb = defaults.disciplines[idx] || defaults.disciplines[0];
            const cat = String(d.category || fb.category);
            const validCat = (["creative", "events", "production", "delivery"] as const).includes(
              cat as ServicesSectionContent["disciplines"][number]["category"]
            )
              ? (cat as ServicesSectionContent["disciplines"][number]["category"])
              : fb.category;
            return {
              id: readString(d, "id", `service-${idx + 1}`),
              number: readString(d, "number", String(idx + 1).padStart(2, "0")),
              tag: readString(d, "tag", fb.tag),
              title: readString(d, "title", fb.title),
              icon: readString(d, "icon", fb.icon),
              category: validCat,
              specs: readStringArray(d, "specs", fb.specs),
              description: readString(d, "description", fb.description),
              deliverables: readStringArray(d, "deliverables", fb.deliverables),
              metrics: readString(d, "metrics", fb.metrics),
            };
          })
      : defaults.disciplines;

  return {
    ...defaults,
    eyebrow: readString(raw, "eyebrow", defaults.eyebrow),
    headlinePrefix: readString(raw, "headlinePrefix", defaults.headlinePrefix),
    headlineHighlight: readString(raw, "headlineHighlight", defaults.headlineHighlight),
    description: readString(raw, "description", defaults.description),
    filterAllLabel: readString(raw, "filterAllLabel", defaults.filterAllLabel),
    filterCreativeLabel: readString(raw, "filterCreativeLabel", defaults.filterCreativeLabel),
    filterEventsLabel: readString(raw, "filterEventsLabel", defaults.filterEventsLabel),
    filterProductionLabel: readString(raw, "filterProductionLabel", defaults.filterProductionLabel),
    filterDeliveryLabel: readString(raw, "filterDeliveryLabel", defaults.filterDeliveryLabel),
    cardCtaText: readString(raw, "cardCtaText", defaults.cardCtaText),
    modalSelectCtaText: readString(raw, "modalSelectCtaText", defaults.modalSelectCtaText),
    disciplines: disciplines.length > 0 ? disciplines : defaults.disciplines,
    bannerEyebrow: readString(raw, "bannerEyebrow", defaults.bannerEyebrow),
    bannerHeadlinePrefix: readString(raw, "bannerHeadlinePrefix", defaults.bannerHeadlinePrefix),
    bannerHeadlineHighlight: readString(raw, "bannerHeadlineHighlight", defaults.bannerHeadlineHighlight),
    bannerDescription: readString(raw, "bannerDescription", defaults.bannerDescription),
    bannerCtaText: readString(raw, "bannerCtaText", defaults.bannerCtaText),
  };
}

export function normalizeHomeShowcaseContent(value: unknown): HomeShowcaseSectionContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.homeShowcase;
  return {
    ...defaults,
    badge: readString(raw, "badge", defaults.badge),
    headlinePrefix: readString(raw, "headlinePrefix", defaults.headlinePrefix),
    headlineHighlight: readString(raw, "headlineHighlight", defaults.headlineHighlight),
    description: readString(raw, "description", defaults.description),
    viewAllCtaText: readString(raw, "viewAllCtaText", defaults.viewAllCtaText),
    featuredEventBadge: readString(raw, "featuredEventBadge", defaults.featuredEventBadge),
    youtubeButtonText: readString(raw, "youtubeButtonText", defaults.youtubeButtonText),
    exploreGalleryCtaText: readString(raw, "exploreGalleryCtaText", defaults.exploreGalleryCtaText),
    cardExploreText: readString(raw, "cardExploreText", defaults.cardExploreText),
    mobileArchiveCtaText: readString(raw, "mobileArchiveCtaText", defaults.mobileArchiveCtaText),
  };
}

function normalizeWhyUsPage(value: unknown): WhyUsPageContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.whyUsPage;
  if ("manifesto_lead" in raw || "paragraphs" in raw) {
    const paragraphs = Array.isArray(raw.paragraphs)
      ? raw.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string" && paragraph.trim().length > 0)
      : [];
    const metrics = Array.isArray(raw.metrics)
      ? raw.metrics
          .map(asRecord)
          .filter((metric) => typeof metric.value === "string" && typeof metric.label === "string")
          .map((metric) => ({ num: metric.value as string, label: metric.label as string }))
      : [];
    return {
      ...defaults,
      sceneTitle: readString(raw, "heading", defaults.sceneTitle),
      presentationTitle: readString(raw, "manifesto_lead", defaults.presentationTitle),
      presentationSubtitle: paragraphs[0] || defaults.presentationSubtitle,
      metrics: metrics.length ? metrics : defaults.metrics,
    };
  }

  const capabilityCards =
    Array.isArray(raw.capabilityCards) && raw.capabilityCards.length > 0
      ? raw.capabilityCards
          .map(asRecord)
          .filter((c) => typeof c.title === "string" && c.title.trim().length > 0)
          .map((c, idx) => {
            const fb = defaults.capabilityCards?.[idx] || defaults.capabilityCards?.[0] || {
              title: "CAPABILITY",
              description: "",
              bullets: ["Deliverable"],
            };
            return {
              title: readString(c, "title", fb.title),
              description: readString(c, "description", fb.description),
              bullets: readStringArray(c, "bullets", fb.bullets),
              icon: readString(c, "icon", fb.icon || "layers"),
            };
          })
      : defaults.capabilityCards;

  return {
    ...defaults,
    ...raw,
    sceneBadge: readString(raw, "sceneBadge", defaults.sceneBadge),
    sceneTitle: readString(raw, "sceneTitle", defaults.sceneTitle),
    statusBadge: readString(raw, "statusBadge", defaults.statusBadge),
    heroHeadlineRow1: readString(raw, "heroHeadlineRow1", defaults.heroHeadlineRow1),
    heroHeadlineRow2: readString(raw, "heroHeadlineRow2", defaults.heroHeadlineRow2),
    roiBadge: readString(raw, "roiBadge", defaults.roiBadge),
    contentCreationBadge: readString(raw, "contentCreationBadge", defaults.contentCreationBadge),
    doodleStickers: Array.isArray(raw.doodleStickers)
      ? raw.doodleStickers.filter((sticker): sticker is string => typeof sticker === "string" && sticker.trim().length > 0).length >= 1
        ? raw.doodleStickers.filter((sticker): sticker is string => typeof sticker === "string" && sticker.trim().length > 0)
        : defaults.doodleStickers
      : defaults.doodleStickers,
    presentationTitle: readString(raw, "presentationTitle", defaults.presentationTitle),
    presentationSubtitle: readString(raw, "presentationSubtitle", defaults.presentationSubtitle),
    presentationImage: normalizeSiteMediaPath(
      readString(raw, "presentationImage", defaults.presentationImage),
      defaults.presentationImage
    ),
    presentationImageAlt: readString(raw, "presentationImageAlt", defaults.presentationImageAlt),
    metrics: normalizeMetrics(raw.metrics),
    primaryCtaText: readString(raw, "primaryCtaText", defaults.primaryCtaText || ""),
    secondaryCtaText: readString(raw, "secondaryCtaText", defaults.secondaryCtaText || ""),
    easelTag: readString(raw, "easelTag", defaults.easelTag || ""),
    directorNote: readString(raw, "directorNote", defaults.directorNote || ""),
    tailoredStamp: readString(raw, "tailoredStamp", defaults.tailoredStamp || ""),
    zeroTemplatesBadge: readString(raw, "zeroTemplatesBadge", defaults.zeroTemplatesBadge || ""),
    matrixBadge: readString(raw, "matrixBadge", defaults.matrixBadge || ""),
    matrixHeadlinePrefix: readString(raw, "matrixHeadlinePrefix", defaults.matrixHeadlinePrefix || ""),
    matrixHeadlineHighlight: readString(raw, "matrixHeadlineHighlight", defaults.matrixHeadlineHighlight || ""),
    matrixDescription: readString(raw, "matrixDescription", defaults.matrixDescription || ""),
    capabilityCards: capabilityCards && capabilityCards.length > 0 ? capabilityCards : defaults.capabilityCards,
    calloutTag: readString(raw, "calloutTag", defaults.calloutTag || ""),
    calloutHeadlinePrefix: readString(raw, "calloutHeadlinePrefix", defaults.calloutHeadlinePrefix || ""),
    calloutHeadlineHighlight: readString(raw, "calloutHeadlineHighlight", defaults.calloutHeadlineHighlight || ""),
    calloutDescription: readString(raw, "calloutDescription", defaults.calloutDescription || ""),
    calloutPrimaryCta: readString(raw, "calloutPrimaryCta", defaults.calloutPrimaryCta || ""),
    calloutSecondaryCta: readString(raw, "calloutSecondaryCta", defaults.calloutSecondaryCta || ""),
  };
}

function normalizeContact(value: unknown): ContactSectionContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.contact;
  const legacy = { ...defaults, ...raw } as ContactSectionContent;
  return {
    ...legacy,
    stageTag: readString(raw, "stageTag", defaults.stageTag),
    headline: readString(raw, "headline", defaults.headline),
    description: readString(raw, "description", defaults.description),
    intakeLabel: readString(raw, "intakeLabel", defaults.intakeLabel),
    email: readString(raw, "email", defaults.email),
    phone: readString(raw, "phone", defaults.phone),
    intakeImage: normalizeSiteMediaPath(
      readString(raw, "intakeImage", defaults.intakeImage),
      defaults.intakeImage
    ),
    intakeImageAlt: readString(raw, "intakeImageAlt", defaults.intakeImageAlt),
    studioLocations: readString(
      raw,
      "studioLocations",
      readString(raw, "address", defaults.studioLocations)
    ),
    submitButtonText: readString(raw, "submitButtonText", defaults.submitButtonText),
    serviceOptions: readStringArray(raw, "serviceOptions", defaults.serviceOptions || []),
    formFields:
      Array.isArray(raw.formFields) && raw.formFields.length
        ? (raw.formFields as ContactSectionContent["formFields"])
        : defaults.formFields,
  };
}

export function normalizeGalleryPageContent(value: unknown): GalleryPageContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.galleryPage;
  const workflowSteps =
    Array.isArray(raw.workflowSteps) && raw.workflowSteps.length > 0
      ? raw.workflowSteps
          .map(asRecord)
          .filter((s) => typeof s.title === "string" && s.title.trim().length > 0)
          .map((s, idx) => {
            const fb = defaults.workflowSteps[idx] || defaults.workflowSteps[0];
            return {
              stepNumber: readString(s, "stepNumber", String(idx + 1)),
              title: readString(s, "title", fb.title),
              description: readString(s, "description", fb.description),
            };
          })
      : defaults.workflowSteps;

  return {
    ...defaults,
    heroBadge: readString(raw, "heroBadge", defaults.heroBadge),
    headlinePart1: readString(raw, "headlinePart1", defaults.headlinePart1),
    headlinePart2: readString(raw, "headlinePart2", defaults.headlinePart2),
    heroDescription: readString(raw, "heroDescription", defaults.heroDescription),
    heroTags: readStringArray(raw, "heroTags", defaults.heroTags),
    filterAllLabel: readString(raw, "filterAllLabel", defaults.filterAllLabel),
    filterConferencesLabel: readString(raw, "filterConferencesLabel", defaults.filterConferencesLabel),
    filterBoothsLabel: readString(raw, "filterBoothsLabel", defaults.filterBoothsLabel),
    filterBrandingLabel: readString(raw, "filterBrandingLabel", defaults.filterBrandingLabel),
    gridEyebrow: readString(raw, "gridEyebrow", defaults.gridEyebrow),
    gridHeadline: readString(raw, "gridHeadline", defaults.gridHeadline),
    spotlightHeadline: readString(raw, "spotlightHeadline", defaults.spotlightHeadline),
    spotlightTag: readString(raw, "spotlightTag", defaults.spotlightTag),
    spotlightImage: normalizeSiteMediaPath(
      readString(raw, "spotlightImage", defaults.spotlightImage),
      defaults.spotlightImage
    ),
    spotlightImageAlt: readString(raw, "spotlightImageAlt", defaults.spotlightImageAlt),
    approachBadge: readString(raw, "approachBadge", defaults.approachBadge),
    quoteText: readString(raw, "quoteText", defaults.quoteText),
    quoteAuthor: readString(raw, "quoteAuthor", defaults.quoteAuthor),
    workflowSteps: workflowSteps.length > 0 ? workflowSteps : defaults.workflowSteps,
    spotlightCtaText: readString(raw, "spotlightCtaText", defaults.spotlightCtaText),
    ctaTag: readString(raw, "ctaTag", defaults.ctaTag),
    ctaHeadlinePrefix: readString(raw, "ctaHeadlinePrefix", defaults.ctaHeadlinePrefix),
    ctaHeadlineHighlight: readString(raw, "ctaHeadlineHighlight", defaults.ctaHeadlineHighlight),
    ctaDescription: readString(raw, "ctaDescription", defaults.ctaDescription),
    ctaPrimaryButtonText: readString(raw, "ctaPrimaryButtonText", defaults.ctaPrimaryButtonText),
    ctaEmailPrefix: readString(raw, "ctaEmailPrefix", defaults.ctaEmailPrefix),
  };
}

export function normalizeLayoutContent(value: unknown): LayoutSectionContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.layout;
  return {
    ...defaults,
    navHomeLabel: readString(raw, "navHomeLabel", defaults.navHomeLabel),
    navWhyUsLabel: readString(raw, "navWhyUsLabel", defaults.navWhyUsLabel),
    navServicesLabel: readString(raw, "navServicesLabel", defaults.navServicesLabel),
    navGalleryLabel: readString(raw, "navGalleryLabel", defaults.navGalleryLabel),
    navContactLabel: readString(raw, "navContactLabel", defaults.navContactLabel),
    fullVaultCtaText: readString(raw, "fullVaultCtaText", defaults.fullVaultCtaText),
    briefCtaText: readString(raw, "briefCtaText", defaults.briefCtaText),
    footerCopyright: readString(raw, "footerCopyright", defaults.footerCopyright),
    footerBrandTitle: readString(raw, "footerBrandTitle", defaults.footerBrandTitle),
    footerBrandSubtitle: readString(raw, "footerBrandSubtitle", defaults.footerBrandSubtitle),
  };
}

/** Return the stable API tree regardless of whether the database row is old or new. */
export function normalizeSiteContent(value: unknown): SiteContent {
  const raw = asRecord(value);
  const manifesto = raw.manifesto ?? raw.hero;
  return {
    ...DEFAULT_SITE_CONTENT,
    ...raw,
    manifesto: normalizeHeroManifestoContent(manifesto),
    whyUsTeaser: normalizeWhyUsTeaser(raw.whyUsTeaser ?? raw.why_us),
    services: normalizeServicesContent(raw.services ?? raw.capabilities),
    homeShowcase: normalizeHomeShowcaseContent(raw.homeShowcase ?? raw.home_showcase),
    contact: normalizeContact(raw.contact),
    whyUsPage: normalizeWhyUsPage(raw.whyUsPage ?? raw.why_us_page),
    galleryPage: normalizeGalleryPageContent(raw.galleryPage ?? raw.gallery_page),
    layout: normalizeLayoutContent(raw.layout ?? raw.navigation),
  } as SiteContent;
}
