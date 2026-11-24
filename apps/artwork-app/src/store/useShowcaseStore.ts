import { create } from "zustand";
import {
  DEFAULT_COMPANIES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  isValidLocale,
  type BilingualSiteContent,
  type CompanyRecord,
  type Locale,
  type ProjectCategory,
  type ProjectRecord,
  type SiteContent,
} from "@art-work/types";
import {
  CANONICAL_BILINGUAL_CONTENT,
  CANONICAL_SITE_CONTENT,
  CANONICAL_SITE_CONTENT_AR,
} from "@/lib/siteContent";
import { SEED_PROJECTS } from "@/data/seedContent";
import type { InitialHomeData } from "@/components/home/server";

export const DEFAULT_CACHE_TTL_MS = 60_000; // 60 seconds client-side cache window

export interface ShowcaseSyncOptions {
  force?: boolean;
  ttlMs?: number;
  fetcher?: typeof fetch;
}

export interface ShowcaseState {
  // Active Locale & Bilingual Core Domain Data
  locale: Locale;
  siteContentByLocale: BilingualSiteContent;
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
  setLocale: (locale: Locale) => void;
  hydrateLocaleFromDom: () => void;
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

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  try {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    window.localStorage.setItem(LOCALE_COOKIE_NAME, locale);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export const useShowcaseStore = create<ShowcaseState>((set, get) => ({
  locale: DEFAULT_LOCALE,
  siteContentByLocale: CANONICAL_BILINGUAL_CONTENT,
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

  setLocale: (nextLocale) => {
    const safeLocale: Locale = isValidLocale(nextLocale) ? nextLocale : DEFAULT_LOCALE;
    applyDocumentLocale(safeLocale);
    set((prev) => ({
      locale: safeLocale,
      siteContent: prev.siteContentByLocale[safeLocale] || prev.siteContent,
    }));
  },

  hydrateLocaleFromDom: () => {
    if (typeof document === "undefined") return;
    const htmlLang = document.documentElement.lang;
    let detected: Locale | null = isValidLocale(htmlLang) ? htmlLang : null;
    if (!detected) {
      try {
        const stored = window.localStorage.getItem(LOCALE_COOKIE_NAME);
        if (isValidLocale(stored)) detected = stored;
      } catch {
        // Ignore
      }
    }
    if (detected && detected !== get().locale) {
      applyDocumentLocale(detected);
      set((prev) => ({
        locale: detected!,
        siteContent: prev.siteContentByLocale[detected!] || prev.siteContent,
      }));
    }
  },

  hydrateFromServer: (data) => {
    const state = get();
    // Avoid overwriting fresher client-synced state unless store hasn't been hydrated yet
    if (state.hasSyncedLive) return;

    const activeLocale: Locale = isValidLocale(data.locale) ? data.locale : state.locale;

    set((prev) => {
      const nextByLocale: BilingualSiteContent = data.bilingualContent
        ? {
            en: mergeSiteContent(prev.siteContentByLocale.en, data.bilingualContent.en),
            ar: mergeSiteContent(prev.siteContentByLocale.ar, data.bilingualContent.ar),
          }
        : {
            ...prev.siteContentByLocale,
            [activeLocale]: {
              ...prev.siteContentByLocale[activeLocale],
              manifesto: data.heroContent
                ? { ...prev.siteContentByLocale[activeLocale].manifesto, ...data.heroContent }
                : prev.siteContentByLocale[activeLocale].manifesto,
              whyUsTeaser: data.whyUsContent
                ? {
                    ...prev.siteContentByLocale[activeLocale].whyUsTeaser,
                    ...data.whyUsContent,
                    blueprint: {
                      ...prev.siteContentByLocale[activeLocale].whyUsTeaser.blueprint,
                      ...(data.whyUsContent.blueprint || {}),
                    },
                  }
                : prev.siteContentByLocale[activeLocale].whyUsTeaser,
              services: data.servicesContent
                ? { ...prev.siteContentByLocale[activeLocale].services, ...data.servicesContent }
                : prev.siteContentByLocale[activeLocale].services,
              homeShowcase: data.homeShowcaseContent
                ? {
                    ...prev.siteContentByLocale[activeLocale].homeShowcase,
                    ...data.homeShowcaseContent,
                  }
                : prev.siteContentByLocale[activeLocale].homeShowcase,
              contact: data.contactContent
                ? { ...prev.siteContentByLocale[activeLocale].contact, ...data.contactContent }
                : prev.siteContentByLocale[activeLocale].contact,
              layout: data.layoutContent
                ? { ...prev.siteContentByLocale[activeLocale].layout, ...data.layoutContent }
                : prev.siteContentByLocale[activeLocale].layout,
            },
          };

      return {
        locale: activeLocale,
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
        siteContentByLocale: nextByLocale,
        siteContent: nextByLocale[activeLocale],
      };
    });
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
          fetcher("/api/content?includeLocales=true", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          fetcher("/api/companies", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          fetcher("/api/projects?limit=500", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
        ]);

        const rawContentPayload =
          contentRes.status === "fulfilled"
            ? (contentRes.value as
                | Partial<BilingualSiteContent>
                | Partial<SiteContent>
                | null)
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

        set((prev) => {
          const isBilingualPayload =
            rawContentPayload &&
            typeof rawContentPayload === "object" &&
            ("en" in rawContentPayload || "ar" in rawContentPayload);

          const nextByLocale: BilingualSiteContent = isBilingualPayload
            ? {
                en: mergeSiteContent(
                  prev.siteContentByLocale.en,
                  (rawContentPayload as Partial<BilingualSiteContent>).en
                ),
                ar: mergeSiteContent(
                  prev.siteContentByLocale.ar || CANONICAL_SITE_CONTENT_AR,
                  (rawContentPayload as Partial<BilingualSiteContent>).ar
                ),
              }
            : {
                ...prev.siteContentByLocale,
                en: mergeSiteContent(
                  prev.siteContentByLocale.en,
                  rawContentPayload as Partial<SiteContent> | null
                ),
              };

          return {
            siteContentByLocale: nextByLocale,
            siteContent: nextByLocale[prev.locale],
            companies: nextCompanies || prev.companies,
            projects: nextProjects || prev.projects,
            hasSyncedLive: true,
            isSyncing: false,
            lastSyncedAt: Date.now(),
            syncError: null,
          };
        });
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
      locale: DEFAULT_LOCALE,
      siteContentByLocale: CANONICAL_BILINGUAL_CONTENT,
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
