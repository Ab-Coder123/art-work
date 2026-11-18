import { apiFetchWithCsrf } from "./csrf";

export interface DirectUploadResult {
  ok: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

/**
 * Uploads a file with Vercel 4.5MB bypass.
 * 1. Requests a signed direct-upload slot from /api/upload/sign (tiny JSON request).
 * 2. Uploads directly from browser to Supabase Storage via PUT (supporting files up to 50MB).
 * 3. Falls back to traditional /api/upload if signed upload is unavailable or offline.
 */
export async function uploadFileDirect(
  file: File,
  folder: string = "giveaways"
): Promise<DirectUploadResult> {
  // 1. Try Direct Signed Upload (bypasses Vercel 4.5MB Serverless limit)
  try {
    const signRes = await apiFetchWithCsrf("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        folder,
        size: file.size,
        mimeType: file.type,
      }),
    });

    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.uploadUrl && signData.publicUrl) {
        const putRes = await fetch(signData.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        if (putRes.ok) {
          return {
            ok: true,
            url: signData.publicUrl,
            filename: file.name,
          };
        }
      }
    }
  } catch {
    // Proceed to fallback
  }

  // 2. Fallback to /api/upload (for local offline dev)
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await apiFetchWithCsrf("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.url) {
      return { ok: true, url: data.url, filename: file.name };
    }

    if (res.status === 413) {
      return {
        ok: false,
        error: "File size exceeds host request limit (Payload Too Large). Please ensure direct upload is enabled.",
      };
    }

    return {
      ok: false,
      error: data?.error || `Upload failed with status ${res.status}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload request failed";
    return { ok: false, error: msg };
  }
}
