import { NextRequest, NextResponse } from "next/server";
import { createServerClient, verifyAdminMembership } from "@art-work/database";

export async function GET(request: NextRequest) {
  const cookieStore = {
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  };

  const supabase = createServerClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const membership = await verifyAdminMembership(supabase, user.id);
  if (!membership.isAuthorized || !membership.adminUser) {
    return NextResponse.json(
      { authenticated: false, error: "User is not an active studio administrator" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: membership.adminUser,
  });
}
