import React, { useState, useRef } from "react";
import { FileText, Loader2, Trash2 } from "lucide-react";
import type { ProjectRecord } from "@art-work/types";

interface ProjectGiveawaysPdfCardProps {
  project: ProjectRecord;
  isUploadingPdf: boolean;
  onChangeProject: (project: ProjectRecord) => void;
  onUploadPdf: (file: File, targetCategory?: string) => void;
  onSetManualPdf: (url: string) => void;
}

export const ProjectGiveawaysPdfCard = React.memo(function ProjectGiveawaysPdfCard({
  project,
  isUploadingPdf,
  onChangeProject,
  onUploadPdf,
  onSetManualPdf,
}: ProjectGiveawaysPdfCardProps) {
  const [isGiveawaysPdfDragging, setIsGiveawaysPdfDragging] = useState(false);
  const [manualPdfUrl, setManualPdfUrl] = useState("");
  const giveawaysPdfInputRef = useRef<HTMLInputElement | null>(null);

  return (
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
              Attach corporate gifts catalog, item dimensions, printing specs or pricing
              proposals (PDF)
            </span>
          </div>
        </div>
        {project.pdfUrl && (
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
          if (file) onUploadPdf(file, "branding");
        }}
        onClick={() => !isUploadingPdf && giveawaysPdfInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isGiveawaysPdfDragging
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
            if (file) onUploadPdf(file, "branding");
            e.target.value = "";
          }}
          className="hidden"
        />
        {isUploadingPdf ? (
          <div className="py-2 flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="font-mono text-zinc-400 text-xs">
              Uploading Giveaways PDF catalog to Supabase...
            </span>
          </div>
        ) : (
          <>
            <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs font-bold">
                Drag &amp; drop Giveaways PDF catalog here, or{" "}
                <span className="text-amber-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Max file size 50MB • PDF Document, Merchandise Catalog or Spec Sheet
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
            onSetManualPdf(manualPdfUrl);
            setManualPdfUrl("");
          }}
          disabled={!manualPdfUrl.trim()}
          className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
        >
          + Set PDF URL
        </button>
      </div>

      {/* Attached PDF Preview Card */}
      {project.pdfUrl && (
        <div className="p-3.5 bg-[#151520] border border-amber-500/40 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {project.pdfTitle || "Giveaways Catalog & Specs (PDF)"}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {project.pdfUrl}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <a
                href={project.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1 font-bold transition-colors"
              >
                <span>Open Catalog ↗</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  onChangeProject({ ...project, pdfUrl: null, pdfTitle: null });
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
              value={project.pdfTitle || ""}
              onChange={(e) => onChangeProject({ ...project, pdfTitle: e.target.value })}
              className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
});
