import { NextRequest, NextResponse } from "next/server";
import {
  createBrowserClient,
  createSupabaseProjectsRepository,
  createInMemoryProjectsRepository,
  listPublicProjects,
} from "@art-work/database";
import { mapRecordToDbProject } from "@art-work/types";
import { SEED_PROJECTS } from "@/data/seedContent";

/**
 * GET /api/projects (Public Website Showcase API)
 * Query params: ?category=stage&q=arena&featured=true&page=1&limit=24
 * Enforces `status = 'published'` via both PostgreSQL RLS and `listPublicProjects`.
 * Gracefully falls back to `SEED_PROJECTS` if offline.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryInput: Record<string, unknown> = {
    category: searchParams.get("category") || "all",
    q: searchParams.get("q") || "",
    featured: searchParams.get("featured") ?? undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "24",
  };

  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseProjectsRepository(supabase);
    const result = await listPublicProjects(queryInput, repo);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // If database returned published rows, serve them with edge cache headers
    if (result.data.total > 0 || queryInput.category !== "all" || queryInput.q !== "") {
      return NextResponse.json(result.data, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      });
    }
  } catch {
    // Fallback to deterministic seed repository if Supabase is unreachable
  }

  const fallbackRows = SEED_PROJECTS.map((record, idx) => ({
    ...mapRecordToDbProject(record),
    id: record.id,
    order_index: record.order || idx + 1,
  }));
  const fallbackRepo = createInMemoryProjectsRepository(fallbackRows);
  const fallbackResult = await listPublicProjects(queryInput, fallbackRepo);

  if (!fallbackResult.ok) {
    return NextResponse.json({ error: fallbackResult.error }, { status: fallbackResult.status });
  }

  return NextResponse.json(fallbackResult.data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
