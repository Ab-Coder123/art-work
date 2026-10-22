import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseInquiryRepository,
  fetchInquiries,
  type InquiryStatus,
} from "@art-work/database";

/**
 * GET /api/inquiries
 * Admin-authenticated listing of client leads with status filtering and search.
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json(
      { ok: false, error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  const { searchParams } = request.nextUrl;
  const statusParam = searchParams.get("status") as InquiryStatus | null;
  const search = searchParams.get("search") || undefined;
  const limit = Number(searchParams.get("limit")) || 50;
  const offset = Number(searchParams.get("offset")) || 0;

  try {
    const repo = createSupabaseInquiryRepository(sessionCheck.supabase);
    const result = await fetchInquiries(repo, {
      status: statusParam || undefined,
      search,
      limit,
      offset,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, data: result.data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch inquiries";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
