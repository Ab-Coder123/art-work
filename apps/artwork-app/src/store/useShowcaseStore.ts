import { create } from "zustand";
import {
  DEFAULT_COMPANIES,
  type CompanyRecord,
  type ProjectCategory,
  type ProjectRecord,
  type SiteContent,
} from "@art-work/types";
import { CANONICAL_SITE_CONTENT } from "@/lib/siteContent";
import { SEED_PROJECTS } from "@/data/seedContent";
import type { InitialHomeData } from "@/components/home/server";

export const DEFAULT_CACHE_TTL_MS = 60_000; // 60 seconds client-side cache window

export interface ShowcaseSyncOptions {
  force?: boolean;
  ttlMs?: number;
  fetcher?: typeof fetch;
}

export interface ShowcaseState {
  // Core domain data
  siteContent: SiteContent;
  companies: CompanyRecord[];
  projects: ProjectRecord[];

  // Cache & synchronization telemetry
  hasHydratedServerData: boolean;
  hasSyncedLive: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  syncError: string | null;

  // UI Interaction State (Persists seamlessly across route transitions)
  activeCategoryFilter: ProjectCategory;
  selectedProjectId: string | null;
  selectedShowcaseVideoId: string | null;

  // Actions
  hydrateFromServer: (data: InitialHomeData) => void;
  ensureFreshData: (options?: ShowcaseSyncOptions) => Promise<void>;
  setActiveCategoryFilter: (category: ProjectCategory) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedShowcaseVideoId: (id: string | null) => void;
  invalidateCache: () => void;
  resetStore: () => void;
}

// Module-scoped promise for in-flight request deduplication
let inFlightSyncPromise: Promise<void> | null = null;

function mergeSiteContent(
  prev: SiteContent,
  incoming: Partial<SiteContent> | null | undefined
): SiteContent {
  if (!incoming || typeof incoming !== "object") return prev;
  return {
    ...prev,
    manifesto: incoming.manifesto
      ? { ...prev.manifesto, ...incoming.manifesto }
      : prev.manifesto,
    whyUsTeaser: incoming.whyUsTeaser
      ? {
          ...prev.whyUsTeaser,
          ...incoming.whyUsTeaser,
          blueprint: {
            ...prev.whyUsTeaser.blueprint,
            ...(incoming.whyUsTeaser.blueprint || {}),
          },
        }
      : prev.whyUsTeaser,
    services: incoming.services
      ? { ...prev.services, ...incoming.services }
      : prev.services,
    homeShowcase: incoming.homeShowcase
      ? { ...prev.homeShowcase, ...incoming.homeShowcase }
      : prev.homeShowcase,
    contact: incoming.contact
      ? { ...prev.contact, ...incoming.contact }
      : prev.contact,
    whyUsPage: incoming.whyUsPage
      ? { ...prev.whyUsPage, ...incoming.whyUsPage }
      : prev.whyUsPage,
    galleryPage: incoming.galleryPage
      ? { ...prev.galleryPage, ...incoming.galleryPage }
      : prev.galleryPage,
    layout: incoming.layout
      ? { ...prev.layout, ...incoming.layout }
      : prev.layout,
  };
}

export const useShowcaseStore = create<ShowcaseState>((set, get) => ({
  siteContent: CANONICAL_SITE_CONTENT,
  companies: DEFAULT_COMPANIES,
  projects: SEED_PROJECTS,

  hasHydratedServerData: false,
  hasSyncedLive: false,
  isSyncing: false,
  lastSyncedAt: null,
  syncError: null,

  activeCategoryFilter: "all",
  selectedProjectId: null,
  selectedShowcaseVideoId: null,

  hydrateFromServer: (data) => {
    const state = get();
    // Avoid overwriting fresher client-synced state unless store hasn't been hydrated yet
    if (state.hasSyncedLive) return;

    set((prev) => ({
      hasHydratedServerData: true,
      lastSyncedAt: prev.lastSyncedAt ?? Date.now(),
      companies:
        Array.isArray(data.companies) && data.companies.length > 0
          ? data.companies
          : prev.companies,
      projects:
        Array.isArray(data.projects) && data.projects.length > 0
          ? data.projects
          : prev.projects,
      siteContent: {
        ...prev.siteContent,
        manifesto: data.heroContent
          ? { ...prev.siteContent.manifesto, ...data.heroContent }
          : prev.siteContent.manifesto,
        whyUsTeaser: data.whyUsContent
          ? {
              ...prev.siteContent.whyUsTeaser,
              ...data.whyUsContent,
              blueprint: {
                ...prev.siteContent.whyUsTeaser.blueprint,
                ...(data.whyUsContent.blueprint || {}),
              },
            }
          : prev.siteContent.whyUsTeaser,
        services: data.servicesContent
          ? { ...prev.siteContent.services, ...data.servicesContent }
          : prev.siteContent.services,
        homeShowcase: data.homeShowcaseContent
          ? { ...prev.siteContent.homeShowcase, ...data.homeShowcaseContent }
          : prev.siteContent.homeShowcase,
        contact: data.contactContent
          ? { ...prev.siteContent.contact, ...data.contactContent }
          : prev.siteContent.contact,
        layout: data.layoutContent
          ? { ...prev.siteContent.layout, ...data.layoutContent }
          : prev.siteContent.layout,
      },
    }));
  },

  ensureFreshData: async (options = {}) => {
    const {
      force = false,
      ttlMs = DEFAULT_CACHE_TTL_MS,
      fetcher = globalThis.fetch,
    } = options;

    const state = get();
    const now = Date.now();
    const isWithinTtl =
      state.hasSyncedLive &&
      state.lastSyncedAt !== null &&
      now - state.lastSyncedAt < ttlMs;

    // Cache hit: skip redundant network requests when fresh data is already available
    if (!force && isWithinTtl) {
      return;
    }

    // Deduplicate concurrent requests across multiple mounted components
    if (inFlightSyncPromise && !force) {
      return inFlightSyncPromise;
    }

    set({ isSyncing: true, syncError: null });

    const runSync = async () => {
      try {
        const [contentRes, companiesRes, projectsRes] = await Promise.allSettled([
          fetcher("/api/content", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          fetcher("/api/companies", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          fetcher("/api/projects?limit=500", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
        ]);

        const incomingContent =
          contentRes.status === "fulfilled"
            ? (contentRes.value as Partial<SiteContent> | null)
            : null;
        const companiesPayload =
          companiesRes.status === "fulfilled" ? companiesRes.value : null;
        const projectsPayload =
          projectsRes.status === "fulfilled" ? projectsRes.value : null;

        const nextCompanies =
          companiesPayload?.ok &&
          Array.isArray(companiesPayload.data) &&
          companiesPayload.data.length > 0
            ? (companiesPayload.data as CompanyRecord[])
            : null;

        const nextProjects =
          Array.isArray(projectsPayload?.items) && projectsPayload.items.length > 0
            ? (projectsPayload.items as ProjectRecord[])
            : null;

        set((prev) => ({
          siteContent: mergeSiteContent(prev.siteContent, incomingContent),
          companies: nextCompanies || prev.companies,
          projects: nextProjects || prev.projects,
          hasSyncedLive: true,
          isSyncing: false,
          lastSyncedAt: Date.now(),
          syncError: null,
        }));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to synchronize platform data";
        set({ isSyncing: false, syncError: message });
      } finally {
        inFlightSyncPromise = null;
      }
    };

    inFlightSyncPromise = runSync();
    return inFlightSyncPromise;
  },

  setActiveCategoryFilter: (category) => set({ activeCategoryFilter: category }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedShowcaseVideoId: (id) => set({ selectedShowcaseVideoId: id }),
  invalidateCache: () => set({ lastSyncedAt: null, hasSyncedLive: false }),

  resetStore: () => {
    inFlightSyncPromise = null;
    set({
      siteContent: CANONICAL_SITE_CONTENT,
      companies: DEFAULT_COMPANIES,
      projects: SEED_PROJECTS,
      hasHydratedServerData: false,
      hasSyncedLive: false,
      isSyncing: false,
      lastSyncedAt: null,
      syncError: null,
      activeCategoryFilter: "all",
      selectedProjectId: null,
      selectedShowcaseVideoId: null,
    });
  },
}));
