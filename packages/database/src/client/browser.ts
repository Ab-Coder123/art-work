import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { parseDatabaseEnv } from "../config/env";

/**
 * Creates a public anonymous Supabase client.
 * In browser contexts, uses `@supabase/ssr` browser client.
 * In Node.js server contexts (e.g. login route handler or tests), uses an in-memory session store
 * so `signInWithPassword` + immediate RLS queries carry the authenticated JWT.
 */
export function createBrowserClient(customUrl?: string, customAnonKey?: string) {
  let url = customUrl;
  let anonKey = customAnonKey;

  if (!url || !anonKey) {
    url =
      url ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "http://127.0.0.1:54321";
    anonKey =
      anonKey ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key";
  }

  if (typeof window === "undefined") {
    return createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createSupabaseBrowserClient(url, anonKey);
}
