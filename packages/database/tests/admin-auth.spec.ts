import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LoginCredentialsSchema,
  verifyAdminMembership,
  authenticateAdmin,
  LoginRateLimiter,
  canWriteAdminData,
} from "../src/index";

describe("Phase 03: Administrator Authentication & Membership Verification", () => {
  it("allows editors and super admins to write but keeps viewers read-only", () => {
    assert.equal(canWriteAdminData("viewer"), false);
    assert.equal(canWriteAdminData("editor"), true);
    assert.equal(canWriteAdminData("super_admin"), true);
  });

  it("should validate credentials schema format strictly", () => {
    // Valid
    const valid = LoginCredentialsSchema.parse({
      email: "chief@artwork.stage",
      password: "strongPassword123!",
    });
    assert.equal(valid.email, "chief@artwork.stage");

    // Invalid email
    assert.throws(() => {
      LoginCredentialsSchema.parse({
        email: "not-an-email",
        password: "strongPassword123!",
      });
    }, /Please provide a valid studio administrator email/);

    // Password too short (< 8 chars)
    assert.throws(() => {
      LoginCredentialsSchema.parse({
        email: "chief@artwork.stage",
        password: "short",
      });
    }, /Password must contain at least 8 characters/);
  });

  it("should verify active administrator membership correctly", async () => {
    // Mock Supabase client where user exists and is_active = true
    const activeAdminClient: any = {
      from: () => ({
        select: () => ({
          eq: (col: string, val: any) => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  user_id: "00000000-0000-0000-0000-000000000001",
                  email: "chief@artwork.stage",
                  full_name: "Chief Director",
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
      activeAdminClient,
      "00000000-0000-0000-0000-000000000001"
    );
    assert.equal(res.isAuthorized, true);
    assert.equal(res.adminUser?.role, "super_admin");
    assert.equal(res.adminUser?.email, "chief@artwork.stage");
  });

  it("should deny access if user is not in admin_users or inactive", async () => {
    // Mock Supabase client where user is not found
    const nonAdminClient: any = {
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

    const res = await verifyAdminMembership(nonAdminClient, "some-random-user-id");
    assert.equal(res.isAuthorized, false);
    assert.equal(res.adminUser, null);
  });

  it("should reject authentication and return 429 when rate limiter is exhausted", async () => {
    const rateLimiter = new LoginRateLimiter({ maxAttempts: 1, windowMs: 10000 });
    const key = "1.2.3.4:locked@artwork.stage";
    rateLimiter.recordFailure(key); // Exhausts attempt

    const mockClient: any = {};
    const res = await authenticateAdmin(
      { email: "locked@artwork.stage", password: "password123" },
      mockClient,
      { clientIp: "1.2.3.4", rateLimiter }
    );

    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 429);
      assert.ok(res.error.includes("Too many failed login attempts"));
      assert.ok(res.retryAfterSeconds! > 0);
    }
  });

  it("should return 401 and increment failures on invalid password", async () => {
    const rateLimiter = new LoginRateLimiter({ maxAttempts: 3, windowMs: 10000 });
    const mockClient: any = {
      auth: {
        signInWithPassword: async () => ({
          data: { session: null, user: null },
          error: { message: "Invalid login credentials" },
        }),
      },
    };

    const res = await authenticateAdmin(
      { email: "admin@artwork.stage", password: "wrong-password" },
      mockClient,
      { clientIp: "1.2.3.4", rateLimiter }
    );

    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 401);
      assert.equal(res.error, "Invalid email or password.");
    }
    // Rate limit remaining attempts should be decremented
    assert.equal(rateLimiter.checkLimit("1.2.3.4:admin@artwork.stage").remainingAttempts, 2);
  });

  it("should return 403 and sign out if user is in auth.users but NOT in public.admin_users", async () => {
    let signedOut = false;
    const rateLimiter = new LoginRateLimiter({ maxAttempts: 5, windowMs: 10000 });

    const mockClient: any = {
      auth: {
        signInWithPassword: async () => ({
          data: {
            session: { access_token: "token-123", refresh_token: "refresh-123" },
            user: { id: "rogue-user-id", email: "rogue@example.com" },
          },
          error: null,
        }),
        signOut: async () => {
          signedOut = true;
        },
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    };

    const res = await authenticateAdmin(
      { email: "rogue@example.com", password: "validPassword123!" },
      mockClient,
      { clientIp: "1.2.3.4", rateLimiter }
    );

    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 403);
      assert.ok(res.error.includes("not authorized as an active studio administrator"));
    }
    assert.equal(signedOut, true, "Must revoke session immediately if user is not in admin_users");
  });

  it("should succeed with 200, session, admin profile, and CSRF token for verified active admin", async () => {
    const rateLimiter = new LoginRateLimiter({ maxAttempts: 5, windowMs: 10000 });

    const mockClient: any = {
      auth: {
        signInWithPassword: async () => ({
          data: {
            session: {
              access_token: "valid-access-token",
              refresh_token: "valid-refresh-token",
              expires_in: 3600,
            },
            user: { id: "super-admin-uuid", email: "chief@artwork.stage" },
          },
          error: null,
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  user_id: "super-admin-uuid",
                  email: "chief@artwork.stage",
                  full_name: "Chief Director",
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

    const res = await authenticateAdmin(
      { email: "chief@artwork.stage", password: "validPassword123!" },
      mockClient,
      { clientIp: "1.2.3.4", rateLimiter }
    );

    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.adminUser.email, "chief@artwork.stage");
      assert.equal(res.adminUser.role, "super_admin");
      assert.equal(res.adminUser.full_name, "Chief Director");
      assert.equal(typeof res.csrfToken, "string");
      assert.equal(res.csrfToken.length, 64);
    }
  });
});
