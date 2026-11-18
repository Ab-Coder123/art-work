import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteContent, GalleryWorkflowStep } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface GalleryPageFormProps {
  galleryPage: SiteContent["galleryPage"];
  updateSection: UpdateSectionFn;
}

export const GalleryPageForm = React.memo(function GalleryPageForm({
  galleryPage,
  updateSection,
}: GalleryPageFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            /GALLERY ARCHIVE HERO, FILTER CHIPS &amp; WORKFLOW
          </h3>
          <p className="text-xs text-zinc-400">Target route: /gallery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Hero Badge</label>
          <input
            type="text"
            value={galleryPage.heroBadge}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                heroBadge: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Part 1</label>
          <input
            type="text"
            value={galleryPage.headlinePart1}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                headlinePart1: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Part 2</label>
          <input
            type="text"
            value={galleryPage.headlinePart2}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                headlinePart2: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Hero Description</label>
        <textarea
          rows={2}
          value={galleryPage.heroDescription}
          onChange={(e) =>
            updateSection("galleryPage", (p) => ({
              ...p,
              heroDescription: e.target.value,
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      {/* 4 Filter Chip Labels */}
      <div className="pt-4 border-t border-[#262638]">
        <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">
          Gallery Filter Chip Labels
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CLS}>All Filter</label>
            <input
              type="text"
              value={galleryPage.filterAllLabel}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  filterAllLabel: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Conferences Filter</label>
            <input
              type="text"
              value={galleryPage.filterConferencesLabel}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  filterConferencesLabel: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Booths Filter</label>
            <input
              type="text"
              value={galleryPage.filterBoothsLabel}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  filterBoothsLabel: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Branding Filter</label>
            <input
              type="text"
              value={galleryPage.filterBrandingLabel}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  filterBrandingLabel: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>
      </div>

      {/* Quote & Workflow Steps */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Spotlight Quote</label>
            <input
              type="text"
              value={galleryPage.quoteText}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  quoteText: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Quote Attribution</label>
            <input
              type="text"
              value={galleryPage.quoteAuthor}
              onChange={(e) =>
                updateSection("galleryPage", (p) => ({
                  ...p,
                  quoteAuthor: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            Production Workflow Steps ({galleryPage.workflowSteps.length})
          </h4>
          <button
            type="button"
            onClick={() => {
              const nextStep: GalleryWorkflowStep = {
                stepNumber: `0${galleryPage.workflowSteps.length + 1}`,
                title: "New Stage",
                description: "Describe this milestone in the event production workflow.",
              };
              updateSection("galleryPage", (p) => ({
                ...p,
                workflowSteps: [...p.workflowSteps, nextStep],
              }));
            }}
            className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {galleryPage.workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-yellow-400 font-bold">
                  STEP #{step.stepNumber}
                </span>
                {galleryPage.workflowSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        workflowSteps: p.workflowSteps.filter((_, i) => i !== idx),
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
                value={step.title}
                onChange={(e) =>
                  updateSection("galleryPage", (p) => {
                    const next = [...p.workflowSteps];
                    next[idx] = { ...next[idx], title: e.target.value };
                    return { ...p, workflowSteps: next };
                  })
                }
                className={`${INPUT_CLS} font-bold`}
              />
              <input
                type="text"
                value={step.description}
                onChange={(e) =>
                  updateSection("galleryPage", (p) => {
                    const next = [...p.workflowSteps];
                    next[idx] = { ...next[idx], description: e.target.value };
                    return { ...p, workflowSteps: next };
                  })
                }
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Bottom CTA Prefix</label>
          <input
            type="text"
            value={galleryPage.ctaHeadlinePrefix}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                ctaHeadlinePrefix: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Bottom CTA Highlight</label>
          <input
            type="text"
            value={galleryPage.ctaHeadlineHighlight}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                ctaHeadlineHighlight: e.target.value,
              }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Bottom CTA Button</label>
          <input
            type="text"
            value={galleryPage.ctaPrimaryButtonText}
            onChange={(e) =>
              updateSection("galleryPage", (p) => ({
                ...p,
                ctaPrimaryButtonText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  );
});
