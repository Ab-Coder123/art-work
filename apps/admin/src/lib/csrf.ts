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
 * Ensures a valid CSRF token is available. If missing, requests a fresh token from /api/auth/csrf.
 */
export async function ensureCsrfToken(): Promise<string> {
  const existing = readCsrfCookie();
  if (existing && existing.length === 64) {
    return existing;
  }

  try {
    const res = await fetch("/api/auth/csrf", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.csrfToken && data.csrfToken.length === 64) {
        return data.csrfToken;
      }
    }
  } catch (err) {
    console.error("Failed to fetch fresh CSRF token:", err);
  }

  const fallback = readCsrfCookie();
  return fallback || "";
}

/**
 * Enhanced fetch wrapper that ensures valid X-CSRF-Token is attached to all mutating requests (POST, PUT, PATCH, DELETE).
 * If the request receives a 403 CSRF error, it automatically requests a fresh token and retries once.
 */
export async function apiFetchWithCsrf(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (!isMutating) {
    return fetch(input, init);
  }

  const token = await ensureCsrfToken();
  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set(CSRF_HEADER_NAME, token);
  }

  let response = await fetch(input, {
    ...init,
    headers,
  });

  // Self-healing: If rejected due to expired/missing CSRF cookie, refresh and retry once
  if (response.status === 403) {
    const cloned = response.clone();
    const body = await cloned.json().catch(() => ({}));
    if (body.error && String(body.error).toLowerCase().includes("csrf")) {
      // Proactively fetch fresh CSRF token
      try {
        const csrfRes = await fetch("/api/auth/csrf", { cache: "no-store" });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          if (csrfData.csrfToken) {
            headers.set(CSRF_HEADER_NAME, csrfData.csrfToken);
            response = await fetch(input, {
              ...init,
              headers,
            });
          }
        }
      } catch (retryErr) {
        console.error("CSRF retry failed:", retryErr);
      }
    }
  }

  return response;
}
