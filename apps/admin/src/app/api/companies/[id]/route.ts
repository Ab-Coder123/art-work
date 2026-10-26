import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "@art-work/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/companies/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { id } = await context.params;
  const result = await getCompany(id, sessionCheck.supabase);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data, { status: 200 });
}

/**
 * PUT /api/companies/[id]
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { id } = await context.params;
  try {
    const body = await request.json();
    const result = await updateCompany(id, body, sessionCheck.supabase);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result.data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update company";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/companies/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  const { id } = await context.params;
  try {
    const result = await deleteCompany(id, sessionCheck.supabase);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete company";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
