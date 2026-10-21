import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInMemoryContentRepository,
  fetchSiteContent,
  updateContentSection,
  fetchContentHistory,
  rollbackContent,
  validateSectionPayload,
  DEFAULT_SITE_CONTENT,
} from "../src/index";

describe("Phase 07: Site Content Versioning & Dynamic Content API", () => {
  it("should fetch complete site content tree conforming to SiteContent schema", async () => {
    const repo = createInMemoryContentRepository();
    const result = await fetchSiteContent(repo);

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(typeof result.data.version, "string");
    assert.equal(typeof result.data.updatedAt, "string");

    // Assert Manifesto
    assert.equal(result.data.manifesto.headlinePart1, "CREATIVE IDEAS.");
    assert.equal(result.data.manifesto.headlinePart2, "REAL IMPACT.");
    assert.ok(result.data.manifesto.metrics.length >= 3);

    // Assert WhyUs Teaser
    assert.equal(result.data.whyUsTeaser.eyebrow, "02 WHY ART WORK");
    assert.ok(result.data.whyUsTeaser.bentoCards.length >= 3);

    // Assert Contact
    assert.equal(result.data.contact.email, "studio@artwork-solutions.stage");
    assert.ok(result.data.contact.formFields.length >= 4);

    // Assert WhyUs Page
    assert.equal(result.data.whyUsPage.sceneTitle, "02 / WHY ART WORK");
    assert.ok(result.data.whyUsPage.doodleStickers.length >= 4);
  });

  it("should validate and update the manifesto section with version increment", async () => {
    const repo = createInMemoryContentRepository();

    const updatePayload = {
      ...DEFAULT_SITE_CONTENT.manifesto,
      headlinePart1: "UNCONVENTIONAL VISIONS.",
      headlinePart2: "ARENA SCALE.",
      editionBadge: "EDITION 2027",
      metrics: [
        { num: "500+", label: "Stadium Shows" },
        { num: "99.9%", label: "Cue Precision" },
        { num: "2.5M+", label: "Global Reach" },
      ],
    };

    const result = await updateContentSection(
      "manifesto",
      updatePayload,
      repo,
      "chief@art-work.agency"
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.data.section, "manifesto");
    assert.equal(result.data.version, 2);

    // Verify fetched content reflects update
    const fetched = await fetchSiteContent(repo);
    assert.equal(fetched.ok, true);
    if (!fetched.ok) return;
    assert.equal(fetched.data.manifesto.headlinePart1, "UNCONVENTIONAL VISIONS.");
    assert.equal(fetched.data.manifesto.metrics[0].num, "500+");
  });

  it("should accept alternative section key casings (e.g. 'why_us_teaser', 'teaser')", async () => {
    const repo = createInMemoryContentRepository();

    const updatePayload = {
      ...DEFAULT_SITE_CONTENT.whyUsTeaser,
      headline: "ENGINEERED FOR SUPREME STAGE PRESENCE.",
    };

    const res1 = await updateContentSection("why_us_teaser", updatePayload, repo);
    assert.equal(res1.ok, true);
    if (!res1.ok) return;
    assert.equal(res1.data.section, "whyUsTeaser");

    const fetched = await fetchSiteContent(repo);
    assert.equal(fetched.ok, true);
    if (!fetched.ok) return;
    assert.equal(
      fetched.data.whyUsTeaser.headline,
      "ENGINEERED FOR SUPREME STAGE PRESENCE."
    );
  });

  it("should reject invalid section keys with 400 Bad Request", async () => {
    const repo = createInMemoryContentRepository();
    const result = await updateContentSection("unknown_section", {}, repo);

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.status, 400);
    assert.match(result.error, /invalid section key/i);
  });

  it("should reject invalid payloads with 422 Unprocessable Entity", async () => {
    const repo = createInMemoryContentRepository();

    // Invalid email in contact section
    const invalidContact = {
      ...DEFAULT_SITE_CONTENT.contact,
      email: "not-an-email",
    };

    const result = await updateContentSection("contact", invalidContact, repo);

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.status, 422);
    assert.match(result.error, /email/i);
  });

  it("should track revision history with actor email, timestamp, and diff snapshots", async () => {
    const repo = createInMemoryContentRepository();

    await updateContentSection(
      "manifesto",
      {
        ...DEFAULT_SITE_CONTENT.manifesto,
        headlinePart1: "REVISION 1 TEST",
      },
      repo,
      "director@art-work.agency"
    );

    await updateContentSection(
      "whyUsPage",
      {
        ...DEFAULT_SITE_CONTENT.whyUsPage,
        presentationTitle: "REVISION 2 TEST",
      },
      repo,
      "lead@art-work.agency"
    );

    const historyResult = await fetchContentHistory(repo, 10);
    assert.equal(historyResult.ok, true);
    if (!historyResult.ok) return;

    assert.equal(historyResult.data.length, 2);
    assert.equal(historyResult.data[0].sectionKey, "whyUsPage");
    assert.equal(historyResult.data[0].actorEmail, "lead@art-work.agency");
    assert.equal(historyResult.data[1].sectionKey, "manifesto");
    assert.equal(historyResult.data[1].actorEmail, "director@art-work.agency");
  });

  it("should atomically rollback content to a previous revision snapshot", async () => {
    const repo = createInMemoryContentRepository();

    const originalHeadline = DEFAULT_SITE_CONTENT.manifesto.headlinePart1;

    // Mutate manifesto
    await updateContentSection(
      "manifesto",
      {
        ...DEFAULT_SITE_CONTENT.manifesto,
        headlinePart1: "TEMPORARY EXPERIMENTAL HEADLINE",
      },
      repo,
      "intern@art-work.agency"
    );

    // Verify mutation applied
    let fetched = await fetchSiteContent(repo);
    assert.equal(fetched.ok, true);
    if (!fetched.ok) return;
    assert.equal(
      fetched.data.manifesto.headlinePart1,
      "TEMPORARY EXPERIMENTAL HEADLINE"
    );

    // Get the revision
    const history = await fetchContentHistory(repo);
    assert.equal(history.ok, true);
    if (!history.ok) return;
    const latestRevision = history.data[0];

    // Rollback
    const rollbackResult = await rollbackContent(
      latestRevision.id,
      repo,
      "admin@art-work.agency"
    );

    assert.equal(rollbackResult.ok, true);
    if (!rollbackResult.ok) return;
    assert.equal(rollbackResult.data.section, "manifesto");

    // Verify original headline restored
    fetched = await fetchSiteContent(repo);
    assert.equal(fetched.ok, true);
    if (!fetched.ok) return;
    assert.equal(fetched.data.manifesto.headlinePart1, originalHeadline);
  });
});
