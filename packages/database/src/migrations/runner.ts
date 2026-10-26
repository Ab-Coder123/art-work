import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Client } from "pg";
import { parseDatabaseEnv } from "../config/env";

export interface MigrationFile {
  filename: string;
  filepath: string;
  version: string;
  hash: string;
  sql: string;
}

export interface MigrationResult {
  filename: string;
  status: "applied" | "already_applied" | "skipped" | "failed" | "drift_detected";
  durationMs?: number;
  error?: string;
  expectedHash?: string;
  recordedHash?: string;
}

/**
 * Finds the canonical migrations directory across monorepo workspace depths.
 */
export function resolveMigrationsDir(explicitDir?: string): string {
  if (explicitDir !== undefined) {
    return explicitDir;
  }

  const candidatePaths = [
    path.resolve(process.cwd(), "supabase", "migrations"),
    path.resolve(process.cwd(), "..", "supabase", "migrations"),
    path.resolve(process.cwd(), "..", "..", "supabase", "migrations"),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), "supabase", "migrations");
}

/**
 * Discovers all canonical migration files in supabase/migrations/
 */
export function getMigrationFiles(migrationsDir?: string): MigrationFile[] {
  const dir = resolveMigrationsDir(migrationsDir);
  
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return files.map((filename) => {
    const filepath = path.join(dir, filename);
    const sql = fs.readFileSync(filepath, "utf-8");
    const hash = crypto.createHash("sha256").update(sql).digest("hex");
    const version = filename.split("_")[0] || filename;

    return { filename, filepath, version, hash, sql };
  });
}

/**
 * Initializes the migrations tracking table if not present.
 */
async function ensureMigrationsTable(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public._art_work_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      version TEXT NOT NULL,
      hash TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

/**
 * Runs pending migrations against target PostgreSQL database.
 */
export async function runMigrations(options?: {
  connectionString?: string;
  migrationsDir?: string;
  dryRun?: boolean;
  strictDriftCheck?: boolean;
}): Promise<MigrationResult[]> {
  const env = parseDatabaseEnv();
  const connString = options?.connectionString || env.DATABASE_URL;
  const migrations = getMigrationFiles(options?.migrationsDir);

  const client = new Client({ connectionString: connString });
  const results: MigrationResult[] = [];

  try {
    await client.connect();
    await ensureMigrationsTable(client);

    const appliedQuery = await client.query<{ filename: string; hash?: string }>(
      "SELECT filename, hash FROM public._art_work_migrations ORDER BY id ASC;"
    );
    const appliedMap = new Map(appliedQuery.rows.map((r) => [r.filename, r.hash]));

    for (const migration of migrations) {
      if (appliedMap.has(migration.filename)) {
        const recordedHash = appliedMap.get(migration.filename);
        if (recordedHash && recordedHash !== migration.hash) {
          const driftErr = `Migration hash drift detected for '${migration.filename}'. Recorded hash: '${recordedHash}', but source file hash is '${migration.hash}'. Migration files must be immutable once applied.`;
          results.push({
            filename: migration.filename,
            status: "drift_detected",
            error: driftErr,
            expectedHash: migration.hash,
            recordedHash,
          });
          if (options?.strictDriftCheck) {
            throw new Error(driftErr);
          }
          continue;
        }

        results.push({
          filename: migration.filename,
          status: "already_applied",
        });
        continue;
      }

      if (options?.dryRun) {
        results.push({
          filename: migration.filename,
          status: "skipped",
        });
        continue;
      }

      const startTime = Date.now();
      try {
        await client.query("BEGIN;");
        await client.query(migration.sql);
        await client.query(
          "INSERT INTO public._art_work_migrations (filename, version, hash) VALUES ($1, $2, $3);",
          [migration.filename, migration.version, migration.hash]
        );
        await client.query("COMMIT;");

        results.push({
          filename: migration.filename,
          status: "applied",
          durationMs: Date.now() - startTime,
        });
      } catch (err: any) {
        await client.query("ROLLBACK;");
        results.push({
          filename: migration.filename,
          status: "failed",
          error: err?.message || String(err),
          durationMs: Date.now() - startTime,
        });
        // Stop execution on first migration failure
        break;
      }
    }
    if (results.some((r) => r.status === "applied")) {
      try {
        await client.query("NOTIFY pgrst, 'reload schema';");
      } catch {
        // Safe fallback if NOTIFY is unsupported
      }
    }
  } finally {
    await client.end().catch(() => {});
  }

  return results;
}
