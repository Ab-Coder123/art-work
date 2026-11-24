import { NextResponse, type NextRequest } from "next/server";
import {
  handleCorsPreflight,
  applyCorsHeaders,
  applySecurityHeaders,
} from "@art-work/database/edge";
import { LOCALE_COOKIE_NAME, isValidLocale } from "@art-work/types";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const origin = request.headers.get("origin");

  // 1. Handle CORS Preflight for API routes
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflight = handleCorsPreflight(origin, request.method);
    if (preflight) {
      return applySecurityHeaders(preflight, { appType: "web" });
    }
  }

  // 2. Resolve optional ?lang=ar|en override and forward active locale header for SSR
  const queryLang = searchParams.get("lang");
  const cookieLang = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const activeLocale = isValidLocale(queryLang)
    ? queryLang
    : isValidLocale(cookieLang)
    ? cookieLang
    : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-artwork-locale", activeLocale);

  // 3. Proceed with Next.js pipeline
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isValidLocale(queryLang)) {
    response.cookies.set(LOCALE_COOKIE_NAME, queryLang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // 4. Attach CORS headers to API responses
  if (pathname.startsWith("/api/")) {
    applyCorsHeaders(response, origin);
  }

  // 5. Attach hardened security headers
  return applySecurityHeaders(response, { appType: "web" });
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
