import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteContent, WhyUsCapabilityCard } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface WhyUsPageFormProps {
  whyUsPage: SiteContent["whyUsPage"];
  updateSection: UpdateSectionFn;
}

export const WhyUsPageForm = React.memo(function WhyUsPageForm({
  whyUsPage,
  updateSection,
}: WhyUsPageFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            STANDALONE /WHY-US PAGE &amp; CAPABILITY CARDS
          </h3>
          <p className="text-xs text-zinc-400">Target route: /why-us</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Scene Badge</label>
          <input
            type="text"
            value={whyUsPage.sceneBadge}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                sceneBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Hero Title Row 1</label>
          <input
            type="text"
            value={whyUsPage.heroHeadlineRow1}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                heroHeadlineRow1: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Hero Title Row 2</label>
          <input
            type="text"
            value={whyUsPage.heroHeadlineRow2}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                heroHeadlineRow2: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Presentation Heading</label>
          <input
            type="text"
            value={whyUsPage.presentationTitle}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                presentationTitle: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Presentation Subtitle</label>
          <input
            type="text"
            value={whyUsPage.presentationSubtitle}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                presentationSubtitle: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Director Note</label>
          <input
            type="text"
            value={whyUsPage.directorNote || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                directorNote: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Tailored Engineering Stamp</label>
          <input
            type="text"
            value={whyUsPage.tailoredStamp || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                tailoredStamp: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Zero Templates Badge</label>
          <input
            type="text"
            value={whyUsPage.zeroTemplatesBadge || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                zeroTemplatesBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Capability Cards */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            Experiential Capability Bento Cards (
            {(whyUsPage.capabilityCards || []).length})
          </h4>
          <button
            type="button"
            onClick={() => {
              const nextCard: WhyUsCapabilityCard = {
                title: "New Capability Pillar",
                description:
                  "Integrated planning and execution tailored around your brand.",
                bullets: ["Custom Strategy", "Full On-Site Delivery"],
                icon: "layers",
              };
              updateSection("whyUsPage", (p) => ({
                ...p,
                capabilityCards: [...(p.capabilityCards || []), nextCard],
              }));
            }}
            className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Capability Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(whyUsPage.capabilityCards || []).map((card, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-yellow-400 font-bold">
                  CAPABILITY #{idx + 1}
                </span>
                {(whyUsPage.capabilityCards || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateSection("whyUsPage", (p) => ({
                        ...p,
                        capabilityCards: (p.capabilityCards || []).filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={card.title}
                onChange={(e) =>
                  updateSection("whyUsPage", (p) => {
                    const next = [...(p.capabilityCards || [])];
                    next[idx] = { ...next[idx], title: e.target.value };
                    return { ...p, capabilityCards: next };
                  })
                }
                className={`${INPUT_CLS} font-bold`}
              />
              <textarea
                rows={2}
                value={card.description}
                onChange={(e) =>
                  updateSection("whyUsPage", (p) => {
                    const next = [...(p.capabilityCards || [])];
                    next[idx] = { ...next[idx], description: e.target.value };
                    return { ...p, capabilityCards: next };
                  })
                }
                className={INPUT_CLS}
              />
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  BULLETS (One per line)
                </label>
                <textarea
                  rows={3}
                  value={card.bullets.join("\n")}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => {
                      const next = [...(p.capabilityCards || [])];
                      const bullets = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      next[idx] = {
                        ...next[idx],
                        bullets: bullets.length > 0 ? bullets : ["Key Deliverable"],
                      };
                      return { ...p, capabilityCards: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Callout */}
      <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Callout Prefix</label>
          <input
            type="text"
            value={whyUsPage.calloutHeadlinePrefix || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                calloutHeadlinePrefix: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Callout Highlight</label>
          <input
            type="text"
            value={whyUsPage.calloutHeadlineHighlight || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                calloutHeadlineHighlight: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Callout Primary Button</label>
          <input
            type="text"
            value={whyUsPage.calloutPrimaryCta || ""}
            onChange={(e) =>
              updateSection("whyUsPage", (p) => ({
                ...p,
                calloutPrimaryCta: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  );
});
