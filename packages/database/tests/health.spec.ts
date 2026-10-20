import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { performSystemHealthAudit, testDatabaseHandshake } from "../src/index";

describe("Phase 01: Deterministic Health & Pooler Handshake Audit", () => {
  it("should perform static health and configuration audit deterministically", async () => {
    const audit = await performSystemHealthAudit({ checkLiveHandshake: false });

    assert.equal(audit.ok, true);
    assert.ok(audit.timestamp);
    assert.equal(audit.pooler.compatible, true);
    assert.equal(audit.pooler.disablePreparedStatements, true);
    assert.equal(audit.pooler.maxConnections, 20);
    assert.equal(audit.pooler.warnings.length, 0);
  });

  it("should capture unreachable database gracefully without throwing uncaught exceptions", async () => {
    // Testing an unreachable port (e.g. 54399) with 500ms timeout
    const handshake = await testDatabaseHandshake(
      "postgresql://postgres:postgres@127.0.0.1:54399/postgres",
      500
    );

    assert.equal(handshake.connected, false);
    assert.ok(handshake.error);
    assert.ok(typeof handshake.latencyMs === "number");
  });
});
