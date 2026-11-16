import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Phase 07: Component Memoization & Render Pruning", () => {
  const homeComponentsDir = path.resolve(
    process.cwd(),
    "../../apps/artwork-app/src/components/home"
  );

  const keyHomeComponents = [
    "ManifestoHero.tsx",
    "WhyUsTeaser.tsx",
    "ServicesStage.tsx",
    "GalleryShowcaseStage.tsx",
    "ContactSection.tsx",
    "StudioHeader.tsx",
    "StudioFooter.tsx",
    "TheaterStageIndicator.tsx",
    "PartnersMarquee.tsx",
  ];

  it("verifies all key home scene components are wrapped with React.memo", () => {
    for (const fileName of keyHomeComponents) {
      const filePath = path.join(homeComponentsDir, fileName);
      assert.ok(fs.existsSync(filePath), `Component file must exist: ${fileName}`);
      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(
        content.includes("React.memo"),
        `Component ${fileName} must be wrapped with React.memo to prune cascading re-renders`
      );
    }
  });

  it("verifies HomeTheaterController provides stable useCallback handlers to children", () => {
    const controllerPath = path.join(homeComponentsDir, "HomeTheaterController.tsx");
    assert.ok(fs.existsSync(controllerPath));
    const content = fs.readFileSync(controllerPath, "utf-8");

    // Must use stable callbacks instead of inline arrow functions
    assert.ok(content.includes("handleExploreShowreel = React.useCallback"));
    assert.ok(content.includes("handleViewCapabilities = React.useCallback"));
    assert.ok(content.includes("onExploreShowreel={handleExploreShowreel}"));
    assert.ok(content.includes("onViewCapabilities={handleViewCapabilities}"));
  });

  it("verifies PartnersMarquee optimizes row duplication with useMemo and callbacks with useCallback", () => {
    const marqueePath = path.join(homeComponentsDir, "PartnersMarquee.tsx");
    const content = fs.readFileSync(marqueePath, "utf-8");

    assert.ok(content.includes("const { marqueeRow1, marqueeRow2 } = useMemo"));
    assert.ok(content.includes("const handleToggle = useCallback"));
    assert.ok(content.includes("export const PartnerLogoCard = React.memo"));
  });
});
