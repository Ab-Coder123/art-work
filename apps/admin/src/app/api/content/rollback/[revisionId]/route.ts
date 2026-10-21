import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseContentRepository,
  rollbackContent,
} from "@art-work/database";

/**
 * POST /api/content/rollback/[revisionId]
 * Restores a specific content section to its snapshot before that revision.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ revisionId: string }> }
) {
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

  const { revisionId } = await context.params;

  try {
    const repo = createSupabaseContentRepository(sessionCheck.supabase);
    const actorEmail = sessionCheck.adminUser?.email || "admin@art-work.agency";
    const result = await rollbackContent(revisionId, repo, actorEmail);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : `Failed to rollback revision ${revisionId}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
