import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseContentRepository,
  fetchContentHistory,
} from "@art-work/database";

/**
 * GET /api/content/history
 * Returns the recent content audit log revisions with actor email and diff snapshots.
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json(
      { error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "25", 10))
  );

  try {
    const repo = createSupabaseContentRepository(sessionCheck.supabase);
    const result = await fetchContentHistory(repo, limit);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ revisions: result.data }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load content revision history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
