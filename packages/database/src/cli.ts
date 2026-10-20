import fs from "fs";
import path from "path";
import { Client } from "pg";
import { parseDatabaseEnv } from "./config/env";
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
          res.status === "applied" ? "✅" : res.status === "already_applied" ? "⏹️" : "❌";
        console.log(`  ${icon} [${res.status.toUpperCase()}] ${res.filename} ${res.durationMs ? `(${res.durationMs}ms)` : ""}`);
        if (res.error) {
          console.error(`     Error: ${res.error}`);
        }
      }
      break;
    }

    case "reset": {
      console.log("Resetting database schema & replaying canonical migrations...");
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

    default: {
      console.error(`Unknown command: ${command}. Available: status, check, migrate, reset`);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error("Fatal CLI error:", err.message);
  process.exit(1);
});
