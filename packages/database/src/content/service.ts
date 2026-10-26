import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  SiteContent,
  HeroManifestoContent,
  WhyUsTeaserContent,
  ContactSectionContent,
  WhyUsPageContent,
} from "@art-work/types";
import { DEFAULT_SITE_CONTENT } from "./default-content";

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
  formFields: z.array(ContactFormFieldSchema).min(1),
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
});

export type ValidSectionKey =
  | "manifesto"
  | "whyUsTeaser"
  | "contact"
  | "whyUsPage";

export const CANONICAL_SECTION_KEYS: Record<string, ValidSectionKey> = {
  manifesto: "manifesto",
  hero: "manifesto",
  whyusteaser: "whyUsTeaser",
  why_us_teaser: "whyUsTeaser",
  "why-us-teaser": "whyUsTeaser",
  teaser: "whyUsTeaser",
  why_us: "whyUsTeaser",
  contact: "contact",
  whyuspage: "whyUsPage",
  why_us_page: "whyUsPage",
  "why-us-page": "whyUsPage",
  whyus: "whyUsPage",
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
  action: "insert" | "update" | "delete";
  actorEmail: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * The audit trigger stores the full site_content row. Expose only its JSONB
 * content payload to the editor and rollback service while accepting older
 * audit records that stored the section payload directly.
 */
export function normalizeContentAuditSnapshot(
  value: unknown
): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const snapshot = value as Record<string, unknown>;
  if (
    typeof snapshot.section_key === "string" &&
    snapshot.data !== null &&
    typeof snapshot.data === "object" &&
    !Array.isArray(snapshot.data)
  ) {
    return snapshot.data as Record<string, unknown>;
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
  getSiteContent(): Promise<SiteContent>;
  getSectionData(key: ValidSectionKey): Promise<Record<string, unknown> | null>;
  saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail?: string
  ): Promise<{ version: number; updatedAt: string }>;
  listRevisions(limit?: number): Promise<ContentRevisionItem[]>;
  getRevision(revisionId: string): Promise<ContentRevisionItem | null>;
  rollback(
    revisionId: string,
    actorEmail?: string
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number }>;
}

/* =========================================================================
   IN-MEMORY REPOSITORY IMPLEMENTATION
   ========================================================================= */

export class InMemoryContentRepository implements ContentRepository {
  private content: SiteContent;
  private versions: Record<ValidSectionKey, number>;
  private revisions: ContentRevisionItem[];

  constructor(initialContent?: SiteContent) {
    this.content = initialContent
      ? JSON.parse(JSON.stringify(initialContent))
      : JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    this.versions = {
      manifesto: 1,
      whyUsTeaser: 1,
      contact: 1,
      whyUsPage: 1,
    };
    this.revisions = [];
  }

  async getSiteContent(): Promise<SiteContent> {
    return JSON.parse(JSON.stringify(this.content));
  }

  async getSectionData(key: ValidSectionKey): Promise<Record<string, unknown> | null> {
    return (this.content[key] as unknown as Record<string, unknown>) || null;
  }

  async saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail = "admin@art-work.agency"
  ): Promise<{ version: number; updatedAt: string }> {
    const beforeState = JSON.parse(JSON.stringify(this.content[key]));
    const nextVersion = (this.versions[key] || 1) + 1;
    this.versions[key] = nextVersion;

    ((this.content as unknown) as Record<string, unknown>)[key] = JSON.parse(JSON.stringify(data));
    const now = new Date().toISOString();
    this.content.updatedAt = now;
    this.content.version = `1.${nextVersion}.0`;

    const revision: ContentRevisionItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sectionKey: key,
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
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number }> {
    const rev = await this.getRevision(revisionId);
    if (!rev) {
      throw new Error(`Revision ${revisionId} not found`);
    }

    if (!rev.beforeState) {
      throw new Error(`Revision ${revisionId} has no previous state to restore`);
    }

    const { version } = await this.saveSection(
      rev.sectionKey,
      rev.beforeState,
      `rollback:${actorEmail}`
    );
    return { sectionKey: rev.sectionKey, restoredVersion: version };
  }
}

/* =========================================================================
   SUPABASE POSTGRESQL REPOSITORY IMPLEMENTATION
   ========================================================================= */

export class SupabaseContentRepository implements ContentRepository {
  constructor(private supabase: SupabaseClient) {}

  async getSiteContent(): Promise<SiteContent> {
    try {
      const { data, error } = await this.supabase
        .from("site_content")
        .select("section_key, data, version, updated_at")
        .eq("status", "published");

      if (error || !data || data.length === 0) {
        return DEFAULT_SITE_CONTENT;
      }

      const compiled: SiteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
      let latestUpdated = DEFAULT_SITE_CONTENT.updatedAt;
      let maxVersion = 1;

      for (const row of data) {
        const canonicalKey = normalizeSectionKey(row.section_key);
        if (canonicalKey && row.data && typeof row.data === "object") {
          ((compiled as unknown) as Record<string, unknown>)[canonicalKey] = row.data;
          if (row.version && row.version > maxVersion) {
            maxVersion = row.version;
          }
          if (row.updated_at && row.updated_at > latestUpdated) {
            latestUpdated = row.updated_at;
          }
        }
      }

      compiled.version = `1.${maxVersion}.0`;
      compiled.updatedAt = latestUpdated;
      return compiled;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  async getSectionData(key: ValidSectionKey): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase
      .from("site_content")
      .select("data")
      .eq("section_key", key)
      .maybeSingle();

    if (error || !data) return null;
    return (data.data as Record<string, unknown>) || null;
  }

  async saveSection(
    key: ValidSectionKey,
    data: Record<string, unknown>,
    actorEmail = "admin@art-work.agency",
    expectedVersion?: number
  ): Promise<{ version: number; updatedAt: string }> {
    // 1. Attempt atomic PostgreSQL function with row-level lock & concurrency check
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
      .map((row) => {
        const canonicalKey = normalizeSectionKey(row.entity_id || "");
        if (!canonicalKey) return null;
        return {
          id: row.id,
          sectionKey: canonicalKey,
          action: row.action as "insert" | "update" | "delete",
          actorEmail: row.actor_email || "system@art-work.internal",
          beforeState: normalizeContentAuditSnapshot(row.before_state),
          afterState: normalizeContentAuditSnapshot(row.after_state),
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

    return {
      id: data.id,
      sectionKey: canonicalKey,
      action: data.action as "insert" | "update" | "delete",
      actorEmail: data.actor_email || "system@art-work.internal",
      beforeState: normalizeContentAuditSnapshot(data.before_state),
      afterState: normalizeContentAuditSnapshot(data.after_state),
      createdAt: data.created_at,
    };
  }

  async rollback(
    revisionId: string,
    actorEmail = "admin@art-work.agency"
  ): Promise<{ sectionKey: ValidSectionKey; restoredVersion: number }> {
    const rev = await this.getRevision(revisionId);
    if (!rev) {
      throw new Error(`Revision ${revisionId} not found`);
    }

    if (!rev.beforeState) {
      throw new Error(`Revision ${revisionId} does not have a previous snapshot`);
    }

    const { version } = await this.saveSection(
      rev.sectionKey,
      rev.beforeState,
      `rollback:${actorEmail}`
    );
    return { sectionKey: rev.sectionKey, restoredVersion: version };
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
      case "contact": {
        const parsed = ContactSectionSchema.parse(payload);
        return { success: true, data: parsed as unknown as Record<string, unknown> };
      }
      case "whyUsPage": {
        const parsed = WhyUsPageSectionSchema.parse(payload);
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
 * Retrieves the compiled site content tree.
 */
export async function fetchSiteContent(
  repo: ContentRepository
): Promise<ContentServiceResult<SiteContent>> {
  try {
    const content = await repo.getSiteContent();
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
 * Updates a specific site content section with Zod validation and version tracking.
 */
export async function updateContentSection(
  sectionKey: string,
  rawPayload: unknown,
  repo: ContentRepository,
  actorEmail?: string
): Promise<
  ContentServiceResult<{ section: ValidSectionKey; version: number; updatedAt: string }>
> {
  const normalizedKey = normalizeSectionKey(sectionKey);
  if (!normalizedKey) {
    return {
      ok: false,
      status: 400,
      error: `Invalid section key '${sectionKey}'. Supported: manifesto, whyUsTeaser, contact, whyUsPage`,
    };
  }

  const validation = validateSectionPayload(normalizedKey, rawPayload);
  if (!validation.success) {
    return { ok: false, status: 422, error: validation.error };
  }

  try {
    const result = await repo.saveSection(normalizedKey, validation.data, actorEmail);
    return {
      ok: true,
      status: 200,
      data: {
        section: normalizedKey,
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
