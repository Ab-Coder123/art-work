import { NextRequest, NextResponse } from "next/server";
import {
  createBrowserClient,
  createSupabaseProjectsRepository,
  createInMemoryProjectsRepository,
  getProjectByIdOrSlug,
} from "@art-work/database";
import { mapRecordToDbProject } from "@art-work/types";
import { SEED_PROJECTS } from "@/data/seedContent";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id] (Public Website Showcase Single Project Lookup)
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseProjectsRepository(supabase);
    const result = await getProjectByIdOrSlug(id, { includeDrafts: false }, repo);

    if (result.ok) {
      return NextResponse.json(
        { project: result.data },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
          },
        }
      );
    }
    return NextResponse.json({ error: result.error }, { status: result.status });
  } catch {
    const fallbackRows = SEED_PROJECTS.map((record, idx) => ({
      ...mapRecordToDbProject(record),
      id: record.id,
      order_index: record.order || idx + 1,
    }));
    const fallbackRepo = createInMemoryProjectsRepository(fallbackRows);
    const fallbackResult = await getProjectByIdOrSlug(
      id,
      { includeDrafts: false },
      fallbackRepo
    );

    if (!fallbackResult.ok) {
      return NextResponse.json({ error: fallbackResult.error }, { status: fallbackResult.status });
    }
    return NextResponse.json({ project: fallbackResult.data }, { status: 200 });
  }
}
