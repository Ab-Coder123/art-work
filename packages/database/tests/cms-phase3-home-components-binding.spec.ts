import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("CMS Phase 3: Full Home Page Component CMS Bindings & Multi-Video Stage", () => {
  const rootDir = path.resolve(process.cwd(), "../..");
  const homeDir = path.join(rootDir, "apps/artwork-app/src/components/home");
  const cinematicDir = path.join(rootDir, "apps/artwork-app/src/components/cinematic");

  it("1. wires all Home CMS sections and projects into server.ts and HomeTheaterController.tsx", () => {
    const serverSrc = fs.readFileSync(path.join(homeDir, "server.ts"), "utf-8");
    const controllerSrc = fs.readFileSync(
      path.join(homeDir, "HomeTheaterController.tsx"),
      "utf-8"
    );

    assert.ok(serverSrc.includes("servicesContent: contentData.services"));
    assert.ok(serverSrc.includes("homeShowcaseContent: contentData.homeShowcase"));
    assert.ok(serverSrc.includes("layoutContent: contentData.layout"));
    assert.ok(serverSrc.includes('tags: ["site-content", "companies", "projects"]'));

    assert.ok(controllerSrc.includes("<ServicesStage content={servicesContent} />"));
    assert.ok(controllerSrc.includes("content={homeShowcaseContent}"));
    assert.ok(controllerSrc.includes("initialProjects={projects}"));
    assert.ok(controllerSrc.includes("layout={layoutContent}"));
    assert.ok(controllerSrc.includes('fetch("/api/projects?limit=24"'));
  });

  it("2. binds StudioHeader and StudioFooter to CMS layout labels while keeping dark logo polish", () => {
    const headerSrc = fs.readFileSync(path.join(homeDir, "StudioHeader.tsx"), "utf-8");
    const footerSrc = fs.readFileSync(path.join(homeDir, "StudioFooter.tsx"), "utf-8");

    assert.ok(headerSrc.includes("layout.navHomeLabel"));
    assert.ok(headerSrc.includes("layout.navWhyUsLabel"));
    assert.ok(headerSrc.includes("layout.navServicesLabel"));
    assert.ok(headerSrc.includes("layout.navGalleryLabel"));
    assert.ok(headerSrc.includes("layout.navContactLabel"));
    assert.ok(headerSrc.includes("layout.fullVaultCtaText"));
    assert.ok(headerSrc.includes("layout.briefCtaText"));
    assert.ok(headerSrc.includes("artwork_logo_dark.png"));
    assert.ok(headerSrc.includes("dark:hidden"));
    assert.ok(headerSrc.includes("hidden dark:block"));
    assert.ok(
      headerSrc.includes('href="/gallery"') &&
        !headerSrc.includes('href="/gallery"\n            className="md:hidden'),
      "StudioHeader desktop /gallery CTA must be visible on desktop viewports (no md:hidden inside hidden md:flex)"
    );

    assert.ok(footerSrc.includes("layout.footerCopyright"));
    assert.ok(footerSrc.includes("layout.navGalleryLabel"));
  });

  it("3. binds ManifestoHero, PartnersMarquee, and WhyUsTeaser to dynamic CMS fields", () => {
    const heroSrc = fs.readFileSync(path.join(homeDir, "ManifestoHero.tsx"), "utf-8");
    const marqueeSrc = fs.readFileSync(path.join(homeDir, "PartnersMarquee.tsx"), "utf-8");
    const teaserSrc = fs.readFileSync(path.join(homeDir, "WhyUsTeaser.tsx"), "utf-8");

    assert.ok(heroSrc.includes("content.primaryCtaText"));
    assert.ok(heroSrc.includes("content.secondaryCtaText"));
    assert.ok(heroSrc.includes("content.proofTagline"));
    assert.ok(heroSrc.includes("content.performanceBadge"));
    assert.ok(heroSrc.includes("content.heroImage"));
    assert.ok(marqueeSrc.includes("partnersBadge"));
    assert.ok(marqueeSrc.includes("partnersHeadlineHighlight"));
    assert.ok(marqueeSrc.includes("starburstText.top"));
    assert.ok(teaserSrc.includes("cards.map("));
  });

  it("4. binds ServicesStage & Capabilities3DMatrix to dynamic CMS services & deliverables", () => {
    const servicesSrc = fs.readFileSync(path.join(homeDir, "ServicesStage.tsx"), "utf-8");
    const matrixSrc = fs.readFileSync(
      path.join(cinematicDir, "Capabilities3DMatrix.tsx"),
      "utf-8"
    );

    assert.ok(servicesSrc.includes("<Capabilities3DMatrix content={content} />"));
    assert.ok(matrixSrc.includes("content.disciplines"));
    assert.ok(matrixSrc.includes("content.eyebrow"));
    assert.ok(matrixSrc.includes("content.headlineHighlight"));
    assert.ok(matrixSrc.includes("content.filterCreativeLabel"));
    assert.ok(matrixSrc.includes("content.bannerHeadlineHighlight"));
    assert.ok(matrixSrc.includes("content.bannerCtaText"));
  });

  it("5. upgrades GalleryShowcaseStage with ★ Star multi-video switcher & inline video cards", () => {
    const showcaseSrc = fs.readFileSync(
      path.join(homeDir, "GalleryShowcaseStage.tsx"),
      "utf-8"
    );

    assert.ok(
      showcaseSrc.includes("resolveHomeShowcaseItems(projectsList)"),
      "GalleryShowcaseStage must use resolveHomeShowcaseItems to honor ★ Star featured flags"
    );
    assert.ok(
      showcaseSrc.includes("showcase.featuredVideos.length > 1"),
      "GalleryShowcaseStage must render multi-video switcher when multiple videos are starred"
    );
    assert.ok(
      showcaseSrc.includes("setSelectedVideoId"),
      "GalleryShowcaseStage must support switching active video on Home"
    );
    assert.ok(showcaseSrc.includes("content.badge"));
    assert.ok(showcaseSrc.includes("content.featuredEventBadge"));
    assert.ok(showcaseSrc.includes("content.exploreGalleryCtaText"));
  });

  it("6. binds ContactSection to CMS serviceOptions, formFields, phone, email & studioLocations", () => {
    const contactSrc = fs.readFileSync(path.join(homeDir, "ContactSection.tsx"), "utf-8");

    assert.ok(contactSrc.includes("content.serviceOptions"));
    assert.ok(contactSrc.includes("fieldMap.fullName?.label"));
    assert.ok(contactSrc.includes("fieldMap.email?.label"));
    assert.ok(contactSrc.includes("fieldMap.brief?.label"));
    assert.ok(contactSrc.includes("content.phone"));
    assert.ok(contactSrc.includes("content.studioLocations"));
    assert.ok(contactSrc.includes("content.submitButtonText"));
  });
});
