import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BilingualSiteContent, Locale, SiteContent } from "@art-work/types";
import { DEFAULT_SITE_CONTENT } from "./default-content";
import { DEFAULT_SITE_CONTENT_AR } from "./default-content-ar";
import { getDefaultSiteContentForLocale, normalizeSiteContent } from "./contract";

/* =========================================================================
   ZOD SECTION VALIDATION SCHEMAS
   ========================================================================= */

export const ContentMetricItemSchema = z.object({
  num: z.string().trim().min(1, "Metric number is required"),
  label: z.string().trim().min(1, "Metric label is required"),
});

export const BentoCardSchema = z.object({
  number: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(3),
  badge: z.string().trim().min(1),
  iconName: z.string().optional(),
});

export const BlueprintSchema = z.object({
  badge: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(3),
  image: z.string().trim().min(1),
  altText: z.string().trim().min(1),
});

export const ManifestoSectionSchema = z.object({
  announcementBadge: z.string().trim().min(1),
  editionBadge: z.string().trim().min(1),
  stickyNote: z.string().trim().min(1),
  headlinePart1: z.string().trim().min(1),
  headlinePart2: z.string().trim().min(1),
  starburstText: z.object({
    top: z.string().trim().min(1),
    middle: z.string().trim().min(1),
    bottom: z.string().trim().min(1),
  }),
  introParagraph: z.string().trim().min(5),
  primaryCtaText: z.string().trim().min(1),
  secondaryCtaText: z.string().trim().min(1),
  proofTagline: z.string().trim().optional(),
  performanceBadge: z.string().trim().optional(),
  partnersBadge: z.string().trim().optional(),
  partnersHeadlinePrefix: z.string().trim().optional(),
  partnersHeadlineHighlight: z.string().trim().optional(),
  metrics: z.array(ContentMetricItemSchema).min(1),
  canvasHeader: z.string().trim().min(1),
  canvasTag: z.string().trim().min(1),
  heroImage: z.string().trim().min(1),
  heroImageAlt: z.string().trim().min(1),
});

export const WhyUsTeaserSectionSchema = z.object({
  eyebrow: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  exploreCtaText: z.string().trim().min(1),
  bentoCards: z.array(BentoCardSchema).min(1),
  blueprint: BlueprintSchema,
});

export const ServiceDisciplineItemSchema = z.object({
  id: z.string().trim().min(1),
  number: z.string().trim().min(1),
  tag: z.string().trim().min(1),
  title: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  category: z.enum(["creative", "events", "production", "delivery"]),
  specs: z.array(z.string().trim().min(1)).min(1),
  description: z.string().trim().min(3),
  deliverables: z.array(z.string().trim().min(1)).min(1),
  metrics: z.string().trim().min(1),
});

export const ServicesSectionSchema = z.object({
  eyebrow: z.string().trim().min(1),
  headlinePrefix: z.string().trim().min(1),
  headlineHighlight: z.string().trim().min(1),
  description: z.string().trim().min(3),
  filterAllLabel: z.string().trim().min(1),
  filterCreativeLabel: z.string().trim().min(1),
  filterEventsLabel: z.string().trim().min(1),
  filterProductionLabel: z.string().trim().min(1),
  filterDeliveryLabel: z.string().trim().min(1),
  cardCtaText: z.string().trim().min(1),
  modalSelectCtaText: z.string().trim().min(1),
  disciplines: z.array(ServiceDisciplineItemSchema).min(1),
  bannerEyebrow: z.string().trim().min(1),
  bannerHeadlinePrefix: z.string().trim().min(1),
  bannerHeadlineHighlight: z.string().trim().min(1),
  bannerDescription: z.string().trim().min(3),
  bannerCtaText: z.string().trim().min(1),
});

export const HomeShowcaseSectionSchema = z.object({
  badge: z.string().trim().min(1),
  headlinePrefix: z.string().trim().min(1),
  headlineHighlight: z.string().trim().min(1),
  description: z.string().trim().min(3),
  viewAllCtaText: z.string().trim().min(1),
  featuredEventBadge: z.string().trim().min(1),
  youtubeButtonText: z.string().trim().min(1),
  exploreGalleryCtaText: z.string().trim().min(1),
  cardExploreText: z.string().trim().min(1),
  mobileArchiveCtaText: z.string().trim().min(1),
});

export const ContactFormFieldSchema = z.object({
  name: z.string().trim().min(1),
  label: z.string().trim().min(1),
  placeholder: z.string().trim().min(1),
  type: z.enum(["text", "email", "textarea", "select"]),
  required: z.boolean().optional(),
});

export const ContactSectionSchema = z.object({
  stageTag: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  description: z.string().trim().min(5),
  intakeLabel: z.string().trim().min(1),
  intakeImage: z.string().trim().min(1),
  intakeImageAlt: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(3),
  studioLocations: z.string().trim().min(1),
  submitButtonText: z.string().trim().min(1),
  serviceOptions: z.array(z.string().trim().min(1)).optional(),
  formFields: z.array(ContactFormFieldSchema).min(1),
});

export const WhyUsCapabilityCardSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(3),
  bullets: z.array(z.string().trim().min(1)).min(1),
  icon: z.string().trim().optional(),
});

export const WhyUsPageSectionSchema = z.object({
  sceneBadge: z.string().trim().min(1),
  sceneTitle: z.string().trim().min(1),
  statusBadge: z.string().trim().min(1),
  heroHeadlineRow1: z.string().trim().min(1),
  heroHeadlineRow2: z.string().trim().min(1),
  roiBadge: z.string().trim().min(1),
  contentCreationBadge: z.string().trim().min(1),
  doodleStickers: z.array(z.string()).default([]),
  presentationTitle: z.string().trim().min(1),
  presentationSubtitle: z.string().trim().min(1),
  presentationImage: z.string().trim().min(1),
  presentationImageAlt: z.string().trim().min(1),
  metrics: z.array(ContentMetricItemSchema).min(1),
  primaryCtaText: z.string().trim().optional(),
  secondaryCtaText: z.string().trim().optional(),
  easelTag: z.string().trim().optional(),
  directorNote: z.string().trim().optional(),
  tailoredStamp: z.string().trim().optional(),
  zeroTemplatesBadge: z.string().trim().optional(),
  matrixBadge: z.string().trim().optional(),
  matrixHeadlinePrefix: z.string().trim().optional(),
  matrixHeadlineHighlight: z.string().trim().optional(),
  matrixDescription: z.string().trim().optional(),
  capabilityCards: z.array(WhyUsCapabilityCardSchema).optional(),
  calloutTag: z.string().trim().optional(),
  calloutHeadlinePrefix: z.string().trim().optional(),
  calloutHeadlineHighlight: z.string().trim().optional(),
  calloutDescription: z.string().trim().optional(),
  calloutPrimaryCta: z.string().trim().optional(),
  calloutSecondaryCta: z.string().trim().optional(),
});

export const GalleryWorkflowStepSchema = z.object({
  stepNumber: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(3),
});

export const GalleryPageSectionSchema = z.object({
  heroBadge: z.string().trim().min(1),
  headlinePart1: z.string().trim().min(1),
  headlinePart2: z.string().trim().min(1),
  heroDescription: z.string().trim().min(3),
  heroTags: z.array(z.string().trim().min(1)).min(1),
  filterAllLabel: z.string().trim().min(1),
  filterConferencesLabel: z.string().trim().min(1),
  filterBoothsLabel: z.string().trim().min(1),
  filterBrandingLabel: z.string().trim().min(1),
  gridEyebrow: z.string().trim().min(1),
  gridHeadline: z.string().trim().min(1),
  spotlightHeadline: z.string().trim().min(1),
  spotlightTag: z.string().trim().min(1),
  spotlightImage: z.string().trim().min(1),
  spotlightImageAlt: z.string().trim().min(1),
  approachBadge: z.string().trim().min(1),
  quoteText: z.string().trim().min(3),
  quoteAuthor: z.string().trim().min(1),
  workflowSteps: z.array(GalleryWorkflowStepSchema).min(1),
  spotlightCtaText: z.string().trim().min(1),
  ctaTag: z.string().trim().min(1),
  ctaHeadlinePrefix: z.string().trim().min(1),
  ctaHeadlineHighlight: z.string().trim().min(1),
  ctaDescription: z.string().trim().min(3),
  ctaPrimaryButtonText: z.string().trim().min(1),
  ctaEmailPrefix: z.string().trim().min(1),
});

export const LayoutSectionSchema = z.object({
  navHomeLabel: z.string().trim().min(1),
  navWhyUsLabel: z.string().trim().min(1),
  navServicesLabel: z.string().trim().min(1),
  navGalleryLabel: z.string().trim().min(1),
  navContactLabel: z.string().trim().min(1),
  fullVaultCtaText: z.string().trim().min(1),
  briefCtaText: z.string().trim().min(1),
  footerCopyright: z.string().trim().min(1),
  footerBrandTitle: z.string().trim().min(1),
  footerBrandSubtitle: z.string().trim().min(1),
});

export type ValidSectionKey =
  | "manifesto"
  | "whyUsTeaser"
  | "services"
  | "homeShowcase"
  | "contact"
  | "whyUsPage"
  | "galleryPage"
  | "layout";

export const ALL_VALID_SECTION_KEYS: ValidSectionKey[] = [
  "manifesto",
  "whyUsTeaser",
  "services",
  "homeShowcase",
  "contact",
  "whyUsPage",
  "galleryPage",
  "layout",
];

export const CANONICAL_SECTION_KEYS: Record<string, ValidSectionKey> = {
  manifesto: "manifesto",
  hero: "manifesto",
  whyusteaser: "whyUsTeaser",
  teaser: "whyUsTeaser",
  services: "services",
  capabilities: "services",
  disciplines: "services",
  homeshowcase: "homeShowcase",
  galleryshowcase: "homeShowcase",
  showcase: "homeShowcase",
  contact: "contact",
  whyuspage: "whyUsPage",
  whyus: "whyUsPage",
  gallerypage: "galleryPage",
  gallery: "galleryPage",
  layout: "layout",
  navigation: "layout",
  headerfooter: "layout",
};

export function normalizeSectionKey(key: string): ValidSectionKey | null {
  const clean = key.trim().toLowerCase().replace(/[-_]/g, "");
  return CANONICAL_SECTION_KEYS[clean] || null;
}

/* =========================================================================
   TYPES & RESULT INTERFACES
   ========================================================================= */

export interface ContentRevisionItem {
  id: string;
  sectionKey: ValidSectionKey;
  locale?: Locale;
  action: "insert" | "update" | "delete";
  actorEmail: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Detects whether a site_content audit row mutated Arabic (`data_ar`) or English (`data`).
 */
export function detectAuditSnapshotLocale(
  beforeRow: unknown,
  afterRow: unknown
): Locale {
  if (
    beforeRow !== null &&
    typeof beforeRow === "object" &&
    afterRow !== null &&
    typeof afterRow === "object"
  ) {
    const b = beforeRow as Record<string, unknown>;
    const a = afterRow as Record<string, unknown>;
    if ("data_ar" in a || "data_ar" in b) {
      if (JSON.stringify(b.data_ar ?? null) !== JSON.stringify(a.data_ar ?? null)) {
        return "ar";
      }
    }
  }
  return "en";
}

/**
 * The audit trigger stores the full site_content row. Expose only its JSONB
 * content payload to the editor and rollback service while accepting older
 * audit records that stored the section payload directly.
 */
export function normalizeContentAuditSnapshot(
  value: unknown,
  locale: Locale = "en"
): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const snapshot = value as Record<string, unknown>;
  if (typeof snapshot.section_key === "string") {
    const payload = locale === "ar" ? snapshot.data_ar : snapshot.data;
    if (payload !== null && typeof payload === "object" && !Array.isArray(payload)) {
      return payload as Record<string, unknown>;
    }
  }

  return snapshot;
}

export type ContentServiceResult<T> =
  | { ok: true; status: 200 | 201; data: T }
  | { ok: false; status: 400 | 404 | 422 | 500; error: string };

/* =========================================================================
   REPOSITORY ABSTRACTION (Supabase & In-Memory for Unit Testing)
   ========================================================================= */

export interface ContentRepository {
  getSiteContent(locale?: Locale): Promise<SiteContent>;
  getBilingualSiteContent?(): Promise<BilingualSiteContent>;
  getSectionData(key: ValidSectionKey, locale?: Locale): Promise<Record<string, unknown> | null>;
  saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail?: string,
    expectedVersion?: number,
    locale?: Locale
  ): Promise<{ version: number; updatedAt: string }>;
  listRevisions(limit?: number): Promise<ContentRevisionItem[]>;
  getRevision(revisionId: string): Promise<ContentRevisionItem | null>;
  rollback(
    revisionId: string,
    actorEmail?: string
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number; locale?: Locale }>;
}

/* =========================================================================
   IN-MEMORY REPOSITORY IMPLEMENTATION
   ========================================================================= */

export class InMemoryContentRepository implements ContentRepository {
  private content: SiteContent;
  private contentAr: SiteContent;
  private versions: Record<ValidSectionKey, number>;
  private revisions: ContentRevisionItem[];

  constructor(initialContent?: SiteContent, initialContentAr?: SiteContent) {
    this.content = initialContent
      ? normalizeSiteContent(JSON.parse(JSON.stringify(initialContent)), "en")
      : JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    this.contentAr = initialContentAr
      ? normalizeSiteContent(JSON.parse(JSON.stringify(initialContentAr)), "ar")
      : JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_AR));
    this.versions = {
      manifesto: 1,
      whyUsTeaser: 1,
      services: 1,
      homeShowcase: 1,
      contact: 1,
      whyUsPage: 1,
      galleryPage: 1,
      layout: 1,
    };
    this.revisions = [];
  }

  async getSiteContent(locale: Locale = "en"): Promise<SiteContent> {
    const source = locale === "ar" ? this.contentAr : this.content;
    return normalizeSiteContent(JSON.parse(JSON.stringify(source)), locale);
  }

  async getBilingualSiteContent(): Promise<BilingualSiteContent> {
    return {
      en: await this.getSiteContent("en"),
      ar: await this.getSiteContent("ar"),
    };
  }

  async getSectionData(
    key: ValidSectionKey,
    locale: Locale = "en"
  ): Promise<Record<string, unknown> | null> {
    const source = locale === "ar" ? this.contentAr : this.content;
    return (source[key] as unknown as Record<string, unknown>) || null;
  }

  async saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail = "admin@art-work.agency",
    _expectedVersion?: number,
    locale: Locale = "en"
  ): Promise<{ version: number; updatedAt: string }> {
    void _expectedVersion;
    const target = locale === "ar" ? this.contentAr : this.content;
    const beforeState = JSON.parse(JSON.stringify(target[key]));
    const nextVersion = (this.versions[key] || 1) + 1;
    this.versions[key] = nextVersion;

    ((target as unknown) as Record<string, unknown>)[key] = JSON.parse(JSON.stringify(data));
    const now = new Date().toISOString();
    target.updatedAt = now;
    target.version = `1.${nextVersion}.0`;

    const revision: ContentRevisionItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sectionKey: key,
      locale,
      action: "update",
      actorEmail,
      beforeState,
      afterState: JSON.parse(JSON.stringify(data)),
      createdAt: now,
    };
    this.revisions.unshift(revision);

    return { version: nextVersion, updatedAt: now };
  }

  async listRevisions(limit = 20): Promise<ContentRevisionItem[]> {
    return this.revisions.slice(0, limit);
  }

  async getRevision(revisionId: string): Promise<ContentRevisionItem | null> {
    const found = this.revisions.find((r) => r.id === revisionId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async rollback(
    revisionId: string,
    actorEmail = "admin@art-work.agency"
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number; locale?: Locale }> {
    const rev = await this.getRevision(revisionId);
    if (!rev) {
      throw new Error(`Revision ${revisionId} not found`);
    }

    if (!rev.beforeState) {
      throw new Error(`Revision ${revisionId} has no previous state to restore`);
    }

    const locale = rev.locale || "en";
    const { version } = await this.saveSection(
      rev.sectionKey,
      rev.beforeState,
      `rollback:${actorEmail}`,
      undefined,
      locale
    );
    return { sectionKey: rev.sectionKey, restoredVersion: version, locale };
  }
}

/* =========================================================================
   SUPABASE POSTGRESQL REPOSITORY IMPLEMENTATION
   ========================================================================= */

export class SupabaseContentRepository implements ContentRepository {
  constructor(private supabase: SupabaseClient) {}

  private compileRowsForLocale(
    rows: Array<{
      section_key: string;
      data?: Record<string, unknown> | null;
      data_ar?: Record<string, unknown> | null;
      version?: number | null;
      updated_at?: string | null;
    }>,
    locale: Locale = "en"
  ): SiteContent {
    const defaults = getDefaultSiteContentForLocale(locale);
    const compiled: Record<string, unknown> = JSON.parse(JSON.stringify(defaults));
    let latestUpdated = defaults.updatedAt;
    let maxVersion = 1;

    for (const row of rows) {
      const canonicalKey = normalizeSectionKey(row.section_key);
      if (!canonicalKey) continue;

      const enPayload =
        row.data && typeof row.data === "object" && !Array.isArray(row.data)
          ? row.data
          : null;
      const arPayload =
        row.data_ar && typeof row.data_ar === "object" && !Array.isArray(row.data_ar)
          ? row.data_ar
          : null;

      if (locale === "ar") {
        // Carry over non-linguistic shared visual assets & contact details from EN row when AR is sparse
        const mergedAr: Record<string, unknown> = {
          ...(compiled[canonicalKey] as Record<string, unknown>),
        };
        if (enPayload) {
          if (typeof enPayload.heroImage === "string" && enPayload.heroImage) {
            mergedAr.heroImage = enPayload.heroImage;
          }
          if (typeof enPayload.intakeImage === "string" && enPayload.intakeImage) {
            mergedAr.intakeImage = enPayload.intakeImage;
          }
          if (typeof enPayload.email === "string" && enPayload.email) {
            mergedAr.email = enPayload.email;
          }
          if (typeof enPayload.phone === "string" && enPayload.phone) {
            mergedAr.phone = enPayload.phone;
          }
          if (typeof enPayload.presentationImage === "string" && enPayload.presentationImage) {
            mergedAr.presentationImage = enPayload.presentationImage;
          }
          if (typeof enPayload.spotlightImage === "string" && enPayload.spotlightImage) {
            mergedAr.spotlightImage = enPayload.spotlightImage;
          }
        }
        if (arPayload && Object.keys(arPayload).length > 0) {
          Object.assign(mergedAr, arPayload);
        }
        compiled[canonicalKey] = mergedAr;
      } else if (enPayload) {
        compiled[canonicalKey] = enPayload;
      }

      if (row.version && row.version > maxVersion) {
        maxVersion = row.version;
      }
      if (row.updated_at && row.updated_at > latestUpdated) {
        latestUpdated = row.updated_at;
      }
    }

    const normalized = normalizeSiteContent(compiled, locale);
    normalized.version = `1.${maxVersion}.0`;
    normalized.updatedAt = latestUpdated;
    return normalized;
  }

  async getSiteContent(locale: Locale = "en"): Promise<SiteContent> {
    try {
      const { data, error } = await this.supabase
        .from("site_content")
        .select("section_key, data, data_ar, version, updated_at")
        .eq("status", "published");

      if (error || !data || data.length === 0) {
        return getDefaultSiteContentForLocale(locale);
      }

      return this.compileRowsForLocale(data, locale);
    } catch {
      return getDefaultSiteContentForLocale(locale);
    }
  }

  async getBilingualSiteContent(): Promise<BilingualSiteContent> {
    try {
      const { data, error } = await this.supabase
        .from("site_content")
        .select("section_key, data, data_ar, version, updated_at")
        .eq("status", "published");

      if (error || !data || data.length === 0) {
        return {
          en: DEFAULT_SITE_CONTENT,
          ar: DEFAULT_SITE_CONTENT_AR,
        };
      }

      return {
        en: this.compileRowsForLocale(data, "en"),
        ar: this.compileRowsForLocale(data, "ar"),
      };
    } catch {
      return {
        en: DEFAULT_SITE_CONTENT,
        ar: DEFAULT_SITE_CONTENT_AR,
      };
    }
  }

  async getSectionData(
    key: ValidSectionKey,
    locale: Locale = "en"
  ): Promise<Record<string, unknown> | null> {
    const column = locale === "ar" ? "data_ar" : "data";
    const { data, error } = await this.supabase
      .from("site_content")
      .select(column)
      .eq("section_key", key)
      .maybeSingle();

    if (error || !data) return null;
    const row = data as unknown as Record<string, unknown>;
    return (row[column] as Record<string, unknown>) || null;
  }

  async saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail = "admin@art-work.agency",
    expectedVersion?: number,
    locale: Locale = "en"
  ): Promise<{ version: number; updatedAt: string }> {
    if (locale === "ar") {
      const { data: existing } = await this.supabase
        .from("site_content")
        .select("version, data")
        .eq("section_key", key)
        .maybeSingle();

      const nextVersion = existing?.version ? existing.version + 1 : 1;
      const now = new Date().toISOString();

      if (existing) {
        const { error } = await this.supabase
          .from("site_content")
          .update({
            data_ar: data,
            status: "published",
            version: nextVersion,
            updated_at: now,
          })
          .eq("section_key", key);

        if (error) {
          throw new Error(`Failed to save Arabic section ${key}: ${error.message}`);
        }
      } else {
        const defaultEn = (DEFAULT_SITE_CONTENT[key] || {}) as unknown as Record<string, unknown>;
        const { error } = await this.supabase.from("site_content").upsert(
          {
            section_key: key,
            data: defaultEn,
            data_ar: data,
            status: "published",
            version: nextVersion,
            updated_at: now,
          },
          { onConflict: "section_key" }
        );

        if (error) {
          throw new Error(`Failed to insert Arabic section ${key}: ${error.message}`);
        }
      }

      return { version: nextVersion, updatedAt: now };
    }

    // 1. Attempt atomic PostgreSQL function with row-level lock & concurrency check (English canonical data)
    try {
      const { data: rpcData, error: rpcError } = await this.supabase.rpc("save_site_content", {
        p_section_key: key,
        p_data: data,
        p_actor_email: actorEmail,
        p_expected_version: expectedVersion ?? null,
      });

      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        return {
          version: Number(rpcData[0].version),
          updatedAt: String(rpcData[0].updated_at),
        };
      }
    } catch {
      // Continue to fallback
    }

    // 2. Fallback to client-side increment for mocked test clients
    const { data: existing } = await this.supabase
      .from("site_content")
      .select("version")
      .eq("section_key", key)
      .maybeSingle();

    const nextVersion = existing?.version ? existing.version + 1 : 1;
    const now = new Date().toISOString();

    const { error } = await this.supabase.from("site_content").upsert(
      {
        section_key: key,
        data,
        status: "published",
        version: nextVersion,
        updated_at: now,
      },
      { onConflict: "section_key" }
    );

    if (error) {
      throw new Error(`Failed to save section ${key}: ${error.message}`);
    }

    return { version: nextVersion, updatedAt: now };
  }

  async listRevisions(limit = 20): Promise<ContentRevisionItem[]> {
    const { data, error } = await this.supabase
      .from("content_audit_logs")
      .select("id, entity_id, action, actor_email, before_state, after_state, created_at")
      .eq("entity_type", "site_content")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data
      .map<ContentRevisionItem | null>((row) => {
        const canonicalKey = normalizeSectionKey(row.entity_id || "");
        if (!canonicalKey) return null;
        const locale = detectAuditSnapshotLocale(row.before_state, row.after_state);
        return {
          id: row.id,
          sectionKey: canonicalKey,
          locale,
          action: row.action as "insert" | "update" | "delete",
          actorEmail: row.actor_email || "system@art-work.internal",
          beforeState: normalizeContentAuditSnapshot(row.before_state, locale),
          afterState: normalizeContentAuditSnapshot(row.after_state, locale),
          createdAt: row.created_at,
        };
      })
      .filter((item): item is ContentRevisionItem => item !== null);
  }

  async getRevision(revisionId: string): Promise<ContentRevisionItem | null> {
    const { data, error } = await this.supabase
      .from("content_audit_logs")
      .select("id, entity_id, action, actor_email, before_state, after_state, created_at")
      .eq("id", revisionId)
      .maybeSingle();

    if (error || !data) return null;
    const canonicalKey = normalizeSectionKey(data.entity_id || "");
    if (!canonicalKey) return null;
    const locale = detectAuditSnapshotLocale(data.before_state, data.after_state);

    return {
      id: data.id,
      sectionKey: canonicalKey,
      locale,
      action: data.action as "insert" | "update" | "delete",
      actorEmail: data.actor_email || "system@art-work.internal",
      beforeState: normalizeContentAuditSnapshot(data.before_state, locale),
      afterState: normalizeContentAuditSnapshot(data.after_state, locale),
      createdAt: data.created_at,
    };
  }

  async rollback(
    revisionId: string,
    actorEmail = "admin@art-work.agency"
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number; locale?: Locale }> {
    const rev = await this.getRevision(revisionId);
    if (!rev) {
      throw new Error(`Revision ${revisionId} not found`);
    }

    if (!rev.beforeState) {
      throw new Error(`Revision ${revisionId} does not have a previous snapshot`);
    }

    const locale = rev.locale || "en";
    const { version } = await this.saveSection(
      rev.sectionKey,
      rev.beforeState,
      `rollback:${actorEmail}`,
      undefined,
      locale
    );
    return { sectionKey: rev.sectionKey, restoredVersion: version, locale };
  }
}

/* =========================================================================
   FACTORY FUNCTIONS
   ========================================================================= */

export function createInMemoryContentRepository(
  initialContent?: SiteContent
): InMemoryContentRepository {
  return new InMemoryContentRepository(initialContent);
}

export function createSupabaseContentRepository(
  supabase: SupabaseClient
): SupabaseContentRepository {
  return new SupabaseContentRepository(supabase);
}

/* =========================================================================
   PUBLIC HIGH-LEVEL SERVICE FUNCTIONS
   ========================================================================= */

/**
 * Validates section payload against the respective Zod schema.
 */
export function validateSectionPayload(
  sectionKey: ValidSectionKey,
  payload: unknown
):
  | { success: true; data: Record<string, unknown> }
  | { success: false; error: string } {
  try {
    switch (sectionKey) {
      case "manifesto": {
        const parsed = ManifestoSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "whyUsTeaser": {
        const parsed = WhyUsTeaserSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "services": {
        const parsed = ServicesSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "homeShowcase": {
        const parsed = HomeShowcaseSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "contact": {
        const parsed = ContactSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "whyUsPage": {
        const parsed = WhyUsPageSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "galleryPage": {
        const parsed = GalleryPageSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "layout": {
        const parsed = LayoutSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      default:
        return { success: false, error: `Unsupported section key: ${sectionKey}` };
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issue = err.issues[0];
      return {
        success: false,
        error: `${issue.path.join(".") || "payload"}: ${issue.message}`,
      };
    }
    return { success: false, error: "Invalid section schema payload" };
  }
}

/**
 * Retrieves the compiled site content tree for the requested locale ("en" or "ar").
 */
export async function fetchSiteContent(
  repo: ContentRepository,
  locale: Locale = "en"
): Promise<ContentServiceResult<SiteContent>> {
  try {
    const content = await repo.getSiteContent(locale);
    return { ok: true, status: 200, data: content };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: `Failed to retrieve site content: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Retrieves both English and Arabic compiled site content trees for Admin CMS editing.
 */
export async function fetchBilingualSiteContent(
  repo: ContentRepository
): Promise<ContentServiceResult<BilingualSiteContent>> {
  try {
    if (typeof repo.getBilingualSiteContent === "function") {
      const bilingual = await repo.getBilingualSiteContent();
      return { ok: true, status: 200, data: bilingual };
    }
    const [en, ar] = await Promise.all([
      repo.getSiteContent("en"),
      repo.getSiteContent("ar"),
    ]);
    return { ok: true, status: 200, data: { en, ar } };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: `Failed to retrieve bilingual site content: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Updates a specific site content section with Zod validation and version tracking.
 */
export async function updateContentSection(
  sectionKey: string,
  rawPayload: unknown,
  repo: ContentRepository,
  actorEmail?: string,
  locale: Locale = "en"
): Promise<
  ContentServiceResult<{ section: ValidSectionKey; locale: Locale; version: number; updatedAt: string }>
> {
  const normalizedKey = normalizeSectionKey(sectionKey);
  if (!normalizedKey) {
    return {
      ok: false,
      status: 400,
      error: `Invalid section key '${sectionKey}'. Supported: ${ALL_VALID_SECTION_KEYS.join(", ")}`,
    };
  }

  const validation = validateSectionPayload(normalizedKey, rawPayload);
  if (!validation.success) {
    return { ok: false, status: 422, error: validation.error };
  }

  try {
    const result = await repo.saveSection(
      normalizedKey,
      validation.data,
      actorEmail,
      undefined,
      locale
    );
    return {
      ok: true,
      status: 200,
      data: {
        section: normalizedKey,
        locale,
        version: result.version,
        updatedAt: result.updatedAt,
      },
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: `Failed to update section ${normalizedKey}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Fetches recent content revisions and author audit logs.
 */
export async function fetchContentHistory(
  repo: ContentRepository,
  limit = 20
): Promise<ContentServiceResult<ContentRevisionItem[]>> {
  try {
    const revisions = await repo.listRevisions(limit);
    return { ok: true, status: 200, data: revisions };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: `Failed to fetch revision history: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Restores content section to a specific previous snapshot.
 */
export async function rollbackContent(
  revisionId: string,
  repo: ContentRepository,
  actorEmail?: string
): Promise<
  ContentServiceResult<{ section: ValidSectionKey; restoredVersion: number }>
> {
  if (!revisionId || typeof revisionId !== "string") {
    return { ok: false, status: 400, error: "A valid revisionId is required" };
  }

  try {
    const result = await repo.rollback(revisionId, actorEmail);
    return {
      ok: true,
      status: 200,
      data: {
        section: result.sectionKey,
        restoredVersion: result.restoredVersion,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.includes("not found") ? 404 : 500;
    return { ok: false, status, error: msg };
  }
}
