import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { SiteContent } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface HeroSectionFormProps {
  manifesto: SiteContent["manifesto"];
  updateSection: UpdateSectionFn;
}

export const HeroSectionForm = React.memo(function HeroSectionForm({
  manifesto,
  updateSection,
}: HeroSectionFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            HOME HERO MANIFESTO &amp; PARTNERS MARQUEE
          </h3>
          <p className="text-xs text-zinc-400">Target scene: /#stage-01</p>
        </div>
        <Link
          href="/companies"
          className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1"
        >
          <span>Manage Partner Logos</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Announcement Badge</label>
          <input
            type="text"
            value={manifesto.announcementBadge}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                announcementBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Edition Badge</label>
          <input
            type="text"
            value={manifesto.editionBadge}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                editionBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Sticky Note</label>
          <input
            type="text"
            value={manifesto.stickyNote}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                stickyNote: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Headline Primary</label>
          <input
            type="text"
            value={manifesto.headlinePart1}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                headlinePart1: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Kinetic Highlight</label>
          <input
            type="text"
            value={manifesto.headlinePart2}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                headlinePart2: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Intro Paragraph</label>
        <textarea
          rows={3}
          value={manifesto.introParagraph}
          onChange={(e) =>
            updateSection("manifesto", (p) => ({
              ...p,
              introParagraph: e.target.value,
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Primary CTA Button</label>
          <input
            type="text"
            value={manifesto.primaryCtaText}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                primaryCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Secondary CTA Button</label>
          <input
            type="text"
            value={manifesto.secondaryCtaText}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                secondaryCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Proof Tagline</label>
          <input
            type="text"
            value={manifesto.proofTagline || ""}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                proofTagline: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Performance Badge</label>
          <input
            type="text"
            value={manifesto.performanceBadge || ""}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                performanceBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Hero Illustration URL</label>
          <input
            type="text"
            value={manifesto.heroImage || ""}
            onChange={(e) =>
              updateSection("manifesto", (p) => ({
                ...p,
                heroImage: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Proof Metrics */}
      <div className="pt-4 border-t border-[#262638]">
        <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">
          Hero Proof Metrics Strip
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {manifesto.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#0d0d12] p-3 rounded-xl border border-[#2b2b3d]"
            >
              <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                METRIC 0{idx + 1} VALUE
              </label>
              <input
                type="text"
                value={metric.num}
                onChange={(e) =>
                  updateSection("manifesto", (p) => {
                    const next = [...p.metrics];
                    next[idx] = { ...next[idx], num: e.target.value };
                    return { ...p, metrics: next };
                  })
                }
                className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-2 focus:outline-none"
              />
              <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                LABEL
              </label>
              <input
                type="text"
                value={metric.label}
                onChange={(e) =>
                  updateSection("manifesto", (p) => {
                    const next = [...p.metrics];
                    next[idx] = { ...next[idx], label: e.target.value };
                    return { ...p, metrics: next };
                  })
                }
                className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Partners Marquee */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono">
          Partners Marquee &amp; Starburst Stamp
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLS}>Partners Badge</label>
            <input
              type="text"
              value={manifesto.partnersBadge || ""}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  partnersBadge: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Partners Headline Prefix</label>
            <input
              type="text"
              value={manifesto.partnersHeadlinePrefix || ""}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  partnersHeadlinePrefix: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Partners Headline Highlight</label>
            <input
              type="text"
              value={manifesto.partnersHeadlineHighlight || ""}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  partnersHeadlineHighlight: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLS}>Starburst Line 1 (Top)</label>
            <input
              type="text"
              value={manifesto.starburstText.top}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  starburstText: { ...p.starburstText, top: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Starburst Line 2 (Middle)</label>
            <input
              type="text"
              value={manifesto.starburstText.middle}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  starburstText: { ...p.starburstText, middle: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Starburst Line 3 (Bottom)</label>
            <input
              type="text"
              value={manifesto.starburstText.bottom}
              onChange={(e) =>
                updateSection("manifesto", (p) => ({
                  ...p,
                  starburstText: { ...p.starburstText, bottom: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
