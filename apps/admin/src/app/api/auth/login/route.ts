import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  LoginCredentialsSchema,
  createBrowserClient,
  getAuthCookieOptions,
  getCsrfCookieOptions,
  AUTH_COOKIES,
} from "@art-work/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = LoginCredentialsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid credentials format" },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0]?.trim() : "127.0.0.1";

    const supabase = createBrowserClient();
    const result = await authenticateAdmin(validation.data, supabase, { clientIp });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, retryAfterSeconds: result.retryAfterSeconds },
        { status: result.status }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      ok: true,
      adminUser: result.adminUser,
      csrfToken: result.csrfToken,
    });

    // Set HttpOnly secure session cookies
    response.cookies.set(
      AUTH_COOKIES.ACCESS_TOKEN,
      result.session.access_token,
      getAuthCookieOptions(isProd, result.session.expires_in || 3600)
    );

    response.cookies.set(
      AUTH_COOKIES.REFRESH_TOKEN,
      result.session.refresh_token,
      getAuthCookieOptions(isProd, 60 * 60 * 24 * 30) // 30 days
    );

    // Set client-accessible CSRF cookie
    response.cookies.set(
      AUTH_COOKIES.CSRF_TOKEN,
      result.csrfToken,
      getCsrfCookieOptions(isProd)
    );

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error during authentication";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
