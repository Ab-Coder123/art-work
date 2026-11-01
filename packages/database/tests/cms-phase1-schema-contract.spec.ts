import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_VALID_SECTION_KEYS,
  DEFAULT_SITE_CONTENT,
  DEFAULT_SERVICE_DISCIPLINES,
  createInMemoryContentRepository,
  fetchSiteContent,
  updateContentSection,
  fetchContentHistory,
  rollbackContent,
  normalizeSectionKey,
  normalizeSiteContent,
  validateSectionPayload,
} from "../src/index";

describe("CMS Phase 1: 8-Section Full-Site Content Schema, Defaults & Contract", () => {
  it("1. registers all 8 canonical CMS section keys and resolves aliases", () => {
    assert.deepEqual(ALL_VALID_SECTION_KEYS, [
      "manifesto",
      "whyUsTeaser",
      "services",
      "homeShowcase",
      "contact",
      "whyUsPage",
      "galleryPage",
      "layout",
    ]);

    assert.equal(normalizeSectionKey("services"), "services");
    assert.equal(normalizeSectionKey("capabilities"), "services");
    assert.equal(normalizeSectionKey("home_showcase"), "homeShowcase");
    assert.equal(normalizeSectionKey("home-showcase"), "homeShowcase");
    assert.equal(normalizeSectionKey("gallery_page"), "galleryPage");
    assert.equal(normalizeSectionKey("layout"), "layout");
    assert.equal(normalizeSectionKey("navigation"), "layout");
    assert.equal(normalizeSectionKey("header-footer"), "layout");
  });

  it("2. populates DEFAULT_SITE_CONTENT with complete 8-section defaults and 12 services", () => {
    assert.equal(DEFAULT_SERVICE_DISCIPLINES.length, 12);
    assert.equal(DEFAULT_SITE_CONTENT.services.disciplines.length, 12);
    assert.ok(DEFAULT_SITE_CONTENT.homeShowcase.headlinePrefix.length > 0);
    assert.ok((DEFAULT_SITE_CONTENT.contact.serviceOptions?.length ?? 0) >= 4);
    assert.equal(DEFAULT_SITE_CONTENT.whyUsPage.capabilityCards?.length, 4);
    assert.equal(DEFAULT_SITE_CONTENT.galleryPage.workflowSteps.length, 4);
    assert.equal(DEFAULT_SITE_CONTENT.galleryPage.filterAllLabel, "All Projects");
    assert.equal(DEFAULT_SITE_CONTENT.layout.navHomeLabel, "Home");
    assert.equal(DEFAULT_SITE_CONTENT.layout.navGalleryLabel, "Gallery");
  });

  it("3. fetchSiteContent returns status 200 with all 8 sections normalized", async () => {
    const repo = createInMemoryContentRepository();
    const res = await fetchSiteContent(repo);

    assert.equal(res.ok, true);
    assert.equal(res.status, 200);
    if (!res.ok) return;

    for (const key of ALL_VALID_SECTION_KEYS) {
      assert.ok(res.data[key], `Section '${key}' must exist on SiteContent`);
    }
  });

  it("4. updateContentSection returns status 200 and persists updates across all 8 sections", async () => {
    const repo = createInMemoryContentRepository();
    const actor = "director@art-work.agency";

    const sectionMutations = [
      {
        key: "manifesto",
        payload: {
          ...DEFAULT_SITE_CONTENT.manifesto,
          headlinePart1: "PHASE 1 HERO HEADLINE",
          partnersHeadlineHighlight: "GLOBAL BRANDS",
        },
      },
      {
        key: "whyUsTeaser",
        payload: {
          ...DEFAULT_SITE_CONTENT.whyUsTeaser,
          headline: "PHASE 1 TEASER HEADLINE",
        },
      },
      {
        key: "services",
        payload: {
          ...DEFAULT_SITE_CONTENT.services,
          headlineHighlight: "ARENA DAY.",
          disciplines: DEFAULT_SITE_CONTENT.services.disciplines.map((d, idx) =>
            idx === 0 ? { ...d, title: "Custom Concept Direction V2" } : d
          ),
        },
      },
      {
        key: "homeShowcase",
        payload: {
          ...DEFAULT_SITE_CONTENT.homeShowcase,
          badge: "★ STARRED SHOWREELS",
          headlineHighlight: "LIVE SHOWCASES.",
        },
      },
      {
        key: "contact",
        payload: {
          ...DEFAULT_SITE_CONTENT.contact,
          headline: "PHASE 1 CONTACT HEADLINE",
          serviceOptions: ["Custom Booths", "Medical Conferences", "VIP Launch"],
        },
      },
      {
        key: "whyUsPage",
        payload: {
          ...DEFAULT_SITE_CONTENT.whyUsPage,
          matrixHeadlineHighlight: "Studio Powers",
        },
      },
      {
        key: "galleryPage",
        payload: {
          ...DEFAULT_SITE_CONTENT.galleryPage,
          heroBadge: "★ LIVE PORTFOLIO VAULT",
          filterBrandingLabel: "Branding, Print & Giveaways",
        },
      },
      {
        key: "layout",
        payload: {
          ...DEFAULT_SITE_CONTENT.layout,
          navGalleryLabel: "Portfolio",
          briefCtaText: "Start Your Brief",
        },
      },
    ] as const;

    for (const item of sectionMutations) {
      const updateRes = await updateContentSection(item.key, item.payload, repo, actor);
      assert.equal(updateRes.ok, true, `Section ${item.key} update failed`);
      assert.equal(updateRes.status, 200, `Section ${item.key} must return HTTP 200`);
      if (updateRes.ok) {
        assert.equal(updateRes.data.section, item.key);
        assert.equal(updateRes.data.version, 2);
      }
    }

    const fetched = await fetchSiteContent(repo);
    assert.equal(fetched.ok, true);
    assert.equal(fetched.status, 200);
    if (!fetched.ok) return;

    assert.equal(fetched.data.manifesto.headlinePart1, "PHASE 1 HERO HEADLINE");
    assert.equal(fetched.data.manifesto.partnersHeadlineHighlight, "GLOBAL BRANDS");
    assert.equal(fetched.data.services.disciplines[0].title, "Custom Concept Direction V2");
    assert.equal(fetched.data.homeShowcase.badge, "★ STARRED SHOWREELS");
    assert.deepEqual(fetched.data.contact.serviceOptions, [
      "Custom Booths",
      "Medical Conferences",
      "VIP Launch",
    ]);
    assert.equal(fetched.data.whyUsPage.matrixHeadlineHighlight, "Studio Powers");
    assert.equal(fetched.data.galleryPage.heroBadge, "★ LIVE PORTFOLIO VAULT");
    assert.equal(fetched.data.layout.navGalleryLabel, "Portfolio");
  });

  it("5. validates new section schemas and normalizes partial/malformed inputs safely", () => {
    const invalidServices = validateSectionPayload("services", {
      ...DEFAULT_SITE_CONTENT.services,
      disciplines: [],
    });
    assert.equal(invalidServices.success, false);

    const normalized = normalizeSiteContent({
      services: { eyebrow: "CUSTOM SERVICES", disciplines: [] },
      gallery_page: { heroBadge: "★ ARCHIVE", workflowSteps: [] },
      navigation: { navHomeLabel: "Overview" },
    });

    assert.equal(normalized.services.eyebrow, "CUSTOM SERVICES");
    assert.equal(normalized.services.disciplines.length, 12);
    assert.equal(normalized.galleryPage.heroBadge, "★ ARCHIVE");
    assert.equal(normalized.galleryPage.workflowSteps.length, 4);
    assert.equal(normalized.layout.navHomeLabel, "Overview");
  });

  it("6. tracks revision history and rolls back new sections with status 200", async () => {
    const repo = createInMemoryContentRepository();
    const originalNav = DEFAULT_SITE_CONTENT.layout.navServicesLabel;

    const updated = await updateContentSection(
      "layout",
      { ...DEFAULT_SITE_CONTENT.layout, navServicesLabel: "Capabilities" },
      repo,
      "editor@art-work.agency"
    );
    assert.equal(updated.ok, true);
    assert.equal(updated.status, 200);

    const history = await fetchContentHistory(repo, 5);
    assert.equal(history.ok, true);
    assert.equal(history.status, 200);
    if (!history.ok) return;
    assert.equal(history.data[0].sectionKey, "layout");

    const rolledBack = await rollbackContent(history.data[0].id, repo, "admin@art-work.agency");
    assert.equal(rolledBack.ok, true);
    assert.equal(rolledBack.status, 200);

    const afterRollback = await fetchSiteContent(repo);
    assert.equal(afterRollback.ok, true);
    if (afterRollback.ok) {
      assert.equal(afterRollback.data.layout.navServicesLabel, originalNav);
    }
  });
});
