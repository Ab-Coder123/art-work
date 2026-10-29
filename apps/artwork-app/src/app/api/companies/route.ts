import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient, listCompanies } from "@art-work/database";
import type { CompanyCategorySlug } from "@art-work/types";

/**
 * GET /api/companies (Public Showcase API)
 * Query params: ?category=pharma&q=rameda
 * Returns all active companies with edge caching headers.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "all") as CompanyCategorySlug;
  const q = searchParams.get("q") || "";

  try {
    const supabase = createBrowserClient();
    const result = await listCompanies(supabase, {
      category,
      q,
      activeOnly: true,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    });
  } catch {
    // In-memory fallback
    const result = await listCompanies(null, {
      category,
      q,
      activeOnly: true,
    });
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    });
  }
}
