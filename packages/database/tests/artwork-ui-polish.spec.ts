import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Art Work UI Polishing & System Reconfiguration Verification", () => {
  const rootDir = path.resolve(process.cwd(), "../..");
  const artworkAppDir = path.join(rootDir, "apps/artwork-app");

  it("1. should ensure artwork_logo_dark.png exists alongside artwork_logo.png", () => {
    const lightLogo = path.join(artworkAppDir, "public/assets/images/artwork_logo.png");
    const darkLogo = path.join(artworkAppDir, "public/assets/images/artwork_logo_dark.png");

    assert.equal(fs.existsSync(lightLogo), true, "artwork_logo.png must exist");
    assert.equal(fs.existsSync(darkLogo), true, "artwork_logo_dark.png must exist");

    const lightStats = fs.statSync(lightLogo);
    const darkStats = fs.statSync(darkLogo);
    assert.ok(lightStats.size > 0, "light logo should not be empty");
    assert.ok(darkStats.size > 0, "dark logo should not be empty");
  });

  it("2. should verify dark mode logo switching across all key public routes", () => {
    const routes = [
      path.join(artworkAppDir, "src/app/page.tsx"),
      path.join(artworkAppDir, "src/app/gallery/page.tsx"),
      path.join(artworkAppDir, "src/app/why-us/page.tsx"),
    ];

    for (const routePath of routes) {
      assert.equal(fs.existsSync(routePath), true, `Route file must exist: ${routePath}`);
      const content = fs.readFileSync(routePath, "utf-8");

      assert.ok(
        content.includes("artwork_logo_dark.png"),
        `Route ${path.basename(routePath)} must reference artwork_logo_dark.png`
      );
      assert.ok(
        content.includes("dark:hidden"),
        `Route ${path.basename(routePath)} must have dark:hidden on light logo`
      );
      assert.ok(
        content.includes("hidden dark:block"),
        `Route ${path.basename(routePath)} must have hidden dark:block on dark logo`
      );
    }
  });

  it("3. should verify removal of black telemetry card from gallery page", () => {
    const galleryPage = path.join(artworkAppDir, "src/app/gallery/page.tsx");
    const content = fs.readFileSync(galleryPage, "utf-8");

    assert.equal(
      content.includes("[SYS_TELEMETRY: STAGE_OPS]"),
      false,
      "Black telemetry card [SYS_TELEMETRY: STAGE_OPS] must be removed"
    );
    assert.equal(
      content.includes("● LIVE RIGGING"),
      false,
      "Live rigging indicator from telemetry card must be removed"
    );
  });

  it("4. should verify ribbon header styling and no-scrollbar containment", () => {
    const homePage = path.join(artworkAppDir, "src/app/page.tsx");
    const globalsCss = path.join(artworkAppDir, "src/app/globals.css");

    const homeContent = fs.readFileSync(homePage, "utf-8");
    const cssContent = fs.readFileSync(globalsCss, "utf-8");

    // Ribbon exists
    assert.ok(
      homeContent.includes("CREATIVE MARKETING MANIFESTO"),
      "Scene 01 technical ribbon must be present"
    );
    assert.ok(
      homeContent.includes("SCENE // 01"),
      "Scene badge must be present in ribbon"
    );

    // Scrollbar prevention
    assert.ok(
      homeContent.includes("no-scrollbar"),
      "Main scene container must use no-scrollbar to avoid cutting through ribbon"
    );
    assert.ok(
      cssContent.includes(".no-scrollbar"),
      "globals.css must define .no-scrollbar rules"
    );
  });

  it("5. should verify admin user authentication email configuration", () => {
    const sessionMiddlewareTest = path.join(
      rootDir,
      "packages/database/tests/session-middleware.spec.ts"
    );
    const content = fs.readFileSync(sessionMiddlewareTest, "utf-8");

    assert.ok(
      content.includes("ahmed.artwork2026@gmail.com"),
      "Session middleware test must use ahmed.artwork2026@gmail.com"
    );
    assert.equal(
      content.includes("abdulrahmanahm7li@gmail.com"),
      false,
      "Old email abdulrahmanahm7li@gmail.com must no longer be present in session tests"
    );
  });
});
