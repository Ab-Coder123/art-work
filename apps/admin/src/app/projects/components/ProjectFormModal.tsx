import React, { useState, useRef } from "react";
import {
  X,
  Save,
  Video,
  Sparkles,
  Loader2,
  Smartphone,
  FileText,
  UploadCloud,
  Star,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  ProjectRecord,
  resolveSafeYouTubeEmbed,
  resolveSafeFacebookEmbed,
  isValidFacebookVideoUrl,
  isUnresolvedFacebookShareUrl,
  extractFacebookVideoUrlFromSnippet,
  isGenericYouTubeDescription,
} from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { BehanceIcon, YouTubeIcon } from "./Icons";
import { FacebookVideoFieldCard } from "./FacebookVideoFieldCard";

export interface ProjectFormModalProps {
  project: ProjectRecord;
  isCreatingNew: boolean;
  isSaving: boolean;
  modalError: string | null;
  onClose: () => void;
  onSave: (project: ProjectRecord) => void;
  setModalError: (err: string | null) => void;
}

export function ProjectFormModal({
  project,
  isSaving,
  modalError,
  onClose,
  onSave,
  setModalError,
}: ProjectFormModalProps) {
  const [editingProject, setEditingProject] = useState<ProjectRecord>(project);

  // Form-specific UI states
  const [resolvingYt, setResolvingYt] = useState(false);
  const [ytStatusMessage, setYtStatusMessage] = useState<string | null>(null);
  const [resolvingFb, setResolvingFb] = useState(false);
  const [fbStatusMessage, setFbStatusMessage] = useState<string | null>(null);
  const [fbThumbnailUrl, setFbThumbnailUrl] = useState<string | null>(
    project.facebookUrl && project.image ? project.image : null
  );
  const [isResolvingBehance, setIsResolvingBehance] = useState(false);
  const [behanceStatusMessage, setBehanceStatusMessage] = useState<string | null>(null);
  const [mediaSourceTab, setMediaSourceTab] = useState<"behance" | "upload">(
    project.behanceUrl ? "behance" : "upload"
  );
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [manualPdfUrl, setManualPdfUrl] = useState("");
  const [manualCoverUrl, setManualCoverUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Uploading and dragging indicators
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isBoothImagesDragging, setIsBoothImagesDragging] = useState(false);
  const [isBoothPdfDragging, setIsBoothPdfDragging] = useState(false);
  const [isGiveawaysPdfDragging, setIsGiveawaysPdfDragging] = useState(false);

  // Dedicated file input references
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const boothImagesInputRef = useRef<HTMLInputElement | null>(null);
  const boothPdfInputRef = useRef<HTMLInputElement | null>(null);
  const giveawaysPdfInputRef = useRef<HTMLInputElement | null>(null);

  const applyThumbnailAsCover = (url: string) => {
    setEditingProject((prev) => {
      const currentImages = prev.images || [];
      const nextImages = !currentImages.includes(url) ? [url, ...currentImages] : currentImages;
      return {
        ...prev,
        image: url,
        images: nextImages,
      };
    });
  };

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    const url = manualImageUrl.trim();
    const nextImages = editingProject.images ? [...editingProject.images] : [];
    if (!nextImages.includes(url)) {
      nextImages.push(url);
    }
    setEditingProject({
      ...editingProject,
      image: editingProject.image || url,
      images: nextImages,
    });
    setManualImageUrl("");
  };

  const handleFetchBehanceMetadata = async () => {
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
            image: data.coverImageUrl || (prev.image?.includes("project_01_neon_horizon.jpg") ? "" : prev.image),
            images: cleanImages.length > 0 ? cleanImages : (data.coverImageUrl ? [data.coverImageUrl] : []),
            title: shouldUpdateTitle && data.title ? data.title : prev.title,
            description: shouldUpdateDesc && data.description ? data.description : prev.description,
          };
        });
        setBehanceStatusMessage("✓ تم استخراج صورة الغلاف بدقة عالية وبيانات المشروع من Behance بنجاح!");
      } else {
        const errData = await res.json().catch(() => ({}));
        setBehanceStatusMessage(`✕ تعذر سحب البيانات: ${errData.error || "تأكد من صحة الرابط"}`);
      }
    } catch {
      setBehanceStatusMessage("✕ حدث خطأ أثناء الاتصال بسيرفر Behance");
    } finally {
      setIsResolvingBehance(false);
    }
  };

  const handleUploadCoverFile = async (file: File) => {
    if (!file) return;
    setIsUploadingCover(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "covers");

      const res = await apiFetchWithCsrf("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditingProject((prev) => {
          const currentImages = prev.images || [];
          const nextImages = [data.url, ...currentImages.filter((img) => img !== data.url)];
          return {
            ...prev,
            image: data.url,
            images: nextImages,
          };
        });
        setUploadError(null);
      } else {
        setUploadError(data.error || "Failed to upload cover image");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setIsUploadingCover(false);
      setIsCoverDragging(false);
    }
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "booths");

        const res = await apiFetchWithCsrf("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          setUploadError(data.error || `Failed to upload ${file.name}`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadError(msg);
      }
    }

    if (uploadedUrls.length > 0) {
      setEditingProject((prev) => {
        const currentImages = prev.images || (prev.image ? [prev.image] : []);
        const merged = [...currentImages, ...uploadedUrls.filter((u) => !currentImages.includes(u))];
        return {
          ...prev,
          images: merged,
          image: prev.image || merged[0] || "",
        };
      });
    }

    setIsUploadingImages(false);
  };

  const handleUploadPdf = async (file: File | undefined, targetCategory?: string) => {
    if (!file) return;
    setIsUploadingPdf(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const category = targetCategory || editingProject.category;
      formData.append("folder", category === "branding" ? "giveaways" : "blueprints");

      const res = await apiFetchWithCsrf("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const autoTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        setEditingProject((prev) => ({
          ...prev,
          pdfUrl: data.url,
          pdfTitle: prev.pdfTitle || autoTitle,
        }));
        setUploadError(null);
      } else {
        setUploadError(data.error || "Failed to upload PDF");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PDF upload failed";
      setUploadError(msg);
    } finally {
      setIsUploadingPdf(false);
      setIsBoothPdfDragging(false);
      setIsGiveawaysPdfDragging(false);
    }
  };

  const triggerResolveFacebook = async (targetUrl: string, explicitShort?: boolean) => {
    if (!targetUrl || !targetUrl.trim()) return;
    setResolvingFb(true);

    try {
      const res = await apiFetchWithCsrf("/api/media/facebook/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: targetUrl,
          isShort: explicitShort !== undefined ? explicitShort : editingProject?.isShort,
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
        setFbStatusMessage("⚠️ رابط فيديو فيسبوك غير صالح. تأكد أن الرابط عام ومن Facebook أو fb.watch");
      }
    } catch {
      setFbStatusMessage("⚠️ تعذر التحقق من الرابط عبر السيرفر. تم اعتماد الرابط كما هو.");
    } finally {
      setResolvingFb(false);
    }
  };

  const handleYouTubeInputChange = (rawInput: string) => {
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
      setFbStatusMessage("✓ تم التعرف على رابط فيسبوك تلقائياً ونقله إلى حقل Facebook Video");
      triggerResolveFacebook(cleanInput);
      return;
    }

    const resolved = resolveSafeYouTubeEmbed(cleanInput);
    if (resolved) {
      const isGeneric =
        !editingProject.image ||
        editingProject.image.includes("project_01_neon_horizon.jpg") ||
        editingProject.image.includes("placeholder");
      const ytThumbnail = `https://img.youtube.com/vi/${resolved.videoId}/hqdefault.jpg`;

      setEditingProject({
        ...editingProject,
        youtubeUrl: resolved.canonicalUrl,
        youtubeVideoId: resolved.videoId,
        isShort: resolved.isShort,
        image: isGeneric ? ytThumbnail : editingProject.image,
      });
    } else {
      setEditingProject({
        ...editingProject,
        youtubeUrl: rawInput,
        youtubeVideoId: null,
      });
    }
  };

  const handleFacebookInputChange = (rawInput: string) => {
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
      setFbStatusMessage("⚠️ رابط فيديو فيسبوك غير صالح. يرجى إدخال رابط فيديو صالح من Facebook أو fb.watch");
    }
  };

  const handleResolveFacebookMetadata = async () => {
    if (!editingProject?.facebookUrl) return;
    await triggerResolveFacebook(editingProject.facebookUrl, editingProject.isShort);
  };

  const handleFetchYouTubeMetadata = async () => {
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
          const hasFreshYtDesc = Boolean(rawYtDesc && !isGenericYouTubeDescription(rawYtDesc));
          const ytDesc = hasFreshYtDesc
            ? rawYtDesc
            : (prev.youtubeDescription && !isGenericYouTubeDescription(prev.youtubeDescription)
              ? prev.youtubeDescription
              : "");

          const prevDescIsGeneric = isGenericYouTubeDescription(prev.description);

          const shouldUpdateMainDesc =
            !prev.description ||
            prev.description.trim().length < 10 ||
            prevDescIsGeneric ||
            prev.description === prev.youtubeDescription;

          return {
            ...prev,
            title: (!prev.title || prev.title === "New Project") && ytTitle ? ytTitle : prev.title,
            description: shouldUpdateMainDesc && hasFreshYtDesc
              ? rawYtDesc
              : (prevDescIsGeneric ? (hasFreshYtDesc ? rawYtDesc : "") : prev.description),
            youtubeVideoId: data.videoId,
            youtubeUrl: data.canonicalUrl,
            youtubeTitle: ytTitle,
            youtubeDescription: ytDesc,
            isShort: Boolean(data.isShort),
            image: posterUrl || prev.image,
          };
        });
        setYtStatusMessage("✓ تم استخراج صورة الغلاف وعنوان ووصف الفيديو الحقيقي من YouTube وتعبئتها بنجاح");
      } else {
        const parsed = resolveSafeYouTubeEmbed(editingProject.youtubeUrl);
        if (parsed) {
          const fallbackThumb = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
          setEditingProject((prev) => {
            const fallbackTitle = prev.youtubeTitle || `${prev.title || "Project"} — Official Showreel`;
            const prevDescIsGeneric = isGenericYouTubeDescription(prev.description);
            const prevYtDescIsGeneric = isGenericYouTubeDescription(prev.youtubeDescription);
            const fallbackDesc = !prevYtDescIsGeneric && prev.youtubeDescription
              ? prev.youtubeDescription
              : (!prevDescIsGeneric && prev.description ? prev.description : "");

            return {
              ...prev,
              title: (!prev.title || prev.title === "New Project") && fallbackTitle ? fallbackTitle : prev.title,
              description: (!prev.description || prev.description.trim().length < 10 || prevDescIsGeneric) && fallbackDesc
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
          setYtStatusMessage("✓ تم التحقق من رابط YouTube وسحب صورة الغلاف وتجهيز البيانات بنجاح");
        } else {
          setYtStatusMessage("⚠️ رابط YouTube غير صالح. يرجى وضع رابط الفيديو مباشرة (بدون كود iframe)");
        }
      }
    } catch {
      setYtStatusMessage("⚠️ تعذر الاتصال بـ YouTube لجلب بيانات الفيديو تلقائياً");
    } finally {
      setResolvingYt(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingProject);
  };

  const resolvedPreview = editingProject
    ? resolveSafeYouTubeEmbed(editingProject.youtubeVideoId || editingProject.youtubeUrl)
    : null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="bg-[#151520] border border-[#2b2b3d] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Sticky Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262638] bg-[#171724] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#ffffff]">
              AW
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                {editingProject.id.startsWith("project-")
                  ? "New Showcase Project"
                  : "Edit Project Record"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Scroll Y active • Configuring media, copy & YouTube synchronization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#20202e] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body (Dedicated Scroll Y) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs font-mono overscroll-contain">
          {/* Mode Indicator Banner */}
          {editingProject.category === "booths" ? (
            <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-300">
                <FileText className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Exhibition Booth &amp; Pavilion Production Mode
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Headline • Description • 3D Renders • PDF Blueprints
              </span>
            </div>
          ) : null}

          {/* 1. Headline & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">
                {editingProject.category === "booths" ? "Booth / Pavilion Headline" : "Project Display Title"}
              </label>
              <input
                type="text"
                required
                placeholder={editingProject.category === "booths" ? "e.g. Nova MedTech 36m² Custom Pavilion" : "e.g. Neon Horizon Tour"}
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                {editingProject.category === "booths" ? "Exhibitor / Client Name" : "Client Name"}
              </label>
              <input
                type="text"
                required
                placeholder={editingProject.category === "booths" ? "e.g. Nova MedTech Innovations" : "e.g. Global Music Group"}
                value={editingProject.client}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, client: e.target.value })
                }
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* 2. Category, Year, and Meta Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Category</label>
              <select
                value={editingProject.category}
                onChange={(e) => {
                  const newCat = e.target.value as ProjectRecord["category"];
                  const isNowBooth = newCat === "booths";
                  setEditingProject({
                    ...editingProject,
                    category: newCat,
                    metaBadge:
                      isNowBooth &&
                        (!editingProject.metaBadge ||
                          editingProject.metaBadge.includes("2026") ||
                          editingProject.metaBadge.includes("GATHERING"))
                        ? "36M² CUSTOM BUILD"
                        : editingProject.metaBadge,
                    image:
                      isNowBooth &&
                        (!editingProject.image ||
                          editingProject.image.includes("neon_horizon"))
                        ? "/assets/images/gallery/project_06_sensory_expo.jpg"
                        : editingProject.image,
                  });
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="conferences">Conferences & Medical Events</option>
                <option value="booths">Exhibition Booths</option>
                <option value="branding">Branding & Print & Giveaways</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Year / التاريخ السنوي
              </label>
              <input
                type="number"
                min="2000"
                max="2099"
                placeholder="2026"
                value={editingProject.year || 2026}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const updatedYear = isNaN(val) ? 2026 : val;
                  setEditingProject({
                    ...editingProject,
                    year: updatedYear,
                    stamp: String(updatedYear),
                  });
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                {editingProject.category === "booths" ? "Footprint Badge" : "Tagline / Badge (Right)"}
              </label>
              <input
                type="text"
                placeholder={editingProject.category === "booths" ? "36M² CUSTOM BUILD" : "ANNUAL GATHERING"}
                value={editingProject.metaBadge ?? ""}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, metaBadge: e.target.value })
                }
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-zinc-400 mb-1">
              {editingProject.category === "booths"
                ? "Booth Description & Spatial Concept"
                : "Description & Scenography Narrative"}
            </label>
            <textarea
              rows={3}
              placeholder={
                editingProject.category === "booths"
                  ? "Describe the booth layout, spatial architecture, visitor journey, finishes (matte lacquer, acrylic, CNC joinery), and integrated audio-visual..."
                  : "Describe project scenography..."
              }
              value={editingProject.description}
              onChange={(e) =>
                setEditingProject({ ...editingProject, description: e.target.value })
              }
              className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
            />
          </div>

          {/* 4. Tags & Filter Keywords */}
          <div>
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <label className="block text-zinc-400">
                Project Tags / Chips (Separated by commas)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                First tag is highlighted in yellow as primary
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Corporate Gathering, Annual Event, Stage & Production, Event Management"
              value={
                Array.isArray(editingProject.tags)
                  ? editingProject.tags.join(", ")
                  : typeof editingProject.tags === "string"
                    ? editingProject.tags
                    : ""
              }
              onChange={(e) => {
                const tagsArray = e.target.value
                  .split(",")
                  .map((t) => t.trimStart());
                setEditingProject({ ...editingProject, tags: tagsArray });
              }}
              onBlur={(e) => {
                const cleanTags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                setEditingProject({ ...editingProject, tags: cleanTags });
              }}
              className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 font-mono text-xs"
            />
            {Array.isArray(editingProject.tags) && editingProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {editingProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${idx === 0
                      ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Global Media Upload Error (All Categories & Files) */}
          {uploadError && (
            <div className="p-3.5 bg-red-950/60 border-2 border-red-500/60 rounded-xl text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg shadow-red-950/30">
              <div className="flex items-center gap-2">
                <span className="font-bold">⚠️ Upload Error:</span>
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="p-1 text-red-400 hover:text-white hover:bg-red-900/40 rounded-lg cursor-pointer transition-colors"
                title="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 5. MEDIA ENGINE: DYNAMIC BASED ON BOOTH VS STANDARD */}
          {editingProject.category === "booths" ? (
            <div className="space-y-4">
              {/* SELECT MEDIA SOURCE TABS */}
              <div className="p-1 bg-[#101018] border border-[#2b2b3d] rounded-2xl flex items-center gap-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMediaSourceTab("behance")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${mediaSourceTab === "behance"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black"
                    : "text-zinc-400 hover:text-white hover:bg-[#181824]"
                    }`}
                >
                  <BehanceIcon className="w-4 h-4" />
                  <span>Behance 3D Project Sync</span>
                  {editingProject.behanceUrl && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMediaSourceTab("upload")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${mediaSourceTab === "upload"
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-black"
                    : "text-zinc-400 hover:text-white hover:bg-[#181824]"
                    }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Manual 3D Renders &amp; File Upload</span>
                  {(editingProject.images?.length || editingProject.image) ? (
                    <span className="text-[10px] bg-black/40 text-yellow-300 px-1.5 py-0.5 rounded-full ml-0.5">
                      {editingProject.images?.length || 1}
                    </span>
                  ) : null}
                </button>
              </div>

              {/* DYNAMIC RENDERING: BEHANCE ONLY VS MANUAL UPLOAD ONLY */}
              {mediaSourceTab === "behance" ? (
                /* BEHANCE 3D INTEGRATION TAB */
                <div className="p-5 bg-gradient-to-br from-blue-950/40 via-[#0e1424] to-[#0d0d12] border-2 border-blue-500/50 rounded-2xl space-y-4 shadow-xl shadow-blue-950/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                        <BehanceIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-xs uppercase tracking-wider font-mono">
                            Behance 3D Project Sync
                          </span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                            AUTO-IMPORT
                          </span>
                        </div>
                        <span className="text-[10px] text-blue-200/70 font-mono">
                          Paste Behance project URL to auto-extract high-res 3D perspective &amp; portfolio link
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input & Auto-Fetch Button */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="https://www.behance.net/gallery/12345678/Booth-Design..."
                        value={editingProject.behanceUrl || ""}
                        onChange={(e) => {
                          setEditingProject({
                            ...editingProject,
                            behanceUrl: e.target.value,
                          });
                          setBehanceStatusMessage(null);
                        }}
                        className="w-full bg-[#151520] border border-blue-500/40 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none text-xs font-mono pr-8"
                      />
                      {editingProject.behanceUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({ ...editingProject, behanceUrl: null });
                            setBehanceStatusMessage(null);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="Clear URL"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleFetchBehanceMetadata}
                      disabled={!editingProject.behanceUrl || isResolvingBehance}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-40 cursor-pointer shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap active:scale-95"
                    >
                      {isResolvingBehance ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>Auto-Fetch 3D Render</span>
                    </button>
                  </div>

                  {/* Status Message */}
                  {behanceStatusMessage && (
                    <div
                      className={`text-xs font-mono px-3.5 py-2 rounded-xl border flex items-center gap-2 ${behanceStatusMessage.startsWith("✓")
                        ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                        : "text-rose-300 bg-rose-500/10 border-rose-500/30"
                        }`}
                    >
                      <span>{behanceStatusMessage}</span>
                    </div>
                  )}

                  {/* Live Extracted Render Preview Card */}
                  {editingProject.image && !editingProject.image.includes("project_01_neon_horizon.jpg") ? (
                    <div className="pt-2 border-t border-blue-500/20 space-y-3">
                      <div className="text-[10px] text-blue-300/80 font-mono flex items-center justify-between">
                        <span>ACTIVE 3D PERSPECTIVE (EXTRACTED FROM BEHANCE)</span>
                        <a
                          href={editingProject.behanceUrl || undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Open Project on Behance ↗</span>
                        </a>
                      </div>
                      <div className="relative aspect-[16/9] max-w-md mx-auto rounded-xl overflow-hidden border-2 border-blue-400/40 bg-black shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProject.image}
                          alt="Behance 3D Booth Preview"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                          ★ BEHANCE 3D COVER
                        </div>
                      </div>

                      {/* Additional angles input from Behance */}
                      <div className="pt-2 border-t border-blue-500/10 space-y-2">
                        <label className="text-[11px] text-blue-200/90 font-mono block">
                          Add more 3D render angles from this Behance project (Copy image address &amp; paste here):
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="url"
                            placeholder="https://mir-s3-cdn-cf.behance.net/..."
                            value={manualImageUrl}
                            onChange={(e) => setManualImageUrl(e.target.value)}
                            className="flex-1 bg-[#151520] border border-blue-500/30 rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400 text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddManualImage}
                            disabled={!manualImageUrl.trim()}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow whitespace-nowrap"
                          >
                            + Add Angle
                          </button>
                        </div>

                        {/* Images row if more than 1 image */}
                        {editingProject.images && editingProject.images.length > 1 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                            {editingProject.images.map((img, idx) => {
                              const isCover = img === editingProject.image;
                              return (
                                <div
                                  key={idx}
                                  className={`relative aspect-[16/10] rounded-lg overflow-hidden border p-0.5 bg-black cursor-pointer group ${isCover ? "border-blue-400 ring-1 ring-blue-400" : "border-[#2b2b3d]"
                                    }`}
                                  onClick={() => setEditingProject({ ...editingProject, image: img })}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt={`Angle ${idx + 1}`} referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                  {isCover && (
                                    <span className="absolute top-1 left-1 bg-blue-600 text-white font-black text-[8px] px-1 py-0.2 rounded shadow">
                                      Cover
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 text-center space-y-1.5 mt-2">
                      <p className="text-xs text-blue-300 font-mono">
                        ✦ جاهز لسحب صورة الغلاف من مشروع Behance
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        اضغط على <span className="text-blue-400 font-bold">&ldquo;Auto-Fetch 3D Render&rdquo;</span> بالأعلى وسيتم جلب وتعيين صورة الرندر الحقيقية للمشروع تلقائياً.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* MANUAL UPLOAD TAB */
                <div className="space-y-4">
                  <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Manual 3D Spatial Renders &amp; Photos
                          </span>
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            Upload 3D perspectives, elevations or paste direct image links
                          </span>
                        </div>
                      </div>
                      {(editingProject.images?.length || editingProject.image) ? (
                        <span className="text-[10px] text-yellow-300 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full font-mono">
                          {(editingProject.images?.length || 1)} Renders Attached
                        </span>
                      ) : null}
                    </div>

                    {/* Drag & Drop Booth Images Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsBoothImagesDragging(true);
                      }}
                      onDragLeave={() => setIsBoothImagesDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsBoothImagesDragging(false);
                        if (e.dataTransfer.files) handleUploadImages(e.dataTransfer.files);
                      }}
                      onClick={() => !isUploadingImages && boothImagesInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${isBoothImagesDragging
                        ? "border-yellow-400 bg-yellow-400/10 scale-[1.01]"
                        : "border-[#2b2b3d] bg-[#12121c] hover:border-yellow-400/60 hover:bg-[#151522]"
                        }`}
                    >
                      <input
                        ref={boothImagesInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        disabled={isUploadingImages}
                        onChange={(e) => {
                          handleUploadImages(e.target.files);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                      {isUploadingImages ? (
                        <div className="py-2 flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                          <span className="font-mono text-zinc-400 text-xs">
                            Uploading spatial renders to Supabase...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold">
                              Drag &amp; drop booth images here, or <span className="text-yellow-400 underline">browse</span>
                            </p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              Select single or multiple perspectives (PNG, JPG, WebP)
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Direct Image URL input */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#1e1e2d]">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (e.g. Behance CDN link, Unsplash, etc.)..."
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualImage}
                        disabled={!manualImageUrl.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
                      >
                        + Add Image URL
                      </button>
                    </div>

                    {/* Images Previews Grid */}
                    {(() => {
                      const imagesList =
                        editingProject.images && editingProject.images.length > 0
                          ? editingProject.images
                          : editingProject.image
                            ? [editingProject.image]
                            : [];
                      return imagesList.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                          {imagesList.map((img, idx) => {
                            const isCover = img === editingProject.image;
                            return (
                              <div
                                key={idx}
                                className={`relative rounded-xl border p-1.5 bg-[#151520] flex flex-col gap-1.5 ${isCover ? "border-yellow-400 ring-1 ring-yellow-400" : "border-[#2b2b3d]"
                                  }`}
                              >
                                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt={`Booth preview ${idx + 1}`} className="w-full h-full object-cover" />
                                  {isCover && (
                                    <span className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                                      ★ Cover
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-1 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => setEditingProject({ ...editingProject, image: img })}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${isCover
                                      ? "bg-yellow-400 text-black"
                                      : "text-zinc-400 hover:text-white bg-[#20202e]"
                                      }`}
                                  >
                                    {isCover ? "Primary Cover" : "Set as Cover"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = imagesList.filter((_, i) => i !== idx);
                                      const nextCover = isCover ? filtered[0] || "" : editingProject.image;
                                      setEditingProject({
                                        ...editingProject,
                                        images: filtered,
                                        image: nextCover,
                                      });
                                    }}
                                    className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                                    title="Remove Image"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-zinc-500 italic">No images attached yet. Add at least 1 image.</p>
                      );
                    })()}
                  </div>

                  {/* ARCHITECTURAL BLUEPRINT & TECHNICAL SPEC (PDF) */}
                  <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Architectural Blueprint &amp; Specs (PDF)
                          </span>
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            Floor plans, 3D technical elevation &amp; spatial layout sheets
                          </span>
                        </div>
                      </div>
                      {editingProject.pdfUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          ✓ Blueprint Attached
                        </span>
                      )}
                    </div>

                    {/* Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsBoothPdfDragging(true);
                      }}
                      onDragLeave={() => setIsBoothPdfDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsBoothPdfDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleUploadPdf(file);
                      }}
                      onClick={() => !isUploadingPdf && boothPdfInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${isBoothPdfDragging
                        ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                        : "border-[#2b2b3d] bg-[#12121c] hover:border-amber-400/50 hover:bg-[#141420]"
                        }`}
                    >
                      <input
                        ref={boothPdfInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        disabled={isUploadingPdf}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadPdf(file);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                      {isUploadingPdf ? (
                        <div className="py-2 flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                          <span className="font-mono text-zinc-400 text-[11px]">
                            Uploading PDF blueprint...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold">
                              Drag &amp; drop architectural PDF here, or <span className="text-amber-400 underline">browse</span>
                            </p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              CAD drawings, spatial specs &amp; 3D axonometric sheets (Max 25MB)
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Attached PDF Preview Card */}
                    {editingProject.pdfUrl && (
                      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate">
                              {editingProject.pdfTitle || "Architectural Blueprint (PDF)"}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">{editingProject.pdfUrl}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          <a
                            href={editingProject.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1 font-bold"
                          >
                            <span>View Blueprint ↗</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject({ ...editingProject, pdfUrl: null, pdfTitle: null });
                              if (boothPdfInputRef.current) boothPdfInputRef.current.value = "";
                            }}
                            className="px-2.5 py-1 text-[11px] bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-colors"
                            title="Delete Attached PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VIDEO & WALKTHROUGH HUB */}
                  <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Booth Walkthrough &amp; Video Tour
                          </span>
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            Optional YouTube showreel, spatial animation or vertical short
                          </span>
                        </div>
                      </div>

                      {/* Format Switcher Badge */}
                      <div className="flex items-center gap-1 bg-[#161622] p-1 rounded-lg border border-[#262638]">
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, isShort: false })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${!editingProject.isShort
                            ? "bg-red-500 text-white font-bold"
                            : "text-zinc-400 hover:text-white"
                            }`}
                        >
                          16:9 Showcase
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, isShort: true })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${editingProject.isShort
                            ? "bg-red-500 text-white font-bold"
                            : "text-zinc-400 hover:text-white"
                            }`}
                        >
                          9:16 Reel/Shorts
                        </button>
                      </div>
                    </div>

                    {/* Video Input + Embed */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Paste YouTube video or Shorts link (e.g. youtube.com/watch?v=... or shorts/...)"
                        value={editingProject.youtubeUrl || ""}
                        onChange={(e) => handleYouTubeInputChange(e.target.value)}
                        className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 text-xs font-mono"
                      />
                      {editingProject.youtubeUrl && (
                        <button
                          type="button"
                          onClick={() => handleYouTubeInputChange("")}
                          className="px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Live Embed Preview if valid */}
                    {(() => {
                      const resolved = editingProject.youtubeUrl ? resolveSafeYouTubeEmbed(editingProject.youtubeUrl) : null;
                      if (!resolved) return null;
                      return (
                        <div className="mt-2 pt-2 border-t border-[#1e1e2d] space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Valid YouTube Embed (ID: {resolved.videoId})
                            </span>
                            <span>{editingProject.isShort ? "9:16 Vertical Reel" : "16:9 Cinematic Video"}</span>
                          </div>
                          <div
                            className={`rounded-xl overflow-hidden border border-[#2b2b3d] bg-black ${editingProject.isShort
                              ? "aspect-[9/16] max-w-[220px] mx-auto"
                              : "aspect-video w-full max-w-md mx-auto"
                              }`}
                          >
                            <iframe
                              src={resolved.embedUrl}
                              title="Booth Video Walkthrough"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Facebook Video / Reel for Booth */}
                  <FacebookVideoFieldCard
                    facebookUrl={editingProject.facebookUrl}
                    isShort={Boolean(editingProject.isShort)}
                    onToggleShort={(short) => {
                      setEditingProject((prev) => ({ ...prev, isShort: short }));
                      setFbStatusMessage(
                        short
                          ? "تم ضبط المشغل على 9:16 رأسي (Vertical Reel)"
                          : "تم ضبط المشغل على 16:9 أفقي (Horizontal Video)"
                      );
                    }}
                    thumbnailUrl={fbThumbnailUrl}
                    onApplyThumbnailAsCover={applyThumbnailAsCover}
                    onChange={handleFacebookInputChange}
                    onVerify={handleResolveFacebookMetadata}
                    isVerifying={resolvingFb}
                    statusMessage={fbStatusMessage}
                    variant="booth"
                  />
                </div>
              )}
            </div>
          ) : (
            /* STANDARD STAGE & CONFERENCES YOUTUBE ENGINE */
            <div className="space-y-4">
              {/* Cover & Card Thumbnail Image with Drag & Drop */}
              <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-zinc-200 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Card Thumbnail &amp; Cover Image (Main Website)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {editingProject.youtubeVideoId && (
                      <button
                        type="button"
                        onClick={() => {
                          const ytThumb = `https://img.youtube.com/vi/${editingProject.youtubeVideoId}/hqdefault.jpg`;
                          setEditingProject({ ...editingProject, image: ytThumb });
                          setYtStatusMessage("✓ Synced thumbnail directly from YouTube video");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-[10px] font-bold border border-yellow-400/30 cursor-pointer transition-colors"
                      >
                        Sync Thumbnail from YouTube
                      </button>
                    )}
                    {editingProject.facebookUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (fbThumbnailUrl) {
                            applyThumbnailAsCover(fbThumbnailUrl);
                          } else {
                            handleResolveFacebookMetadata();
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-bold border border-blue-500/30 cursor-pointer transition-colors"
                      >
                        Sync Thumbnail from Facebook
                      </button>
                    )}
                    {editingProject.image && (
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, image: "" })}
                        className="px-2 py-1 text-[10px] text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Drag & Drop Upload Zone + Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                  {/* Thumbnail Preview (Left) */}
                  <div className="sm:col-span-4 aspect-[16/10] sm:aspect-auto sm:h-28 rounded-xl overflow-hidden border border-[#2b2b3d] bg-black relative flex items-center justify-center">
                    {editingProject.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProject.image}
                          alt="Project Card Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/assets/images/gallery/project_01_neon_horizon.jpg";
                          }}
                        />
                        <div className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                          Active Cover
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-600 gap-1 p-2 text-center">
                        <Sparkles className="w-5 h-5 text-zinc-700" />
                        <span className="text-[10px] font-mono">No Cover Image</span>
                      </div>
                    )}
                  </div>

                  {/* Drag and Drop Zone (Right) */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(true);
                    }}
                    onDragLeave={() => setIsCoverDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleUploadCoverFile(file);
                    }}
                    onClick={() => !isUploadingCover && coverInputRef.current?.click()}
                    className={`sm:col-span-8 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${isCoverDragging
                      ? "border-yellow-400 bg-yellow-400/10 scale-[1.01]"
                      : "border-[#2b2b3d] bg-[#12121c] hover:border-yellow-400/60 hover:bg-[#151522]"
                      }`}
                  >
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      disabled={isUploadingCover}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadCoverFile(file);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    {isUploadingCover ? (
                      <div className="py-2 flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                        <span className="font-mono text-zinc-400 text-[11px]">
                          Uploading image...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">
                            Drag &amp; drop cover image here, or <span className="text-yellow-400 underline">browse</span>
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            PNG, JPG, WebP (drag from desktop or click to upload)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Direct URL input for Cover Image */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#1e1e2d]">
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (e.g. /assets/images/... or https://...)..."
                    value={manualCoverUrl}
                    onChange={(e) => setManualCoverUrl(e.target.value)}
                    className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!manualCoverUrl.trim()) return;
                      const url = manualCoverUrl.trim();
                      setEditingProject((prev) => {
                        const currentImages = prev.images || [];
                        const nextImages = [url, ...currentImages.filter((u) => u !== url)];
                        return {
                          ...prev,
                          image: url,
                          images: nextImages,
                        };
                      });
                      setManualCoverUrl("");
                      setUploadError(null);
                    }}
                    disabled={!manualCoverUrl.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
                  >
                    + Set Cover Image
                  </button>
                </div>
              </div>

              {/* Giveaways & Merchandise Specification Sheet & Catalog (PDF) */}
              {editingProject.category === "branding" && (
                <div className="p-4 bg-gradient-to-br from-amber-950/30 via-[#14121a] to-[#0d0d14] border-2 border-amber-500/40 rounded-xl space-y-3 shadow-lg shadow-amber-950/20">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Giveaways Catalog &amp; Specs (PDF)
                          </span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                            GIVEAWAYS &amp; MERCH
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block font-mono">
                          Attach corporate gifts catalog, item dimensions, printing specs or pricing proposals (PDF)
                        </span>
                      </div>
                    </div>
                    {editingProject.pdfUrl && (
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Giveaways PDF Attached
                      </span>
                    )}
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsGiveawaysPdfDragging(true);
                    }}
                    onDragLeave={() => setIsGiveawaysPdfDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsGiveawaysPdfDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleUploadPdf(file, "branding");
                    }}
                    onClick={() => !isUploadingPdf && giveawaysPdfInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${isGiveawaysPdfDragging
                      ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                      : "border-[#2b2b3d] bg-[#12121c] hover:border-amber-400/60 hover:bg-[#161524]"
                      }`}
                  >
                    <input
                      ref={giveawaysPdfInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      disabled={isUploadingPdf}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadPdf(file, "branding");
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    {isUploadingPdf ? (
                      <div className="py-2 flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        <span className="font-mono text-zinc-400 text-xs">Uploading Giveaways PDF catalog to Supabase...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">
                            Drag &amp; drop Giveaways PDF catalog here, or <span className="text-amber-400 underline">browse</span>
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            Max file size 25MB • PDF Document, Merchandise Catalog or Spec Sheet
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Direct URL input for PDF */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#1e1e2d]">
                    <input
                      type="url"
                      placeholder="Or paste direct PDF URL (e.g. /assets/docs/... or external link)..."
                      value={manualPdfUrl}
                      onChange={(e) => setManualPdfUrl(e.target.value)}
                      className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!manualPdfUrl.trim()) return;
                        const fileName = manualPdfUrl.split("/").pop() || "Giveaways Catalog";
                        const autoTitle = fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
                        setEditingProject((prev) => ({
                          ...prev,
                          pdfUrl: manualPdfUrl.trim(),
                          pdfTitle: prev.pdfTitle || autoTitle,
                        }));
                        setManualPdfUrl("");
                      }}
                      disabled={!manualPdfUrl.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      + Set PDF URL
                    </button>
                  </div>

                  {/* Attached PDF Preview Card */}
                  {editingProject.pdfUrl && (
                    <div className="p-3.5 bg-[#151520] border border-amber-500/40 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {editingProject.pdfTitle || "Giveaways Catalog & Specs (PDF)"}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">{editingProject.pdfUrl}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          <a
                            href={editingProject.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1 font-bold transition-colors"
                          >
                            <span>Open Catalog ↗</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject({ ...editingProject, pdfUrl: null, pdfTitle: null });
                              if (giveawaysPdfInputRef.current) giveawaysPdfInputRef.current.value = "";
                            }}
                            className="px-2.5 py-1 text-[11px] bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-colors"
                            title="Delete Attached PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400 font-mono block mb-1">
                          PDF Document Title / Label (Displayed on Gallery &amp; Modal Buttons):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Promotional Giveaways 2026 Catalog & Item Dimensions (PDF)"
                          value={editingProject.pdfTitle || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, pdfTitle: e.target.value })}
                          className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* YouTube Video & Reel/Shorts Engine */}
              <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-zinc-200 font-bold flex items-center gap-2">
                    <YouTubeIcon className="w-4 h-4 text-red-500" />
                    <span>YouTube Video / Reel (Shorts) Link</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    Supports youtube.com/watch, youtu.be, and youtube.com/shorts
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or https://www.youtube.com/shorts/..."
                    value={editingProject.youtubeUrl || ""}
                    onChange={(e) => handleYouTubeInputChange(e.target.value)}
                    className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={handleFetchYouTubeMetadata}
                    disabled={!editingProject.youtubeUrl || resolvingYt}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/30 font-bold text-[11px] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                  >
                    {resolvingYt ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Fetch Thumbnail, Headline &amp; Copy</span>
                  </button>
                </div>

                {ytStatusMessage && (
                  <div
                    className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border flex items-center gap-2 ${ytStatusMessage.startsWith("✓")
                      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                      : "text-rose-300 bg-rose-500/10 border-rose-500/30"
                      }`}
                  >
                    <span>{ytStatusMessage}</span>
                  </div>
                )}

                {resolvedPreview ? (
                  <div className="space-y-3 pt-2 border-t border-[#222232]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">
                          Video / Reel Headline (Displayed on Website)
                        </label>
                        <input
                          type="text"
                          placeholder="Headline of the YouTube Video or Reel..."
                          value={editingProject.youtubeTitle || ""}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              youtubeTitle: e.target.value,
                            })
                          }
                          className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div className="flex flex-col justify-between">
                        <label className="block text-[10px] text-zinc-400 mb-1">
                          Format &amp; Quick Sync
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 bg-[#151520] border border-[#2b2b3d] px-2.5 py-1.5 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProject.isShort)}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  isShort: e.target.checked,
                                })
                              }
                              className="rounded text-yellow-400"
                            />
                            <Smartphone className="w-3 h-3 text-yellow-400" />
                            <span>9:16 Vertical Reel</span>
                          </label>

                          {editingProject.youtubeTitle && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProject({
                                  ...editingProject,
                                  title: editingProject.youtubeTitle || editingProject.title,
                                  description:
                                    editingProject.youtubeDescription ||
                                    editingProject.description,
                                })
                              }
                              title="نسخ عنوان ووصف اليوتيوب إلى الحقول الأساسية للمشروع"
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-200 text-[10px] font-sans border border-zinc-700 transition-colors cursor-pointer"
                            >
                              نسخ للكارد الرئيسي (Apply to Card)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">
                        Video / Reel Paragraph (Narrative Summary)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Paragraph describing the YouTube video or Reel..."
                        value={editingProject.youtubeDescription || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            youtubeDescription: e.target.value,
                          })
                        }
                        className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>
                            Sanitized Embed Preview (ID: {resolvedPreview.videoId})
                          </span>
                        </span>
                        <span>
                          {editingProject.isShort ? "9:16 REEL / SHORT" : "16:9 SHOWREEL"}
                        </span>
                      </div>
                      <div
                        className={`${editingProject.isShort
                          ? "aspect-[9/16] max-w-[240px] mx-auto"
                          : "aspect-video w-full"
                          } rounded-lg overflow-hidden border border-[#262638] bg-black`}
                      >
                        <iframe
                          src={resolvedPreview.embedUrl}
                          title={editingProject.youtubeTitle || "YouTube Video Preview"}
                          className="w-full h-full"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ) : editingProject.youtubeUrl ? (
                  <p className="text-[10px] text-amber-400/90 font-mono">
                    * Enter a valid YouTube watch, share, or shorts URL (raw &lt;iframe&gt; HTML is
                    blocked for security).
                  </p>
                ) : null}
              </div>

              {/* Facebook Video & Reel Engine */}
              <FacebookVideoFieldCard
                facebookUrl={editingProject.facebookUrl}
                isShort={Boolean(editingProject.isShort)}
                onToggleShort={(short) => {
                  setEditingProject((prev) => ({ ...prev, isShort: short }));
                  setFbStatusMessage(
                    short
                      ? "تم ضبط المشغل على 9:16 رأسي (Vertical Reel)"
                      : "تم ضبط المشغل على 16:9 أفقي (Horizontal Video)"
                  );
                }}
                thumbnailUrl={fbThumbnailUrl}
                onApplyThumbnailAsCover={applyThumbnailAsCover}
                onChange={handleFacebookInputChange}
                onVerify={handleResolveFacebookMetadata}
                isVerifying={resolvingFb}
                statusMessage={fbStatusMessage}
                variant="standard"
              />

              {/* Optional Behance Link for Standard Projects */}
              <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-200 font-bold flex items-center gap-2 text-xs">
                    <BehanceIcon className="w-4 h-4 text-blue-400" />
                    <span>Attach Behance Project Link</span>
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Optional link to Behance portfolio
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="https://www.behance.net/gallery/12345678/..."
                  value={editingProject.behanceUrl || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      behanceUrl: e.target.value,
                    })
                  }
                  className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation / Error banner inside modal */}
        {modalError && (
          <div className="mx-6 my-2.5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start justify-between gap-2.5 shrink-0">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 font-sans">تنبيه التحقق من البيانات:</span>
                <p className="leading-relaxed opacity-90 font-sans">{modalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalError(null)}
              className="text-rose-400 hover:text-white cursor-pointer text-sm shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sticky Bottom Actions Footer */}
        <div className="px-6 py-3.5 border-t border-[#262638] bg-[#12121a] flex items-center justify-between shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="statusCheck"
                checked={editingProject.status === "published"}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    status: e.target.checked ? "published" : "draft",
                  })
                }
                className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="statusCheck" className="text-zinc-300 cursor-pointer select-none">
                Publish to live /gallery view
              </label>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
              <input
                type="checkbox"
                id="featuredHomeCheck"
                checked={Boolean(editingProject.featured)}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    featured: e.target.checked,
                    status: e.target.checked ? "published" : editingProject.status,
                  })
                }
                className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="featuredHomeCheck"
                className="text-yellow-300 font-bold cursor-pointer select-none flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>★ Show on Home Page (Video / Showcase)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white border border-[#2b2b3d] hover:bg-[#20202e] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#ffffff] disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Project</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
