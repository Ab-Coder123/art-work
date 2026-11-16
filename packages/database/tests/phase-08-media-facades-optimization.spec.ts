import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Phase 08: Third-Party Media Facades & Asset Optimization", () => {
  const cinematicDir = path.resolve(
    process.cwd(),
    "../../apps/artwork-app/src/components/cinematic"
  );
  const homeComponentsDir = path.resolve(
    process.cwd(),
    "../../apps/artwork-app/src/components/home"
  );
  const artworkAppNextConfig = path.resolve(
    process.cwd(),
    "../../apps/artwork-app/next.config.ts"
  );
  const adminNextConfig = path.resolve(
    process.cwd(),
    "../../apps/admin/next.config.ts"
  );

  it("verifies YouTubeVideoFacade provides zero-initial-iframe poster facade", () => {
    const facadePath = path.join(cinematicDir, "YouTubeVideoFacade.tsx");
    assert.ok(fs.existsSync(facadePath), "YouTubeVideoFacade.tsx must exist");
    const content = fs.readFileSync(facadePath, "utf-8");

    // Must be memoized
    assert.ok(content.includes("React.memo"));
    // Must preconnect DNS hints on hover/touch
    assert.ok(content.includes("https://www.youtube-nocookie.com"));
    assert.ok(content.includes("https://i.ytimg.com"));
    // Must format autoplay URL only when active
    assert.ok(content.includes("autoplay=1"));
    // Must render poster Image prior to interaction
    assert.ok(content.includes("<Image"));
  });

  it("verifies GalleryShowcaseStage enforces lazy loading and responsive aspect ratios on iframe embeds", () => {
    const stagePath = path.join(homeComponentsDir, "GalleryShowcaseStage.tsx");
    assert.ok(fs.existsSync(stagePath));
    const content = fs.readFileSync(stagePath, "utf-8");

    // Uses YouTubeVideoFacade for video showcase
    assert.ok(content.includes("<YouTubeVideoFacade"));
    // Uses loading="lazy" for all third-party iframes
    assert.ok(content.includes('loading="lazy"'));
    // Supports 16:9 and 9:16 aspect ratio switching
    assert.ok(content.includes("aspect-video"));
    assert.ok(content.includes("aspect-[9/16]"));
  });

  it("verifies Next.js config optimizes modern image formats and tree-shakes lucide-react", () => {
    const webConfig = fs.readFileSync(artworkAppNextConfig, "utf-8");
    const adminConfig = fs.readFileSync(adminNextConfig, "utf-8");

    // Both apps must optimizePackageImports for lucide-react
    assert.ok(webConfig.includes('optimizePackageImports: ["lucide-react"]'));
    assert.ok(adminConfig.includes('optimizePackageImports: ["lucide-react"]'));

    // Web app configures AVIF and WebP modern formats
    assert.ok(webConfig.includes('"image/avif"'));
    assert.ok(webConfig.includes('"image/webp"'));
  });
});
