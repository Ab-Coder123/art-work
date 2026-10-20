import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getMigrationFiles } from "../src/index.js";

describe("Phase 02: DDL Migration & Schema Integrity Verification", () => {
  const migrationsDir = path.resolve(process.cwd(), "..", "..", "supabase", "migrations");
  const migrations = getMigrationFiles(migrationsDir);
  const coreSchemaMigration = migrations.find((m) =>
    m.filename.includes("core_schemas")
  );

  it("should find the canonical core schemas migration file", () => {
    assert.ok(coreSchemaMigration, "Migration 20261019000001_core_schemas.sql must exist");
    assert.equal(coreSchemaMigration.version, "20261019000001");
    assert.equal(coreSchemaMigration.hash.length, 64);
  });

  it("should define all required PostgreSQL enums", () => {
    const sql = coreSchemaMigration!.sql;
    assert.ok(sql.includes("CREATE TYPE public.admin_role_enum"), "Must define admin_role_enum");
    assert.ok(sql.includes("CREATE TYPE public.content_status_enum"), "Must define content_status_enum");
    assert.ok(sql.includes("CREATE TYPE public.project_category_enum"), "Must define project_category_enum");
    assert.ok(sql.includes("CREATE TYPE public.inquiry_status_enum"), "Must define inquiry_status_enum");
    assert.ok(sql.includes("CREATE TYPE public.audit_action_enum"), "Must define audit_action_enum");
    assert.ok(sql.includes("CREATE TYPE public.audit_entity_enum"), "Must define audit_entity_enum");
  });

  it("should define all 5 core tables with correct constraints", () => {
    const sql = coreSchemaMigration!.sql;

    // 1. admin_users table
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.admin_users"));
    assert.ok(sql.includes("user_id UUID PRIMARY KEY"));
    assert.ok(sql.includes("role public.admin_role_enum"));

    // 2. projects table
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.projects"));
    assert.ok(sql.includes("slug TEXT UNIQUE NOT NULL"));
    assert.ok(sql.includes("year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2035)"));
    assert.ok(
      sql.includes("youtube_video_id VARCHAR(11) CHECK (youtube_video_id IS NULL OR youtube_video_id ~ '^[a-zA-Z0-9_-]{11}$')"),
      "Must constrain youtube_video_id to valid 11-char pattern"
    );

    // 3. site_content table
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.site_content"));
    assert.ok(sql.includes("section_key TEXT PRIMARY KEY"));
    assert.ok(sql.includes("data JSONB NOT NULL"));

    // 4. inquiries table
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.inquiries"));
    assert.ok(sql.includes("status public.inquiry_status_enum"));

    // 5. content_audit_logs table
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.content_audit_logs"));
    assert.ok(sql.includes("entity_type public.audit_entity_enum NOT NULL"));
    assert.ok(sql.includes("action public.audit_action_enum NOT NULL"));
    assert.ok(sql.includes("before_state JSONB"));
    assert.ok(sql.includes("after_state JSONB"));
  });

  it("should configure optimized partial indexes and GIN tag indexing", () => {
    const sql = coreSchemaMigration!.sql;

    // Partial index for published projects
    assert.ok(sql.includes("CREATE INDEX IF NOT EXISTS idx_projects_public_listing"));
    assert.ok(sql.includes("WHERE status = 'published'"));

    // Category partial index
    assert.ok(sql.includes("CREATE INDEX IF NOT EXISTS idx_projects_category"));

    // GIN index for project tags
    assert.ok(sql.includes("idx_projects_tags ON public.projects USING GIN (tags)"));

    // Admin users active lookup index
    assert.ok(sql.includes("idx_admin_users_lookup ON public.admin_users (user_id) WHERE is_active = true"));

    // Audit logs indexes
    assert.ok(sql.includes("idx_audit_entity ON public.content_audit_logs (entity_type, entity_id)"));
  });

  it("should configure automated audit logging triggers", () => {
    const sql = coreSchemaMigration!.sql;

    assert.ok(sql.includes("FUNCTION public.audit_project_mutation()"));
    assert.ok(sql.includes("TRIGGER trg_audit_projects"));
    assert.ok(sql.includes("FUNCTION public.audit_site_content_mutation()"));
    assert.ok(sql.includes("TRIGGER trg_audit_site_content"));
    assert.ok(sql.includes("FUNCTION public.set_current_timestamp_updated_at()"));
  });
});
