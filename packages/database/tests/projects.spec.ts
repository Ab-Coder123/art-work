import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DbProjectRecord } from "@art-work/types";
import {
  createInMemoryProjectsRepository,
  listPublicProjects,
  listAdminProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../src/projects/service";

const SAMPLE_ROWS: DbProjectRecord[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "neon-horizon",
    title: "Neon Horizon World Tour",
    client: "Global Music Collective",
    category: "stage",
    year: 2025,
    description:
      "A massive arena tour stage scenography bathed in canary yellow laser arrays and 8K LED walls.",
    tags: ["Stage", "Laser"],
    stamp: "STAMP_PASS: ARENA_01",
    meta_badge: "OCT 2025",
    cad_id: "CAD_ID: NH_TOUR_V4",
    cover_image_url: "/assets/images/gallery/project_01_neon_horizon.jpg",
    cover_image_alt: "Neon Horizon World Tour",
    stats_primary: "⚡ 52,000 Fans / Night",
    stats_secondary: "0.0s DMX Latency",
    specs: ["40m Truss Grid"],
    youtube_video_id: "dQw4w9WgXcQ",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_title: "Neon Horizon Arena Stage — Live Showreel",
    youtube_description: "Full arena rehearsal capture.",
    youtube_is_short: false,
    status: "published",
    order_index: 1,
    featured: true,
    created_at: "2026-10-19T10:00:00.000Z",
    updated_at: "2026-10-19T10:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "medtech-summit",
    title: "Global MedTech Summit 2025",
    client: "World Medical Technology Forum",
    category: "conferences",
    year: 2025,
    description:
      "Ultra-sleek double-decker medical conference pavilion with interactive digital demo kiosks.",
    tags: ["Medical", "Conferences"],
    stamp: "SUMMIT_ID: MED_25",
    meta_badge: "VENUE: GENEVA EXPO",
    cad_id: "REV: PAVILION_STAGE3",
    cover_image_url: "/assets/images/gallery/project_02_medtech_summit.jpg",
    cover_image_alt: "Global MedTech Summit",
    stats_primary: "🏥 14,000 Delegates",
    stats_secondary: "6 Plenary Stages",
    specs: ["6 Simultaneous Plenary Streams"],
    youtube_video_id: "aqz-KE-bpKQ",
    youtube_url: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
    youtube_title: "60-Second Behind-The-Scenes Reel",
    youtube_description: "Vertical 9:16 time-lapse Reel in Geneva.",
    youtube_is_short: true,
    status: "published",
    order_index: 2,
    featured: true,
    created_at: "2026-10-19T11:00:00.000Z",
    updated_at: "2026-10-19T11:00:00.000Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "stealth-draft-stage",
    title: "Stealth Prototype Rig",
    client: "Secret Lab",
    category: "tech",
    year: 2026,
    description: "Confidential prototype stage rig currently in draft status.",
    tags: ["Prototype"],
    stamp: "DRAFT_01",
    meta_badge: "INTERNAL",
    cad_id: "CAD_ID: PROTO_01",
    cover_image_url: "/assets/images/gallery/project_05_arena_genesis.jpg",
    cover_image_alt: "Stealth Prototype",
    stats_primary: "🔒 NDA",
    stats_secondary: "Internal Test",
    specs: ["Confidential"],
    status: "draft",
    order_index: 3,
    featured: false,
    created_at: "2026-10-19T12:00:00.000Z",
    updated_at: "2026-10-19T12:00:00.000Z",
  },
];

describe("Phase 06: Gallery Projects CRUD, Filtering & Reorder Service", () => {
  it("should return only published projects on listPublicProjects and support category/search/pagination", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const allPublic = await listPublicProjects({}, repo);
    assert.ok(allPublic.ok);
    if (allPublic.ok) {
      assert.equal(allPublic.data.total, 2);
      assert.equal(allPublic.data.items.length, 2);
      assert.ok(allPublic.data.items.every((p) => p.status === "published"));
    }

    const byCategory = await listPublicProjects({ category: "conferences" }, repo);
    assert.ok(byCategory.ok);
    if (byCategory.ok) {
      assert.equal(byCategory.data.total, 1);
      assert.equal(byCategory.data.items[0].id, "medtech-summit");
      assert.equal(byCategory.data.items[0].isShort, true);
    }

    const bySearch = await listPublicProjects({ q: "Timecode" }, repo);
    assert.ok(bySearch.ok);

    const paged = await listPublicProjects({ page: 2, limit: 1 }, repo);
    assert.ok(paged.ok);
    if (paged.ok) {
      assert.equal(paged.data.total, 2);
      assert.equal(paged.data.items.length, 1);
      assert.equal(paged.data.items[0].id, "medtech-summit");
    }
  });

  it("should return all projects (including drafts) on listAdminProjects", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);
    const res = await listAdminProjects({}, repo);
    assert.ok(res.ok);
    if (res.ok) {
      assert.equal(res.data.total, 3);
    }

    const draftsOnly = await listAdminProjects({ status: "draft" }, repo);
    assert.ok(draftsOnly.ok);
    if (draftsOnly.ok) {
      assert.equal(draftsOnly.data.total, 1);
      assert.equal(draftsOnly.data.items[0].id, "stealth-draft-stage");
    }
  });

  it("should hide draft projects from public getProjectByIdOrSlug while exposing them to admin", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const publicDraft = await getProjectByIdOrSlug(
      "stealth-draft-stage",
      { includeDrafts: false },
      repo
    );
    assert.equal(publicDraft.ok, false);
    if (!publicDraft.ok) {
      assert.equal(publicDraft.status, 404);
    }

    const adminDraft = await getProjectByIdOrSlug(
      "stealth-draft-stage",
      { includeDrafts: true },
      repo
    );
    assert.equal(adminDraft.ok, true);
  });

  it("should create a new project from camelCase UI payload and normalize YouTube Shorts metadata", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);
    const adminUuid = "526191ee-4398-4617-ad66-30734ada24d3";

    const res = await createProject(
      {
        id: "quantum-dome-2026",
        title: "Quantum Dome 360 Arena",
        client: "Future Live Corp",
        category: "led",
        year: 2026,
        description:
          "Full 360-degree geodesic projection dome with spatial audio and synchronized kinetic winches.",
        tags: ["360 LED", "Spatial Audio"],
        stamp: "STAMP_PASS: DOME_09",
        metaBadge: "DEC 2026",
        cadId: "CAD_ID: QD_360",
        image: "/assets/images/gallery/project_06_sensory_expo.jpg",
        altText: "Quantum Dome 360 Arena",
        stats: "🌐 360° Projection",
        statsSub: "16K Resolution • 64 Audio Channels",
        specs: ["Geodesic Steel Frame", "64-Ch L-ISA Audio"],
        status: "published",
        order: 4,
        featured: true,
        youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        youtubeTitle: "Quantum Dome 60s Vertical Reel",
        youtubeDescription: "Rapid dome erection and projection mapping alignment test.",
      },
      adminUuid,
      repo
    );

    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.status, 201);
      assert.equal(res.data.id, "quantum-dome-2026");
      assert.equal(res.data.youtubeVideoId, "dQw4w9WgXcQ");
      assert.equal(res.data.isShort, true);
      assert.equal(res.data.youtubeUrl, "https://www.youtube.com/shorts/dQw4w9WgXcQ");
      assert.equal(res.data.youtubeTitle, "Quantum Dome 60s Vertical Reel");
    }
  });

  it("should reject raw iframe HTML in youtubeUrl (422) and duplicate slugs (409)", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const badYt = await createProject(
      {
        id: "xss-attempt",
        title: "Bad Embed Project",
        client: "Test Client",
        category: "stage",
        description: "Attempting to inject raw iframe HTML snippet into youtubeUrl.",
        youtubeUrl: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
      },
      null,
      repo
    );
    assert.equal(badYt.ok, false);
    if (!badYt.ok) {
      assert.equal(badYt.status, 422);
    }

    const dupSlug = await createProject(
      {
        id: "neon-horizon",
        title: "Duplicate Slug Project",
        client: "Test Client",
        category: "stage",
        description: "Attempting to create a project with an existing slug.",
      },
      null,
      repo
    );
    assert.equal(dupSlug.ok, false);
    if (!dupSlug.ok) {
      assert.equal(dupSlug.status, 409);
    }
  });

  it("should update an existing project and return 404 for unknown IDs", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const updated = await updateProject(
      "neon-horizon",
      {
        title: "Neon Horizon World Tour (2026 Encore)",
        status: "draft",
      },
      "526191ee-4398-4617-ad66-30734ada24d3",
      repo
    );
    assert.equal(updated.ok, true);
    if (updated.ok) {
      assert.equal(updated.data.title, "Neon Horizon World Tour (2026 Encore)");
      assert.equal(updated.data.status, "draft");
    }

    const missing = await updateProject("non-existent-id", { title: "Nope" }, null, repo);
    assert.equal(missing.ok, false);
    if (!missing.ok) {
      assert.equal(missing.status, 404);
    }
  });

  it("should atomically reorder projects and reject duplicate order indices", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const reordered = await reorderProjects(
      {
        items: [
          { id: "medtech-summit", order: 1 },
          { id: "neon-horizon", order: 2 },
          { id: "stealth-draft-stage", order: 3 },
        ],
      },
      null,
      repo
    );
    assert.equal(reordered.ok, true);
    if (reordered.ok) {
      assert.equal(reordered.data[0].id, "medtech-summit");
      assert.equal(reordered.data[0].order, 1);
      assert.equal(reordered.data[1].id, "neon-horizon");
      assert.equal(reordered.data[1].order, 2);
    }

    const duplicateOrder = await reorderProjects(
      {
        items: [
          { id: "medtech-summit", order: 1 },
          { id: "neon-horizon", order: 1 },
        ],
      },
      null,
      repo
    );
    assert.equal(duplicateOrder.ok, false);
    if (!duplicateOrder.ok) {
      assert.equal(duplicateOrder.status, 400);
    }
  });

  it("should delete an existing project and return 404 when deleting a missing project", async () => {
    const repo = createInMemoryProjectsRepository(SAMPLE_ROWS);

    const delOk = await deleteProject("stealth-draft-stage", repo);
    assert.equal(delOk.ok, true);

    const delAgain = await deleteProject("stealth-draft-stage", repo);
    assert.equal(delAgain.ok, false);
    if (!delAgain.ok) {
      assert.equal(delAgain.status, 404);
    }
  });

  it("should filter exhibition booth projects and return 200 with booth items from repository", async () => {
    const boothRow: DbProjectRecord = {
      id: "44444444-4444-4444-8444-444444444444",
      slug: "nova-medtech-booth",
      title: "Nova MedTech Custom Pavilion",
      client: "Nova MedTech Innovations",
      category: "booths",
      year: 2025,
      description: "Turnkey custom exhibition booth with 3D spatial design, CNC woodwork, and integrated touch kiosks.",
      tags: ["Exhibition Booth", "Custom Fabrication", "3D Spatial Design"],
      stamp: "BOOTH_PASS: MED_EXPO_25",
      meta_badge: "36M² CUSTOM BUILD",
      cad_id: "CAD_ID: BOOTH_NOVA_V3",
      cover_image_url: "/assets/images/gallery/project_06_sensory_expo.jpg",
      cover_image_alt: "Nova MedTech Custom Exhibition Booth",
      stats_primary: "🏛️ 36m² Island Stand",
      stats_secondary: "Custom CNC Woodwork • Integrated LED Kiosks",
      specs: ["Precision CNC Joinery", "Interactive Kiosks"],
      status: "published",
      order_index: 1,
      featured: true,
      created_at: "2026-10-19T13:00:00.000Z",
      updated_at: "2026-10-19T13:00:00.000Z",
    };

    const repo = createInMemoryProjectsRepository([boothRow]);
    const res = await listPublicProjects({ category: "booths" }, repo);

    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.data.total, 1);
      assert.equal(res.data.items.length, 1);
      assert.equal(res.data.items[0].id, "nova-medtech-booth");
      assert.equal(res.data.items[0].category, "booths");
      assert.equal(res.data.items[0].status, "published");
      assert.ok(res.data.items[0].specs.includes("Precision CNC Joinery"));
    }
  });
});
