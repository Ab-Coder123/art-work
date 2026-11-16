import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createParticlePool,
  updateParticlePool,
  spawnParticleInPool,
  DEFAULT_PARTICLE_POOL_SIZE,
  type ParticleStruct,
} from "@art-work/types";

describe("Phase 06: Zero-GC GPU Canvas Particle Struct Pooling Engine", () => {
  it("pre-allocates a fixed pool of structs with dormant initial state", () => {
    const pool = createParticlePool(DEFAULT_PARTICLE_POOL_SIZE);

    assert.equal(pool.length, DEFAULT_PARTICLE_POOL_SIZE);
    assert.equal(pool.length, 120);

    // Verify all pre-allocated slots are initialized and dormant
    for (const p of pool) {
      assert.equal(p.active, false);
      assert.equal(p.life, 0);
      assert.equal(p.alpha, 1);
      assert.equal(typeof p.x, "number");
      assert.equal(typeof p.y, "number");
      assert.equal(typeof p.vx, "number");
      assert.equal(typeof p.vy, "number");
    }
  });

  it("supports configurable pool capacities with boundary sanity", () => {
    const smallPool = createParticlePool(10);
    assert.equal(smallPool.length, 10);

    const minPool = createParticlePool(0);
    assert.equal(minPool.length, 1);
  });

  it("spawns particles in-place without heap re-allocations and advances circularly", () => {
    const pool = createParticlePool(4);
    assert.equal(pool.length, 4);

    // Spawn particle 0
    const next1 = spawnParticleInPool(pool, 0, {
      x: 100,
      y: 200,
      vx: 2.5,
      vy: -1.5,
      size: 8,
      maxLife: 30,
      color: "#ff0000",
      borderColor: "#000000",
    });

    assert.equal(next1, 1);
    assert.equal(pool[0].active, true);
    assert.equal(pool[0].x, 100);
    assert.equal(pool[0].y, 200);
    assert.equal(pool[0].vx, 2.5);
    assert.equal(pool[0].vy, -1.5);
    assert.equal(pool[0].size, 8);
    assert.equal(pool[0].maxLife, 30);
    assert.equal(pool[0].color, "#ff0000");
    assert.equal(pool[0].borderColor, "#000000");

    // Spawn particle 1, 2, 3
    spawnParticleInPool(pool, 1, { x: 10, y: 10, vx: 1, vy: 1, size: 5, maxLife: 20 });
    spawnParticleInPool(pool, 2, { x: 20, y: 20, vx: 1, vy: 1, size: 5, maxLife: 20 });
    const wrappedNext = spawnParticleInPool(pool, 3, { x: 30, y: 30, vx: 1, vy: 1, size: 5, maxLife: 20 });

    // Index wraps around circularly to 0 without expanding array
    assert.equal(wrappedNext, 0);
    assert.equal(pool.length, 4);
  });

  it("advances particle physics, degrades life/alpha, and deactivates expired structs", () => {
    const pool = createParticlePool(2);

    // Spawn a particle with maxLife = 3
    spawnParticleInPool(pool, 0, {
      x: 50,
      y: 50,
      vx: 10,
      vy: 5,
      size: 6,
      maxLife: 3,
    });

    // Frame 1
    const active1 = updateParticlePool(pool);
    assert.equal(active1, 1);
    assert.equal(pool[0].active, true);
    assert.equal(pool[0].life, 1);
    assert.equal(pool[0].x, 60); // 50 + 10
    assert.equal(pool[0].y, 55); // 50 + 5
    assert.ok(pool[0].alpha < 1 && pool[0].alpha > 0);

    // Frame 2
    const active2 = updateParticlePool(pool);
    assert.equal(active2, 1);
    assert.equal(pool[0].life, 2);
    assert.equal(pool[0].x, 70); // 60 + 10
    assert.equal(pool[0].y, 60); // 55 + 5

    // Frame 3: reaches maxLife (3) -> deactivates
    const active3 = updateParticlePool(pool);
    assert.equal(active3, 0);
    assert.equal(pool[0].active, false);
  });

  it("reports 0 active count when pool is idle to put RAF loop into low-power sleep", () => {
    const pool = createParticlePool(10);
    const activeCount = updateParticlePool(pool);
    assert.equal(activeCount, 0);
  });
});
