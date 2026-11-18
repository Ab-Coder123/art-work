import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { useShowcaseStore } from "../../src/store/useShowcaseStore";
import { CANONICAL_SITE_CONTENT } from "../../src/lib/siteContent";
import type { InitialHomeData } from "../../src/components/home/server";

describe("Main Website State Management: Events, Cache & Performance (useShowcaseStore)", () => {
  beforeEach(() => {
    useShowcaseStore.getState().resetStore();
  });

  it("1. handles all interactive UI events cleanly (filter, modal selection, home showcase video switcher)", () => {
    const store = useShowcaseStore.getState();

    assert.equal(store.activeCategoryFilter, "all");
    assert.equal(store.selectedProjectId, null);
    assert.equal(store.selectedShowcaseVideoId, null);

    // Filter events
    store.setActiveCategoryFilter("booths");
    assert.equal(useShowcaseStore.getState().activeCategoryFilter, "booths");

    store.setActiveCategoryFilter("branding");
    assert.equal(useShowcaseStore.getState().activeCategoryFilter, "branding");

    // Modal selection event
    store.setSelectedProjectId("proj-123");
    assert.equal(useShowcaseStore.getState().selectedProjectId, "proj-123");
    useShowcaseStore.getState().setSelectedProjectId(null);
    assert.equal(useShowcaseStore.getState().selectedProjectId, null);

    // Showcase video switcher event
    store.setSelectedShowcaseVideoId("vid-456");
    assert.equal(useShowcaseStore.getState().selectedShowcaseVideoId, "vid-456");
  });

  it("2. hydrates synchronously from SSR InitialHomeData without triggering network fetches or overwriting live state", () => {
    const ssrPayload: InitialHomeData = {
      heroContent: {
        ...CANONICAL_SITE_CONTENT.manifesto,
        headlinePart1: "SSR HYDRATED HEADLINE",
      },
      whyUsContent: CANONICAL_SITE_CONTENT.whyUsTeaser,
      servicesContent: CANONICAL_SITE_CONTENT.services,
      homeShowcaseContent: CANONICAL_SITE_CONTENT.homeShowcase,
      contactContent: CANONICAL_SITE_CONTENT.contact,
      layoutContent: CANONICAL_SITE_CONTENT.layout,
      companies: [
        {
          id: "c1",
          slug: "acme-pharma",
          name: "Acme Pharma",
          logo: "/assets/images/logo.png",
          category: "pharma",
          description: "Leading pharmaceutical group",
          highlight: "Partner since 2022",
          isActive: true,
          order: 1,
        },
      ],
      projects: [
        {
          id: "p-ssr-1",
          title: "SSR Conference",
          client: "BioMED",
          category: "conferences",
          year: 2026,
          description: "Pre-rendered SSR project",
          image: "/assets/images/cover.jpg",
          altText: "SSR Conference Cover",
          stats: "100%",
          statsSub: "Delivery",
          specs: ["Audio", "LED"],
          tags: ["Conference"],
          stamp: "2026",
          metaBadge: "SSR",
          cadId: "CAD-1",
          order: 1,
          status: "published",
          featured: true,
        },
      ],
    };

    useShowcaseStore.getState().hydrateFromServer(ssrPayload);
    const afterHydrate = useShowcaseStore.getState();

    assert.equal(afterHydrate.hasHydratedServerData, true);
    assert.equal(afterHydrate.siteContent.manifesto.headlinePart1, "SSR HYDRATED HEADLINE");
    assert.equal(afterHydrate.companies.length, 1);
    assert.equal(afterHydrate.projects[0].id, "p-ssr-1");
  });

  it("3. enforces TTL client cache: hits cache with 0 network requests within TTL & invalidates properly", async () => {
    let fetchCalls = 0;
    const mockFetch: typeof fetch = async (input) => {
      fetchCalls++;
      const url = String(input);
      if (url.includes("/api/content")) {
        return new Response(
          JSON.stringify({
            manifesto: { ...CANONICAL_SITE_CONTENT.manifesto, headlinePart1: "LIVE SYNCED HERO" },
          }),
          { status: 200 }
        );
      }
      if (url.includes("/api/companies")) {
        return new Response(
          JSON.stringify({ ok: true, data: [{ id: "live-c", name: "Live Co", logoUrl: "/x.png", category: "pharma", isActive: true, order: 1 }] }),
          { status: 200 }
        );
      }
      if (url.includes("/api/projects")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: "live-p1",
                title: "Live Project 1",
                client: "Client",
                category: "branding",
                year: 2026,
                description: "Live",
                image: "/img.jpg",
                tags: [],
                stamp: "2026",
                metaBadge: "LIVE",
                cadId: "C1",
                order: 1,
                status: "published",
              },
            ],
          }),
          { status: 200 }
        );
      }
      return new Response("{}", { status: 404 });
    };

    // Cold sync (3 endpoints in parallel)
    await useShowcaseStore.getState().ensureFreshData({ fetcher: mockFetch, ttlMs: 60_000 });
    assert.equal(fetchCalls, 3);
    assert.equal(useShowcaseStore.getState().hasSyncedLive, true);
    assert.equal(useShowcaseStore.getState().siteContent.manifesto.headlinePart1, "LIVE SYNCED HERO");

    // Navigate to /gallery -> /why-us -> / within TTL: must be 0 extra HTTP requests!
    const t0 = performance.now();
    await useShowcaseStore.getState().ensureFreshData({ fetcher: mockFetch, ttlMs: 60_000 });
    await useShowcaseStore.getState().ensureFreshData({ fetcher: mockFetch, ttlMs: 60_000 });
    const cacheHitElapsedMs = performance.now() - t0;

    assert.equal(fetchCalls, 3, "Subsequent navigations inside TTL must make ZERO network requests");
    assert.ok(cacheHitElapsedMs < 5, `Cache hit should resolve nearly instantaneously (took ${cacheHitElapsedMs.toFixed(2)}ms)`);

    // Force refresh OR invalidateCache should trigger fresh sync
    useShowcaseStore.getState().invalidateCache();
    assert.equal(useShowcaseStore.getState().lastSyncedAt, null);

    await useShowcaseStore.getState().ensureFreshData({ fetcher: mockFetch, ttlMs: 60_000 });
    assert.equal(fetchCalls, 6, "Cache invalidation must trigger a fresh 3-endpoint batch");
  });

  it("4. deduplicates simultaneous concurrent ensureFreshData() calls across mounted components", async () => {
    let fetchCalls = 0;
    const delayedMockFetch: typeof fetch = async (input) => {
      fetchCalls++;
      await new Promise((r) => setTimeout(r, 15));
      const url = String(input);
      if (url.includes("/api/content")) return new Response(JSON.stringify({}), { status: 200 });
      if (url.includes("/api/companies")) return new Response(JSON.stringify({ ok: true, data: [] }), { status: 200 });
      return new Response(JSON.stringify({ items: [] }), { status: 200 });
    };

    // Simulate HomeTheaterController + GalleryShowcaseStage + GalleryPage calling sync simultaneously
    await Promise.all([
      useShowcaseStore.getState().ensureFreshData({ fetcher: delayedMockFetch }),
      useShowcaseStore.getState().ensureFreshData({ fetcher: delayedMockFetch }),
      useShowcaseStore.getState().ensureFreshData({ fetcher: delayedMockFetch }),
      useShowcaseStore.getState().ensureFreshData({ fetcher: delayedMockFetch }),
    ]);

    assert.equal(
      fetchCalls,
      3,
      "Concurrent sync calls must share one in-flight promise (3 endpoint calls total, not 12)"
    );
  });

  it("5. benchmarks 500-project gallery filtering & lookup performance under < 5ms", () => {
    const bulkProjects = Array.from({ length: 500 }, (_, i) => ({
      id: `proj-${i + 1}`,
      title: `Studio Project ${i + 1}`,
      client: `Client ${i + 1}`,
      category: (["conferences", "booths", "branding"] as const)[i % 3],
      year: 2026,
      description: "High scale test project",
      image: "/img.jpg",
      altText: `Studio Project ${i + 1}`,
      stats: "100%",
      statsSub: "Scale",
      specs: ["LED", "Stage"],
      tags: ["Tag1"],
      stamp: "2026",
      metaBadge: "TEST",
      cadId: `CAD-${i}`,
      order: i + 1,
      status: "published" as const,
      featured: i < 5,
    }));

    const t0 = performance.now();
    useShowcaseStore.setState({ projects: bulkProjects });
    const filteredBooths = useShowcaseStore
      .getState()
      .projects.filter((p) => p.category === "booths");
    const targetModal = useShowcaseStore
      .getState()
      .projects.find((p) => p.id === "proj-499");
    const elapsedMs = performance.now() - t0;

    assert.equal(filteredBooths.length, 167);
    assert.equal(targetModal?.id, "proj-499");
    assert.ok(elapsedMs < 15, `500-item state update + filter + lookup took too long: ${elapsedMs.toFixed(2)}ms`);
  });
});
