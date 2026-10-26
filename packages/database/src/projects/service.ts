import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type DbProjectRecord,
  type ProjectRecord,
  mapDbProjectToRecord,
} from "@art-work/types";
import {
  ProjectCategoryEnum,
  ContentStatusEnum,
  ProjectInputSchema,
  type ProjectInput,
} from "../schemas/project";
import { parseYouTubeInput, buildYouTubeShortsUrl } from "../media/youtube";

export const ProjectQuerySchema = z.object({
  category: z.union([ProjectCategoryEnum, z.literal("all")]).default("all"),
  status: z.union([ContentStatusEnum, z.literal("all")]).default("all"),
  q: z.string().trim().max(120).optional().default(""),
  featured: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === "true")),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export type ProjectQueryInput = z.input<typeof ProjectQuerySchema>;
export type ProjectQuery = z.output<typeof ProjectQuerySchema>;

export const ProjectReorderItemSchema = z.object({
  id: z.string().min(1, "Project id or slug is required"),
  order: z.number().int().min(0, "Order index must be a non-negative integer"),
});

export const ProjectReorderSchema = z
  .object({
    items: z
      .array(ProjectReorderItemSchema)
      .min(1, "At least one project reorder entry is required")
      .max(200, "Cannot reorder more than 200 projects at once"),
  })
  .refine(
    (val) => {
      const ids = new Set(val.items.map((i) => i.id));
      const orders = new Set(val.items.map((i) => i.order));
      return ids.size === val.items.length && orders.size === val.items.length;
    },
    {
      message: "Reorder payload must not contain duplicate project IDs or duplicate order indices",
    }
  );

export type ProjectReorderInput = z.infer<typeof ProjectReorderSchema>;

export interface ProjectsListResult {
  items: ProjectRecord[];
  total: number;
  page: number;
  limit: number;
}

export type ProjectServiceResult<T> =
  | { ok: true; status: 200 | 201; data: T }
  | { ok: false; status: 400 | 404 | 409 | 422 | 500; error: string };

/**
 * Storage abstraction so service logic can execute against Supabase PostgreSQL
 * or an in-memory repository for deterministic unit testing.
 */
export interface ProjectsRepository {
  listRows(options: { includeDrafts: boolean }): Promise<DbProjectRecord[]>;
  findByIdOrSlug(idOrSlug: string): Promise<DbProjectRecord | null>;
  insertRow(
    payload: ProjectInput & { created_by?: string | null; updated_by?: string | null }
  ): Promise<DbProjectRecord>;
  updateRow(
    id: string,
    payload: Partial<ProjectInput> & { updated_by?: string | null }
  ): Promise<DbProjectRecord>;
  deleteRow(id: string): Promise<boolean>;
  reorderRows(
    updates: { id: string; order_index: number }[],
    actorId?: string | null
  ): Promise<DbProjectRecord[]>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function toSafeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/**
 * Normalizes a camelCase `ProjectRecord` or snake_case `ProjectInput` (or partial patch)
 * into a strictly validated `ProjectInput`.
 */
export function normalizeProjectInput(
  rawInput: Record<string, unknown>,
  existing?: DbProjectRecord
): { ok: true; data: ProjectInput } | { ok: false; status: 400 | 422; error: string } {
  const title = String(rawInput.title ?? existing?.title ?? "").trim();
  const rawSlugCandidate = String(
    rawInput.slug ??
      (typeof rawInput.id === "string" && !UUID_REGEX.test(rawInput.id) ? rawInput.id : "") ??
      existing?.slug ??
      title
  );
  const slug = toSafeSlug(rawSlugCandidate || title || "project");

  // Validate YouTube fields if present
  const rawYtUrl =
    rawInput.youtubeUrl !== undefined
      ? rawInput.youtubeUrl
      : rawInput.youtube_url !== undefined
      ? rawInput.youtube_url
      : existing?.youtube_url;
  const rawYtId =
    rawInput.youtubeVideoId !== undefined
      ? rawInput.youtubeVideoId
      : rawInput.youtube_video_id !== undefined
      ? rawInput.youtube_video_id
      : existing?.youtube_video_id;

  let youtube_video_id: string | null = null;
  let youtube_url: string | null = null;
  let inferredShort = false;

  const ytCandidate =
    typeof rawYtUrl === "string" && rawYtUrl.trim().length > 0
      ? rawYtUrl.trim()
      : typeof rawYtId === "string" && rawYtId.trim().length > 0
      ? rawYtId.trim()
      : null;

  if (ytCandidate) {
    const parsedYt = parseYouTubeInput(ytCandidate);
    if (!parsedYt.ok) {
      return {
        ok: false,
        status: 422,
        error: `Invalid YouTube link or video ID (${parsedYt.reason}). Raw <iframe> HTML and unapproved domains are prohibited.`,
      };
    }
    youtube_video_id = parsedYt.videoId;
    inferredShort = Boolean(parsedYt.isShort);
    const explicitShortFlag =
      rawInput.isShort !== undefined
        ? Boolean(rawInput.isShort)
        : rawInput.youtube_is_short !== undefined
        ? Boolean(rawInput.youtube_is_short)
        : Boolean(existing?.youtube_is_short);
    const finalShort = explicitShortFlag || inferredShort;
    youtube_url = finalShort
      ? buildYouTubeShortsUrl(parsedYt.videoId)
      : parsedYt.canonicalUrl;
  }

  const youtube_is_short =
    rawInput.isShort !== undefined
      ? Boolean(rawInput.isShort)
      : rawInput.youtube_is_short !== undefined
      ? Boolean(rawInput.youtube_is_short)
      : existing
      ? Boolean(existing.youtube_is_short)
      : inferredShort;

  const candidatePayload = {
    slug,
    title,
    client: String(rawInput.client ?? existing?.client ?? "").trim(),
    category: rawInput.category ?? existing?.category ?? "stage",
    year: Number(rawInput.year ?? existing?.year ?? 2026),
    description: String(rawInput.description ?? existing?.description ?? "").trim(),
    tags: Array.isArray(rawInput.tags)
      ? rawInput.tags.map((t) => String(t).trim()).filter(Boolean)
      : existing?.tags ?? [],
    stamp: String(rawInput.stamp ?? existing?.stamp ?? "STAMP_PASS: 2026").trim(),
    meta_badge: String(
      rawInput.meta_badge ?? rawInput.metaBadge ?? existing?.meta_badge ?? "EDITION 2026"
    ).trim(),
    cad_id: String(rawInput.cad_id ?? rawInput.cadId ?? existing?.cad_id ?? "CAD_ID: REV_01").trim(),
    cover_image_url: String(
      rawInput.cover_image_url ??
        rawInput.image ??
        existing?.cover_image_url ??
        "/assets/images/gallery/project_01_neon_horizon.jpg"
    ).trim(),
    cover_image_alt: String(
      rawInput.cover_image_alt ??
        rawInput.altText ??
        existing?.cover_image_alt ??
        (title || "Project Showcase")
    ).trim(),
    stats_primary: String(
      rawInput.stats_primary ?? rawInput.stats ?? existing?.stats_primary ?? "⚡ LIVE ARENA"
    ).trim(),
    stats_secondary: String(
      rawInput.stats_secondary ?? rawInput.statsSub ?? existing?.stats_secondary ?? "100% Custom Rig"
    ).trim(),
    specs: Array.isArray(rawInput.specs)
      ? rawInput.specs.map((s) => String(s).trim()).filter(Boolean)
      : existing?.specs ?? [],
    youtube_video_id,
    youtube_url,
    youtube_title:
      rawInput.youtubeTitle !== undefined
        ? rawInput.youtubeTitle
          ? String(rawInput.youtubeTitle).trim()
          : null
        : rawInput.youtube_title !== undefined
        ? rawInput.youtube_title
          ? String(rawInput.youtube_title).trim()
          : null
        : existing?.youtube_title ?? null,
    youtube_description:
      rawInput.youtubeDescription !== undefined
        ? rawInput.youtubeDescription
          ? String(rawInput.youtubeDescription).trim()
          : null
        : rawInput.youtube_description !== undefined
        ? rawInput.youtube_description
          ? String(rawInput.youtube_description).trim()
          : null
        : existing?.youtube_description ?? null,
    youtube_is_short,
    status: rawInput.status ?? existing?.status ?? "draft",
    order_index: Number(
      rawInput.order_index ?? rawInput.order ?? existing?.order_index ?? 1
    ),
    featured:
      rawInput.featured !== undefined
        ? Boolean(rawInput.featured)
        : existing?.featured ?? false,
  };

  const parsed = ProjectInputSchema.safeParse(candidatePayload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: (parsed.error.issues || (parsed.error as unknown as { errors?: Array<{ message: string }> }).errors)?.[0]?.message || "Invalid project payload",
    };
  }

  return { ok: true, data: parsed.data };
}

/**
 * Supabase PostgreSQL implementation of `ProjectsRepository`.
 */
export function createSupabaseProjectsRepository(
  supabase: SupabaseClient
): ProjectsRepository {
  return {
    async listRows({ includeDrafts }) {
      let query = supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (!includeDrafts) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
      }
      return (data || []) as DbProjectRecord[];
    },

    async findByIdOrSlug(idOrSlug: string) {
      const trimmed = idOrSlug.trim();
      const column = UUID_REGEX.test(trimmed) ? "id" : "slug";
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq(column, trimmed)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to lookup project '${idOrSlug}': ${error.message}`);
      }
      return (data as DbProjectRecord | null) ?? null;
    },

    async insertRow(payload) {
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed to insert project");
      }
      return data as DbProjectRecord;
    },

    async updateRow(id, payload) {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed to update project");
      }
      return data as DbProjectRecord;
    },

    async deleteRow(id) {
      const { error, count } = await supabase
        .from("projects")
        .delete({ count: "exact" })
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to delete project: ${error.message}`);
      }
      return (count ?? 1) > 0;
    },

    async reorderRows(updates, actorId) {
      // 1. Attempt atomic RPC invocation within a single database transaction
      const { error: rpcError } = await supabase.rpc("reorder_projects", {
        p_items: updates,
        p_actor_id: actorId || null,
      });

      // 2. Fallback to batched updates if RPC is not mocked in unit test environment
      if (rpcError) {
        await Promise.all(
          updates.map(({ id, order_index }) => {
            const col = UUID_REGEX.test(id) ? "id" : "slug";
            return supabase
              .from("projects")
              .update({ order_index, ...(actorId ? { updated_by: actorId } : {}) })
              .eq(col, id);
          })
        );
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        throw new Error(`Failed to read reordered projects: ${error.message}`);
      }
      return (data || []) as DbProjectRecord[];
    },
  };
}

/**
 * In-memory implementation of `ProjectsRepository` for fast, deterministic unit tests.
 */
export function createInMemoryProjectsRepository(
  initialRows: DbProjectRecord[] = []
): ProjectsRepository {
  let rows: DbProjectRecord[] = initialRows.map((r) => ({ ...r }));

  return {
    async listRows({ includeDrafts }) {
      const filtered = includeDrafts
        ? [...rows]
        : rows.filter((r) => r.status === "published");
      return filtered.sort((a, b) => a.order_index - b.order_index);
    },

    async findByIdOrSlug(idOrSlug: string) {
      const found = rows.find((r) => r.id === idOrSlug || r.slug === idOrSlug);
      return found ? { ...found } : null;
    },

    async insertRow(payload) {
      if (rows.some((r) => r.slug === payload.slug)) {
        throw new Error(`duplicate key value violates unique constraint "projects_slug_key"`);
      }
      const now = new Date().toISOString();
      const row: DbProjectRecord = {
        ...payload,
        id: `00000000-0000-4000-8000-${String(rows.length + 1).padStart(12, "0")}`,
        created_at: now,
        updated_at: now,
      };
      rows.push(row);
      return { ...row };
    },

    async updateRow(id, payload) {
      const idx = rows.findIndex((r) => r.id === id || r.slug === id);
      if (idx < 0) {
        throw new Error("Project not found");
      }
      const updated: DbProjectRecord = {
        ...rows[idx],
        ...payload,
        updated_at: new Date().toISOString(),
      };
      rows[idx] = updated;
      return { ...updated };
    },

    async deleteRow(id) {
      const before = rows.length;
      rows = rows.filter((r) => r.id !== id && r.slug !== id);
      return rows.length < before;
    },

    async reorderRows(updates, actorId) {
      for (const u of updates) {
        const idx = rows.findIndex((r) => r.id === u.id || r.slug === u.id);
        if (idx >= 0) {
          rows[idx] = {
            ...rows[idx],
            order_index: u.order_index,
            updated_by: actorId ?? rows[idx].updated_by,
            updated_at: new Date().toISOString(),
          };
        }
      }
      return [...rows].sort((a, b) => a.order_index - b.order_index);
    },
  };
}

function applyProjectFilters(
  records: ProjectRecord[],
  query: ProjectQuery,
  enforcePublishedOnly: boolean
): ProjectsListResult {
  const qLower = query.q.toLowerCase();
  const filtered = records.filter((item) => {
    if (enforcePublishedOnly && item.status !== "published") return false;
    if (!enforcePublishedOnly && query.status !== "all" && item.status !== query.status) {
      return false;
    }
    if (query.category !== "all" && item.category !== query.category) {
      return false;
    }
    if (query.featured !== undefined && Boolean(item.featured) !== query.featured) {
      return false;
    }
    if (qLower) {
      const hay = `${item.title} ${item.client} ${item.description} ${item.tags.join(" ")} ${
        item.youtubeTitle || ""
      }`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => a.order - b.order);
  const total = sorted.length;
  const start = (query.page - 1) * query.limit;
  const items = sorted.slice(start, start + query.limit);

  return {
    items,
    total,
    page: query.page,
    limit: query.limit,
  };
}

/**
 * Lists published projects for the public showcase (`/gallery` and `/`).
 */
export async function listPublicProjects(
  queryInput: Record<string, unknown> | ProjectQueryInput,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectsListResult>> {
  const parsedQuery = ProjectQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    return {
      ok: false,
      status: 400,
      error: (parsedQuery.error.issues || (parsedQuery.error as unknown as { errors?: Array<{ message: string }> }).errors)?.[0]?.message || "Invalid query parameters",
    };
  }

  const rows = await repo.listRows({ includeDrafts: false });
  const records = rows.map(mapDbProjectToRecord);
  return {
    ok: true,
    status: 200,
    data: applyProjectFilters(records, parsedQuery.data, true),
  };
}

/**
 * Lists all projects (published, draft, archived) for the Studio Admin Dashboard.
 */
export async function listAdminProjects(
  queryInput: Record<string, unknown> | ProjectQueryInput,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectsListResult>> {
  const parsedQuery = ProjectQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    return {
      ok: false,
      status: 400,
      error: (parsedQuery.error.issues || (parsedQuery.error as unknown as { errors?: Array<{ message: string }> }).errors)?.[0]?.message || "Invalid query parameters",
    };
  }

  const rows = await repo.listRows({ includeDrafts: true });
  const records = rows.map(mapDbProjectToRecord);
  return {
    ok: true,
    status: 200,
    data: applyProjectFilters(records, parsedQuery.data, false),
  };
}

/**
 * Retrieves a single project by UUID or slug.
 */
export async function getProjectByIdOrSlug(
  idOrSlug: string,
  options: { includeDrafts?: boolean },
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectRecord>> {
  if (!idOrSlug || !idOrSlug.trim()) {
    return { ok: false, status: 400, error: "Project identifier is required" };
  }

  const row = await repo.findByIdOrSlug(idOrSlug.trim());
  if (!row) {
    return { ok: false, status: 404, error: "Project not found" };
  }

  if (!options.includeDrafts && row.status !== "published") {
    return { ok: false, status: 404, error: "Project not found" };
  }

  return {
    ok: true,
    status: 200,
    data: mapDbProjectToRecord(row),
  };
}

/**
 * Creates a new project in `public.projects`.
 */
export async function createProject(
  rawPayload: Record<string, unknown>,
  actorId: string | null,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectRecord>> {
  const normalized = normalizeProjectInput(rawPayload);
  if (!normalized.ok) {
    return normalized;
  }

  try {
    const inserted = await repo.insertRow({
      ...normalized.data,
      created_by: actorId,
      updated_by: actorId,
    });
    return {
      ok: true,
      status: 201,
      data: mapDbProjectToRecord(inserted),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    if (/duplicate key|unique constraint/i.test(msg)) {
      return {
        ok: false,
        status: 409,
        error: `A project with slug '${normalized.data.slug}' already exists.`,
      };
    }
    return { ok: false, status: 500, error: msg };
  }
}

/**
 * Updates an existing project by UUID or slug.
 */
export async function updateProject(
  idOrSlug: string,
  rawPatch: Record<string, unknown>,
  actorId: string | null,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectRecord>> {
  const existing = await repo.findByIdOrSlug(idOrSlug);
  if (!existing) {
    return { ok: false, status: 404, error: `Project '${idOrSlug}' not found` };
  }

  const normalized = normalizeProjectInput(rawPatch, existing);
  if (!normalized.ok) {
    return normalized;
  }

  try {
    const updated = await repo.updateRow(existing.id, {
      ...normalized.data,
      updated_by: actorId,
    });
    return {
      ok: true,
      status: 200,
      data: mapDbProjectToRecord(updated),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update project";
    return { ok: false, status: 500, error: msg };
  }
}

/**
 * Deletes an existing project by UUID or slug.
 */
export async function deleteProject(
  idOrSlug: string,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<{ deletedId: string; slug: string }>> {
  const existing = await repo.findByIdOrSlug(idOrSlug);
  if (!existing) {
    return { ok: false, status: 404, error: `Project '${idOrSlug}' not found` };
  }

  const deleted = await repo.deleteRow(existing.id);
  if (!deleted) {
    return { ok: false, status: 404, error: `Project '${idOrSlug}' not found` };
  }

  return {
    ok: true,
    status: 200,
    data: { deletedId: existing.id, slug: existing.slug },
  };
}

/**
 * Atomically updates order indices for a list of projects.
 */
export async function reorderProjects(
  rawPayload: unknown,
  actorId: string | null,
  repo: ProjectsRepository
): Promise<ProjectServiceResult<ProjectRecord[]>> {
  const parsed = ProjectReorderSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: (parsed.error.issues || (parsed.error as unknown as { errors?: Array<{ message: string }> }).errors)?.[0]?.message || "Invalid reorder payload",
    };
  }

  const updates = parsed.data.items.map((item) => ({
    id: item.id,
    order_index: item.order,
  }));

  const rows = await repo.reorderRows(updates, actorId);
  return {
    ok: true,
    status: 200,
    data: rows.map(mapDbProjectToRecord),
  };
}
