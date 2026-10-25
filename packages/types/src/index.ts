/**
 * Art Work Unified Domain & Content Types
 * Single source of truth shared across @art-work/artwork-app, @art-work/admin, and @art-work/database
 */

export type ProjectCategorySlug =
  | "stage"
  | "conferences"
  | "booths"
  | "branding"
  | "tech"
  | "led";

export type ProjectCategory = "all" | ProjectCategorySlug;

export type PublicationStatus = "published" | "draft" | "archived";

/**
 * Unified Frontend & Dashboard Project Record
 */
export interface ProjectRecord {
  id: string; // Stable slug identifier (e.g. "neon-horizon")
  slug?: string;
  title: string;
  stamp: string; // e.g. "STAMP_PASS: ARENA_01"
  metaBadge: string; // e.g. "OCT 2025"
  cadId: string; // e.g. "CAD_ID: NH_TOUR_V4"
  image: string; // e.g. "/assets/images/gallery/project_01_neon_horizon.jpg"
  altText: string;
  category: ProjectCategorySlug;
  year?: number;
  tags: string[];
  stats: string; // e.g. "⚡ 52,000 Fans / Night"
  statsSub: string; // e.g. "0.0s DMX Latency • 100% Custom Rig"
  description: string;
  client: string;
  specs: string[];
  status: PublicationStatus;
  order: number;
  featured?: boolean;
  /** Validated 11-character YouTube Video or Reel/Short ID */
  youtubeVideoId?: string | null;
  /** Canonical watch or shorts URL (never raw iframe HTML) */
  youtubeUrl?: string | null;
  /** Headline extracted or customized for the YouTube Video or Reel/Short */
  youtubeTitle?: string | null;
  /** Paragraph / narrative description for the YouTube Video or Reel/Short */
  youtubeDescription?: string | null;
  /** True when the YouTube media is a vertical 9:16 Reel / Short */
  isShort?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * PostgreSQL Row Representation (`public.projects`)
 */
export interface DbProjectRecord {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: ProjectCategorySlug;
  year: number;
  description: string;
  tags: string[];
  stamp: string;
  meta_badge: string;
  cad_id: string;
  cover_image_url: string;
  cover_image_alt: string;
  stats_primary: string;
  stats_secondary: string;
  specs: string[];
  youtube_video_id?: string | null;
  youtube_url?: string | null;
  youtube_title?: string | null;
  youtube_description?: string | null;
  youtube_is_short?: boolean;
  status: PublicationStatus;
  order_index: number;
  featured: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Maps a PostgreSQL `public.projects` row into the unified `ProjectRecord` contract.
 */
export function mapDbProjectToRecord(row: DbProjectRecord): ProjectRecord {
  return {
    id: row.slug || row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    category: row.category,
    year: row.year,
    description: row.description,
    tags: row.tags || [],
    stamp: row.stamp,
    metaBadge: row.meta_badge,
    cadId: row.cad_id,
    image: row.cover_image_url,
    altText: row.cover_image_alt,
    stats: row.stats_primary,
    statsSub: row.stats_secondary,
    specs: row.specs || [],
    status: row.status,
    order: row.order_index,
    featured: row.featured,
    youtubeVideoId: row.youtube_video_id ?? null,
    youtubeUrl: row.youtube_url ?? null,
    youtubeTitle: row.youtube_title ?? null,
    youtubeDescription: row.youtube_description ?? null,
    isShort: Boolean(row.youtube_is_short),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps a `ProjectRecord` into a PostgreSQL `public.projects` insert/update payload.
 */
export function mapRecordToDbProject(
  record: ProjectRecord
): Omit<DbProjectRecord, "id" | "created_at" | "updated_at"> {
  const parsedYt = resolveSafeYouTubeEmbed(record.youtubeVideoId || record.youtubeUrl);
  return {
    slug: record.slug || record.id,
    title: record.title,
    client: record.client,
    category: record.category,
    year: record.year ?? 2026,
    description: record.description,
    tags: record.tags,
    stamp: record.stamp,
    meta_badge: record.metaBadge,
    cad_id: record.cadId,
    cover_image_url: record.image,
    cover_image_alt: record.altText || record.title,
    stats_primary: record.stats,
    stats_secondary: record.statsSub,
    specs: record.specs,
    youtube_video_id: parsedYt ? parsedYt.videoId : null,
    youtube_url: parsedYt ? parsedYt.canonicalUrl : null,
    youtube_title: record.youtubeTitle ?? null,
    youtube_description: record.youtubeDescription ?? null,
    youtube_is_short: record.isShort ?? Boolean(parsedYt?.isShort),
    status: record.status,
    order_index: record.order,
    featured: Boolean(record.featured),
  };
}

const SAFE_YT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const SAFE_YT_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

/**
 * Client & SSR safe helper that extracts a validated 11-char YouTube ID,
 * rejects any raw HTML/iframe markup, and returns the privacy-enhanced embed URL.
 */
export function resolveSafeYouTubeEmbed(
  input?:
    | string
    | {
        youtubeUrl?: string | null;
        youtubeVideoId?: string | null;
        isShort?: boolean;
      }
    | null
): {
  videoId: string;
  embedUrl: string;
  canonicalUrl: string;
  isShort: boolean;
} | null {
  if (!input) return null;
  const rawInput =
    typeof input === "string"
      ? input
      : input.youtubeUrl || input.youtubeVideoId || "";
  const explicitShort =
    typeof input === "object" && input !== null ? Boolean(input.isShort) : false;

  if (!rawInput || typeof rawInput !== "string") return null;
  const raw = rawInput.trim();
  if (!raw || /[<>"'`\s]/.test(raw)) return null;

  if (SAFE_YT_ID_REGEX.test(raw)) {
    return {
      videoId: raw,
      embedUrl: `https://www.youtube-nocookie.com/embed/${raw}?enablejsapi=1&rel=0`,
      canonicalUrl: explicitShort
        ? `https://www.youtube.com/shorts/${raw}`
        : `https://www.youtube.com/watch?v=${raw}`,
      isShort: explicitShort,
    };
  }

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;

  const host = url.hostname.toLowerCase();
  if (!SAFE_YT_HOSTS.has(host)) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  let candidate: string | undefined;
  let isShort = explicitShort;

  if (host === "youtu.be" || host === "www.youtu.be") {
    candidate = segments[0];
  } else if (segments[0] === "watch") {
    candidate = url.searchParams.get("v") ?? undefined;
  } else if (
    segments[0] &&
    ["embed", "shorts", "live", "v", "e"].includes(segments[0])
  ) {
    candidate = segments[1];
    if (segments[0] === "shorts") {
      isShort = true;
    }
  }

  if (!candidate || !SAFE_YT_ID_REGEX.test(candidate)) return null;

  return {
    videoId: candidate,
    embedUrl: `https://www.youtube-nocookie.com/embed/${candidate}?enablejsapi=1&rel=0`,
    canonicalUrl: isShort
      ? `https://www.youtube.com/shorts/${candidate}`
      : `https://www.youtube.com/watch?v=${candidate}`,
    isShort,
  };
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

// ---------------------------------------------------------------------------
// Client Inquiry & Lead Submission Types (Phase 08)
// ---------------------------------------------------------------------------

export type InquiryStatus = "pending" | "reviewed" | "contacted" | "archived";

export interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  serviceType: string;
  brief: string;
  status: InquiryStatus;
  ipHash?: string;
  createdAt: string;
}

export interface LeadSubmissionPayload {
  fullName: string;
  email: string;
  serviceType: string;
  brief: string;
  _hp?: string; // Honeypot field (must remain empty)
  _ts?: number; // Millisecond timestamp when form opened (time-gate)
}

