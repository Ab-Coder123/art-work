import { useState, useCallback } from "react";
import {
  ProjectRecord,
  DEFAULT_PLACEHOLDER_COVER,
  resolveSafeYouTubeEmbed,
  resolveSafeFacebookEmbed,
  isValidFacebookVideoUrl,
  isUnresolvedFacebookShareUrl,
  extractFacebookVideoUrlFromSnippet,
  isGenericYouTubeDescription,
} from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { uploadFileDirect } from "@/lib/directUpload";

export function useProjectFormMedia(initialProject: ProjectRecord) {
  const [editingProject, setEditingProject] = useState<ProjectRecord>(initialProject);

  // Media resolution states
  const [resolvingYt, setResolvingYt] = useState(false);
  const [ytStatusMessage, setYtStatusMessage] = useState<string | null>(null);
  const [resolvingFb, setResolvingFb] = useState(false);
  const [fbStatusMessage, setFbStatusMessage] = useState<string | null>(null);
  const [fbThumbnailUrl, setFbThumbnailUrl] = useState<string | null>(
    initialProject.facebookUrl && initialProject.image ? initialProject.image : null
  );
  const [isResolvingBehance, setIsResolvingBehance] = useState(false);
  const [behanceStatusMessage, setBehanceStatusMessage] = useState<string | null>(null);

  // Upload & Error states
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const applyThumbnailAsCover = useCallback((url: string) => {
    setEditingProject((prev) => {
      const currentImages = prev.images || [];
      const nextImages = !currentImages.includes(url) ? [url, ...currentImages] : currentImages;
      return {
        ...prev,
        image: url,
        images: nextImages,
      };
    });
  }, []);

  const addManualImageUrl = useCallback((url: string) => {
    const clean = url.trim();
    if (!clean) return;
    setEditingProject((prev) => {
      const nextImages = prev.images ? [...prev.images] : [];
      if (!nextImages.includes(clean)) {
        nextImages.push(clean);
      }
      return {
        ...prev,
        image: prev.image || clean,
        images: nextImages,
      };
    });
  }, []);

  const setManualCover = useCallback((url: string) => {
    const clean = url.trim();
    if (!clean) return;
    setEditingProject((prev) => {
      const currentImages = prev.images || [];
      const nextImages = [clean, ...currentImages.filter((u) => u !== clean)];
      return {
        ...prev,
        image: clean,
        images: nextImages,
      };
    });
    setUploadError(null);
  }, []);

  const setManualPdf = useCallback((url: string) => {
    const clean = url.trim();
    if (!clean) return;
    const fileName = clean.split("/").pop() || "Giveaways Catalog";
    const autoTitle = fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");

    setEditingProject((prev) => {
      const defaultPdfCover =
        prev.category === "branding"
          ? "/assets/images/gallery/pdf_giveaways_catalog.svg"
          : "/assets/images/gallery/pdf_booth_blueprint.svg";
      const isGeneric =
        !prev.image ||
        prev.image === DEFAULT_PLACEHOLDER_COVER ||
        prev.image.includes("project_01_neon_horizon.jpg");
      return {
        ...prev,
        pdfUrl: clean,
        pdfTitle: prev.pdfTitle || autoTitle,
        image: isGeneric ? defaultPdfCover : prev.image,
      };
    });
  }, []);

  const handleFetchBehanceMetadata = useCallback(async () => {
    if (!editingProject?.behanceUrl) return;
    setIsResolvingBehance(true);
    setBehanceStatusMessage(null);

    try {
      const res = await apiFetchWithCsrf("/api/media/behance/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editingProject.behanceUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditingProject((prev) => {
          const rawImages = prev.images ? [...prev.images] : [];
          const cleanImages = rawImages.filter(
            (img) => !img.includes("project_01_neon_horizon.jpg")
          );
          if (data.coverImageUrl && !cleanImages.includes(data.coverImageUrl)) {
            cleanImages.unshift(data.coverImageUrl);
          }

          const shouldUpdateTitle = !prev.title || prev.title.startsWith("New ");
          const shouldUpdateDesc = !prev.description || prev.description.length < 15;

          return {
            ...prev,
            behanceUrl: data.canonicalUrl,
            image:
              data.coverImageUrl ||
              (prev.image?.includes("project_01_neon_horizon.jpg") ? "" : prev.image),
            images:
              cleanImages.length > 0
                ? cleanImages
                : data.coverImageUrl
                ? [data.coverImageUrl]
                : [],
            title: shouldUpdateTitle && data.title ? data.title : prev.title,
            description:
              shouldUpdateDesc && data.description ? data.description : prev.description,
          };
        });
        setBehanceStatusMessage(
          "✓ تم استخراج صورة الغلاف بدقة عالية وبيانات المشروع من Behance بنجاح!"
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        setBehanceStatusMessage(
          `✕ تعذر سحب البيانات: ${errData.error || "تأكد من صحة الرابط"}`
        );
      }
    } catch {
      setBehanceStatusMessage("✕ حدث خطأ أثناء الاتصال بسيرفر Behance");
    } finally {
      setIsResolvingBehance(false);
    }
  }, [editingProject?.behanceUrl]);

  const handleUploadCoverFile = useCallback(async (file: File) => {
    if (!file) return;
    setIsUploadingCover(true);
    setUploadError(null);

    try {
      const uploadRes = await uploadFileDirect(file, "covers");

      if (uploadRes.ok && uploadRes.url) {
        setEditingProject((prev) => {
          const currentImages = prev.images || [];
          const nextImages = [
            uploadRes.url!,
            ...currentImages.filter((img) => img !== uploadRes.url),
          ];
          return {
            ...prev,
            image: uploadRes.url!,
            images: nextImages,
          };
        });
        setUploadError(null);
      } else {
        setUploadError(uploadRes.error || "Failed to upload cover image");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setIsUploadingCover(false);
    }
  }, []);

  const handleUploadImages = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadRes = await uploadFileDirect(file, "booths");

        if (uploadRes.ok && uploadRes.url) {
          uploadedUrls.push(uploadRes.url);
        } else {
          setUploadError(uploadRes.error || `Failed to upload ${file.name}`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadError(msg);
      }
    }

    if (uploadedUrls.length > 0) {
      setEditingProject((prev) => {
        const currentImages = prev.images || (prev.image ? [prev.image] : []);
        const merged = [
          ...currentImages,
          ...uploadedUrls.filter((u) => !currentImages.includes(u)),
        ];
        return {
          ...prev,
          images: merged,
          image: prev.image || merged[0] || "",
        };
      });
    }

    setIsUploadingImages(false);
  }, []);

  const handleUploadPdf = useCallback(
    async (file: File | undefined, targetCategory?: string) => {
      if (!file) return;
      setIsUploadingPdf(true);
      setUploadError(null);

      try {
        const category = targetCategory || editingProject.category;
        const folder = category === "branding" ? "giveaways" : "blueprints";

        const uploadRes = await uploadFileDirect(file, folder);

        if (uploadRes.ok && uploadRes.url) {
          const autoTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
          const isBranding = category === "branding";
          const defaultPdfCover = isBranding
            ? "/assets/images/gallery/pdf_giveaways_catalog.svg"
            : "/assets/images/gallery/pdf_booth_blueprint.svg";

          setEditingProject((prev) => {
            const isGeneric =
              !prev.image ||
              prev.image === DEFAULT_PLACEHOLDER_COVER ||
              prev.image.includes("project_01_neon_horizon.jpg");
            return {
              ...prev,
              pdfUrl: uploadRes.url,
              pdfTitle: prev.pdfTitle || autoTitle,
              image: isGeneric ? defaultPdfCover : prev.image,
            };
          });
          setUploadError(null);
        } else {
          setUploadError(uploadRes.error || "Failed to upload PDF");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "PDF upload failed";
        setUploadError(msg);
      } finally {
        setIsUploadingPdf(false);
      }
    },
    [editingProject.category]
  );

  const triggerResolveFacebook = useCallback(
    async (targetUrl: string, explicitShort?: boolean) => {
      if (!targetUrl || !targetUrl.trim()) return;
      setResolvingFb(true);

      try {
        const res = await apiFetchWithCsrf("/api/media/facebook/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: targetUrl,
            isShort:
              explicitShort !== undefined ? explicitShort : editingProject?.isShort,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.thumbnailUrl) {
            setFbThumbnailUrl(data.thumbnailUrl);
          }
          setEditingProject((prev) => {
            const currentImages = prev.images || [];
            const nextImages =
              data.thumbnailUrl && !currentImages.includes(data.thumbnailUrl)
                ? [data.thumbnailUrl, ...currentImages]
                : currentImages;
            const targetIsShort =
              explicitShort !== undefined
                ? explicitShort
                : prev.isShort !== undefined && prev.isShort !== null
                ? prev.isShort
                : data.isReel !== undefined
                ? Boolean(data.isReel)
                : false;

            return {
              ...prev,
              facebookUrl: data.canonicalUrl || prev.facebookUrl,
              isShort: targetIsShort,
              image: data.thumbnailUrl ? data.thumbnailUrl : prev.image,
              images: nextImages,
            };
          });
          const finalFormatText = (
            explicitShort !== undefined
              ? explicitShort
              : editingProject?.isShort !== undefined && editingProject?.isShort !== null
              ? editingProject.isShort
              : data.isReel
          )
            ? "Facebook Reel (9:16)"
            : "Facebook Video (16:9)";
          setFbStatusMessage(
            `✓ تم التحقق وتجهيز مشغل ${finalFormatText} واعتماد صورة غلاف الفيديو بنجاح`
          );
        } else {
          setFbStatusMessage(
            "⚠️ رابط فيديو فيسبوك غير صالح. تأكد أن الرابط عام ومن Facebook أو fb.watch"
          );
        }
      } catch {
        setFbStatusMessage(
          "⚠️ تعذر التحقق من الرابط عبر السيرفر. تم اعتماد الرابط كما هو."
        );
      } finally {
        setResolvingFb(false);
      }
    },
    [editingProject?.isShort]
  );

  const handleYouTubeInputChange = useCallback(
    (rawInput: string) => {
      setYtStatusMessage(null);
      const cleanInput = extractFacebookVideoUrlFromSnippet(rawInput).trim();

      if (isValidFacebookVideoUrl(cleanInput)) {
        const resolvedFb = resolveSafeFacebookEmbed(cleanInput, editingProject.isShort);
        setEditingProject((prev) => ({
          ...prev,
          youtubeUrl:
            prev.youtubeUrl && !isValidFacebookVideoUrl(prev.youtubeUrl)
              ? prev.youtubeUrl
              : "",
          facebookUrl: resolvedFb ? resolvedFb.canonicalUrl : cleanInput,
        }));
        setFbStatusMessage(
          "✓ تم التعرف على رابط فيسبوك تلقائياً ونقله إلى حقل Facebook Video"
        );
        triggerResolveFacebook(cleanInput);
        return;
      }

      const resolved = resolveSafeYouTubeEmbed(cleanInput);
      if (resolved) {
        setEditingProject((prev) => {
          const isGeneric =
            !prev.image ||
            prev.image.includes("project_01_neon_horizon.jpg") ||
            prev.image.includes("placeholder");
          const ytThumbnail = `https://img.youtube.com/vi/${resolved.videoId}/hqdefault.jpg`;

          return {
            ...prev,
            youtubeUrl: resolved.canonicalUrl,
            youtubeVideoId: resolved.videoId,
            isShort: resolved.isShort,
            image: isGeneric ? ytThumbnail : prev.image,
          };
        });
      } else {
        setEditingProject((prev) => ({
          ...prev,
          youtubeUrl: rawInput,
          youtubeVideoId: null,
        }));
      }
    },
    [editingProject.isShort, triggerResolveFacebook]
  );

  const handleFacebookInputChange = useCallback(
    (rawInput: string) => {
      setFbStatusMessage(null);
      const cleanInput = extractFacebookVideoUrlFromSnippet(rawInput).trim();
      if (!cleanInput) {
        setEditingProject((prev) => ({
          ...prev,
          facebookUrl: null,
        }));
        setFbThumbnailUrl(null);
        return;
      }
      const resolved = resolveSafeFacebookEmbed(cleanInput, editingProject.isShort);
      if (resolved) {
        const isUnresolved = isUnresolvedFacebookShareUrl(cleanInput);
        setEditingProject((prev) => ({
          ...prev,
          facebookUrl: cleanInput,
        }));
        if (isUnresolved) {
          setFbStatusMessage("⏳ جاري التحقق من الرابط وفك اختصار Facebook...");
          triggerResolveFacebook(cleanInput, editingProject.isShort);
        } else {
          setFbStatusMessage("✓ تم التحقق من رابط فيديو Facebook بنجاح");
          triggerResolveFacebook(resolved.canonicalUrl, editingProject.isShort);
        }
      } else {
        setEditingProject((prev) => ({
          ...prev,
          facebookUrl: cleanInput,
        }));
        setFbStatusMessage(
          "⚠️ رابط فيديو فيسبوك غير صالح. يرجى إدخال رابط فيديو صالح من Facebook أو fb.watch"
        );
      }
    },
    [editingProject.isShort, triggerResolveFacebook]
  );

  const handleResolveFacebookMetadata = useCallback(async () => {
    if (!editingProject?.facebookUrl) return;
    await triggerResolveFacebook(editingProject.facebookUrl, editingProject.isShort);
  }, [editingProject?.facebookUrl, editingProject?.isShort, triggerResolveFacebook]);

  const handleFetchYouTubeMetadata = useCallback(async () => {
    if (!editingProject?.youtubeUrl) return;
    setResolvingYt(true);
    setYtStatusMessage(null);

    try {
      const res = await apiFetchWithCsrf("/api/media/youtube/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: editingProject.youtubeUrl,
          fetchMetadata: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const posterUrl =
          data.thumbnailUrl ||
          (data.posterCandidates && data.posterCandidates[0]) ||
          `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;

        setEditingProject((prev) => {
          const ytTitle = data.headline || prev.youtubeTitle || prev.title;
          const rawYtDesc = (data.paragraph || "").trim();
          const hasFreshYtDesc = Boolean(
            rawYtDesc && !isGenericYouTubeDescription(rawYtDesc)
          );
          const ytDesc = hasFreshYtDesc
            ? rawYtDesc
            : prev.youtubeDescription &&
              !isGenericYouTubeDescription(prev.youtubeDescription)
            ? prev.youtubeDescription
            : "";

          const prevDescIsGeneric = isGenericYouTubeDescription(prev.description);

          const shouldUpdateMainDesc =
            !prev.description ||
            prev.description.trim().length < 10 ||
            prevDescIsGeneric ||
            prev.description === prev.youtubeDescription;

          return {
            ...prev,
            title:
              (!prev.title || prev.title === "New Project") && ytTitle
                ? ytTitle
                : prev.title,
            description:
              shouldUpdateMainDesc && hasFreshYtDesc
                ? rawYtDesc
                : prevDescIsGeneric
                ? hasFreshYtDesc
                  ? rawYtDesc
                  : ""
                : prev.description,
            youtubeVideoId: data.videoId,
            youtubeUrl: data.canonicalUrl,
            youtubeTitle: ytTitle,
            youtubeDescription: ytDesc,
            isShort: Boolean(data.isShort),
            image: posterUrl || prev.image,
          };
        });
        setYtStatusMessage(
          "✓ تم استخراج صورة الغلاف وعنوان ووصف الفيديو الحقيقي من YouTube وتعبئتها بنجاح"
        );
      } else {
        const parsed = resolveSafeYouTubeEmbed(editingProject.youtubeUrl);
        if (parsed) {
          const fallbackThumb = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
          setEditingProject((prev) => {
            const fallbackTitle =
              prev.youtubeTitle || `${prev.title || "Project"} — Official Showreel`;
            const prevDescIsGeneric = isGenericYouTubeDescription(prev.description);
            const prevYtDescIsGeneric = isGenericYouTubeDescription(
              prev.youtubeDescription
            );
            const fallbackDesc =
              !prevYtDescIsGeneric && prev.youtubeDescription
                ? prev.youtubeDescription
                : !prevDescIsGeneric && prev.description
                ? prev.description
                : "";

            return {
              ...prev,
              title:
                (!prev.title || prev.title === "New Project") && fallbackTitle
                  ? fallbackTitle
                  : prev.title,
              description:
                (!prev.description ||
                  prev.description.trim().length < 10 ||
                  prevDescIsGeneric) &&
                fallbackDesc
                  ? fallbackDesc
                  : prev.description,
              youtubeVideoId: parsed.videoId,
              youtubeUrl: parsed.canonicalUrl,
              isShort: parsed.isShort,
              youtubeTitle: fallbackTitle,
              youtubeDescription: fallbackDesc,
              image:
                !prev.image || prev.image.includes("project_01_neon_horizon.jpg")
                  ? fallbackThumb
                  : prev.image,
            };
          });
          setYtStatusMessage(
            "✓ تم التحقق من رابط YouTube وسحب صورة الغلاف وتجهيز البيانات بنجاح"
          );
        } else {
          setYtStatusMessage(
            "⚠️ رابط YouTube غير صالح. يرجى وضع رابط الفيديو مباشرة (بدون كود iframe)"
          );
        }
      }
    } catch {
      setYtStatusMessage("⚠️ تعذر الاتصال بـ YouTube لجلب بيانات الفيديو تلقائياً");
    } finally {
      setResolvingYt(false);
    }
  }, [editingProject?.youtubeUrl]);

  return {
    editingProject,
    setEditingProject,
    resolvingYt,
    ytStatusMessage,
    setYtStatusMessage,
    resolvingFb,
    fbStatusMessage,
    setFbStatusMessage,
    fbThumbnailUrl,
    isResolvingBehance,
    behanceStatusMessage,
    setBehanceStatusMessage,
    uploadError,
    setUploadError,
    isUploadingCover,
    isUploadingImages,
    isUploadingPdf,
    applyThumbnailAsCover,
    addManualImageUrl,
    setManualCover,
    setManualPdf,
    handleFetchBehanceMetadata,
    handleUploadCoverFile,
    handleUploadImages,
    handleUploadPdf,
    handleYouTubeInputChange,
    handleFacebookInputChange,
    handleResolveFacebookMetadata,
    handleFetchYouTubeMetadata,
  };
}
