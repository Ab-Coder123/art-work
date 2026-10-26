import fs from "fs";
import path from "path";
import { Client } from "pg";
import { parseDatabaseEnv } from "./config/env";
import { createAdminClient } from "./client/admin";
import { getMigrationFiles, runMigrations } from "./migrations/runner";
import { performSystemHealthAudit, testDatabaseHandshake } from "./health/check";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "status";

  const env = parseDatabaseEnv();
  console.log("================================================================================");
  console.log(`ART WORK PLATFORM — DATABASE CLI (Command: ${command})`);
  console.log("================================================================================");

  switch (command) {
    case "status": {
      console.log(`Node Environment:  ${env.NODE_ENV}`);
      console.log(`Supabase URL:      ${env.NEXT_PUBLIC_SUPABASE_URL}`);
      console.log(`Database Pooler:   ${env.DATABASE_POOL_URL}`);
      console.log(`Direct DB URL:     ${env.DATABASE_URL}`);
      console.log("--------------------------------------------------------------------------------");

      const migrations = getMigrationFiles();
      console.log(`Canonical Migrations in supabase/migrations/ (${migrations.length} found):`);
      for (const m of migrations) {
        console.log(`  • [${m.version}] ${m.filename} (SHA-256: ${m.hash.slice(0, 12)}...)`);
      }

      console.log("--------------------------------------------------------------------------------");
      const audit = await performSystemHealthAudit({ checkLiveHandshake: false });
      console.log(`Pooler Compatible: ${audit.pooler.compatible ? "✅ YES" : "❌ NO"}`);
      console.log(`disablePreparedStatements: ${audit.pooler.disablePreparedStatements ? "✅ TRUE" : "❌ FALSE"}`);
      if (audit.pooler.warnings.length > 0) {
        console.log("Warnings:");
        audit.pooler.warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
      }
      break;
    }

    case "check": {
      console.log("Running comprehensive deterministic health check...");
      const audit = await performSystemHealthAudit({ checkLiveHandshake: true });
      console.log(`Overall Health:    ${audit.ok ? "✅ HEALTHY" : "⚠️ ATTENTION NEEDED"}`);
      console.log(`Pooler Mode:       ${audit.pooler.compatible ? "✅ COMPATIBLE" : "❌ MISCONFIGURED"}`);
      if (audit.databaseHandshake) {
        console.log(`PostgreSQL Ping:   ${audit.databaseHandshake.connected ? "✅ CONNECTED" : "❌ OFFLINE"}`);
        if (audit.databaseHandshake.connected) {
          console.log(`Database:          ${audit.databaseHandshake.databaseName}`);
          console.log(`Server Version:    ${audit.databaseHandshake.serverVersion}`);
          console.log(`Latency:           ${audit.databaseHandshake.latencyMs}ms`);
        } else {
          console.log(`Handshake Info:    ${audit.databaseHandshake.error}`);
        }
      }
      break;
    }

    case "migrate": {
      console.log("Executing pending canonical migrations...");
      const results = await runMigrations();
      for (const res of results) {
        const icon =
          res.status === "applied"
            ? "✅"
            : res.status === "already_applied"
            ? "⏹️"
            : res.status === "drift_detected"
            ? "⚠️"
            : "❌";
        console.log(`  ${icon} [${res.status.toUpperCase()}] ${res.filename} ${res.durationMs ? `(${res.durationMs}ms)` : ""}`);
        if (res.error) {
          console.error(`     Error: ${res.error}`);
        }
      }
      break;
    }

    case "reset": {
      console.log("Validating safety guardrails before destructive reset...");

      if (process.env.NODE_ENV === "production" || env.NODE_ENV === "production") {
        console.error("❌ Refusing to reset database in production environment (NODE_ENV=production). Operation aborted.");
        process.exit(1);
      }

      let dbHost = "";
      try {
        const parsedUrl = new URL(env.DATABASE_URL);
        dbHost = parsedUrl.hostname;
      } catch {
        // ignore URL parse errors
      }

      const isLocal =
        dbHost === "localhost" ||
        dbHost === "127.0.0.1" ||
        dbHost === "::1" ||
        dbHost === "host.docker.internal" ||
        dbHost === "";

      const forceDropFlag = args.includes("--force-drop-local-only");

      if (!isLocal || !forceDropFlag) {
        console.error("❌ Destructive reset guardrail triggered!");
        console.error(`Target DB Host: ${dbHost || "unknown"}`);
        if (!isLocal) {
          console.error("   Reason: Target database is NOT local. Destructive DROP SCHEMA is strictly forbidden on remote/hosted databases.");
        }
        if (!forceDropFlag) {
          console.error("   Reason: Missing required explicit safety confirmation flag: '--force-drop-local-only'");
        }
        console.error("Operation aborted safely to prevent accidental data loss.");
        process.exit(1);
      }

      console.log(`Resetting local database schema on host '${dbHost}' & replaying canonical migrations...`);
      const client = new Client({ connectionString: env.DATABASE_URL });
      try {
        await client.connect();
        console.log("Dropping public schema cascade...");
        await client.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;");
        await client.end();

        console.log("Re-applying canonical migrations from scratch...");
        const results = await runMigrations();
        for (const res of results) {
          console.log(`  ✅ [${res.status.toUpperCase()}] ${res.filename} (${res.durationMs || 0}ms)`);
        }

        const candidateSeedPaths = [
          path.resolve(process.cwd(), "supabase", "seed.sql"),
          path.resolve(process.cwd(), "..", "supabase", "seed.sql"),
          path.resolve(process.cwd(), "..", "..", "supabase", "seed.sql"),
        ];
        const seedPath = candidateSeedPaths.find((p) => fs.existsSync(p));
        if (seedPath) {
          console.log(`Applying baseline seed script (${seedPath})...`);
          const seedClient = new Client({ connectionString: env.DATABASE_URL });
          await seedClient.connect();
          const seedSql = fs.readFileSync(seedPath, "utf-8");
          await seedClient.query(seedSql);
          await seedClient.end();
          console.log("  ✅ Seed applied successfully.");
        }
        console.log("Database reset completed successfully!");
      } catch (err: any) {
        console.error("Database reset encountered an error:", err.message);
        process.exitCode = 1;
      }
      break;
    }

    case "seed-admin": {
      const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
      const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
      const fullName = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || "Chief Studio Administrator";

      if (!email || !password) {
        console.error("ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD environment variables are required.");
        process.exitCode = 1;
        break;
      }

      const supabaseAdmin = createAdminClient(env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
      if (listErr) {
        throw new Error(`Failed to list users: ${listErr.message}`);
      }

      const existing = listData.users.find((u) => u.email?.toLowerCase() === email);
      let userId: string;

      if (existing) {
        const { data: updated, error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        });
        if (updErr || !updated.user) {
          throw new Error(`Failed to update admin user: ${updErr?.message}`);
        }
        userId = updated.user.id;
        console.log(`Updated existing Auth user: ${email} (${userId})`);
      } else {
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (createErr || !created.user) {
          throw new Error(`Failed to create admin user: ${createErr?.message}`);
        }
        userId = created.user.id;
        console.log(`Created new Auth user: ${email} (${userId})`);
      }

      const { error: upsertErr } = await supabaseAdmin.from("admin_users").upsert(
        {
          user_id: userId,
          email,
          full_name: fullName,
          role: "super_admin",
          is_active: true,
        },
        { onConflict: "user_id" }
      );

      if (upsertErr) {
        throw new Error(`Failed to upsert public.admin_users: ${upsertErr.message}`);
      }

      console.log(`✅ Super Admin provisioned in public.admin_users: ${email}`);
      break;
    }

    default: {
      console.error(`Unknown command: ${command}. Available: status, check, migrate, reset, seed-admin`);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error("Fatal CLI error:", err.message);
  process.exit(1);
});
