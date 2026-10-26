import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  listCompanies,
  createCompany,
} from "@art-work/database";
import type { CompanyCategorySlug } from "@art-work/types";

/**
 * GET /api/companies (Admin Dashboard)
 * Lists all companies including inactive/draft.
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "";

  try {
    const result = await listCompanies(sessionCheck.supabase, {
      category: category as CompanyCategorySlug,
      q,
      activeOnly: false,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load companies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/companies (Admin Dashboard)
 * Creates a new company record.
 */
export async function POST(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  try {
    const body = await request.json();
    const result = await createCompany(body, sessionCheck.supabase);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result.data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create company";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
