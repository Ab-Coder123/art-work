import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getMigrationFiles } from "../src/migrations/runner";

describe("Phase 04: RLS & Storage Access Policy Verification", () => {
  const migrationsDir = path.resolve(process.cwd(), "..", "..", "supabase", "migrations");
  const migrations = getMigrationFiles(migrationsDir);
  const rls = migrations.find((m) => m.filename.includes("rls_policies"));
  const sql = rls?.sql ?? "";

  const tables = [
    "admin_users",
    "projects",
    "site_content",
    "inquiries",
    "content_audit_logs",
  ];

  it("should exist after core schemas in canonical ordering", () => {
    assert.ok(rls, "RLS migration must exist");
    const core = migrations.find((m) => m.filename.includes("core_schemas"))!;
    assert.ok(rls.version > core.version);
  });

  it("should enable RLS on every application table", () => {
    for (const t of tables) {
      assert.ok(
        new RegExp(`ALTER TABLE public\\.${t}\\s+ENABLE ROW LEVEL SECURITY`).test(sql),
        `RLS must be enabled on ${t}`
      );
    }
  });

  it("should define hardened SECURITY DEFINER admin helpers with fixed search_path", () => {
    for (const fn of ["is_admin", "is_super_admin"]) {
      const m = sql.match(new RegExp(`FUNCTION public\\.${fn}\\(\\)[\\s\\S]*?\\$\\$;`));
      assert.ok(m, `${fn} must be defined`);
      assert.ok(m[0].includes("SECURITY DEFINER"));
      assert.ok(m[0].includes("SET search_path = public"));
      assert.ok(m[0].includes("public.admin_users"));
      assert.ok(m[0].includes("is_active = true"));
    }
    assert.ok(sql.includes("REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC"));
  });

  it("should never derive admin rights from client-editable JWT metadata", () => {
    assert.ok(!/user_metadata|raw_user_meta_data|role\s*=\s*'admin'/.test(sql));
  });

  it("should limit anonymous project/content reads to published rows", () => {
    assert.ok(/projects_public_read_published[\s\S]*?USING \(status = 'published'\)/.test(sql));
    assert.ok(/site_content_public_read_published[\s\S]*?USING \(status = 'published'\)/.test(sql));
  });

  it("should restrict project and content mutations to admins", () => {
    for (const p of [
      "projects_admin_insert",
      "projects_admin_update",
      "projects_admin_delete",
      "site_content_admin_insert",
      "site_content_admin_update",
      "site_content_admin_delete",
    ]) {
      assert.ok(sql.includes(p), `${p} policy missing`);
    }
    assert.ok(!/FOR (INSERT|UPDATE|DELETE|ALL) TO anon/.test(sql.replace(/FOR INSERT TO anon, authenticated\s+WITH CHECK \(status = 'pending'\)/, "")));
  });

  it("should allow anonymous inquiry insert only as pending and no anonymous read", () => {
    assert.ok(/inquiries_public_insert[\s\S]*?WITH CHECK \(status = 'pending'\)/.test(sql));
    assert.ok(!/GRANT SELECT[^;]*inquiries[^;]*TO anon/.test(sql));
  });

  it("should keep audit logs read-only for admins (writes via definer triggers)", () => {
    assert.ok(sql.includes("audit_logs_admin_select"));
    assert.ok(!/ON public\.content_audit_logs\s+FOR (INSERT|UPDATE|DELETE|ALL)/.test(sql));
    assert.ok(sql.includes("GRANT SELECT ON public.content_audit_logs TO authenticated"));
  });

  it("should configure artwork-media bucket with size/MIME limits and admin-only writes", () => {
    assert.ok(sql.includes("'artwork-media'"));
    assert.ok(sql.includes("8388608"));
    assert.ok(sql.includes("'image/jpeg'") && sql.includes("'image/webp'"));
    assert.ok(!sql.includes("image/svg+xml"), "SVG uploads are excluded (XSS vector)");
    for (const p of ["admin_insert", "admin_update", "admin_delete"]) {
      assert.ok(new RegExp(`artwork_media_${p}[\\s\\S]*?public\\.is_admin\\(\\)`).test(sql));
    }
    assert.ok(sql.includes("to_regclass('storage.buckets')"), "must be guarded for plain PostgreSQL");
  });
});
