import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SITE_CONTENT, normalizeHeroManifestoContent, normalizeSiteContent } from "../src/index";

describe("Canonical SiteContent API contract", () => {
  it("normalizes modern snake-case hero rows to the legacy API DTO", () => {
    const content = normalizeSiteContent({
      manifesto: {
        banner_badge: "WORLD TOUR 2026 PRODUCTION",
        headline_highlight: "KINETIC STAGES.",
        headline_suffix: "UNFORGETTABLE EXPERIENCES.",
        subheadline: "We design live experiences at scale.",
        cta_primary_text: "Explore Showcase",
        cta_secondary_text: "Our Philosophy",
      },
    });

    assert.equal(content.manifesto.announcementBadge, "WORLD TOUR 2026 PRODUCTION");
    assert.equal(content.manifesto.headlinePart1, "KINETIC STAGES.");
    assert.equal(content.manifesto.headlinePart2, "UNFORGETTABLE EXPERIENCES.");
    assert.equal(content.manifesto.introParagraph, "We design live experiences at scale.");
    assert.equal(content.manifesto.primaryCtaText, "Explore Showcase");
    assert.equal(content.manifesto.secondaryCtaText, "Our Philosophy");
    assert.deepEqual(content.manifesto.metrics, DEFAULT_SITE_CONTENT.manifesto.metrics);
  });

  it("keeps legacy editorial fields and metrics while filling missing optional values", () => {
    const content = normalizeHeroManifestoContent({
      headlinePart1: "EDITORIAL HEADLINE",
      metrics: [{ num: "12", label: "Projects" }],
    });

    assert.equal(content.headlinePart1, "EDITORIAL HEADLINE");
    assert.equal(content.headlinePart2, DEFAULT_SITE_CONTENT.manifesto.headlinePart2);
    assert.deepEqual(content.metrics, [{ num: "12", label: "Projects" }]);
    assert.equal(content.starburstText.top, DEFAULT_SITE_CONTENT.manifesto.starburstText.top);
  });

  it("accepts hero as the persisted section alias and falls back safely for malformed data", () => {
    const content = normalizeSiteContent({
      hero: {
        headline_highlight: "ALIASED HEADLINE",
        headline_suffix: "ALIASED SUFFIX",
        subheadline: "Valid description",
        banner_badge: "LIVE",
      },
    });
    const malformed = normalizeHeroManifestoContent({
      headlinePart1: " ",
      metrics: [{ num: "", label: "" }],
    });

    assert.equal(content.manifesto.headlinePart1, "ALIASED HEADLINE");
    assert.equal(malformed.headlinePart1, DEFAULT_SITE_CONTENT.manifesto.headlinePart1);
    assert.deepEqual(malformed.metrics, DEFAULT_SITE_CONTENT.manifesto.metrics);
  });

  it("normalizes modern why-us and contact rows without dropping their editorial copy", () => {
    const content = normalizeSiteContent({
      whyUsPage: {
        heading: "WHY THIS STUDIO",
        manifesto_lead: "We build bold experiences.",
        paragraphs: ["From first sketch to final cue."],
        metrics: [{ label: "Live reach", value: "2M+", caption: "Across events" }],
      },
      contact: {
        email: "hello@example.com",
        phone: "+1 555 0100",
        address: "Cairo Studio",
        office_hours: "Sun-Thu, 9-5",
      },
    });

    assert.equal(content.whyUsPage.sceneTitle, "WHY THIS STUDIO");
    assert.equal(content.whyUsPage.presentationTitle, "We build bold experiences.");
    assert.equal(content.whyUsPage.presentationSubtitle, "From first sketch to final cue.");
    assert.deepEqual(content.whyUsPage.metrics[0], { num: "2M+", label: "Live reach" });
    assert.equal(content.contact.email, "hello@example.com");
    assert.equal(content.contact.studioLocations, "Cairo Studio");
  });
});
