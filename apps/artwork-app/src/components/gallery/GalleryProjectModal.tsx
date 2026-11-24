"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, FileText, ArrowRight } from "lucide-react";
import {
  type ProjectRecord,
  getUiDictionary,
  resolveLocalizedProject,
  resolveSafeYouTubeEmbed,
  resolveSafeFacebookEmbed,
} from "@art-work/types";
import { useShowcaseStore } from "@/store/useShowcaseStore";

interface GalleryProjectModalProps {
  project: ProjectRecord | null;
  onClose: () => void;
}

export function GalleryProjectModal({ project: rawProject, onClose }: GalleryProjectModalProps) {
  const locale = useShowcaseStore((s) => s.locale);
  const dict = getUiDictionary(locale);
  const project = rawProject ? resolveLocalizedProject(rawProject, locale) : null;
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  const [modalFbOrientationOverride, setModalFbOrientationOverride] = useState<boolean | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<"youtube" | "facebook">("youtube");
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Freeze Lenis & lock document scroll while modal is active
  useEffect(() => {
    if (project) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
      setActiveModalImage(project.image);
      setModalFbOrientationOverride(null);
      if (project.youtubeVideoId || project.youtubeUrl) {
        setActiveMediaTab("youtube");
      } else if (project.facebookUrl) {
        setActiveMediaTab("facebook");
      }
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const selectedYtEmbed = resolveSafeYouTubeEmbed(
    project.youtubeVideoId || project.youtubeUrl,
    project.isShort
  );
  const selectedFbEmbed = resolveSafeFacebookEmbed(project.facebookUrl, project.isShort);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto overscroll-contain"
        onClick={onClose}
      >
        <motion.div
          ref={modalScrollRef}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          className="bg-white dark:bg-[#151520] border-4 border-black dark:border-zinc-700 rounded-2xl p-6 sm:p-8 max-w-2xl w-full comic-shadow relative max-h-[85vh] overflow-y-auto overscroll-contain touch-pan-y"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-yellow-400 hover:bg-black hover:text-white text-black border-2 border-black font-black flex items-center justify-center transition-colors cursor-pointer"
            aria-label={dict.gallery.closeModal}
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-mono text-xs font-black uppercase mb-3">
            <span>{project.year || 2026}</span>
            {project.metaBadge && (
              <>
                <span>•</span>
                <span>{project.metaBadge}</span>
              </>
            )}
          </div>

          <h2 className="text-2xl font-black font-headline uppercase text-black dark:text-white mb-2">
            {project.title}
          </h2>

          <p className="font-body text-sm text-black/80 dark:text-zinc-300 mb-4">
            {project.description}
          </p>

          {/* YouTube and/or Facebook Video Embed */}
          {selectedYtEmbed || selectedFbEmbed ? (
            <div className="mb-5 p-4 rounded-xl border-2 border-black dark:border-zinc-700 bg-neutral-50 dark:bg-[#0e0e16] space-y-3">
              {/* Tab Switcher if BOTH YouTube and Facebook exist */}
              {selectedYtEmbed && selectedFbEmbed && (
                <div className="flex items-center gap-2 pb-2 border-b border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab("youtube")}
                    className={`px-3 py-1 rounded-lg text-xs font-headline font-black uppercase transition-all cursor-pointer ${
                      activeMediaTab === "youtube"
                        ? "bg-red-600 text-white border border-black shadow"
                        : "bg-black/5 dark:bg-white/5 text-black dark:text-zinc-400 hover:text-white"
                    }`}
                  >
                    YouTube Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab("facebook")}
                    className={`px-3 py-1 rounded-lg text-xs font-headline font-black uppercase transition-all cursor-pointer ${
                      activeMediaTab === "facebook"
                        ? "bg-[#1877F2] text-white border border-black shadow"
                        : "bg-black/5 dark:bg-white/5 text-black dark:text-zinc-400 hover:text-white"
                    }`}
                  >
                    Facebook Video
                  </button>
                </div>
              )}

              {/* Render YouTube Video */}
              {selectedYtEmbed && (!selectedFbEmbed || activeMediaTab === "youtube") && (() => {
                const isYtVertical =
                  project.isShort !== undefined && project.isShort !== null
                    ? Boolean(project.isShort)
                    : Boolean(selectedYtEmbed.isShort);

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-red-600 text-white font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border border-black">
                        <Play className="w-3 h-3 fill-current" />
                        <span>
                          {isYtVertical
                            ? "YOUTUBE REEL / SHORT (9:16)"
                            : "YOUTUBE SHOWREEL (16:9)"}
                        </span>
                      </span>
                      <a
                        href={selectedYtEmbed.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-headline font-bold text-[11px] text-red-600 dark:text-red-400 hover:underline"
                      >
                        <span>WATCH ON YOUTUBE</span>
                        <span>↗</span>
                      </a>
                    </div>

                    {project.youtubeTitle && (
                      <h3 className="font-headline font-black text-base text-black dark:text-white">
                        {project.youtubeTitle}
                      </h3>
                    )}

                    {project.youtubeDescription && (
                      <p className="font-body text-xs text-black/80 dark:text-zinc-300 leading-relaxed">
                        {project.youtubeDescription}
                      </p>
                    )}

                    <div
                      className={`relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 bg-black ${
                        isYtVertical
                          ? "aspect-[9/16] max-w-[320px] mx-auto"
                          : "aspect-video w-full"
                      }`}
                    >
                      <iframe
                        src={selectedYtEmbed.embedUrl}
                        title={project.youtubeTitle || project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0 pointer-events-auto cursor-pointer relative z-10"
                      />
                    </div>
                  </>
                );
              })()}

              {/* Render Facebook Video */}
              {selectedFbEmbed && (!selectedYtEmbed || activeMediaTab === "facebook") && (() => {
                const isFbVertical =
                  modalFbOrientationOverride !== null
                    ? modalFbOrientationOverride
                    : project.isShort !== undefined && project.isShort !== null
                    ? Boolean(project.isShort)
                    : Boolean(selectedFbEmbed.isReel);

                return (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#1877F2] text-white font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border border-black">
                          <Play className="w-3 h-3 fill-current" />
                          <span>
                            {isFbVertical
                              ? "FACEBOOK REEL (9:16)"
                              : "FACEBOOK VIDEO (16:9)"}
                          </span>
                        </span>

                        {/* 1-Click Interactive Orientation Switcher */}
                        <div className="inline-flex items-center rounded-md border border-black/20 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800 p-0.5">
                          <button
                            type="button"
                            onClick={() => setModalFbOrientationOverride(false)}
                            className={`px-2 py-0.5 rounded text-[10px] font-headline font-bold cursor-pointer transition-colors ${
                              !isFbVertical
                                ? "bg-[#1877F2] text-white shadow-sm"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                            }`}
                            title="عرض كفيديو أفقي كامل 16:9 بدون حواف سوداء"
                          >
                            16:9 أفقي
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalFbOrientationOverride(true)}
                            className={`px-2 py-0.5 rounded text-[10px] font-headline font-bold cursor-pointer transition-colors ${
                              isFbVertical
                                ? "bg-[#1877F2] text-white shadow-sm"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                            }`}
                            title="عرض كفيديو ريلز رأسي 9:16"
                          >
                            9:16 رأسي
                          </button>
                        </div>
                      </div>

                      <a
                        href={selectedFbEmbed.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-headline font-bold text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>WATCH ON FACEBOOK</span>
                        <span>↗</span>
                      </a>
                    </div>

                    <div
                      className={`relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 bg-black transition-all duration-300 ${
                        isFbVertical
                          ? "aspect-[9/16] max-w-[320px] mx-auto"
                          : "aspect-video w-full"
                      }`}
                    >
                      <iframe
                        src={selectedFbEmbed.embedUrl}
                        title={project.title}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0 pointer-events-auto cursor-pointer relative z-10"
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {/* Main Display Image - 100% Fit & Uncut */}
              <div className="relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 aspect-[16/10] sm:aspect-[16/9] bg-neutral-950 flex items-center justify-center">
                <Image
                  src={activeModalImage || project.image}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-cover opacity-20 blur-xl scale-110 pointer-events-none"
                  unoptimized={
                    (activeModalImage || project.image).startsWith("http") ||
                    (activeModalImage || project.image).startsWith("data:")
                  }
                />
                <Image
                  src={activeModalImage || project.image}
                  alt={project.altText || project.title}
                  fill
                  className="object-contain relative z-10"
                  unoptimized={
                    (activeModalImage || project.image).startsWith("http") ||
                    (activeModalImage || project.image).startsWith("data:")
                  }
                />
              </div>

              {/* Multiple Gallery Images Selector (if any) */}
              {project.images && project.images.length > 1 && (
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-zinc-400">
                    {project.category === "branding"
                      ? `GIVEAWAYS & MERCHANDISE PHOTOS (${project.images.length})`
                      : `3D RENDERS & BUILD ELEVATIONS (${project.images.length})`}
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {project.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveModalImage(imgUrl)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          (activeModalImage || project.image) === imgUrl
                            ? "border-yellow-400 scale-105 comic-shadow-sm"
                            : "border-black/30 dark:border-zinc-700 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Render ${idx + 1}`}
                          fill
                          className="object-cover object-top"
                          unoptimized={
                            imgUrl.startsWith("http") || imgUrl.startsWith("data:")
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Architectural / Giveaways PDF Document Download Banner & Inline Viewer */}
          {project.pdfUrl && (() => {
            const sameOriginPdfUrl = project.pdfUrl.startsWith("http")
              ? `/api/pdf-proxy?url=${encodeURIComponent(project.pdfUrl)}`
              : project.pdfUrl;

            return (
              <div className="mb-5 space-y-3">
                <div className="p-3.5 bg-yellow-400 text-black rounded-xl border-2 border-black comic-shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-black text-yellow-400 border border-black flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-headline font-black text-xs uppercase truncate">
                        {project.pdfTitle ||
                          (project.category === "branding"
                            ? dict.gallery.viewGiveawaysPdf
                            : dict.gallery.viewBlueprint)}
                      </div>
                      <span className="text-[10px] font-mono text-black/70 block">
                        {locale === "ar"
                          ? "ملف PDF رسمي • اضغط لعرض الكتالوج والمواصفات الكاملة"
                          : "Official PDF Document • Click to view full catalog & specifications"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ms-auto">
                    <a
                      href={project.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-yellow-400 font-headline font-bold text-xs uppercase rounded border border-black flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <span>{dict.gallery.openInNewTab} ↗</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </a>
                  </div>
                </div>

                {/* Embedded PDF Viewer */}
                <div className="rounded-xl overflow-hidden border-2 border-black dark:border-zinc-700 bg-neutral-900 shadow-md">
                  <div className="bg-[#181824] px-3.5 py-2 border-b border-[#2b2b3d] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs min-w-0">
                      <FileText className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      <span className="font-bold text-white truncate max-w-xs sm:max-w-md">
                        {project.pdfTitle || "PDF Document Viewer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setUseGoogleViewer((prev) => !prev)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 hover:bg-neutral-700 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                        title="تبديل محرك العرض إذا واجهت حظر من المتصفح"
                      >
                        {useGoogleViewer ? "Same-Origin Direct Mode" : "Google Cloud Engine"}
                      </button>
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-yellow-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Full Screen ↗</span>
                      </a>
                    </div>
                  </div>
                  <iframe
                    src={
                      useGoogleViewer
                        ? `https://docs.google.com/viewer?url=${encodeURIComponent(project.pdfUrl)}&embedded=true`
                        : sameOriginPdfUrl
                    }
                    title={project.pdfTitle || "PDF Document Viewer"}
                    className="w-full h-80 sm:h-96 border-0 bg-white"
                    allow="fullscreen"
                  />
                  <div className="bg-[#12121a] px-3 py-1.5 border-t border-[#2b2b3d] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-400">
                    <span>
                      {useGoogleViewer
                        ? "Rendering via Google Cloud Docs Viewer engine"
                        : "Rendering via Same-Origin Stream Engine (Bypasses Browser CSP Blocks)"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setUseGoogleViewer((v) => !v)}
                        className="text-yellow-400 hover:underline cursor-pointer"
                      >
                        {useGoogleViewer ? "Switch to Same-Origin Direct Mode" : "Switch to Google Cloud Engine"}
                      </button>
                      <span>•</span>
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:underline"
                      >
                        Open in New Window ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="pt-4 border-t border-black/10 dark:border-zinc-800 flex items-center justify-end">
            <Link
              href="/#stage-04"
              className="w-full sm:w-auto px-6 py-2.5 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-300 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm transition-colors text-center"
            >
              {locale === "ar" ? "اطلب مشروعاً مماثلاً" : "REQUEST SIMILAR"}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
