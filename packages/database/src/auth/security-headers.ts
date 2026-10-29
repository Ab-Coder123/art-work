export interface SecurityHeaderOptions {
  isProduction?: boolean;
  appType?: "web" | "admin";
  customCsp?: Record<string, string[]>;
}

export interface NextHeaderRule {
  key: string;
  value: string;
}

/**
 * Builds Content-Security-Policy directive string.
 */
export function buildContentSecurityPolicy(options: SecurityHeaderOptions = {}): string {
  const isProduction = options.isProduction ?? (typeof process !== "undefined" && process.env?.NODE_ENV === "production");
  const isAdmin = options.appType === "admin";

  const defaultDirectives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://va.vercel-scripts.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://images.unsplash.com",
      "https://i.ytimg.com",
      "https://img.youtube.com",
      "https://*.supabase.co",
    ],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "frame-src": [
      "'self'",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
    ],
    "connect-src": [
      "'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://*.vercel-insights.com",
      "https://vitals.vercel-insights.com",
      "https://va.vercel-scripts.com",
    ],
    "media-src": ["'self'", "data:", "blob:", "https://*.supabase.co"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": [isAdmin ? "'none'" : "'self'"],
  };

  if (isProduction) {
    defaultDirectives["upgrade-insecure-requests"] = [];
  }

  // Merge custom CSP directives
  if (options.customCsp) {
    for (const [key, values] of Object.entries(options.customCsp)) {
      if (!defaultDirectives[key]) {
        defaultDirectives[key] = [...values];
      } else {
        defaultDirectives[key] = Array.from(new Set([...defaultDirectives[key], ...values]));
      }
    }
  }

  return Object.entries(defaultDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(" ")}`;
    })
    .join("; ");
}

/**
 * Returns a map of standard HTTP security headers.
 */
export function getSecurityHeadersMap(options: SecurityHeaderOptions = {}): Record<string, string> {
  const isProduction = options.isProduction ?? (typeof process !== "undefined" && process.env?.NODE_ENV === "production");
  const isAdmin = options.appType === "admin";

  const headers: Record<string, string> = {
    "Content-Security-Policy": buildContentSecurityPolicy(options),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": isAdmin ? "DENY" : "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  };

  if (isProduction) {
    // 2 years HSTS with preload and subdomains
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";
  }

  return headers;
}

/**
 * Returns security headers formatted for Next.js next.config.ts `headers()` array.
 */
export function getSecurityHeaders(options: SecurityHeaderOptions = {}): NextHeaderRule[] {
  const headersMap = getSecurityHeadersMap(options);
  return Object.entries(headersMap).map(([key, value]) => ({ key, value }));
}

/**
 * Applies security headers to a Response object.
 */
export function applySecurityHeaders<T extends Response>(
  response: T,
  options: SecurityHeaderOptions = {}
): T {
  const headersMap = getSecurityHeadersMap(options);
  for (const [key, value] of Object.entries(headersMap)) {
    response.headers.set(key, value);
  }
  return response;
}
