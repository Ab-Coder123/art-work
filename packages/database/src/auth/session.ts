export const AUTH_COOKIES = {
  ACCESS_TOKEN: "sb-access-token",
  REFRESH_TOKEN: "sb-refresh-token",
  CSRF_TOKEN: "csrf-token",
} as const;

export interface AuthCookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge?: number;
}

/**
 * Returns security-hardened options for HttpOnly session authentication cookies.
 */
export function getAuthCookieOptions(isProduction: boolean, maxAgeSeconds: number = 60 * 60 * 24 * 7): AuthCookieConfig {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Returns cookie options for the CSRF token.
 * Note: httpOnly must be false so client-side JavaScript can read it and attach it to X-CSRF-Token headers.
 */
export function getCsrfCookieOptions(isProduction: boolean): AuthCookieConfig {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
