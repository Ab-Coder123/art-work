import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getAuthCookieOptions,
  getCsrfCookieOptions,
  AUTH_COOKIES,
} from "../src/index";

describe("Phase 03: Session Lifecycle & Cookie Security Configuration", () => {
  it("should configure strict HttpOnly and SameSite=Lax for auth session cookies", () => {
    const devOptions = getAuthCookieOptions(false);
    assert.equal(devOptions.httpOnly, true, "Auth cookies must be HttpOnly to prevent XSS leakage");
    assert.equal(devOptions.sameSite, "lax", "Must enforce SameSite=Lax");
    assert.equal(devOptions.secure, false, "Secure is false in local dev");
    assert.equal(devOptions.path, "/");

    const prodOptions = getAuthCookieOptions(true);
    assert.equal(prodOptions.httpOnly, true);
    assert.equal(prodOptions.secure, true, "Must be Secure (HTTPS) in production");
    assert.equal(prodOptions.sameSite, "lax");
  });

  it("should configure client-readable cookie for CSRF token", () => {
    const csrfOptions = getCsrfCookieOptions(true);
    assert.equal(
      csrfOptions.httpOnly,
      false,
      "CSRF token cookie must be client-readable for double-submit header attachment"
    );
    assert.equal(csrfOptions.secure, true);
    assert.equal(csrfOptions.sameSite, "lax");
  });

  it("should export standard cookie names", () => {
    assert.equal(AUTH_COOKIES.ACCESS_TOKEN, "sb-access-token");
    assert.equal(AUTH_COOKIES.REFRESH_TOKEN, "sb-refresh-token");
    assert.equal(AUTH_COOKIES.CSRF_TOKEN, "csrf-token");
  });
});
