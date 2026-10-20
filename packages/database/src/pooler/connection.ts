import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";
import { parseDatabaseEnv, validatePoolerUrl } from "../config/env";

export interface SupavisorPoolConfig extends PoolConfig {
  /**
   * Supavisor Transaction Pooler requires prepared statements to be disabled.
   * If true or undefined, prepared statements are prevented.
   */
  disablePreparedStatements: boolean;
}

/**
 * Derives production-grade connection options tailored for Supavisor in transaction mode.
 */
export function getSupavisorPoolOptions(
  poolUrl?: string,
  overrides: Partial<PoolConfig> = {}
): SupavisorPoolConfig {
  const env = parseDatabaseEnv();
  const targetUrl = poolUrl || env.DATABASE_POOL_URL;

  const urlCheck = validatePoolerUrl(targetUrl);
  if (!urlCheck.isValid && env.NODE_ENV === "production") {
    throw new Error(`[Supavisor] Invalid pooler URL: ${urlCheck.warning}`);
  }

  const isLocal =
    targetUrl.includes("localhost") ||
    targetUrl.includes("127.0.0.1") ||
    targetUrl.includes("0.0.0.0");

  return {
    connectionString: targetUrl,
    max: 20, // Recommended pool size for serverless Node instances behind Supavisor
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // In transaction pooling mode, prepared statements MUST be disabled
    disablePreparedStatements: true,
    // SSL configuration: disabled for local testing, required with rejectUnauthorized: false for hosted Supabase
    ssl: isLocal ? false : { rejectUnauthorized: false },
    ...overrides,
  };
}

/**
 * Creates a configured PostgreSQL Pool instance with Supavisor safeguards.
 */
export function createSupavisorPool(config?: Partial<SupavisorPoolConfig>): Pool {
  const poolOptions = getSupavisorPoolOptions(config?.connectionString, config);
  const pool = new Pool(poolOptions);

  pool.on("error", (err) => {
    // Prevent unhandled errors from terminating Node server
    console.error("[Supavisor Pool Error]:", err.message);
  });

  return pool;
}

/**
 * Safely executes a query through the pooler ensuring no named prepared statements are registered.
 */
export async function executePoolQuery<R extends QueryResultRow = any>(
  pool: Pool,
  queryText: string,
  values: any[] = []
): Promise<QueryResult<R>> {
  // Never pass a "name" property to prevent pg from creating server-side prepared statements
  return pool.query<R>({
    text: queryText,
    values,
    name: undefined, // Explicitly undefined to enforce stateless execution in Supavisor
  });
}
