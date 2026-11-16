import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  STAGE_ORDER,
  STAGE_HASH_MAP,
  resolveHashToStage,
  getNextStage,
  getPrevStage,
  calculateActiveStageFromTops,
  type StageId,
} from "@art-work/types";

describe("Phase 05: Scrollytelling, Hash Routing & Stage Controller Engine", () => {
  it("enforces canonical 5-stage sequential progression order", () => {
    assert.deepEqual(STAGE_ORDER, [
      "stage-01",
      "stage-02",
      "stage-03",
      "stage-gallery",
      "stage-04",
    ]);
    assert.equal(STAGE_ORDER.length, 5);
  });

  it("handles boundary-safe forward stage progression (getNextStage)", () => {
    assert.equal(getNextStage("stage-01"), "stage-02");
    assert.equal(getNextStage("stage-02"), "stage-03");
    assert.equal(getNextStage("stage-03"), "stage-gallery");
    assert.equal(getNextStage("stage-gallery"), "stage-04");
    // Boundary lock at end of show
    assert.equal(getNextStage("stage-04"), "stage-04");
  });

  it("handles boundary-safe backward stage progression (getPrevStage)", () => {
    assert.equal(getPrevStage("stage-04"), "stage-gallery");
    assert.equal(getPrevStage("stage-gallery"), "stage-03");
    assert.equal(getPrevStage("stage-03"), "stage-02");
    assert.equal(getPrevStage("stage-02"), "stage-01");
    // Boundary lock at beginning of show
    assert.equal(getPrevStage("stage-01"), "stage-01");
  });

  it("resolves canonical, nested, and aliased URL hashes reliably", () => {
    // Exact IDs
    assert.equal(resolveHashToStage("#stage-01"), "stage-01");
    assert.equal(resolveHashToStage("#stage-02"), "stage-02");
    assert.equal(resolveHashToStage("#stage-03"), "stage-03");
    assert.equal(resolveHashToStage("#stage-gallery"), "stage-gallery");
    assert.equal(resolveHashToStage("#stage-04"), "stage-04");

    // Slash prefix hashes
    assert.equal(resolveHashToStage("#/services"), "stage-03");
    assert.equal(resolveHashToStage("#/gallery"), "stage-gallery");
    assert.equal(resolveHashToStage("#/contact"), "stage-04");

    // Editorial and marketing aliases
    assert.equal(resolveHashToStage("hero"), "stage-01");
    assert.equal(resolveHashToStage("why-us"), "stage-02");
    assert.equal(resolveHashToStage("about"), "stage-02");
    assert.equal(resolveHashToStage("capabilities"), "stage-03");
    assert.equal(resolveHashToStage("work"), "stage-gallery");
    assert.equal(resolveHashToStage("portfolio"), "stage-gallery");
    assert.equal(resolveHashToStage("showcase"), "stage-gallery");
    assert.equal(resolveHashToStage("brief-inquiry"), "stage-04");
    assert.equal(resolveHashToStage("brief"), "stage-04");
    assert.equal(resolveHashToStage("intake"), "stage-04");

    // Invalid / empty hashes
    assert.equal(resolveHashToStage(""), null);
    assert.equal(resolveHashToStage(null), null);
    assert.equal(resolveHashToStage(undefined), null);
    assert.equal(resolveHashToStage("#unknown-section"), null);
  });

  it("calculates active stage based on viewport threshold scroll tops", () => {
    const thresholdY = 400;

    // Viewport at top: stage-01 is active, rest are below threshold
    const initialTops: { id: StageId; top: number }[] = [
      { id: "stage-01", top: 0 },
      { id: "stage-02", top: 1000 },
      { id: "stage-03", top: 2000 },
      { id: "stage-gallery", top: 3000 },
      { id: "stage-04", top: 4000 },
    ];
    assert.equal(calculateActiveStageFromTops(initialTops, thresholdY), "stage-01");

    // Scrolled to Stage 02
    const scrolledToS2: { id: StageId; top: number }[] = [
      { id: "stage-01", top: -800 },
      { id: "stage-02", top: 200 }, // <= 400
      { id: "stage-03", top: 1200 },
      { id: "stage-gallery", top: 2200 },
      { id: "stage-04", top: 3200 },
    ];
    assert.equal(calculateActiveStageFromTops(scrolledToS2, thresholdY), "stage-02");

    // Scrolled to Stage Gallery
    const scrolledToGallery: { id: StageId; top: number }[] = [
      { id: "stage-01", top: -2800 },
      { id: "stage-02", top: -1800 },
      { id: "stage-03", top: -800 },
      { id: "stage-gallery", top: 150 }, // <= 400
      { id: "stage-04", top: 1150 },
    ];
    assert.equal(calculateActiveStageFromTops(scrolledToGallery, thresholdY), "stage-gallery");

    // Scrolled to Stage 04 Contact
    const scrolledToS4: { id: StageId; top: number }[] = [
      { id: "stage-01", top: -3800 },
      { id: "stage-02", top: -2800 },
      { id: "stage-03", top: -1800 },
      { id: "stage-gallery", top: -850 },
      { id: "stage-04", top: 50 }, // <= 400
    ];
    assert.equal(calculateActiveStageFromTops(scrolledToS4, thresholdY), "stage-04");
  });
});
