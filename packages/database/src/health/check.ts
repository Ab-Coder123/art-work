import { Pool, Client } from "pg";
import { parseDatabaseEnv, validatePoolerUrl, type DatabaseEnv } from "../config/env.js";
import { getSupavisorPoolOptions, type SupavisorPoolConfig } from "../pooler/connection.js";

export interface HealthAuditResult {
  ok: boolean;
  timestamp: string;
  environment: {
    nodeEnv: string;
    supabaseUrl: string;
    hasAnonKey: boolean;
    hasServiceKey: boolean;
  };
  pooler: {
    compatible: boolean;
    poolerUrlValid: boolean;
    disablePreparedStatements: boolean;
    maxConnections: number;
    warnings: string[];
  };
  databaseHandshake?: {
    connected: boolean;
    serverVersion?: string;
    databaseName?: string;
    latencyMs?: number;
    error?: string;
  };
}

/**
 * Deterministically audits database environment and pooler parameters without throwing uncaught exceptions.
 */
export function auditPoolerConfiguration(
  customEnv?: Partial<DatabaseEnv>,
  customPoolConfig?: Partial<SupavisorPoolConfig>
): {
  compatible: boolean;
  warnings: string[];
  config: SupavisorPoolConfig;
} {
  const warnings: string[] = [];
  const poolConfig = getSupavisorPoolOptions(customPoolConfig?.connectionString, customPoolConfig);

  // 1. Supavisor transaction mode must disable prepared statements
  if (!poolConfig.disablePreparedStatements) {
    warnings.push("Supavisor transaction pooler requires prepared statements to be disabled (disablePreparedStatements must be true).");
  }

  // 2. Max connections check
  if ((poolConfig.max || 0) > 50) {
    warnings.push("Pool size exceeds 50; recommend keeping <= 20 connections per serverless instance behind Supavisor.");
  }

  // 3. Pooler URL validation
  if (poolConfig.connectionString) {
    const check = validatePoolerUrl(poolConfig.connectionString);
    if (!check.isValid && check.warning) {
      warnings.push(check.warning);
    }
  }

  return {
    compatible: warnings.length === 0,
    warnings,
    config: poolConfig,
  };
}

/**
 * Attempts a live handshake against PostgreSQL.
 * If the database is offline or unreachable, cleanly captures the error without throwing.
 */
export async function testDatabaseHandshake(
  connectionString?: string,
  timeoutMs: number = 3000
): Promise<{
  connected: boolean;
  serverVersion?: string;
  databaseName?: string;
  latencyMs?: number;
  error?: string;
}> {
  const env = parseDatabaseEnv();
  const targetUri = connectionString || env.DATABASE_URL;

  const client = new Client({
    connectionString: targetUri,
    connectionTimeoutMillis: timeoutMs,
    statement_timeout: timeoutMs,
  });

  const startTime = Date.now();

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 AS connected, current_database() AS database_name, current_setting('server_version') AS server_version"
    );
    const latencyMs = Date.now() - startTime;
    await client.end();

    return {
      connected: true,
      serverVersion: res.rows[0]?.server_version,
      databaseName: res.rows[0]?.database_name,
      latencyMs,
    };
  } catch (err: any) {
    try {
      await client.end();
    } catch {
      // Ignore cleanup error if connect failed
    }

    return {
      connected: false,
      error: err?.message || "Failed to establish PostgreSQL connection",
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Full system health check combining static environment audit and optional live handshake.
 */
export async function performSystemHealthAudit(options?: {
  checkLiveHandshake?: boolean;
}): Promise<HealthAuditResult> {
  const env = parseDatabaseEnv();
  const poolerAudit = auditPoolerConfiguration();

  const result: HealthAuditResult = {
    ok: poolerAudit.compatible,
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: env.NODE_ENV,
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
    },
    pooler: {
      compatible: poolerAudit.compatible,
      poolerUrlValid: validatePoolerUrl(env.DATABASE_POOL_URL).isValid,
      disablePreparedStatements: poolerAudit.config.disablePreparedStatements,
      maxConnections: poolerAudit.config.max || 20,
      warnings: poolerAudit.warnings,
    },
  };

  if (options?.checkLiveHandshake) {
    result.databaseHandshake = await testDatabaseHandshake(env.DATABASE_URL);
    if (!result.databaseHandshake.connected) {
      result.ok = false;
    }
  }

  return result;
}
