import path from "path";
import { SiteContent, ProjectRecord, ProjectCategory, PublicationStatus } from "@/types/content";
import { SEED_SITE_CONTENT, SEED_PROJECTS } from "@/data/seedContent";

// Runtime path resolution for persistent JSON files
const DATA_DIR = path.join(process.cwd(), "src", "data");
const SITE_CONTENT_PATH = path.join(DATA_DIR, "siteContent.json");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");

// In-memory cache for fast read access and client/edge fallbacks
let cachedContent: SiteContent | null = null;
let cachedProjects: ProjectRecord[] | null = null;

/**
 * Safely reads a JSON file from disk with fallback to memory/seed.
 */
async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  if (typeof window !== "undefined") {
    return fallback;
  }
  try {
    const fs = await import("fs/promises");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(`[contentStore] Warning reading ${filePath}:`, error);
    return fallback;
  }
}

/**
 * Safely writes a JSON file to disk and updates in-memory cache.
 */
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  if (typeof window !== "undefined") {
    return;
  }
  const fs = await import("fs/promises");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/* =========================================================================
   SITE CONTENT API
   ========================================================================= */

/**
 * Fetches the current site content (manifesto, teaser, contact, why-us).
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (cachedContent) {
    return cachedContent;
  }
  const content = await readJsonFile<SiteContent>(SITE_CONTENT_PATH, SEED_SITE_CONTENT);
  cachedContent = content;
  return content;
}

/**
 * Synchronous accessor for fast initial renders / SSR fallbacks.
 */
export function getSiteContentSync(): SiteContent {
  return cachedContent || SEED_SITE_CONTENT;
}

/**
 * Updates site content partially and persists to disk.
 */
export async function updateSiteContent(
  updates: Partial<SiteContent>
): Promise<SiteContent> {
  const current = await getSiteContent();

  const merged: SiteContent = {
    ...current,
    ...updates,
    manifesto: {
      ...current.manifesto,
      ...(updates.manifesto || {}),
      starburstText: {
        ...current.manifesto.starburstText,
        ...(updates.manifesto?.starburstText || {}),
      },
      metrics: updates.manifesto?.metrics || current.manifesto.metrics,
    },
    whyUsTeaser: {
      ...current.whyUsTeaser,
      ...(updates.whyUsTeaser || {}),
      bentoCards: updates.whyUsTeaser?.bentoCards || current.whyUsTeaser.bentoCards,
      blueprint: {
        ...current.whyUsTeaser.blueprint,
        ...(updates.whyUsTeaser?.blueprint || {}),
      },
    },
    contact: {
      ...current.contact,
      ...(updates.contact || {}),
      formFields: updates.contact?.formFields || current.contact.formFields,
    },
    whyUsPage: {
      ...current.whyUsPage,
      ...(updates.whyUsPage || {}),
      doodleStickers: updates.whyUsPage?.doodleStickers || current.whyUsPage.doodleStickers,
      metrics: updates.whyUsPage?.metrics || current.whyUsPage.metrics,
    },
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(SITE_CONTENT_PATH, merged);
  cachedContent = merged;
  return merged;
}

/* =========================================================================
   GALLERY PROJECTS API
   ========================================================================= */

/**
 * Retrieves all gallery projects with optional category and publication filtering.
 */
export async function getProjects(options?: {
  category?: ProjectCategory;
  status?: PublicationStatus | "all";
  query?: string;
}): Promise<ProjectRecord[]> {
  let list = cachedProjects;
  if (!list) {
    list = await readJsonFile<ProjectRecord[]>(PROJECTS_PATH, SEED_PROJECTS);
    cachedProjects = list;
  }

  let filtered = [...list];

  // Filter by category
  if (options?.category && options.category !== "all") {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  // Filter by status (default returns published only unless "all" or explicit "draft")
  if (options?.status && options.status !== "all") {
    filtered = filtered.filter((p) => p.status === options.status);
  } else if (!options?.status) {
    // By default, public queries get published projects only
    filtered = filtered.filter((p) => p.status === "published");
  }

  // Filter by search query
  if (options?.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort by order ascending
  return filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Retrieves a single project record by its unique ID.
 */
export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const projects = await getProjects({ status: "all" });
  return projects.find((p) => p.id === id) || null;
}

/**
 * Creates and persists a new gallery project record.
 */
export async function createProject(
  data: Omit<ProjectRecord, "id" | "order"> & { id?: string; order?: number }
): Promise<ProjectRecord> {
  const projects = await getProjects({ status: "all" });

  // Generate clean slug ID if not provided
  const generatedId =
    data.id && data.id.trim().length > 0
      ? data.id
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

  // Prevent duplicate ID collision
  if (projects.some((p) => p.id === generatedId)) {
    throw new Error(`Project ID "${generatedId}" already exists. Please choose a unique title or ID.`);
  }

  const nextOrder =
    typeof data.order === "number"
      ? data.order
      : projects.length > 0
      ? Math.max(...projects.map((p) => p.order ?? 0)) + 1
      : 1;

  const now = new Date().toISOString();
  const newProject: ProjectRecord = {
    ...data,
    id: generatedId,
    order: nextOrder,
    status: data.status || "published",
    createdAt: now,
    updatedAt: now,
  };

  const updatedProjects = [...projects, newProject].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  await writeJsonFile(PROJECTS_PATH, updatedProjects);
  cachedProjects = updatedProjects;
  return newProject;
}

/**
 * Updates an existing project record by its ID.
 */
export async function updateProject(
  id: string,
  updates: Partial<ProjectRecord>
): Promise<ProjectRecord> {
  const projects = await getProjects({ status: "all" });
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Project with ID "${id}" was not found.`);
  }

  const updated: ProjectRecord = {
    ...projects[index],
    ...updates,
    id: projects[index].id, // Prevent changing ID through updates to maintain reference integrity
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;

  await writeJsonFile(PROJECTS_PATH, projects);
  cachedProjects = projects;
  return updated;
}

/**
 * Deletes a project record by its ID.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects({ status: "all" });
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) {
    return false; // Nothing was deleted
  }

  // Re-normalize order indexes
  const normalized = filtered.map((p, idx) => ({
    ...p,
    order: idx + 1,
  }));

  await writeJsonFile(PROJECTS_PATH, normalized);
  cachedProjects = normalized;
  return true;
}

/**
 * Reorders projects given an array of ordered project IDs.
 */
export async function reorderProjects(orderedIds: string[]): Promise<ProjectRecord[]> {
  const projects = await getProjects({ status: "all" });
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const reordered: ProjectRecord[] = [];
  orderedIds.forEach((id, index) => {
    const proj = projectMap.get(id);
    if (proj) {
      reordered.push({ ...proj, order: index + 1 });
      projectMap.delete(id);
    }
  });

  // Append any projects not explicitly in orderedIds
  projectMap.forEach((proj) => {
    reordered.push({ ...proj, order: reordered.length + 1 });
  });

  await writeJsonFile(PROJECTS_PATH, reordered);
  cachedProjects = reordered;
  return reordered;
}

/**
 * Resets site content and projects back to authoritative default seeds.
 */
export async function resetToSeed(): Promise<void> {
  await writeJsonFile(SITE_CONTENT_PATH, SEED_SITE_CONTENT);
  await writeJsonFile(PROJECTS_PATH, SEED_PROJECTS);
  cachedContent = SEED_SITE_CONTENT;
  cachedProjects = SEED_PROJECTS;
}
