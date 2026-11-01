import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInMemoryProjectsRepository,
  createProject,
  updateProject,
  toggleProjectFeatured,
  reorderProjects,
  listPublicProjects,
  listAdminProjects,
  resolveHomeShowcaseItems,
} from "../src/index";

describe("CMS Phase 2: ★ Star Home Video & Multi-Video Showcase Engine", () => {
  const actorId = "00000000-0000-4000-8000-000000000001";

  it("1. toggles ★ Star (featured) on projects with HTTP 200 and updates public featured query", async () => {
    const repo = createInMemoryProjectsRepository();

    const p1 = await createProject(
      {
        title: "Rameda Annual Gathering",
        client: "Rameda Pharma",
        category: "conferences",
        description: "Arena-scale medical conference and annual gathering showreel.",
        youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
        status: "published",
        featured: true,
        order: 1,
      },
      actorId,
      repo
    );
    assert.equal(p1.ok, true);
    assert.equal(p1.status, 201);

    const p2 = await createProject(
      {
        title: "Cairo ICT Keynote Stage",
        client: "Vodafone",
        category: "conferences",
        description: "Keynote panoramic LED stage and live broadcast walk-through.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "published",
        featured: false,
        order: 2,
      },
      actorId,
      repo
    );
    assert.equal(p2.ok, true);
    assert.equal(p2.status, 201);

    // Initially only p1 is starred
    let pubFeatured = await listPublicProjects({ featured: true }, repo);
    assert.equal(pubFeatured.ok, true);
    assert.equal(pubFeatured.status, 200);
    if (pubFeatured.ok) {
      assert.equal(pubFeatured.data.total, 1);
      assert.equal(pubFeatured.data.items[0].title, "Rameda Annual Gathering");
    }

    // Star p2 via toggleProjectFeatured -> HTTP 200
    if (p2.ok) {
      const starRes = await toggleProjectFeatured(p2.data.id, true, actorId, repo);
      assert.equal(starRes.ok, true);
      assert.equal(starRes.status, 200);
      if (starRes.ok) {
        assert.equal(starRes.data.featured, true);
      }
    }

    pubFeatured = await listPublicProjects({ featured: true }, repo);
    assert.equal(pubFeatured.ok, true);
    assert.equal(pubFeatured.status, 200);
    if (pubFeatured.ok) {
      assert.equal(pubFeatured.data.total, 2);
    }
  });

  it("2. changes which video appears on Home when unstarring Video A and starring Video B", async () => {
    const repo = createInMemoryProjectsRepository();

    const v1 = await createProject(
      {
        title: "Showreel Alpha",
        client: "Client A",
        category: "conferences",
        description: "First featured video on Home stage.",
        youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
        status: "published",
        featured: true,
        order: 1,
      },
      actorId,
      repo
    );
    const v2 = await createProject(
      {
        title: "Showreel Beta Vertical",
        client: "Client B",
        category: "booths",
        description: "Second vertical video short ready to replace Home video.",
        youtubeUrl: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
        isShort: true,
        status: "published",
        featured: false,
        order: 2,
      },
      actorId,
      repo
    );
    assert.equal(v1.ok && v2.ok, true);
    if (!v1.ok || !v2.ok) return;

    // Unstar Alpha (200) and Star Beta (200)
    const unstarAlpha = await toggleProjectFeatured(v1.data.id, false, actorId, repo);
    const starBeta = await toggleProjectFeatured(v2.data.id, true, actorId, repo);
    assert.equal(unstarAlpha.status, 200);
    assert.equal(starBeta.status, 200);

    const allPublic = await listPublicProjects({ limit: 24 }, repo);
    assert.equal(allPublic.ok, true);
    assert.equal(allPublic.status, 200);
    if (!allPublic.ok) return;

    const home = resolveHomeShowcaseItems(allPublic.data.items);
    assert.equal(home.hasExplicitStarred, true);
    assert.equal(home.featuredVideos.length, 1);
    assert.equal(home.primaryVideo?.title, "Showreel Beta Vertical");
    assert.equal(home.primaryVideo?.isShort, true);
  });

  it("3. supports adding 4+ ★ Starred videos to Home without truncating and respects reorder (HTTP 200)", async () => {
    const repo = createInMemoryProjectsRepository();

    const videos = [
      { slug: "vid-1", title: "Video 01", yt: "https://www.youtube.com/watch?v=7SkcdZ7CcGI", order: 1 },
      { slug: "vid-2", title: "Video 02", yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 2 },
      { slug: "vid-3", title: "Video 03", yt: "https://www.youtube.com/shorts/aqz-KE-bpKQ", order: 3 },
      { slug: "vid-4", title: "Video 04", yt: "https://www.youtube.com/watch?v=M7lc1UVf-VE", order: 4 },
    ];

    for (const v of videos) {
      const created = await createProject(
        {
          slug: v.slug,
          title: v.title,
          client: "Art Work Client",
          category: "conferences",
          description: `Description for ${v.title} showcase video.`,
          youtubeUrl: v.yt,
          status: "published",
          featured: true,
          order: v.order,
        },
        actorId,
        repo
      );
      assert.equal(created.ok, true);
    }

    // Also add an unstarred project to verify it does NOT clutter starred Home items
    await createProject(
      {
        slug: "unstarred-booth",
        title: "Unstarred Booth",
        client: "Expo Corp",
        category: "booths",
        description: "Regular gallery booth not starred for Home.",
        status: "published",
        featured: false,
        order: 5,
      },
      actorId,
      repo
    );

    const list1 = await listPublicProjects({ limit: 24 }, repo);
    assert.equal(list1.ok, true);
    assert.equal(list1.status, 200);
    if (!list1.ok) return;

    const home1 = resolveHomeShowcaseItems(list1.data.items);
    assert.equal(home1.featuredVideos.length, 4, "All 4 starred videos must appear on Home");
    assert.equal(home1.primaryVideo?.id, "vid-1");
    assert.equal(home1.secondaryVideos.length, 3);

    // Reorder so vid-4 becomes #1 on Home -> HTTP 200
    const reordered = await reorderProjects(
      {
        items: [
          { id: "vid-4", order: 1 },
          { id: "vid-1", order: 2 },
          { id: "vid-2", order: 3 },
          { id: "vid-3", order: 4 },
        ],
      },
      actorId,
      repo
    );
    assert.equal(reordered.ok, true);
    assert.equal(reordered.status, 200);

    const list2 = await listPublicProjects({ limit: 24 }, repo);
    if (!list2.ok) return;
    const home2 = resolveHomeShowcaseItems(list2.data.items);
    assert.equal(home2.primaryVideo?.id, "vid-4", "Reordered video #1 must become primary Home video");
  });

  it("4. excludes draft starred videos from public Home while keeping them visible in Admin (HTTP 200)", async () => {
    const repo = createInMemoryProjectsRepository();

    await createProject(
      {
        slug: "secret-draft-video",
        title: "Unreleased Draft Video",
        client: "Stealth Client",
        category: "conferences",
        description: "Draft video marked featured before launch.",
        youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
        status: "draft",
        featured: true,
        order: 1,
      },
      actorId,
      repo
    );

    const adminFeatured = await listAdminProjects({ featured: true }, repo);
    assert.equal(adminFeatured.ok, true);
    assert.equal(adminFeatured.status, 200);
    if (adminFeatured.ok) {
      assert.equal(adminFeatured.data.total, 1);
    }

    const publicFeatured = await listPublicProjects({ featured: true }, repo);
    assert.equal(publicFeatured.ok, true);
    assert.equal(publicFeatured.status, 200);
    if (publicFeatured.ok) {
      assert.equal(publicFeatured.data.total, 0, "Draft starred video must never leak to public");
    }
  });

  it("5. falls back cleanly to top 3 published projects when zero projects are starred", async () => {
    const repo = createInMemoryProjectsRepository();
    for (let i = 1; i <= 4; i++) {
      await createProject(
        {
          slug: `proj-${i}`,
          title: `Project ${i}`,
          client: "Client",
          category: "booths",
          description: `Published project number ${i} without star.`,
          status: "published",
          featured: false,
          order: i,
        },
        actorId,
        repo
      );
    }

    const pub = await listPublicProjects({ limit: 24 }, repo);
    assert.equal(pub.ok, true);
    assert.equal(pub.status, 200);
    if (!pub.ok) return;

    const home = resolveHomeShowcaseItems(pub.data.items);
    assert.equal(home.hasExplicitStarred, false);
    assert.equal(home.showcaseItems.length, 3);

    // Also verify updating YouTube URL on an existing project returns HTTP 200
    const updated = await updateProject(
      "proj-1",
      { youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI", featured: true },
      actorId,
      repo
    );
    assert.equal(updated.ok, true);
    assert.equal(updated.status, 200);
  });
});
