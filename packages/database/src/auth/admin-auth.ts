import { z } from "zod";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { generateCsrfToken } from "./csrf";
import { LoginRateLimiter, globalLoginRateLimiter } from "./rate-limiter";
import { AUTH_COOKIES } from "./session";
import { createServerClient, type CookieMethodsServer } from "../client/server";
import type { AdminRole, AdminUserRow } from "../schemas/admin-user";

export const LoginCredentialsSchema = z.object({
  email: z.string().email("Please provide a valid studio administrator email"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export interface AuthSuccessResult {
  ok: true;
  session: Session;
  adminUser: Pick<AdminUserRow, "user_id" | "email" | "full_name" | "role">;
  csrfToken: string;
}

export interface AuthFailureResult {
  ok: false;
  status: 400 | 401 | 403 | 429;
  error: string;
  retryAfterSeconds?: number;
}

export type AuthResult = AuthSuccessResult | AuthFailureResult;

/** Viewer accounts can inspect permitted records but cannot mutate them. */
export function canWriteAdminData(role: AdminRole): boolean {
  return role === "super_admin" || role === "editor";
}

/**
 * Checks whether a given user UUID belongs to an active administrator in public.admin_users.
 */
export async function verifyAdminMembership(
  supabase: SupabaseClient,
  userId: string
): Promise<{ isAuthorized: boolean; adminUser: Pick<AdminUserRow, "user_id" | "email" | "full_name" | "role"> | null }> {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id, email, full_name, role, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return { isAuthorized: false, adminUser: null };
    }

    return {
      isAuthorized: true,
      adminUser: {
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
      },
    };
  } catch {
    return { isAuthorized: false, adminUser: null };
  }
}

/**
 * Executes full administrator authentication pipeline:
 * Rate Limiting -> Supabase Auth -> public.admin_users Membership Check -> CSRF Token Generation
 */
export async function authenticateAdmin(
  credentials: LoginCredentials,
  supabase: SupabaseClient,
  options?: {
    clientIp?: string;
    rateLimiter?: LoginRateLimiter;
  }
): Promise<AuthResult> {
  const limiter = options?.rateLimiter || globalLoginRateLimiter;
  const throttleKey = `${options?.clientIp || "unknown"}:${credentials.email.toLowerCase()}`;

  // 1. Check Rate Limiter
  const limitStatus = limiter.checkLimit(throttleKey);
  if (!limitStatus.allowed) {
    return {
      ok: false,
      status: 429,
      error: `Too many failed login attempts. Account temporarily locked for 15 minutes.`,
      retryAfterSeconds: limitStatus.retryAfterSeconds,
    };
  }

  // 2. Validate Credentials format
  const parseResult = LoginCredentialsSchema.safeParse(credentials);
  if (!parseResult.success) {
    return {
      ok: false,
      status: 400,
      error: parseResult.error.errors[0]?.message || "Invalid credentials format",
    };
  }

  // 3. Attempt Supabase Auth Sign-In
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (authError || !authData.session || !authData.user) {
    const failStatus = limiter.recordFailure(throttleKey);
    return {
      ok: false,
      status: 401,
      error: "Invalid email or password.",
      retryAfterSeconds: failStatus.retryAfterSeconds,
    };
  }

  // 4. Verify Administrator Membership in public.admin_users
  const membership = await verifyAdminMembership(supabase, authData.user.id);
  if (!membership.isAuthorized || !membership.adminUser) {
    // Revoke the Supabase session immediately
    await supabase.auth.signOut();
    limiter.recordFailure(throttleKey);

    return {
      ok: false,
      status: 403,
      error: "Access denied. Your account is not authorized as an active studio administrator.",
    };
  }

  // 5. Authentication Successful: Reset rate limiter and return session with CSRF token
  limiter.recordSuccess(throttleKey);
  const csrfToken = generateCsrfToken();

  return {
    ok: true,
    session: authData.session,
    adminUser: membership.adminUser,
    csrfToken,
  };
}

/**
 * Validates an incoming server request's cookies (`sb-access-token` or SSR session cookies)
 * and verifies that the authenticated user is an active administrator in `public.admin_users`.
 */
export async function verifyAdminSessionFromCookies(
  cookieStore: CookieMethodsServer,
  options: { requireWriteAccess?: boolean } = {}
): Promise<
  | {
      ok: true;
      supabase: SupabaseClient;
      adminUser: Pick<AdminUserRow, "user_id" | "email" | "full_name" | "role">;
    }
  | {
      ok: false;
      status: 401 | 403;
      error: string;
    }
> {
  const cookies = await cookieStore.getAll();
  const accessToken = cookies.find((c) => c.name === AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const supabase = createServerClient({
    getAll: () => cookies,
    setAll: cookieStore.setAll,
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const membership = await verifyAdminMembership(supabase, user.id);
  if (!membership.isAuthorized || !membership.adminUser) {
    return {
      ok: false,
      status: 403,
      error: "Administrator access required",
    };
  }

  if (options.requireWriteAccess && !canWriteAdminData(membership.adminUser.role)) {
    return {
      ok: false,
      status: 403,
      error: "Editor access required",
    };
  }

  return {
    ok: true,
    supabase,
    adminUser: membership.adminUser,
  };
}
