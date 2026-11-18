import React from "react";
import {
  Monitor,
  Smartphone,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  resolveSafeFacebookEmbed,
  isUnresolvedFacebookShareUrl,
} from "@art-work/types";
import { FacebookIcon } from "./Icons";

export interface FacebookVideoFieldCardProps {
  facebookUrl?: string | null;
  isShort?: boolean;
  onToggleShort?: (isShort: boolean) => void;
  thumbnailUrl?: string | null;
  onApplyThumbnailAsCover?: (url: string) => void;
  onChange: (value: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  statusMessage: string | null;
  variant?: "booth" | "standard";
}

/** Shared Facebook Video / Reel field with inline format toggle, cover image sync, verification, and live iframe embed preview. */
export function FacebookVideoFieldCard({
  facebookUrl,
  isShort = false,
  onToggleShort,
  thumbnailUrl,
  onApplyThumbnailAsCover,
  onChange,
  onVerify,
  isVerifying,
  statusMessage,
  variant = "standard",
}: FacebookVideoFieldCardProps) {
  const isUnresolvedShare = facebookUrl ? isUnresolvedFacebookShareUrl(facebookUrl) : false;
  const resolvedFb = facebookUrl ? resolveSafeFacebookEmbed(facebookUrl, isShort) : null;
  const isBooth = variant === "booth";

  return (
    <div
      className={`p-4 rounded-xl space-y-3 border ${
        isBooth ? "bg-[#0d0d14] border-blue-500/30" : "bg-[#0d0d12] border-blue-500/35"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/20 text-[#1877F2] border border-blue-500/30 flex items-center justify-center">
            <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block">
                Facebook Video / Reel Link
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-sans font-bold">
                اختياري (Optional)
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans">
              يدعم فيديوهات فيسبوك العادية والريلز — يمكنك التبديل بين العرض الأفقي (16:9) والرأسي (9:16) وسحب الغلاف
            </span>
          </div>
        </div>

        {/* Quick Format Switcher in Card Header */}
        {onToggleShort && (
          <div className="flex items-center gap-1 bg-[#161622] p-1 rounded-lg border border-[#262638]">
            <button
              type="button"
              onClick={() => onToggleShort(false)}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                !isShort
                  ? "bg-[#1877F2] text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="عرض كفيديو أفقي عادي 16:9"
            >
              <Monitor className="w-3 h-3" />
              <span>16:9 أفقي</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleShort(true)}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                isShort
                  ? "bg-[#1877F2] text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="عرض كفيديو ريلز رأسي 9:16"
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16 رأسي</span>
            </button>
          </div>
        )}
      </div>

      {/* Prominent Format Switcher Cards */}
      {onToggleShort && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggleShort(false)}
            className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
              !isShort
                ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_12px_rgba(24,119,242,0.25)]"
                : "bg-[#14141e] border-[#252535] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Monitor className={`w-3.5 h-3.5 ${!isShort ? "text-blue-400" : "text-zinc-500"}`} />
                <span>16:9 أفقي (Horizontal)</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                للفيديوهات والشاشات الأفقية (Full Width)
              </p>
            </div>
            {!isShort && (
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleShort(true)}
            className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
              isShort
                ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_12px_rgba(24,119,242,0.25)]"
                : "bg-[#14141e] border-[#252535] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Smartphone className={`w-3.5 h-3.5 ${isShort ? "text-blue-400" : "text-zinc-500"}`} />
                <span>9:16 رأسي (Vertical Reel)</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                لفيديوهات الريلز والقصص الرأسية
              </p>
            </div>
            {isShort && (
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
            )}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="https://www.facebook.com/watch/?v=... or https://fb.watch/... or /reel/..."
          value={facebookUrl || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onVerify}
            disabled={!facebookUrl || isVerifying}
            className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            title="التحقق من الرابط واستخراج صورة الغلاف وتجهيز المشغل"
          >
            {isVerifying ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>Verify &amp; Preview</span>
          </button>
          {facebookUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div
          className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            statusMessage.startsWith("✓")
              ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
              : statusMessage.startsWith("⏳")
              ? "text-blue-300 bg-blue-500/10 border-blue-500/30"
              : "text-rose-300 bg-rose-500/10 border-rose-500/30"
          }`}
        >
          <span>{statusMessage}</span>
        </div>
      )}

      {isVerifying || isUnresolvedShare ? (
        <div className="p-6 rounded-lg border border-blue-500/25 bg-[#10101c] flex flex-col items-center justify-center text-center gap-2">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-xs font-bold text-blue-200 font-mono">
            جاري فك اختصار رابط فيسبوك وتجهيز المشغل...
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            Resolving canonical Reel &amp; embedded video preview
          </span>
        </div>
      ) : resolvedFb ? (
        <div className="space-y-3 pt-2 border-t border-[#222232]">
          <div className="text-[10px] font-mono text-blue-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Facebook Embed Preview</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href={resolvedFb.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
              >
                <span>مشاهدة على Facebook</span>
                <span>↗</span>
              </a>
              <span className="font-bold">
                {isShort ? "9:16 VERTICAL REEL" : "16:9 HORIZONTAL VIDEO"}
              </span>
            </div>
          </div>
          <div
            className={`${
              isShort
                ? "aspect-[9/16] max-w-[240px] mx-auto"
                : isBooth
                ? "aspect-video w-full max-w-md mx-auto"
                : "aspect-video w-full"
            } rounded-lg overflow-hidden border border-[#262638] bg-black`}
          >
            <iframe
              src={resolvedFb.embedUrl}
              title={isBooth ? "Booth Facebook Video" : "Facebook Video Preview"}
              className="w-full h-full border-0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {thumbnailUrl && onApplyThumbnailAsCover ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2.5">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-blue-400/40 bg-black shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt="Facebook Video Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-200 block font-sans">
                    ✓ صورة غلاف الفيديو متوفرة من فيسبوك
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    اضغط لاعتمادها كصورة الغلاف الأساسية للكرت في الموقع
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onApplyThumbnailAsCover(thumbnailUrl)}
                className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-all cursor-pointer shadow flex items-center gap-1 font-sans shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>تعيين كغلاف للمشروع 🖼️</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#14141e] border border-[#262638]">
              <span className="text-[11px] text-zinc-400 font-sans">
                💡 صورة الغلاف: اضغط لجلب صورة الغلاف تلقائياً من فيسبوك واعتمادها
              </span>
              <button
                type="button"
                onClick={onVerify}
                disabled={isVerifying}
                className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-1"
              >
                {isVerifying ? (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-blue-400" />
                )}
                <span>جلب صورة الغلاف الآن</span>
              </button>
            </div>
          )}
        </div>
      ) : facebookUrl ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-200">
          <p className="text-[11px] font-sans">
            ⚠️ الرابط المدخل غير صالح. (ملاحظة: هذا الحقل اختياري تماماً، يمكنك تركه فارغاً إذا كنت لا ترغب بإضافة فيديو فيسبوك).
          </p>
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors shrink-0 cursor-pointer self-start sm:self-center"
          >
            مسح الرابط (بدون فيديو فيسبوك)
          </button>
        </div>
      ) : null}
    </div>
  );
}
