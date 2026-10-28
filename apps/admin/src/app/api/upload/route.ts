import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionFromCookies, createAdminClient } from "@art-work/database";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB for architectural blueprints & high-res renders

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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: PNG, JPG, WebP, PDF` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 25MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // Determine target subfolder: default to "logos"
    const folderParam = (formData.get("folder") as string) || "logos";
    const sanitizedFolder = folderParam.replace(/[^a-zA-Z0-9_-]/g, "") || "logos";

    // Sanitize filename
    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `${sanitizedFolder}/${uniqueSuffix}-${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createAdminClient();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("artwork-media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError || !uploadData) {
      // Local fallback in development if bucket is unconfigured
      try {
        const fs = await import("fs");
        const path = await import("path");
        const uploadsDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localFileName = `${uniqueSuffix}-${cleanFileName}`;
        const localFilePath = path.join(uploadsDir, localFileName);
        fs.writeFileSync(localFilePath, buffer);

        // Also sync to artwork-app if in monorepo
        const appPublicUploads = path.join(process.cwd(), "..", "artwork-app", "public", "uploads", sanitizedFolder);
        if (fs.existsSync(path.join(process.cwd(), "..", "artwork-app", "public"))) {
          if (!fs.existsSync(appPublicUploads)) {
            fs.mkdirSync(appPublicUploads, { recursive: true });
          }
          fs.writeFileSync(path.join(appPublicUploads, localFileName), buffer);
        }

        const localUrl = `/uploads/${sanitizedFolder}/${localFileName}`;
        return NextResponse.json(
          {
            ok: true,
            url: localUrl,
            path: localFilePath,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
          },
          { status: 201 }
        );
      } catch {
        return NextResponse.json(
          { error: uploadError?.message || "Failed to upload file to storage" },
          { status: 500 }
        );
      }
    }

    const { data: publicUrlData } = supabase.storage
      .from("artwork-media")
      .getPublicUrl(uploadData.path);

    return NextResponse.json(
      {
        ok: true,
        url: publicUrlData.publicUrl,
        path: uploadData.path,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
