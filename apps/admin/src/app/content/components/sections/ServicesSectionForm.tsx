import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  SiteContent,
  ServiceDisciplineCategory,
  ServiceDisciplineItem,
} from "@art-work/types";
import { DEFAULT_SERVICE_DISCIPLINES } from "@art-work/database/content/default-content";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface ServicesSectionFormProps {
  services: SiteContent["services"];
  updateSection: UpdateSectionFn;
}

export const ServicesSectionForm = React.memo(function ServicesSectionForm({
  services,
  updateSection,
}: ServicesSectionFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            HOME SERVICES &amp; 3D CAPABILITIES MATRIX
          </h3>
          <p className="text-xs text-zinc-400">
            Target scene: /#stage-03 ({services.disciplines.length} active services)
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            updateSection("services", (p) => ({
              ...p,
              disciplines: DEFAULT_SERVICE_DISCIPLINES,
            }))
          }
          className="text-xs font-mono text-zinc-400 hover:text-yellow-400 cursor-pointer"
        >
          Reset Default 12 Services
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Section Eyebrow</label>
          <input
            type="text"
            value={services.eyebrow}
            onChange={(e) =>
              updateSection("services", (p) => ({ ...p, eyebrow: e.target.value }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline Prefix</label>
          <input
            type="text"
            value={services.headlinePrefix}
            onChange={(e) =>
              updateSection("services", (p) => ({
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
            value={services.headlineHighlight}
            onChange={(e) =>
              updateSection("services", (p) => ({
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
          value={services.description}
          onChange={(e) =>
            updateSection("services", (p) => ({
              ...p,
              description: e.target.value,
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      {/* Filter Labels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className={LABEL_CLS}>Filter: All</label>
          <input
            type="text"
            value={services.filterAllLabel}
            onChange={(e) =>
              updateSection("services", (p) => ({
                ...p,
                filterAllLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Filter: Creative</label>
          <input
            type="text"
            value={services.filterCreativeLabel}
            onChange={(e) =>
              updateSection("services", (p) => ({
                ...p,
                filterCreativeLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Filter: Events</label>
          <input
            type="text"
            value={services.filterEventsLabel}
            onChange={(e) =>
              updateSection("services", (p) => ({
                ...p,
                filterEventsLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Filter: Production</label>
          <input
            type="text"
            value={services.filterProductionLabel}
            onChange={(e) =>
              updateSection("services", (p) => ({
                ...p,
                filterProductionLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Filter: Delivery</label>
          <input
            type="text"
            value={services.filterDeliveryLabel}
            onChange={(e) =>
              updateSection("services", (p) => ({
                ...p,
                filterDeliveryLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Service Disciplines List */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            Editable Service Cards ({services.disciplines.length})
          </h4>
          <button
            type="button"
            onClick={() => {
              const newItem: ServiceDisciplineItem = {
                id: `service-${Date.now()}`,
                number: `0${services.disciplines.length + 1}`,
                title: "New Studio Service",
                tag: "CUSTOM SERVICE",
                icon: "sparkles",
                category: "production",
                description:
                  "End-to-end creative direction and physical production tailored for your event.",
                deliverables: [
                  "Custom Spatial Design",
                  "On-Site Production Supervision",
                ],
                specs: ["Turnkey Delivery", "Brand-Aligned Execution"],
                metrics: "100% Custom",
              };
              updateSection("services", (p) => ({
                ...p,
                disciplines: [...p.disciplines, newItem],
              }));
            }}
            className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.disciplines.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-yellow-400 font-bold">
                  SERVICE #{idx + 1} ({item.number})
                </span>
                {services.disciplines.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateSection("services", (p) => ({
                        ...p,
                        disciplines: p.disciplines.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateSection("services", (p) => {
                        const next = [...p.disciplines];
                        next[idx] = { ...next[idx], title: e.target.value };
                        return { ...p, disciplines: next };
                      })
                    }
                    className={`${INPUT_CLS} font-bold`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) =>
                      updateSection("services", (p) => {
                        const next = [...p.disciplines];
                        next[idx] = {
                          ...next[idx],
                          category: e.target.value as ServiceDisciplineCategory,
                        };
                        return { ...p, disciplines: next };
                      })
                    }
                    className={INPUT_CLS}
                  >
                    <option value="creative">Creative</option>
                    <option value="events">Events</option>
                    <option value="production">Production</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    TAG BADGE
                  </label>
                  <input
                    type="text"
                    value={item.tag}
                    onChange={(e) =>
                      updateSection("services", (p) => {
                        const next = [...p.disciplines];
                        next[idx] = { ...next[idx], tag: e.target.value };
                        return { ...p, disciplines: next };
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    METRIC PILL
                  </label>
                  <input
                    type="text"
                    value={item.metrics}
                    onChange={(e) =>
                      updateSection("services", (p) => {
                        const next = [...p.disciplines];
                        next[idx] = { ...next[idx], metrics: e.target.value };
                        return { ...p, disciplines: next };
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateSection("services", (p) => {
                      const next = [...p.disciplines];
                      next[idx] = { ...next[idx], description: e.target.value };
                      return { ...p, disciplines: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  DELIVERABLES (One per line)
                </label>
                <textarea
                  rows={3}
                  value={item.deliverables.join("\n")}
                  onChange={(e) =>
                    updateSection("services", (p) => {
                      const next = [...p.disciplines];
                      const lines = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      next[idx] = {
                        ...next[idx],
                        deliverables: lines.length > 0 ? lines : ["Custom Scope"],
                      };
                      return { ...p, disciplines: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="pt-4 border-t border-[#262638] space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono">
          Services Bottom Callout Banner
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLS}>Banner Eyebrow</label>
            <input
              type="text"
              value={services.bannerEyebrow}
              onChange={(e) =>
                updateSection("services", (p) => ({
                  ...p,
                  bannerEyebrow: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Banner Headline Prefix</label>
            <input
              type="text"
              value={services.bannerHeadlinePrefix}
              onChange={(e) =>
                updateSection("services", (p) => ({
                  ...p,
                  bannerHeadlinePrefix: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Banner Headline Highlight</label>
            <input
              type="text"
              value={services.bannerHeadlineHighlight}
              onChange={(e) =>
                updateSection("services", (p) => ({
                  ...p,
                  bannerHeadlineHighlight: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={LABEL_CLS}>Banner Description</label>
            <input
              type="text"
              value={services.bannerDescription}
              onChange={(e) =>
                updateSection("services", (p) => ({
                  ...p,
                  bannerDescription: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Banner CTA Button</label>
            <input
              type="text"
              value={services.bannerCtaText}
              onChange={(e) =>
                updateSection("services", (p) => ({
                  ...p,
                  bannerCtaText: e.target.value,
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
