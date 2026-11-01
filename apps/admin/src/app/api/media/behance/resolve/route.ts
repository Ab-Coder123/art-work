import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  parseBehanceInput,
  fetchBehanceMetadata,
} from "@art-work/database";

/**
 * POST /api/media/behance/resolve (admin only; CSRF enforced by middleware)
 * Body: { url: string } or { input: string }
 * Returns validated canonicalUrl, title, description, coverImageUrl, authorName.
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

  const payload = body as { url?: unknown; input?: unknown } | null;
  const rawInput = (payload?.url || payload?.input) as string | undefined;

  const parseResult = parseBehanceInput(rawInput);
  if (!parseResult.ok) {
    return NextResponse.json(
      { error: "Invalid Behance URL", reason: parseResult.reason },
      { status: 422 }
    );
  }

  const metaResult = await fetchBehanceMetadata(parseResult.canonicalUrl);
  if (!metaResult.ok) {
    return NextResponse.json({ error: metaResult.error }, { status: 502 });
  }

  return NextResponse.json(metaResult.data);
}
