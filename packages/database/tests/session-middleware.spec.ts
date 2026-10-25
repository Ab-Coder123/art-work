import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_COOKIES,
  getAuthCookieOptions,
  getCsrfCookieOptions,
} from "../src/auth/session";
import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_HEADER_NAME,
} from "../src/auth/csrf";
import {
  canWriteAdminData,
  verifyAdminMembership,
} from "../src/auth/admin-auth";
import type { AdminRole } from "../src/schemas/admin-user";

describe("Phase 09: Session Middleware & Role Enforcement", () => {
  it("should enforce strict role write boundaries (super_admin & editor write, viewer read-only)", () => {
    assert.equal(canWriteAdminData("super_admin"), true);
    assert.equal(canWriteAdminData("editor"), true);
    assert.equal(canWriteAdminData("viewer"), false);
    // Explicit type-check
    const roles: AdminRole[] = ["super_admin", "editor", "viewer"];
    const writableRoles = roles.filter(canWriteAdminData);
    assert.deepEqual(writableRoles, ["super_admin", "editor"]);
  });

  it("should configure secure HttpOnly options for production vs development", () => {
    const prodOptions = getAuthCookieOptions(true);
    assert.equal(prodOptions.httpOnly, true);
    assert.equal(prodOptions.secure, true);
    assert.equal(prodOptions.sameSite, "lax");
    assert.equal(prodOptions.path, "/");

    const devOptions = getAuthCookieOptions(false);
    assert.equal(devOptions.httpOnly, true);
    assert.equal(devOptions.secure, false);
  });

  it("should configure client-readable cookie options for CSRF tokens", () => {
    const csrfOptions = getCsrfCookieOptions(true);
    assert.equal(csrfOptions.httpOnly, false);
    assert.equal(csrfOptions.secure, true);
    assert.equal(csrfOptions.path, "/");
  });

  it("should correctly validate matching CSRF tokens and reject mismatched or missing ones", () => {
    const token = generateCsrfToken();
    assert.equal(validateCsrfToken(token, token), true);
    assert.equal(validateCsrfToken(token, "invalid_cookie_token"), false);
    assert.equal(validateCsrfToken(null, token), false);
    assert.equal(validateCsrfToken(token, null), false);
    assert.equal(validateCsrfToken(undefined, undefined), false);
  });

  it("should verify admin membership correctly using mock Supabase client", async () => {
    const mockSupabaseAdminActive = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  user_id: "526191ee-4398-4617-ad66-30734ada24d3",
                  email: "abdulrahmanahm7li@gmail.com",
                  full_name: "Lead Architect",
                  role: "super_admin",
                  is_active: true,
                },
                error: null,
              }),
            }),
          }),
        }),
      }),
    };

    const res = await verifyAdminMembership(
      mockSupabaseAdminActive as any,
      "526191ee-4398-4617-ad66-30734ada24d3"
    );
    assert.equal(res.isAuthorized, true);
    assert.equal(res.adminUser?.role, "super_admin");
    assert.equal(res.adminUser?.email, "abdulrahmanahm7li@gmail.com");
  });

  it("should deny access if admin user is not active or missing from table", async () => {
    const mockSupabaseInactive = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      }),
    };

    const res = await verifyAdminMembership(mockSupabaseInactive as any, "random-uuid");
    assert.equal(res.isAuthorized, false);
    assert.equal(res.adminUser, null);
  });

  it("should define standard header names and cookie keys", () => {
    assert.equal(CSRF_HEADER_NAME, "x-csrf-token");
    assert.equal(AUTH_COOKIES.ACCESS_TOKEN, "sb-access-token");
    assert.equal(AUTH_COOKIES.REFRESH_TOKEN, "sb-refresh-token");
    assert.equal(AUTH_COOKIES.CSRF_TOKEN, "csrf-token");
  });
});
