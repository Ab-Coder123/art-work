import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionFromCookies } from "@art-work/database";

export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });

  if (!sessionCheck.ok) {
    return NextResponse.json(
      { authenticated: false, error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: sessionCheck.adminUser,
  });
}
