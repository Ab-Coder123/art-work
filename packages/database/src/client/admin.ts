import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { parseDatabaseEnv } from "../config/env.js";

/**
 * Creates an administrative Supabase client using the service_role key.
 * 
 * ⚠️ SECURITY CRITICAL WARNING:
 * Operations executed with this client completely BYPASS PostgreSQL Row-Level Security (RLS).
 * This client is strictly restricted to:
 *   1. Initial super-admin bootstrap & seeding scripts.
 *   2. Supabase Auth Admin user management (e.g. inviting team members).
 *   3. Ephemeral automated test teardowns.
 * 
 * It must NEVER be imported or used in standard client-facing REST endpoints or Server Actions.
 */
export function createAdminClient(customServiceKey?: string): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "[SECURITY VIOLATION] createAdminClient cannot be executed in browser context. Service role keys must never leak to clients."
    );
  }

  const env = parseDatabaseEnv();
  const serviceKey = customServiceKey || env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "[DatabaseConfig] SUPABASE_SERVICE_ROLE_KEY is required to initialize an admin client, but none was provided."
    );
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
