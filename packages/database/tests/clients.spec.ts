import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createBrowserClient, createAdminClient } from "../src/index.js";

describe("Phase 01: Supabase Client Factories & Security Boundaries", () => {
  it("should initialize browser client with public anonymous credentials", () => {
    const client = createBrowserClient(
      "http://127.0.0.1:54321",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anon-token-test-key-0123456789"
    );

    assert.ok(client);
    assert.ok(typeof client.from === "function");
    assert.ok(typeof client.auth === "object");
  });

  it("should throw error if admin client is requested without service role key", () => {
    // Clear SUPABASE_SERVICE_ROLE_KEY for this test
    const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    assert.throws(
      () => {
        createAdminClient();
      },
      /SUPABASE_SERVICE_ROLE_KEY is required to initialize an admin client/
    );

    if (oldKey) {
      process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
    }
  });

  it("should prevent admin client execution in client-side browser window context", () => {
    // Simulate browser window
    (global as any).window = {};

    try {
      assert.throws(
        () => {
          createAdminClient("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-service-key-1234567890");
        },
        /\[SECURITY VIOLATION\] createAdminClient cannot be executed in browser context/
      );
    } finally {
      delete (global as any).window;
    }
  });

  it("should initialize admin client in server context with valid service key", () => {
    const admin = createAdminClient(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-service-key-1234567890"
    );

    assert.ok(admin);
    assert.ok(typeof admin.from === "function");
    assert.ok(typeof admin.auth.admin === "object");
  });
});
