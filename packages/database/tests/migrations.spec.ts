import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getMigrationFiles, runMigrations } from "../src/migrations/runner";

describe("Phase 01: Canonical Migrations & Runner Verification", () => {
  it("should locate and parse canonical baseline migration files in supabase/migrations", () => {
    const migrationsDir = path.resolve(process.cwd(), "..", "..", "supabase", "migrations");
    const migrations = getMigrationFiles(migrationsDir);

    assert.ok(migrations.length >= 1, "At least one migration file should exist");
    const baseline = migrations[0];

    assert.ok(baseline);
    assert.equal(baseline.filename, "20261019000000_baseline_init.sql");
    assert.equal(baseline.version, "20261019000000");
    assert.equal(baseline.hash.length, 64); // SHA-256 hex string length
    assert.ok(baseline.sql.includes("system_health_check()"));
    assert.ok(baseline.sql.includes("uuid-ossp"));
    assert.ok(baseline.sql.includes("pgcrypto"));
  });

  it("should return empty list gracefully when directory does not exist", () => {
    const nonExistentDir = path.resolve(process.cwd(), "non_existent_folder");
    const migrations = getMigrationFiles(nonExistentDir);
    assert.deepEqual(migrations, []);
  });
});
