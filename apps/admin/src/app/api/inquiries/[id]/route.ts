import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseInquiryRepository,
  fetchInquiryById,
  updateInquiryStatus,
  removeInquiry,
} from "@art-work/database";

/**
 * GET /api/inquiries/[id]
 * Retrieves details for a specific client lead.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

  const { id } = await context.params;

  try {
    const repo = createSupabaseInquiryRepository(sessionCheck.supabase);
    const result = await fetchInquiryById(id, repo);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, data: result.data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `Failed to get inquiry ${id}`;
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/inquiries/[id]
 * Updates lead status (pending, reviewed, contacted, archived).
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  }, { requireWriteAccess: true });
  if (!sessionCheck.ok) {
    return NextResponse.json(
      { ok: false, error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const repo = createSupabaseInquiryRepository(sessionCheck.supabase);
    const result = await updateInquiryStatus(id, body.status, repo);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, data: result.data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `Failed to update inquiry ${id}`;
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/inquiries/[id]
 * Removes an inquiry permanently.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  }, { requireWriteAccess: true });
  if (!sessionCheck.ok) {
    return NextResponse.json(
      { ok: false, error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  const { id } = await context.params;

  try {
    const repo = createSupabaseInquiryRepository(sessionCheck.supabase);
    const result = await removeInquiry(id, repo);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, message: "Inquiry deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `Failed to delete inquiry ${id}`;
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
