import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateCsrfToken, validateCsrfToken } from "../src/index";

describe("Phase 03: CSRF Defense & Double-Submit Token Engine", () => {
  it("should generate a cryptographically strong 64-character hex token", () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();

    assert.equal(typeof token1, "string");
    assert.equal(token1.length, 64);
    assert.equal(token2.length, 64);
    assert.notEqual(token1, token2, "Consecutive tokens must be cryptographically unique");
    assert.ok(/^[a-f0-9]{64}$/.test(token1), "Token must be valid hex characters");
  });

  it("should validate matching header and cookie tokens successfully", () => {
    const token = generateCsrfToken();
    const isValid = validateCsrfToken(token, token);
    assert.equal(isValid, true);
  });

  it("should reject when tokens do not match", () => {
    const headerToken = generateCsrfToken();
    const cookieToken = generateCsrfToken();

    const isValid = validateCsrfToken(headerToken, cookieToken);
    assert.equal(isValid, false);
  });

  it("should reject when header or cookie is missing or null", () => {
    const token = generateCsrfToken();

    assert.equal(validateCsrfToken(null, token), false);
    assert.equal(validateCsrfToken(token, null), false);
    assert.equal(validateCsrfToken(undefined, token), false);
    assert.equal(validateCsrfToken(token, undefined), false);
    assert.equal(validateCsrfToken("", ""), false);
  });

  it("should reject malformed or truncated tokens safely", () => {
    const token = generateCsrfToken();
    const truncated = token.slice(0, 32);

    assert.equal(validateCsrfToken(truncated, token), false);
    assert.equal(validateCsrfToken(token, truncated), false);
  });
});
