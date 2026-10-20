import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr";
import { parseDatabaseEnv } from "../config/env";
import { AUTH_COOKIES } from "../auth/session";

export interface CookieMethodsServer {
  getAll: () => { name: string; value: string }[] | Promise<{ name: string; value: string }[]>;
  setAll?: (
    cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
  ) => void | Promise<void>;
}

/**
 * Creates a server-side Supabase client for Next.js Server Components, Server Actions, and Route Handlers.
 * Automatically forwards HttpOnly session cookies (`sb-access-token`) to preserve user identity and trigger PostgreSQL RLS.
 */
export function createServerClient(
  cookieStore: CookieMethodsServer,
  options?: { url?: string; anonKey?: string }
) {
  const env = parseDatabaseEnv();
  const url = options?.url || env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = options?.anonKey || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Extract synchronous sb-access-token if available so PostgREST RLS receives Authorization Bearer header
  let accessToken: string | undefined;
  try {
    const maybeCookies = cookieStore.getAll();
    if (Array.isArray(maybeCookies)) {
      accessToken = maybeCookies.find((c) => c.name === AUTH_COOKIES.ACCESS_TOKEN)?.value;
    }
  } catch {
    // Ignore if getAll is async
  }

  return createSupabaseServerClient(url, anonKey, {
    ...(accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : {}),
    cookies: {
      async getAll() {
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        if (cookieStore.setAll) {
          await cookieStore.setAll(cookiesToSet);
        }
      },
    },
  });
}
