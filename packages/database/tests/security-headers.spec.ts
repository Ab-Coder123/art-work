import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildContentSecurityPolicy,
  getSecurityHeadersMap,
  getSecurityHeaders,
  applySecurityHeaders,
} from "../src/auth/security-headers";

describe("Phase 09: Security Headers & Content Security Policy (CSP)", () => {
  it("should configure CSP with YouTube embed and video hosts", () => {
    const csp = buildContentSecurityPolicy();

    assert.match(csp, /frame-src/);
    assert.match(csp, /https:\/\/www\.youtube\.com/);
    assert.match(csp, /https:\/\/www\.youtube-nocookie\.com/);
    assert.match(csp, /img-src.*https:\/\/i\.ytimg\.com/);
    assert.match(csp, /img-src.*https:\/\/img\.youtube\.com/);
  });

  it("should configure CSP with Supabase endpoints", () => {
    const csp = buildContentSecurityPolicy();

    assert.match(csp, /connect-src.*https:\/\/\*\.supabase\.co/);
    assert.match(csp, /connect-src.*wss:\/\/\*\.supabase\.co/);
    assert.match(csp, /img-src.*https:\/\/\*\.supabase\.co/);
  });

  it("should configure CSP with Vercel analytics endpoints", () => {
    const csp = buildContentSecurityPolicy();

    assert.match(csp, /script-src.*https:\/\/va\.vercel-scripts\.com/);
    assert.match(csp, /connect-src.*https:\/\/\*\.vercel-insights\.com/);
    assert.match(csp, /connect-src.*https:\/\/vitals\.vercel-insights\.com/);
  });

  it("should enforce clickjacking defense (frame-ancestors 'none' on admin, 'self' on web)", () => {
    const adminCsp = buildContentSecurityPolicy({ appType: "admin" });
    assert.match(adminCsp, /frame-ancestors 'none'/);

    const webCsp = buildContentSecurityPolicy({ appType: "web" });
    assert.match(webCsp, /frame-ancestors 'self'/);

    const adminHeaders = getSecurityHeadersMap({ appType: "admin" });
    assert.equal(adminHeaders["X-Frame-Options"], "DENY");

    const webHeaders = getSecurityHeadersMap({ appType: "web" });
    assert.equal(webHeaders["X-Frame-Options"], "SAMEORIGIN");
  });

  it("should include HSTS and upgrade-insecure-requests in production mode", () => {
    const prodHeaders = getSecurityHeadersMap({ isProduction: true });
    assert.equal(
      prodHeaders["Strict-Transport-Security"],
      "max-age=63072000; includeSubDomains; preload"
    );
    assert.match(prodHeaders["Content-Security-Policy"] || "", /upgrade-insecure-requests/);

    const devHeaders = getSecurityHeadersMap({ isProduction: false });
    assert.equal(devHeaders["Strict-Transport-Security"], undefined);
  });

  it("should include standard OWASP defensive headers", () => {
    const headers = getSecurityHeadersMap();

    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.equal(headers["X-XSS-Protection"], "1; mode=block");
    assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
    assert.match(headers["Permissions-Policy"] || "", /camera=\(\), microphone=\(\)/);
  });

  it("should allow custom CSP directive extensions", () => {
    const customCsp = buildContentSecurityPolicy({
      customCsp: {
        "connect-src": ["https://api.resend.com"],
        "media-src": ["https://cdn.artwork.local"],
      },
    });

    assert.match(customCsp, /https:\/\/api\.resend\.com/);
    assert.match(customCsp, /https:\/\/cdn\.artwork\.local/);
  });

  it("should return NextHeaderRule array for Next.js config", () => {
    const nextRules = getSecurityHeaders({ appType: "web", isProduction: true });

    assert.ok(Array.isArray(nextRules));
    assert.ok(nextRules.some((r) => r.key === "Content-Security-Policy"));
    assert.ok(nextRules.some((r) => r.key === "X-Content-Type-Options" && r.value === "nosniff"));
    assert.ok(nextRules.some((r) => r.key === "Strict-Transport-Security"));
  });

  it("should apply security headers to a Response object", () => {
    const response = new Response("ok", { status: 200 });
    const secured = applySecurityHeaders(response, { appType: "admin", isProduction: true });

    assert.equal(secured.headers.get("X-Frame-Options"), "DENY");
    assert.equal(secured.headers.get("X-Content-Type-Options"), "nosniff");
    assert.match(secured.headers.get("Content-Security-Policy") || "", /frame-ancestors 'none'/);
  });
});
