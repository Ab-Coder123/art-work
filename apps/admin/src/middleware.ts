import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIES,
  CSRF_HEADER_NAME,
  validateCsrfToken,
} from "@art-work/database";

// Routes exempt from authentication checks
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/csrf"];

// Mutating HTTP methods requiring CSRF validation
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths without auth redirection
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 2. Check for session token cookie
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

  // 3. CSRF Validation on Mutating API Requests
  if (
    pathname.startsWith("/api/") &&
    MUTATING_METHODS.includes(request.method) &&
    pathname !== "/api/auth/login" // Initial login handshake is exempt from CSRF cookie check
  ) {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(AUTH_COOKIES.CSRF_TOKEN)?.value;

    if (!validateCsrfToken(headerToken, cookieToken)) {
      return NextResponse.json(
        { error: "CSRF defense: Invalid or missing X-CSRF-Token header" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
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
