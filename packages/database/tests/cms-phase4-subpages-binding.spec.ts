import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SITE_CONTENT,
  createInMemoryContentRepository,
  fetchSiteContent,
  updateContentSection,
} from "../src/index";

describe("CMS Phase 4: /why-us & /gallery Subpage CMS Bindings", () => {
  const rootDir = path.resolve(process.cwd(), "../..");
  const whyUsPath = path.join(rootDir, "apps/artwork-app/src/app/why-us/page.tsx");
  const galleryPath = path.join(rootDir, "apps/artwork-app/src/app/gallery/page.tsx");

  it("1. binds /why-us page to CMS whyUsPage (capabilityCards, callout, easel stamps) and layout", () => {
    const whyUsSrc = fs.readFileSync(whyUsPath, "utf-8");

    assert.ok(whyUsSrc.includes('fetch("/api/content"'));
    assert.ok(whyUsSrc.includes("content.directorNote"));
    assert.ok(whyUsSrc.includes("content.tailoredStamp"));
    assert.ok(whyUsSrc.includes("content.zeroTemplatesBadge"));
    assert.ok(whyUsSrc.includes("content.matrixHeadlineHighlight"));
    assert.ok(whyUsSrc.includes("capabilityCards.map("));
    assert.ok(whyUsSrc.includes("content.calloutHeadlineHighlight"));
    assert.ok(whyUsSrc.includes("content.calloutPrimaryCta"));
    assert.ok(whyUsSrc.includes("layout.navWhyUsLabel"));
    assert.ok(whyUsSrc.includes("layout.footerCopyright"));
    assert.ok(whyUsSrc.includes("artwork_logo_dark.png"));
  });

  it("2. binds /gallery page to CMS galleryPage, contact, layout, and ★ HOME featured badge", () => {
    const gallerySrc = fs.readFileSync(galleryPath, "utf-8");

    assert.ok(gallerySrc.includes('fetch("/api/content"'));
    assert.ok(gallerySrc.includes("galleryContent.heroBadge"));
    assert.ok(gallerySrc.includes("galleryContent.headlinePart1"));
    assert.ok(gallerySrc.includes("galleryContent.headlinePart2"));
    assert.ok(gallerySrc.includes("galleryContent.filterAllLabel"));
    assert.ok(gallerySrc.includes("galleryContent.filterConferencesLabel"));
    assert.ok(gallerySrc.includes("galleryContent.filterBoothsLabel"));
    assert.ok(gallerySrc.includes("galleryContent.filterBrandingLabel"));
    assert.ok(gallerySrc.includes("galleryContent.quoteText"));
    assert.ok(gallerySrc.includes("workflowSteps.map("));
    assert.ok(gallerySrc.includes("galleryContent.ctaHeadlineHighlight"));
    assert.ok(gallerySrc.includes("contact.email"));
    assert.ok(gallerySrc.includes("contact.studioLocations"));
    assert.ok(gallerySrc.includes("layout.navGalleryLabel"));
    assert.ok(gallerySrc.includes("★ HOME"));
    assert.ok(gallerySrc.includes("artwork_logo_dark.png"));
  });

  it("3. persists whyUsPage and galleryPage CMS updates with HTTP 200 status", async () => {
    const repo = createInMemoryContentRepository();

    const whyUsRes = await updateContentSection(
      "whyUsPage",
      {
        ...DEFAULT_SITE_CONTENT.whyUsPage,
        calloutHeadlineHighlight: "PHARMA SUMMIT.",
        directorNote: "CUSTOM DIRECTOR NOTE FROM DASHBOARD",
      },
      repo,
      "admin@artwork.com"
    );
    assert.equal(whyUsRes.ok, true);
    if (whyUsRes.ok) {
      assert.equal(whyUsRes.status, 200);
    }

    const galleryRes = await updateContentSection(
      "galleryPage",
      {
        ...DEFAULT_SITE_CONTENT.galleryPage,
        heroBadge: "ARCHIVE // 2026 DASHBOARD",
        filterBoothsLabel: "Custom 3D Booths",
        quoteText: "Every booth starts from a clean slate.",
      },
      repo,
      "admin@artwork.com"
    );
    assert.equal(galleryRes.ok, true);
    if (galleryRes.ok) {
      assert.equal(galleryRes.status, 200);
    }

    const allRes = await fetchSiteContent(repo);
    assert.equal(allRes.ok, true);
    if (allRes.ok) {
      assert.equal(allRes.status, 200);
      assert.equal(allRes.data.whyUsPage.calloutHeadlineHighlight, "PHARMA SUMMIT.");
      assert.equal(allRes.data.galleryPage.filterBoothsLabel, "Custom 3D Booths");
    }
  });
});
