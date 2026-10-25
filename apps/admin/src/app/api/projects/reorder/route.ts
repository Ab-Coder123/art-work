import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseProjectsRepository,
  reorderProjects,
} from "@art-work/database";

/**
 * PATCH /api/projects/reorder (Admin Dashboard — CSRF enforced by middleware)
 * Body: { items: [{ id: string, order: number }] }
 */
export async function PATCH(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  }, { requireWriteAccess: true });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
    const result = await reorderProjects(body, sessionCheck.adminUser.user_id, repo);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ items: result.data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
