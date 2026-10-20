export const CSRF_HEADER_NAME = "x-csrf-token";
export const CSRF_COOKIE_NAME = "csrf-token";

/**
 * Generates a cryptographically strong 32-byte (64-character) hex CSRF token.
 * Uses Web Crypto API compatible with Node.js, Next.js Edge Runtime, and browsers.
 */
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time timing-safe comparison to validate CSRF token against double-submit cookie.
 * Defends against timing attacks and runs universally across Node and Edge middleware runtimes.
 */
export function validateCsrfToken(
  headerToken?: string | null,
  cookieToken?: string | null
): boolean {
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Token must be exactly 64 hexadecimal characters
  if (headerToken.length !== 64 || cookieToken.length !== 64) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < 64; i++) {
    mismatch |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }

  return mismatch === 0;
}
