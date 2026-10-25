export interface CorsOptions {
  allowedOrigins?: (string | RegExp)[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
}

/**
 * Standard allowed origins for Art Work monorepo environments.
 */
export const DEFAULT_ALLOWED_ORIGINS: (string | RegExp)[] = [
  // Local development environments
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",

  // Production Vercel canonical domains
  "https://artwork-agency.vercel.app",
  "https://artwork-app-pi.vercel.app",

  // Vercel deployment preview domains
  /^https:\/\/art-work-[a-z0-9]+-abcoder123s-projects\.vercel\.app$/,
  /^https:\/\/artwork-app-[a-z0-9]+-abcoder123s-projects\.vercel\.app$/,
  /^https:\/\/art-work.*\.vercel\.app$/,
];

export const DEFAULT_ALLOWED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
];

export const DEFAULT_ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-CSRF-Token",
  "X-Requested-With",
  "Accept",
  "Origin",
];

export const DEFAULT_EXPOSED_HEADERS = [
  "Content-Range",
  "X-Content-Range",
  "Content-Length",
];

/**
 * Resolves allowed origins from defaults + environment variables if provided.
 */
export function getResolvedAllowedOrigins(custom?: (string | RegExp)[]): (string | RegExp)[] {
  if (custom && custom.length > 0) {
    return custom;
  }

  const origins: (string | RegExp)[] = [...DEFAULT_ALLOWED_ORIGINS];

  // Optional environment variable parsing
  if (typeof process !== "undefined" && process.env?.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    origins.push(...envOrigins);
  }

  return origins;
}

/**
 * Checks whether the given origin is authorized by explicit matching or regex.
 */
export function isAllowedOrigin(
  origin: string | null | undefined,
  allowedOrigins: (string | RegExp)[] = getResolvedAllowedOrigins()
): boolean {
  if (!origin) {
    // Requests without origin header (e.g. server-to-server or same-origin direct navigation)
    return true;
  }

  const normalized = origin.trim();

  return allowedOrigins.some((candidate) => {
    if (candidate instanceof RegExp) {
      return candidate.test(normalized);
    }
    return candidate === normalized;
  });
}

/**
 * Generates CORS headers for a given request origin.
 */
export function buildCorsHeaders(
  origin: string | null | undefined,
  options: CorsOptions = {}
): Record<string, string> {
  const allowedOrigins = getResolvedAllowedOrigins(options.allowedOrigins);
  const isAllowed = isAllowedOrigin(origin, allowedOrigins);

  const headers: Record<string, string> = {
    Vary: "Origin",
  };

  if (isAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    
    if (options.allowCredentials !== false) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }

    const methods = options.allowedMethods || DEFAULT_ALLOWED_METHODS;
    headers["Access-Control-Allow-Methods"] = methods.join(", ");

    const allowedHeaders = options.allowedHeaders || DEFAULT_ALLOWED_HEADERS;
    headers["Access-Control-Allow-Headers"] = allowedHeaders.join(", ");

    const exposedHeaders = options.exposedHeaders || DEFAULT_EXPOSED_HEADERS;
    headers["Access-Control-Expose-Headers"] = exposedHeaders.join(", ");

    const maxAge = options.maxAge ?? 86400; // 24 hours
    headers["Access-Control-Max-Age"] = maxAge.toString();
  }

  return headers;
}

/**
 * Preflight OPTIONS request handler.
 * Returns a 204 No Content Response with CORS headers if origin is allowed, or 403 if rejected.
 */
export function handleCorsPreflight(
  origin: string | null | undefined,
  method?: string | null,
  options: CorsOptions = {}
): Response | null {
  if (method && method.toUpperCase() !== "OPTIONS") {
    return null;
  }

  const allowedOrigins = getResolvedAllowedOrigins(options.allowedOrigins);
  const isAllowed = isAllowedOrigin(origin, allowedOrigins);

  if (!isAllowed && origin) {
    return new Response(JSON.stringify({ error: "CORS: Origin not permitted" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        Vary: "Origin",
      },
    });
  }

  const headers = buildCorsHeaders(origin, options);
  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Mutates or attaches CORS headers onto an existing Response object.
 */
export function applyCorsHeaders<T extends Response>(
  response: T,
  origin: string | null | undefined,
  options: CorsOptions = {}
): T {
  const corsHeaders = buildCorsHeaders(origin, options);
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}
