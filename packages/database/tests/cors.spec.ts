import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isAllowedOrigin,
  buildCorsHeaders,
  handleCorsPreflight,
  applyCorsHeaders,
  DEFAULT_ALLOWED_ORIGINS,
} from "../src/auth/cors";

describe("Phase 09: Cross-Origin Resource Sharing (CORS) Defense", () => {
  it("should permit requests without origin header (server-to-server or same-origin)", () => {
    assert.equal(isAllowedOrigin(undefined), true);
    assert.equal(isAllowedOrigin(null), true);
    assert.equal(isAllowedOrigin(""), true);
  });

  it("should permit standard local development origins", () => {
    assert.equal(isAllowedOrigin("http://localhost:3000"), true);
    assert.equal(isAllowedOrigin("http://localhost:3001"), true);
    assert.equal(isAllowedOrigin("http://127.0.0.1:3000"), true);
    assert.equal(isAllowedOrigin("http://127.0.0.1:3001"), true);
  });

  it("should permit canonical production and preview domains", () => {
    assert.equal(isAllowedOrigin("https://artwork-agency.vercel.app"), true);
    assert.equal(isAllowedOrigin("https://artwork-app-pi.vercel.app"), true);
    assert.equal(
      isAllowedOrigin("https://art-work-k37tbvxit-abcoder123s-projects.vercel.app"),
      true
    );
    assert.equal(
      isAllowedOrigin("https://artwork-app-abc123-abcoder123s-projects.vercel.app"),
      true
    );
  });

  it("should reject malicious or unknown third-party origins", () => {
    assert.equal(isAllowedOrigin("https://evil-attacker.com"), false);
    assert.equal(isAllowedOrigin("http://localhost:8080"), false);
    assert.equal(isAllowedOrigin("https://phishing-artwork-agency.com"), false);
    assert.equal(isAllowedOrigin("https://artwork-agency.vercel.app.malicious.io"), false);
  });

  it("should accept custom origin overrides and RegExp matchers", () => {
    const customList = ["https://custom-partner.com", /^https:\/\/.*\.stage-preview\.io$/];
    assert.equal(isAllowedOrigin("https://custom-partner.com", customList), true);
    assert.equal(isAllowedOrigin("https://branch-1.stage-preview.io", customList), true);
    assert.equal(isAllowedOrigin("https://unknown.com", customList), false);
  });

  it("should build correct CORS headers for allowed origins", () => {
    const headers = buildCorsHeaders("http://localhost:3000");

    assert.equal(headers["Access-Control-Allow-Origin"], "http://localhost:3000");
    assert.equal(headers["Access-Control-Allow-Credentials"], "true");
    assert.match(headers["Access-Control-Allow-Methods"], /GET, POST, PUT, PATCH, DELETE/);
    assert.match(headers["Access-Control-Allow-Headers"], /Content-Type, Authorization, X-CSRF-Token/);
    assert.equal(headers["Access-Control-Max-Age"], "86400");
    assert.equal(headers["Vary"], "Origin");
  });

  it("should omit Access-Control-Allow-Origin for unauthorized origins", () => {
    const headers = buildCorsHeaders("https://malicious-site.com");

    assert.equal(headers["Access-Control-Allow-Origin"], undefined);
    assert.equal(headers["Access-Control-Allow-Credentials"], undefined);
    assert.equal(headers["Vary"], "Origin");
  });

  it("should handle preflight OPTIONS requests successfully for allowed origins (204 No Content)", () => {
    const response = handleCorsPreflight("http://localhost:3001", "OPTIONS");

    assert.notEqual(response, null);
    assert.equal(response?.status, 204);
    assert.equal(response?.headers.get("Access-Control-Allow-Origin"), "http://localhost:3001");
    assert.equal(response?.headers.get("Access-Control-Allow-Credentials"), "true");
  });

  it("should reject preflight OPTIONS requests for unauthorized origins with 403 Forbidden", () => {
    const response = handleCorsPreflight("https://hacker.com", "OPTIONS");

    assert.notEqual(response, null);
    assert.equal(response?.status, 403);
    assert.equal(response?.headers.get("Access-Control-Allow-Origin"), null);
  });

  it("should return null from handleCorsPreflight for non-OPTIONS requests", () => {
    const response = handleCorsPreflight("http://localhost:3000", "GET");
    assert.equal(response, null);
  });

  it("should apply CORS headers to an existing Response object", () => {
    const baseResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const modified = applyCorsHeaders(baseResponse, "http://localhost:3000");

    assert.equal(modified.headers.get("Access-Control-Allow-Origin"), "http://localhost:3000");
    assert.equal(modified.headers.get("Access-Control-Allow-Credentials"), "true");
    assert.equal(modified.headers.get("Vary"), "Origin");
    assert.equal(modified.headers.get("Content-Type"), "application/json");
  });
});
