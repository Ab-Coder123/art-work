import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  parseFacebookVideoInput,
} from "@art-work/database";

/**
 * POST /api/media/facebook/resolve (admin only; CSRF enforced by middleware)
 * Body: { input: string } or { url: string }
 * Returns validated canonicalUrl, embedUrl, and isReel flag.
 */
export async function POST(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as { input?: unknown; url?: unknown } | null;
  const rawInput = (payload?.input || payload?.url) as string | undefined;

  const result = parseFacebookVideoInput(rawInput);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Invalid Facebook video URL", reason: result.reason },
      { status: 422 }
    );
  }

  return NextResponse.json(result);
}
