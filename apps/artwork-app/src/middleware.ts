import { NextResponse, type NextRequest } from "next/server";
import {
  handleCorsPreflight,
  applyCorsHeaders,
  applySecurityHeaders,
} from "@art-work/database/edge";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // 1. Handle CORS Preflight for API routes
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflight = handleCorsPreflight(origin, request.method);
    if (preflight) {
      return applySecurityHeaders(preflight, { appType: "web" });
    }
  }

  // 2. Proceed with Next.js pipeline
  const response = NextResponse.next();

  // 3. Attach CORS headers to API responses
  if (pathname.startsWith("/api/")) {
    applyCorsHeaders(response, origin);
  }

  // 4. Attach hardened security headers
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
