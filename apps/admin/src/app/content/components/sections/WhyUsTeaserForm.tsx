import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface WhyUsTeaserFormProps {
  whyUsTeaser: SiteContent["whyUsTeaser"];
  updateSection: UpdateSectionFn;
}

export const WhyUsTeaserForm = React.memo(function WhyUsTeaserForm({
  whyUsTeaser,
  updateSection,
}: WhyUsTeaserFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            HOMEPAGE WHY-US TEASER, BENTO CARDS &amp; BLUEPRINT
          </h3>
          <p className="text-xs text-zinc-400">Target scene: /#stage-02</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Eyebrow Tag</label>
          <input
            type="text"
            value={whyUsTeaser.eyebrow}
            onChange={(e) =>
              updateSection("whyUsTeaser", (p) => ({
                ...p,
                eyebrow: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Explore CTA Text</label>
          <input
            type="text"
            value={whyUsTeaser.exploreCtaText}
            onChange={(e) =>
              updateSection("whyUsTeaser", (p) => ({
                ...p,
                exploreCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Main Headline</label>
        <input
          type="text"
          value={whyUsTeaser.headline}
          onChange={(e) =>
            updateSection("whyUsTeaser", (p) => ({
              ...p,
              headline: e.target.value,
            }))
          }
          className={`${INPUT_CLS} font-bold`}
        />
      </div>

      {/* Bento Cards */}
      <div className="pt-4 border-t border-[#262638] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            Why-Us Bento Cards ({whyUsTeaser.bentoCards.length})
          </h4>
          <button
            type="button"
            onClick={() =>
              updateSection("whyUsTeaser", (p) => ({
                ...p,
                bentoCards: [
                  ...p.bentoCards,
                  {
                    number: `0${p.bentoCards.length + 1}`,
                    badge: "NEW PILLAR",
                    title: "New Studio Advantage",
                    description:
                      "Describe this pillar of Art Work's creative and production workflow.",
                  },
                ],
              }))
            }
            className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bento Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyUsTeaser.bentoCards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-yellow-400 font-bold">
                  CARD #{idx + 1}
                </span>
                {whyUsTeaser.bentoCards.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateSection("whyUsTeaser", (p) => ({
                        ...p,
                        bentoCards: p.bentoCards.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                    title="Remove Bento Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    NUM
                  </label>
                  <input
                    type="text"
                    value={card.number}
                    onChange={(e) =>
                      updateSection("whyUsTeaser", (p) => {
                        const next = [...p.bentoCards];
                        next[idx] = { ...next[idx], number: e.target.value };
                        return { ...p, bentoCards: next };
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    BADGE
                  </label>
                  <input
                    type="text"
                    value={card.badge}
                    onChange={(e) =>
                      updateSection("whyUsTeaser", (p) => {
                        const next = [...p.bentoCards];
                        next[idx] = { ...next[idx], badge: e.target.value };
                        return { ...p, bentoCards: next };
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  CARD TITLE
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => {
                      const next = [...p.bentoCards];
                      next[idx] = { ...next[idx], title: e.target.value };
                      return { ...p, bentoCards: next };
                    })
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={card.description}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => {
                      const next = [...p.bentoCards];
                      next[idx] = { ...next[idx], description: e.target.value };
                      return { ...p, bentoCards: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blueprint Card */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono">
          Blueprint Callout Card
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Blueprint Badge</label>
            <input
              type="text"
              value={whyUsTeaser.blueprint.badge}
              onChange={(e) =>
                updateSection("whyUsTeaser", (p) => ({
                  ...p,
                  blueprint: { ...p.blueprint, badge: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Blueprint Image URL</label>
            <input
              type="text"
              value={whyUsTeaser.blueprint.image}
              onChange={(e) =>
                updateSection("whyUsTeaser", (p) => ({
                  ...p,
                  blueprint: { ...p.blueprint, image: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>
        <div>
          <label className={LABEL_CLS}>Blueprint Headline</label>
          <input
            type="text"
            value={whyUsTeaser.blueprint.title}
            onChange={(e) =>
              updateSection("whyUsTeaser", (p) => ({
                ...p,
                blueprint: { ...p.blueprint, title: e.target.value },
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Blueprint Paragraph</label>
          <textarea
            rows={2}
            value={whyUsTeaser.blueprint.description}
            onChange={(e) =>
              updateSection("whyUsTeaser", (p) => ({
                ...p,
                blueprint: { ...p.blueprint, description: e.target.value },
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  );
});
