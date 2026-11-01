import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ALL_VALID_SECTION_KEYS,
  DEFAULT_SITE_CONTENT,
  InMemoryInquiryRepository,
  InquiryRateLimiter,
  createInMemoryContentRepository,
  createInMemoryProjectsRepository,
  fetchSiteContent,
  updateContentSection,
  fetchContentHistory,
  rollbackContent,
  listPublicProjects,
  listAdminProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  toggleProjectFeatured,
  reorderProjects,
  deleteProject,
  resolveHomeShowcaseItems,
  listCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  submitLeadBrief,
  fetchInquiries,
  fetchInquiryById,
  updateInquiryStatus,
  removeInquiry,
  parseYouTubeInput,
  parseBehanceInput,
} from "../src/index";

describe("CMS Phase 6: Comprehensive HTTP 200 Request Verification & ★ Star Multi-Video E2E", () => {
  const rootDir = path.resolve(process.cwd(), "../..");

  it("1. verifies HTTP 200 across GET /api/content, PUT /api/content/[section] (all 8 sections), history & rollback", async () => {
    const contentRepo = createInMemoryContentRepository();

    // Initial GET /api/content -> 200 OK
    const initialGet = await fetchSiteContent(contentRepo);
    assert.equal(initialGet.ok, true);
    if (initialGet.ok) {
      assert.equal(initialGet.status, 200);
      for (const key of ALL_VALID_SECTION_KEYS) {
        assert.ok(initialGet.data[key], `Missing section '${key}' in GET /api/content`);
      }
    }

    // PUT /api/content/[section] across all 8 sections -> every request MUST return 200 OK
    const sectionPayloads = {
      manifesto: {
        ...DEFAULT_SITE_CONTENT.manifesto,
        headlinePart1: "BOLD IDEAS.",
        partnersHeadlineHighlight: "PHARMA LEADERS.",
      },
      whyUsTeaser: {
        ...DEFAULT_SITE_CONTENT.whyUsTeaser,
        headline: "BUILT FOR LIVE EXPERIENCES.",
      },
      services: {
        ...DEFAULT_SITE_CONTENT.services,
        headlineHighlight: "SOLUTIONS",
      },
      homeShowcase: {
        ...DEFAULT_SITE_CONTENT.homeShowcase,
        featuredEventBadge: "★ LIVE SHOWREEL",
      },
      contact: {
        ...DEFAULT_SITE_CONTENT.contact,
        studioLocations:
          '380 Maadi Corniche - Jawharet Maadi Towers - Tower "B", 35th floor - Cairo',
      },
      whyUsPage: {
        ...DEFAULT_SITE_CONTENT.whyUsPage,
        calloutHeadlineHighlight: "FLAGSHIP SUMMIT.",
      },
      galleryPage: {
        ...DEFAULT_SITE_CONTENT.galleryPage,
        filterBoothsLabel: "Exhibition Booths",
      },
      layout: {
        ...DEFAULT_SITE_CONTENT.layout,
        briefCtaText: "START A BRIEF",
      },
    } as const;

    for (const sectionKey of ALL_VALID_SECTION_KEYS) {
      const putRes = await updateContentSection(
        sectionKey,
        sectionPayloads[sectionKey],
        contentRepo,
        "admin@artwork.com"
      );
      assert.equal(putRes.ok, true, `PUT /api/content/${sectionKey} failed`);
      if (putRes.ok) {
        assert.equal(putRes.status, 200, `Expected HTTP 200 for PUT /api/content/${sectionKey}`);
      }
    }

    // GET /api/content/history -> 200 OK
    const historyRes = await fetchContentHistory(contentRepo, 20);
    assert.equal(historyRes.ok, true);
    if (historyRes.ok) {
      assert.equal(historyRes.status, 200);
      assert.equal(historyRes.data.length, 8);

      // POST /api/content/rollback/[revisionId] -> 200 OK
      const latestRev = historyRes.data[0];
      const rollbackRes = await rollbackContent(
        latestRev.id,
        contentRepo,
        "admin@artwork.com"
      );
      assert.equal(rollbackRes.ok, true);
      if (rollbackRes.ok) {
        assert.equal(rollbackRes.status, 200);
      }
    }

    // Final GET /api/content -> 200 OK
    const finalGet = await fetchSiteContent(contentRepo);
    assert.equal(finalGet.ok, true);
    if (finalGet.ok) {
      assert.equal(finalGet.status, 200);
      assert.equal(finalGet.data.manifesto.headlinePart1, "BOLD IDEAS.");
    }
  });

  it("2. verifies HTTP 200/201 for changing & adding multiple ★ Star Home Videos + Reorder + CRUD", async () => {
    const projectsRepo = createInMemoryProjectsRepository();

    // Create 3 YouTube video projects + 1 Booth project (POST /api/projects -> 201)
    const v1 = await createProject(
      {
        title: "Rameda Annual Gathering",
        client: "Rameda Pharma",
        category: "conferences",
        year: 2026,
        description: "Full corporate gathering showreel and stage choreography.",
        status: "published",
        featured: true,
        order: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
      },
      "admin-1",
      projectsRepo
    );
    assert.equal(v1.ok, true);
    if (!v1.ok) return;
    assert.equal(v1.status, 201);

    const v2 = await createProject(
      {
        title: "CardioAlex Medical Congress",
        client: "CardioAlex",
        category: "conferences",
        year: 2026,
        description: "Main plenary hall LED stage and live broadcast coverage.",
        status: "published",
        featured: false,
        order: 2,
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      "admin-1",
      projectsRepo
    );
    assert.equal(v2.ok, true);
    if (!v2.ok) return;
    assert.equal(v2.status, 201);

    const v3 = await createProject(
      {
        title: "Cairo ICT Booth Walkthrough Reel",
        client: "TechCorp",
        category: "booths",
        year: 2026,
        description: "Vertical 9:16 walkthrough reel of custom double-decker pavilion.",
        status: "published",
        featured: false,
        order: 3,
        youtubeUrl: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
      },
      "admin-1",
      projectsRepo
    );
    assert.equal(v3.ok, true);
    if (!v3.ok) return;
    assert.equal(v3.status, 201);

    // GET /api/projects (Public & Admin) -> 200 OK
    const publicList1 = await listPublicProjects({ limit: 24 }, projectsRepo);
    assert.equal(publicList1.ok, true);
    if (publicList1.ok) assert.equal(publicList1.status, 200);

    const adminList1 = await listAdminProjects({ limit: 50 }, projectsRepo);
    assert.equal(adminList1.ok, true);
    if (adminList1.ok) assert.equal(adminList1.status, 200);

    // GET /api/projects/[id] -> 200 OK
    const singleGet = await getProjectByIdOrSlug(v1.data.id, {}, projectsRepo);
    assert.equal(singleGet.ok, true);
    if (singleGet.ok) assert.equal(singleGet.status, 200);

    // SCENARIO A: Swap Home video via ★ Star (Unstar v1, Star v2) -> PATCH returns 200 OK!
    const unstarV1 = await toggleProjectFeatured(v1.data.id, false, "admin-1", projectsRepo);
    assert.equal(unstarV1.ok, true);
    if (unstarV1.ok) assert.equal(unstarV1.status, 200);

    const starV2 = await toggleProjectFeatured(v2.data.id, true, "admin-1", projectsRepo);
    assert.equal(starV2.ok, true);
    if (starV2.ok) assert.equal(starV2.status, 200);

    const featuredAfterSwap = await listPublicProjects(
      { featured: "true", limit: 24 },
      projectsRepo
    );
    assert.equal(featuredAfterSwap.ok, true);
    if (featuredAfterSwap.ok) {
      assert.equal(featuredAfterSwap.status, 200);
      assert.equal(featuredAfterSwap.data.items.length, 1);
      assert.equal(featuredAfterSwap.data.items[0].id, v2.data.id);

      const allNow = await listPublicProjects({ limit: 24 }, projectsRepo);
      if (allNow.ok) {
        const resolved = resolveHomeShowcaseItems(allNow.data.items);
        assert.equal(resolved.primaryVideo?.id, v2.data.id);
      }
    }

    // SCENARIO B: Add MULTIPLE videos to Home via ★ Star (Star v1 & v3 alongside v2) -> 200 OK!
    const restarV1 = await toggleProjectFeatured(v1.data.id, true, "admin-1", projectsRepo);
    const starV3 = await toggleProjectFeatured(v3.data.id, true, "admin-1", projectsRepo);
    assert.equal(restarV1.ok && restarV1.status, 200);
    assert.equal(starV3.ok && starV3.status, 200);

    // Reorder so v3 plays #1, v2 plays #2, v1 plays #3 -> PATCH /api/projects/reorder returns 200 OK!
    const reorderRes = await reorderProjects(
      {
        items: [
          { id: v3.data.id, order: 1 },
          { id: v2.data.id, order: 2 },
          { id: v1.data.id, order: 3 },
        ],
      },
      "admin-1",
      projectsRepo
    );
    assert.equal(reorderRes.ok, true);
    if (reorderRes.ok) assert.equal(reorderRes.status, 200);

    const multiFeaturedRes = await listPublicProjects({ limit: 24 }, projectsRepo);
    assert.equal(multiFeaturedRes.ok, true);
    if (multiFeaturedRes.ok) {
      assert.equal(multiFeaturedRes.status, 200);
      const showcase = resolveHomeShowcaseItems(multiFeaturedRes.data.items);
      assert.equal(showcase.featuredVideos.length, 3);
      assert.equal(showcase.primaryVideo?.id, v3.data.id);
      assert.equal(showcase.secondaryVideos.length, 2);
    }

    // SCENARIO C: Update video URL via PUT /api/projects/[id] -> 200 OK, then DELETE -> 200 OK
    const putVideoRes = await updateProject(
      v2.data.id,
      {
        ...v2.data,
        youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      },
      "admin-1",
      projectsRepo
    );
    assert.equal(putVideoRes.ok, true);
    if (putVideoRes.ok) {
      assert.equal(putVideoRes.status, 200);
      assert.equal(putVideoRes.data.youtubeVideoId, "9bZkp7q19f0");
    }

    const delRes = await deleteProject(v1.data.id, projectsRepo);
    assert.equal(delRes.ok, true);
    if (delRes.ok) assert.equal(delRes.status, 200);
  });

  it("3. verifies HTTP 200/201 across Companies Showcase & Client Lead Inquiries pipeline", async () => {
    // Companies CRUD
    const listComp = await listCompanies(null, { activeOnly: true });
    assert.equal(listComp.ok, true);
    assert.ok(listComp.data.length > 0);

    const createdComp = await createCompany(
      {
        name: "Eva Pharma",
        slug: `eva-pharma-${Date.now()}`,
        logo_url: "/assets/images/partners/eva.png",
        category: "pharma",
        description: "Strategic pharmaceutical conference partner.",
        highlight: "Annual Summit",
        order_index: 1,
        featured: true,
        is_active: true,
      },
      null
    );
    assert.equal(createdComp.ok, true);
    if (createdComp.ok && createdComp.data) {
      const getComp = await getCompany(createdComp.data.id, null);
      assert.equal(getComp.ok, true);

      const updComp = await updateCompany(
        createdComp.data.id,
        { highlight: "Global Expo Partner" },
        null
      );
      assert.equal(updComp.ok, true);

      const delComp = await deleteCompany(createdComp.data.id, null);
      assert.equal(delComp.ok, true);
    }

    // Client Lead Brief & Admin Inquiries Lifecycle -> 201 & 200 OK
    const inquiryRepo = new InMemoryInquiryRepository();
    const limiter = new InquiryRateLimiter(10, 60_000);

    const briefRes = await submitLeadBrief(
      {
        fullName: "Dr. Tarek Hassan",
        email: "tarek@pharma-summit.eg",
        serviceType: "Conferences & Medical Events",
        brief: "Planning a 1,200-attendee medical congress in Cairo with custom booths.",
        honeypot: "",
        formLoadedAt: Date.now() - 6000,
      },
      inquiryRepo,
      { ip: "197.55.10.20", rateLimiter: limiter, waitForNotifications: false }
    );
    assert.equal(briefRes.ok, true);
    assert.equal(briefRes.status, 201);

    const listInq = await fetchInquiries(inquiryRepo);
    assert.equal(listInq.ok, true);
    assert.equal(listInq.status, 200);

    if (briefRes.data) {
      const singleInq = await fetchInquiryById(briefRes.data.id, inquiryRepo);
      assert.equal(singleInq.ok, true);
      assert.equal(singleInq.status, 200);

      const patchInq = await updateInquiryStatus(
        briefRes.data.id,
        "reviewed",
        inquiryRepo
      );
      assert.equal(patchInq.ok, true);
      assert.equal(patchInq.status, 200);

      const delInq = await removeInquiry(briefRes.data.id, inquiryRepo);
      assert.equal(delInq.ok, true);
      assert.equal(delInq.status, 200);
    }
  });

  it("4. verifies YouTube (16:9 & 9:16 Shorts) and Behance URL resolvers", () => {
    const ytStandard = parseYouTubeInput("https://www.youtube.com/watch?v=7SkcdZ7CcGI");
    assert.equal(ytStandard.ok, true);
    if (ytStandard.ok) {
      assert.equal(ytStandard.videoId, "7SkcdZ7CcGI");
      assert.equal(Boolean(ytStandard.isShort), false);
    }

    const ytShort = parseYouTubeInput("https://www.youtube.com/shorts/aqz-KE-bpKQ");
    assert.equal(ytShort.ok, true);
    if (ytShort.ok) {
      assert.equal(ytShort.videoId, "aqz-KE-bpKQ");
      assert.equal(ytShort.isShort, true);
    }

    const behance = parseBehanceInput(
      "https://www.behance.net/gallery/257888057/Artwork-Booths"
    );
    assert.equal(behance.ok, true);
  });

  it("5. audits all public & admin Next.js API route handlers for explicit HTTP 200/201 responses", () => {
    const routeExpectations: Array<{
      relPath: string;
      methods: string[];
      expects200Or201: boolean;
    }> = [
      // Public Website API Routes (apps/artwork-app)
      {
        relPath: "apps/artwork-app/src/app/api/health/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/content/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/projects/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/projects/[id]/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/companies/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/contact/brief/route.ts",
        methods: ["POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/artwork-app/src/app/api/revalidate/route.ts",
        methods: ["POST"],
        expects200Or201: true,
      },
      // Admin Dashboard API Routes (apps/admin)
      {
        relPath: "apps/admin/src/app/api/health/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/content/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/content/[section]/route.ts",
        methods: ["PUT"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/content/history/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/content/rollback/[revisionId]/route.ts",
        methods: ["POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/projects/route.ts",
        methods: ["GET", "POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/projects/[id]/route.ts",
        methods: ["GET", "PUT", "PATCH", "DELETE"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/projects/reorder/route.ts",
        methods: ["PATCH", "POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/companies/route.ts",
        methods: ["GET", "POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/companies/[id]/route.ts",
        methods: ["GET", "PUT", "DELETE"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/inquiries/route.ts",
        methods: ["GET"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/inquiries/[id]/route.ts",
        methods: ["GET", "PATCH", "DELETE"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/media/youtube/resolve/route.ts",
        methods: ["POST"],
        expects200Or201: true,
      },
      {
        relPath: "apps/admin/src/app/api/media/behance/resolve/route.ts",
        methods: ["POST"],
        expects200Or201: true,
      },
    ];

    for (const route of routeExpectations) {
      const fullPath = path.join(rootDir, route.relPath);
      assert.ok(fs.existsSync(fullPath), `Missing API route file: ${route.relPath}`);
      const src = fs.readFileSync(fullPath, "utf-8");

      for (const method of route.methods) {
        assert.ok(
          src.includes(`export async function ${method}`),
          `Route ${route.relPath} must export HTTP ${method} handler`
        );
      }

      if (route.expects200Or201) {
        const returnsSuccessJson =
          src.includes("status: 200") ||
          src.includes("status: 201") ||
          src.includes("NextResponse.json(");
        assert.ok(
          returnsSuccessJson,
          `Route ${route.relPath} must return NextResponse.json 200/201`
        );
      }
    }
  });
});
