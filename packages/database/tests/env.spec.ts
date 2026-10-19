import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DatabaseEnvSchema,
  parseDatabaseEnv,
  validatePoolerUrl,
} from "../src/config/env.js";

describe("Phase 01: Database Environment Configuration & Zod Schema", () => {
  it("should validate default environment settings successfully", () => {
    const env = parseDatabaseEnv({});
    assert.equal(env.NODE_ENV, "development");
    assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, "http://127.0.0.1:54321");
    assert.ok(env.DATABASE_URL.startsWith("postgresql://"));
    assert.ok(env.DATABASE_POOL_URL.includes("pgbouncer=true") || env.DATABASE_POOL_URL.includes(":54329"));
  });

  it("should accept valid custom Supabase production URLs and keys", () => {
    const customConfig = {
      NEXT_PUBLIC_SUPABASE_URL: "https://xyzcompany.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-anon-token-with-sufficient-length",
      SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-service-role-key-with-sufficient-length",
      DATABASE_URL: "postgresql://postgres.xyz:secret@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
      DATABASE_POOL_URL: "postgresql://postgres.xyz:secret@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
      NODE_ENV: "production",
    };

    const parsed = parseDatabaseEnv(customConfig);
    assert.equal(parsed.NEXT_PUBLIC_SUPABASE_URL, "https://xyzcompany.supabase.co");
    assert.equal(parsed.NODE_ENV, "production");
    assert.equal(parsed.SUPABASE_SERVICE_ROLE_KEY, customConfig.SUPABASE_SERVICE_ROLE_KEY);
  });

  it("should reject invalid Supabase URLs", () => {
    assert.throws(
      () => {
        parseDatabaseEnv({
          NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
        });
      },
      /NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP\/HTTPS URL/
    );
  });

  it("should reject malformed PostgreSQL database connection strings", () => {
    assert.throws(
      () => {
        parseDatabaseEnv({
          DATABASE_URL: "mysql://root:root@localhost:3306/db",
        });
      },
      /DATABASE_URL must be a valid PostgreSQL connection URI/
    );
  });

  it("should enforce transaction pooler port or pgbouncer parameter on pooler URL", () => {
    // Missing port 6543/54329 and missing ?pgbouncer=true
    assert.throws(
      () => {
        parseDatabaseEnv({
          DATABASE_POOL_URL: "postgresql://postgres:pass@db.example.com:5432/postgres",
        });
      },
      /DATABASE_POOL_URL must target a Supavisor\/PgBouncer pooler port/
    );

    // Valid when using port 6543
    const validPort6543 = parseDatabaseEnv({
      DATABASE_POOL_URL: "postgresql://postgres:pass@db.example.com:6543/postgres",
    });
    assert.ok(validPort6543.DATABASE_POOL_URL.includes(":6543"));

    // Valid when using port 54329
    const validPort54329 = parseDatabaseEnv({
      DATABASE_POOL_URL: "postgresql://postgres:pass@127.0.0.1:54329/postgres",
    });
    assert.ok(validPort54329.DATABASE_POOL_URL.includes(":54329"));

    // Valid when using ?pgbouncer=true
    const validQueryParam = parseDatabaseEnv({
      DATABASE_POOL_URL: "postgresql://postgres:pass@db.example.com:5432/postgres?pgbouncer=true",
    });
    assert.ok(validQueryParam.DATABASE_POOL_URL.includes("pgbouncer=true"));
  });

  it("should validate pooler URL helper correctly", () => {
    const valid = validatePoolerUrl("postgresql://user:pass@host:6543/postgres");
    assert.equal(valid.isValid, true);

    const invalid = validatePoolerUrl("postgresql://user:pass@host:5432/postgres");
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.warning?.includes("designated transaction pooler port"));
  });
});
