import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIES,
  CSRF_HEADER_NAME,
  validateCsrfToken,
  generateCsrfToken,
  getCsrfCookieOptions,
  handleCorsPreflight,
  applyCorsHeaders,
  applySecurityHeaders,
} from "@art-work/database/edge";

// Routes exempt from authentication checks
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/csrf", "/api/health"];

// Mutating HTTP methods requiring CSRF validation
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const isProd = process.env.NODE_ENV === "production";

  // 1. Handle CORS Preflight for API routes
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflight = handleCorsPreflight(origin, request.method);
    if (preflight) {
      return applySecurityHeaders(preflight, { appType: "admin" });
    }
  }

  // 2. Allow public paths without auth redirection
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 3. Check for session token cookie
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const isAuthenticated = Boolean(accessToken);

  // If user is logged in and visits /login, redirect to dashboard root
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT logged in and visits protected page (not an API route)
  if (!isAuthenticated && !isPublicPath && !pathname.startsWith("/api/")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Auto-seed CSRF cookie on page visits if authenticated user is missing it
  let freshCsrfTokenForPage: string | null = null;
  const existingCsrfCookie = request.cookies.get(AUTH_COOKIES.CSRF_TOKEN)?.value;
  if (
    isAuthenticated &&
    !pathname.startsWith("/api/") &&
    (!existingCsrfCookie || existingCsrfCookie.length !== 64)
  ) {
    freshCsrfTokenForPage = generateCsrfToken();
  }

  // 5. CSRF Validation on Mutating API Requests
  if (
    pathname.startsWith("/api/") &&
    MUTATING_METHODS.includes(request.method) &&
    pathname !== "/api/auth/login" // Initial login handshake is exempt from CSRF cookie check
  ) {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(AUTH_COOKIES.CSRF_TOKEN)?.value;

    if (!validateCsrfToken(headerToken, cookieToken)) {
      // Generate a fresh token so client can self-heal on next request
      const recoveryCsrfToken = generateCsrfToken();
      const errorResponse = NextResponse.json(
        {
          error: "CSRF defense: Invalid or missing X-CSRF-Token header",
          csrfToken: recoveryCsrfToken,
        },
        { status: 403 }
      );

      errorResponse.cookies.set(
        AUTH_COOKIES.CSRF_TOKEN,
        recoveryCsrfToken,
        getCsrfCookieOptions(isProd)
      );

      applyCorsHeaders(errorResponse, origin);
      return applySecurityHeaders(errorResponse, { appType: "admin" });
    }
  }

  // 6. Proceed with Next.js pipeline and attach security + CORS headers
  const response = NextResponse.next();

  if (freshCsrfTokenForPage) {
    response.cookies.set(
      AUTH_COOKIES.CSRF_TOKEN,
      freshCsrfTokenForPage,
      getCsrfCookieOptions(isProd)
    );
  }

  if (pathname.startsWith("/api/")) {
    applyCorsHeaders(response, origin);
  }

  return applySecurityHeaders(response, { appType: "admin" });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
