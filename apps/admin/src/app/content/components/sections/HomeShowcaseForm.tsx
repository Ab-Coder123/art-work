import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { SiteContent } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface HomeShowcaseFormProps {
  homeShowcase: SiteContent["homeShowcase"];
  updateSection: UpdateSectionFn;
}

export const HomeShowcaseForm = React.memo(function HomeShowcaseForm({
  homeShowcase,
  updateSection,
}: HomeShowcaseFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      {/* ★ Star Home Video Shortcut Banner */}
      <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-yellow-400">
              ★ Change or Add Multiple Home Page Videos
            </h4>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              Click the <strong>★ On Home</strong> star toggle on any YouTube video or
              project in <strong>Projects Manager</strong> to control which video plays
              first on Home — or star multiple videos to enable the multi-video switcher
              &amp; inline video cards on Home!
            </p>
          </div>
        </div>
        <Link
          href="/projects"
          className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Manage ★ Home Videos</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Section Badge</label>
          <input
            type="text"
            value={homeShowcase.badge}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({ ...p, badge: e.target.value }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Prefix</label>
          <input
            type="text"
            value={homeShowcase.headlinePrefix}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                headlinePrefix: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Highlight</label>
          <input
            type="text"
            value={homeShowcase.headlineHighlight}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                headlineHighlight: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Section Description</label>
        <textarea
          rows={2}
          value={homeShowcase.description}
          onChange={(e) =>
            updateSection("homeShowcase", (p) => ({
              ...p,
              description: e.target.value,
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Top View All CTA</label>
          <input
            type="text"
            value={homeShowcase.viewAllCtaText}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                viewAllCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Featured Video Badge</label>
          <input
            type="text"
            value={homeShowcase.featuredEventBadge}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                featuredEventBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Watch on YouTube Button</label>
          <input
            type="text"
            value={homeShowcase.youtubeButtonText}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                youtubeButtonText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Explore Gallery Button</label>
          <input
            type="text"
            value={homeShowcase.exploreGalleryCtaText}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                exploreGalleryCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Project Card Action Text</label>
          <input
            type="text"
            value={homeShowcase.cardExploreText}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                cardExploreText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Mobile Archive CTA</label>
          <input
            type="text"
            value={homeShowcase.mobileArchiveCtaText}
            onChange={(e) =>
              updateSection("homeShowcase", (p) => ({
                ...p,
                mobileArchiveCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  );
});
