import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Phase 03: Main Website Centralized Zustand State Management & Zero-GC Architecture", () => {
  const rootDir = path.resolve(process.cwd(), "../..");
  const webSrcDir = path.join(rootDir, "apps/artwork-app/src");

  it("1. wires HomeTheaterController, GalleryShowcaseStage, /gallery, and /why-us to useShowcaseStore", () => {
    const controllerSrc = fs.readFileSync(
      path.join(webSrcDir, "components/home/HomeTheaterController.tsx"),
      "utf8"
    );
    const showcaseStageSrc = fs.readFileSync(
      path.join(webSrcDir, "components/home/GalleryShowcaseStage.tsx"),
      "utf8"
    );
    const galleryPageSrc = fs.readFileSync(
      path.join(webSrcDir, "app/gallery/page.tsx"),
      "utf8"
    );
    const whyUsPageSrc = fs.readFileSync(
      path.join(webSrcDir, "app/why-us/page.tsx"),
      "utf8"
    );

    assert.ok(controllerSrc.includes("useShowcaseStore"));
    assert.ok(controllerSrc.includes("hydrateFromServer"));
    assert.ok(controllerSrc.includes("ensureFreshData"));

    assert.ok(showcaseStageSrc.includes("useShowcaseStore"));
    assert.ok(
      !showcaseStageSrc.includes('fetch("/api/projects'),
      "GalleryShowcaseStage must NOT execute duplicate /api/projects fetch"
    );

    assert.ok(galleryPageSrc.includes("useShowcaseStore"));
    assert.ok(galleryPageSrc.includes("ensureFreshData"));

    assert.ok(whyUsPageSrc.includes("useShowcaseStore"));
    assert.ok(whyUsPageSrc.includes("ensureFreshData"));
  });

  it("2. enforces Zero-DOM Garbage Collection across all pages (zero document.createElement particle loops)", () => {
    function scanDir(dir: string): string[] {
      let violations: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          violations = violations.concat(scanDir(fullPath));
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf8");
          if (content.includes("document.createElement")) {
            violations.push(path.relative(webSrcDir, fullPath));
          }
        }
      }
      return violations;
    }

    const violations = scanDir(webSrcDir);
    assert.deepEqual(
      violations,
      [],
      `Found legacy DOM createElement loops that cause GC thrashing: ${violations.join(", ")}`
    );

    const galleryPageSrc = fs.readFileSync(path.join(webSrcDir, "app/gallery/page.tsx"), "utf8");
    const whyUsPageSrc = fs.readFileSync(path.join(webSrcDir, "app/why-us/page.tsx"), "utf8");

    assert.ok(galleryPageSrc.includes("<KineticParticleCanvas />"));
    assert.ok(galleryPageSrc.includes("artwork:particle-burst"));
    assert.ok(whyUsPageSrc.includes("<KineticParticleCanvas />"));
  });
});
