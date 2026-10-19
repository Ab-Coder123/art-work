import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSupavisorPoolOptions, auditPoolerConfiguration } from "../src/index.js";

describe("Phase 01: Supavisor Connection Pooling & prepare: false Configuration", () => {
  it("should enforce disablePreparedStatements = true for Supavisor compatibility", () => {
    const options = getSupavisorPoolOptions(
      "postgresql://postgres:postgres@127.0.0.1:54329/postgres?pgbouncer=true"
    );

    assert.equal(options.disablePreparedStatements, true);
    assert.equal(options.max, 20);
    assert.equal(options.idleTimeoutMillis, 30000);
    assert.equal(options.connectionTimeoutMillis, 5000);
  });

  it("should disable SSL on local connections and enable rejectUnauthorized: false on remote connections", () => {
    const localOptions = getSupavisorPoolOptions(
      "postgresql://postgres:postgres@localhost:54329/postgres?pgbouncer=true"
    );
    assert.equal(localOptions.ssl, false);

    const remoteOptions = getSupavisorPoolOptions(
      "postgresql://postgres:secret@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    );
    assert.deepEqual(remoteOptions.ssl, { rejectUnauthorized: false });
  });

  it("should audit pooler configuration and flag invalid prepared statements", () => {
    // When prepared statements are properly disabled
    const healthyAudit = auditPoolerConfiguration(undefined, {
      connectionString: "postgresql://postgres:postgres@127.0.0.1:54329/postgres?pgbouncer=true",
      disablePreparedStatements: true,
      max: 20,
    });
    assert.equal(healthyAudit.compatible, true);
    assert.equal(healthyAudit.warnings.length, 0);

    // When someone attempts to enable prepared statements (which breaks Supavisor)
    const dangerousAudit = auditPoolerConfiguration(undefined, {
      connectionString: "postgresql://postgres:postgres@127.0.0.1:54329/postgres?pgbouncer=true",
      disablePreparedStatements: false,
      max: 100, // excessive pool size
    });
    assert.equal(dangerousAudit.compatible, false);
    assert.ok(dangerousAudit.warnings.some((w) => w.includes("prepared statements to be disabled")));
    assert.ok(dangerousAudit.warnings.some((w) => w.includes("Pool size exceeds 50")));
  });
});
