import { AUTH_COOKIES, CSRF_HEADER_NAME } from "@art-work/database/edge";

/**
 * Reads the CSRF token cookie from document.cookie.
 */
export function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIES.CSRF_TOKEN}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Synchronously writes the CSRF token to document.cookie so that
 * any immediate subsequent fetch calls transmit the cookie
 * synchronously without waiting for background browser parsing.
 */
export function writeCsrfCookie(token: string): void {
  if (typeof document === "undefined" || !token) return;
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${AUTH_COOKIES.CSRF_TOKEN}=${encodeURIComponent(
    token
  )}; path=/; SameSite=Lax; max-age=86400; ${isHttps ? "Secure;" : ""}`;
}

/**
 * In-memory fallback token in case document.cookie is partitioned or restricted.
 */
let inMemoryCsrfToken: string | null = null;

/**
 * Ensures a valid 64-char hex CSRF token is available.
 * If missing, requests a fresh token from /api/auth/csrf and synchronizes document.cookie.
 */
export async function ensureCsrfToken(): Promise<string> {
  const existing = readCsrfCookie();
  if (existing && existing.length === 64) {
    inMemoryCsrfToken = existing;
    return existing;
  }

  if (inMemoryCsrfToken && inMemoryCsrfToken.length === 64) {
    writeCsrfCookie(inMemoryCsrfToken);
    return inMemoryCsrfToken;
  }

  try {
    const res = await fetch("/api/auth/csrf", {
      cache: "no-store",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.csrfToken && data.csrfToken.length === 64) {
        inMemoryCsrfToken = data.csrfToken;
        writeCsrfCookie(data.csrfToken);
        return data.csrfToken;
      }
    }
  } catch (err) {
    console.error("Failed to fetch fresh CSRF token:", err);
  }

  const fallback = readCsrfCookie() || inMemoryCsrfToken;
  return fallback || "";
}

/**
 * Enhanced fetch wrapper that ensures valid X-CSRF-Token is attached to all mutating requests (POST, PUT, PATCH, DELETE).
 * Synchronizes token into document.cookie and supports seamless self-healing on 403 CSRF rejection.
 */
export async function apiFetchWithCsrf(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (!isMutating) {
    return fetch(input, {
      ...init,
      credentials: init?.credentials || "include",
    });
  }

  const token = await ensureCsrfToken();
  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set(CSRF_HEADER_NAME, token);
    writeCsrfCookie(token);
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: init?.credentials || "include",
  });

  // Self-healing: If rejected due to 403 CSRF error, adopt server recovery token and retry once
  if (response.status === 403) {
    const cloned = response.clone();
    const body = await cloned.json().catch(() => ({}));
    if (body.error && String(body.error).toLowerCase().includes("csrf")) {
      let recoveryToken: string | null =
        typeof body.csrfToken === "string" && body.csrfToken.length === 64
          ? body.csrfToken
          : null;

      if (!recoveryToken) {
        try {
          const csrfRes = await fetch("/api/auth/csrf", {
            cache: "no-store",
            credentials: "include",
          });
          if (csrfRes.ok) {
            const csrfData = await csrfRes.json();
            if (csrfData.csrfToken && csrfData.csrfToken.length === 64) {
              recoveryToken = csrfData.csrfToken;
            }
          }
        } catch (retryErr) {
          console.error("CSRF retry token fetch failed:", retryErr);
        }
      }

      if (recoveryToken) {
        inMemoryCsrfToken = recoveryToken;
        writeCsrfCookie(recoveryToken);
        headers.set(CSRF_HEADER_NAME, recoveryToken);
        response = await fetch(input, {
          ...init,
          headers,
          credentials: init?.credentials || "include",
        });
      }
    }
  }

  return response;
}
