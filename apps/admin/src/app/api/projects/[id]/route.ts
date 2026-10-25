import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseProjectsRepository,
  getProjectByIdOrSlug,
  updateProject,
  deleteProject,
} from "@art-work/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id] (Admin Dashboard)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { id } = await context.params;
  const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
  const result = await getProjectByIdOrSlug(id, { includeDrafts: true }, repo);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ project: result.data }, { status: 200 });
}

/**
 * PUT /api/projects/[id] (Admin Dashboard — CSRF enforced by middleware)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  }, { requireWriteAccess: true });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = await context.params;
  const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
  const result = await updateProject(id, body, sessionCheck.adminUser.user_id, repo);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ project: result.data }, { status: 200 });
}

/**
 * DELETE /api/projects/[id] (Admin Dashboard — CSRF enforced by middleware)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  }, { requireWriteAccess: true });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { id } = await context.params;
  const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
  const result = await deleteProject(id, repo);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: 200 });
}
