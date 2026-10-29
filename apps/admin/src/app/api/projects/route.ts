import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseProjectsRepository,
  listAdminProjects,
  createProject,
} from "@art-work/database";

/**
 * GET /api/projects (Admin Dashboard)
 * Lists all projects (published, draft, archived) with filtering & pagination.
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const queryInput: Record<string, unknown> = {
    category: searchParams.get("category") || "all",
    status: searchParams.get("status") || "all",
    q: searchParams.get("q") || "",
    featured: searchParams.get("featured") ?? undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "50",
  };

  try {
    const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
    const result = await listAdminProjects(queryInput, repo);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/projects (Admin Dashboard — CSRF enforced by middleware)
 * Creates a new showcase project in `public.projects`.
 */
export async function POST(request: NextRequest) {
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

  const repo = createSupabaseProjectsRepository(sessionCheck.supabase);
  const result = await createProject(body, sessionCheck.adminUser.user_id, repo);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Trigger on-demand ISR revalidation on the public website (fire-and-forget)
  const publicAppUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_APP_URL ||
    "https://artwork-agency.vercel.app";
  const revalidateSecret = process.env.REVALIDATION_SECRET;
  if (revalidateSecret) {
    fetch(`${publicAppUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": revalidateSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: "projects", path: "/gallery" }),
    }).catch(() => {});
  }

  return NextResponse.json({ project: result.data }, { status: 201 });
}
