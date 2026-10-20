import { NextResponse } from "next/server";
import { generateCsrfToken, getCsrfCookieOptions, AUTH_COOKIES } from "@art-work/database";

export async function GET() {
  const csrfToken = generateCsrfToken();
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = getCsrfCookieOptions(isProd);

  const response = NextResponse.json({ csrfToken });
  response.cookies.set(AUTH_COOKIES.CSRF_TOKEN, csrfToken, cookieOptions);

  return response;
}
