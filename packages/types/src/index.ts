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
  /** Attached showcase images / 3D spatial renders (especially for booth builds) */
  images?: string[];
  /** Attached architectural drawing, floorplan, or spec sheet PDF link */
  pdfUrl?: string | null;
  /** Display label for PDF document (e.g. "Architectural Plan & Specs PDF") */
  pdfTitle?: string | null;
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
  images?: string[];
  pdf_url?: string | null;
  pdf_title?: string | null;
  status: PublicationStatus;
  order_index: number;
  featured: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_PLACEHOLDER_COVER = "/assets/images/gallery/project_01_neon_horizon.jpg";

/**
 * Resolves the display thumbnail image for a project.
 * If a project has a YouTube video and its current cover image is empty or the generic
 * static placeholder, automatically extracts and uses the YouTube video thumbnail.
 */
export function getProjectThumbnailUrl(project: {
  image?: string | null;
  cover_image_url?: string | null;
  youtubeVideoId?: string | null;
  youtubeUrl?: string | null;
  youtube_video_id?: string | null;
  youtube_url?: string | null;
}): string {
  const currentImg = (project.image || project.cover_image_url || "").trim();
  const isGeneric = !currentImg || currentImg === DEFAULT_PLACEHOLDER_COVER || currentImg.includes("project_01_neon_horizon.jpg");

  const ytInput =
    project.youtubeVideoId ||
    project.youtubeUrl ||
    project.youtube_video_id ||
    project.youtube_url;

  if (ytInput) {
    const parsed = resolveSafeYouTubeEmbed(ytInput);
    if (parsed?.videoId && isGeneric) {
      return `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
    }
  }

  return currentImg || DEFAULT_PLACEHOLDER_COVER;
}

/**
 * Maps a PostgreSQL `public.projects` row into the unified `ProjectRecord` contract.
 */
export function mapDbProjectToRecord(row: DbProjectRecord): ProjectRecord {
  const parsedYt = resolveSafeYouTubeEmbed({
    youtubeUrl: row.youtube_url,
    youtubeVideoId: row.youtube_video_id,
    isShort: Boolean(row.youtube_is_short),
  });
  const resolvedImage = getProjectThumbnailUrl({
    image: row.cover_image_url,
    youtubeVideoId: row.youtube_video_id,
    youtubeUrl: row.youtube_url,
  });

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
    image: resolvedImage,
    altText: row.cover_image_alt,
    stats: row.stats_primary,
    statsSub: row.stats_secondary,
    specs: row.specs || [],
    status: row.status,
    order: row.order_index,
    featured: row.featured,
    youtubeVideoId: row.youtube_video_id ?? parsedYt?.videoId ?? null,
    youtubeUrl: row.youtube_url ?? parsedYt?.canonicalUrl ?? null,
    youtubeTitle: row.youtube_title ?? null,
    youtubeDescription: row.youtube_description ?? null,
    isShort: Boolean(row.youtube_is_short ?? parsedYt?.isShort),
    images: row.images || (resolvedImage ? [resolvedImage] : []),
    pdfUrl: row.pdf_url ?? null,
    pdfTitle: row.pdf_title ?? null,
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
  const parsedYt = resolveSafeYouTubeEmbed({
    youtubeUrl: record.youtubeUrl,
    youtubeVideoId: record.youtubeVideoId,
    isShort: record.isShort,
  });
  const resolvedCoverImage = getProjectThumbnailUrl({
    image: record.image,
    youtubeVideoId: parsedYt?.videoId,
    youtubeUrl: parsedYt?.canonicalUrl,
  });

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
    cover_image_url: resolvedCoverImage,
    cover_image_alt: record.altText || record.title,
    stats_primary: record.stats,
    stats_secondary: record.statsSub,
    specs: record.specs,
    youtube_video_id: parsedYt ? parsedYt.videoId : null,
    youtube_url: parsedYt ? parsedYt.canonicalUrl : null,
    youtube_title: record.youtubeTitle ?? null,
    youtube_description: record.youtubeDescription ?? null,
    youtube_is_short: record.isShort ?? Boolean(parsedYt?.isShort),
    images: record.images || (record.image ? [record.image] : []),
    pdf_url: record.pdfUrl ?? null,
    pdf_title: record.pdfTitle ?? null,
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
 * Known boilerplate phrases YouTube uses as site-wide generic placeholders
 * when no specific video description is rendered or when a consent shell is served.
 */
export const GENERIC_YOUTUBE_DESCRIPTIONS = [
  "enjoy the videos and music you love",
  "share your videos with friends, family, and the world",
  "upload original content",
  "يمكنك الاستمتاع بالفيديوهات والموسيقى",
  "مشاركتها مع الأصدقاء والعائلة والعالم",
  "تحميل المحتوى الأصلي",
  "youtube is a video sharing service",
];

/**
 * Returns true if the text matches generic YouTube marketing / boilerplate copy.
 */
export function isGenericYouTubeDescription(text: string | null | undefined): boolean {
  if (!text) return true;
  const normalized = text.toLowerCase().trim();
  if (!normalized) return true;
  return GENERIC_YOUTUBE_DESCRIPTIONS.some((phrase) => normalized.includes(phrase));
}

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

// ---------------------------------------------------------------------------
// Company & Partner Client Showcase Types
// ---------------------------------------------------------------------------

export type CompanyCategorySlug =
  | "all"
  | "pharma"
  | "entertainment"
  | "tech"
  | "real_estate"
  | "festivals"
  | "corporate";

export interface CompanyRecord {
  id: string;
  slug: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  category: CompanyCategorySlug;
  description: string;
  highlight: string;
  order: number;
  featured?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbCompanyRecord {
  id: string;
  slug: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  category: string;
  description: string;
  highlight: string;
  order_index: number;
  featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function mapDbCompanyToRecord(row: DbCompanyRecord): CompanyRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logo: row.logo_url,
    websiteUrl: row.website_url || undefined,
    category: (row.category as CompanyCategorySlug) || "corporate",
    description: row.description || "",
    highlight: row.highlight || "",
    order: row.order_index ?? 0,
    featured: Boolean(row.featured),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const DEFAULT_COMPANIES: CompanyRecord[] = [
  {
    id: "comp-rameda",
    slug: "rameda-pharmaceuticals",
    name: "Rameda Pharmaceuticals",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.rameda.com",
    category: "pharma",
    highlight: "Annual Gathering & Production",
    description: "Annual corporate gathering with custom branded stage, LED choreographies, and arena live broadcast.",
    order: 1,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-redbull",
    slug: "red-bull",
    name: "Red Bull",
    logo: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.redbull.com",
    category: "entertainment",
    highlight: "Kinetic Arena Activation",
    description: "High-voltage brand activations, customized kinetic truss motion, and extreme sporting soundscapes.",
    order: 2,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-mdlbeast",
    slug: "mdlbeast",
    name: "MDLBEAST Soundstorm",
    logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.mdlbeast.com",
    category: "festivals",
    highlight: "Mega Festival Scenography",
    description: "Multi-acre festival arenas with synced lasers, kinetic LED kinetic rings, and 120-cue accuracy.",
    order: 3,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-vodafone",
    slug: "vodafone",
    name: "Vodafone",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.vodafone.com",
    category: "tech",
    highlight: "Telecom Keynote & Holographic Expo",
    description: "Ultra-wide panoramic LED displays, interactive experiential booths, and 5G network launch arenas.",
    order: 4,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-emaar",
    slug: "emaar",
    name: "Emaar Properties",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.emaar.com",
    category: "real_estate",
    highlight: "Architectural Projection Mapping",
    description: "Luxury landmark unveilings with 4K laser projection mapping and synchronized symphonic light show.",
    order: 5,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-spotify",
    slug: "spotify",
    name: "Spotify",
    logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.spotify.com",
    category: "entertainment",
    highlight: "Live Fan Soundstage",
    description: "Custom experiential audio rooms, neon art installations, and creator awards soundstages.",
    order: 6,
    featured: true,
    isActive: true,
  },
  {
    id: "comp-novartis",
    slug: "novartis",
    name: "Novartis",
    logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.novartis.com",
    category: "pharma",
    highlight: "Medical Innovation Summit",
    description: "Arena medical conferences with holographic 3D molecular visualization and VIP plenaries.",
    order: 7,
    featured: false,
    isActive: true,
  },
  {
    id: "comp-samsung",
    slug: "samsung",
    name: "Samsung",
    logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://www.samsung.com",
    category: "tech",
    highlight: "Galaxy Global Unpack Booth",
    description: "Interactive curved display tunnels, tactile device testing zones, and robotic stage arms.",
    order: 8,
    featured: false,
    isActive: true,
  },
];



