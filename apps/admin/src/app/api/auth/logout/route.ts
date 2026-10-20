import { NextRequest, NextResponse } from "next/server";
import {
  validateCsrfToken,
  CSRF_HEADER_NAME,
  AUTH_COOKIES,
  createBrowserClient,
} from "@art-work/database";

export async function POST(request: NextRequest) {
  const headerCsrf = request.headers.get(CSRF_HEADER_NAME);
  const cookieCsrf = request.cookies.get(AUTH_COOKIES.CSRF_TOKEN)?.value;

  if (!validateCsrfToken(headerCsrf, cookieCsrf)) {
    return NextResponse.json(
      { error: "Invalid or missing CSRF token" },
      { status: 403 }
    );
  }

  try {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
  } catch {
    // Non-fatal if session already invalidated
  }

  const response = NextResponse.json({ ok: true, message: "Logged out successfully" });

  // Clear all auth cookies
  response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
  response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);
  response.cookies.delete(AUTH_COOKIES.CSRF_TOKEN);

  return response;
}
