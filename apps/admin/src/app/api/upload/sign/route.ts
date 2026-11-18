import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionFromCookies, createAdminClient } from "@art-work/database";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png", "webp", "jfif"]);

export async function POST(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies(
    {
      getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
    },
    { requireWriteAccess: true }
  );

  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  try {
    const body = await request.json();
    const filename = String(body.filename || "").trim();
    const folder = String(body.folder || "giveaways").trim();
    const size = typeof body.size === "number" ? body.size : 0;
    const mimeType = String(body.mimeType || "application/octet-stream").trim();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const ext = filename.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Unsupported file extension .${ext}. Allowed formats: PDF, PNG, JPG/JPEG, WebP` },
        { status: 400 }
      );
    }

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 50MB limit (${(size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "giveaways";
    const cleanFileName = filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `${sanitizedFolder}/${uniqueSuffix}-${cleanFileName}`;

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("artwork-media")
      .createSignedUploadUrl(storagePath);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Failed to create signed upload URL in storage" },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/["']/g, "").trim() || "";
    const uploadUrl = data.signedUrl.startsWith("http")
      ? data.signedUrl
      : `${supabaseUrl}/storage/v1${data.signedUrl}`;

    const { data: publicUrlData } = supabase.storage
      .from("artwork-media")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      ok: true,
      uploadUrl,
      publicUrl: publicUrlData.publicUrl,
      path: storagePath,
      token: data.token,
      mimeType,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign upload request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
