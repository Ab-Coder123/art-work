import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { parseDatabaseEnv } from "../config/env";

/**
 * Creates a browser-safe Supabase client configured with public anonymous credentials.
 * Used exclusively in Client Components (apps/artwork-app and apps/admin).
 */
export function createBrowserClient(customUrl?: string, customAnonKey?: string) {
  let url = customUrl;
  let anonKey = customAnonKey;

  if (!url || !anonKey) {
    // In browser context, read from NEXT_PUBLIC_ env vars
    url =
      url ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "http://127.0.0.1:54321";
    anonKey =
      anonKey ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key";
  }

  return createSupabaseBrowserClient(url, anonKey);
}
