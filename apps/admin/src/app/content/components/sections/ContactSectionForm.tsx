import React from "react";
import type { SiteContent } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface ContactSectionFormProps {
  contact: SiteContent["contact"];
  updateSection: UpdateSectionFn;
}

export const ContactSectionForm = React.memo(function ContactSectionForm({
  contact,
  updateSection,
}: ContactSectionFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            CONTACT INTAKE, ADDRESS &amp; BRIEF FORM FIELDS
          </h3>
          <p className="text-xs text-zinc-400">Target scene: /#stage-04</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Section Stage Tag</label>
          <input
            type="text"
            value={contact.stageTag}
            onChange={(e) =>
              updateSection("contact", (p) => ({ ...p, stageTag: e.target.value }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Headline</label>
          <input
            type="text"
            value={contact.headline}
            onChange={(e) =>
              updateSection("contact", (p) => ({ ...p, headline: e.target.value }))
            }
            className={`${INPUT_CLS} font-bold`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Description</label>
        <textarea
          rows={2}
          value={contact.description}
          onChange={(e) =>
            updateSection("contact", (p) => ({ ...p, description: e.target.value }))
          }
          className={INPUT_CLS}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#262638]">
        <div>
          <label className={LABEL_CLS}>Studio Email</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) =>
              updateSection("contact", (p) => ({ ...p, email: e.target.value }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Studio Phone</label>
          <input
            type="text"
            value={contact.phone}
            onChange={(e) =>
              updateSection("contact", (p) => ({ ...p, phone: e.target.value }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Submit Button Text</label>
          <input
            type="text"
            value={contact.submitButtonText}
            onChange={(e) =>
              updateSection("contact", (p) => ({
                ...p,
                submitButtonText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Studio Address / Locations</label>
          <input
            type="text"
            value={contact.studioLocations}
            onChange={(e) =>
              updateSection("contact", (p) => ({
                ...p,
                studioLocations: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Intake Card Label</label>
          <input
            type="text"
            value={contact.intakeLabel}
            onChange={(e) =>
              updateSection("contact", (p) => ({
                ...p,
                intakeLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Editable Service Checkboxes */}
      <div className="pt-4 border-t border-[#262638]">
        <label className={LABEL_CLS}>
          Selectable Service Pills in Contact Form (One per line)
        </label>
        <textarea
          rows={4}
          value={(contact.serviceOptions || []).join("\n")}
          onChange={(e) =>
            updateSection("contact", (p) => ({
              ...p,
              serviceOptions: e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      {/* Form Fields */}
      <div className="pt-4 border-t border-[#262638] space-y-3">
        <h4 className="text-xs font-bold text-white uppercase font-mono">
          Brief Form Field Labels &amp; Placeholders
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contact.formFields.map((field, idx) => (
            <div
              key={field.name}
              className="p-3.5 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-2"
            >
              <div className="text-[10px] font-mono text-yellow-400 uppercase font-bold">
                FIELD: {field.name}
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  LABEL
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateSection("contact", (p) => {
                      const next = [...p.formFields];
                      next[idx] = { ...next[idx], label: e.target.value };
                      return { ...p, formFields: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                  PLACEHOLDER
                </label>
                <input
                  type="text"
                  value={field.placeholder}
                  onChange={(e) =>
                    updateSection("contact", (p) => {
                      const next = [...p.formFields];
                      next[idx] = { ...next[idx], placeholder: e.target.value };
                      return { ...p, formFields: next };
                    })
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
