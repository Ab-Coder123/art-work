import type {
  ContactSectionContent,
  HeroManifestoContent,
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

function normalizeMetrics(value: unknown): HeroManifestoContent["metrics"] {
  if (!Array.isArray(value)) return DEFAULT_SITE_CONTENT.manifesto.metrics;
  const metrics = value
    .map(asRecord)
    .filter((item) =>
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
    stickyNote: readString(raw, "stickyNote", defaults.stickyNote),
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
        description: Array.isArray(raw.paragraphs) && typeof raw.paragraphs[0] === "string"
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
    bentoCards: Array.isArray(raw.bentoCards) &&
      raw.bentoCards.length >= 3 &&
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

function normalizeWhyUsPage(value: unknown): WhyUsPageContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.whyUsPage;
  if ("manifesto_lead" in raw || "paragraphs" in raw) {
    const paragraphs = Array.isArray(raw.paragraphs)
      ? raw.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string" && paragraph.trim().length > 0)
      : [];
    const metrics = Array.isArray(raw.metrics)
      ? raw.metrics.map(asRecord).filter((metric) => typeof metric.value === "string" && typeof metric.label === "string")
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
      ? raw.doodleStickers.filter((sticker): sticker is string => typeof sticker === "string").length >= 4
        ? raw.doodleStickers.filter((sticker): sticker is string => typeof sticker === "string")
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
  };
}

function normalizeContact(value: unknown): ContactSectionContent {
  const raw = asRecord(value);
  const defaults = DEFAULT_SITE_CONTENT.contact;
  const legacy = { ...defaults, ...raw } as ContactSectionContent;
  return {
    ...legacy,
    email: readString(raw, "email", defaults.email),
    phone: readString(raw, "phone", defaults.phone),
    intakeImage: normalizeSiteMediaPath(
      readString(raw, "intakeImage", defaults.intakeImage),
      defaults.intakeImage
    ),
    studioLocations: readString(raw, "studioLocations", readString(raw, "address", defaults.studioLocations)),
    formFields: Array.isArray(raw.formFields) && raw.formFields.length
      ? raw.formFields as ContactSectionContent["formFields"]
      : defaults.formFields,
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
    contact: normalizeContact(raw.contact),
    whyUsPage: normalizeWhyUsPage(raw.whyUsPage ?? raw.why_us_page),
  } as SiteContent;
}
