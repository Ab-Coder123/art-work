import React from "react";
import type { SiteContent } from "@art-work/types";
import { INPUT_CLS, LABEL_CLS, type UpdateSectionFn } from "../../types";

interface LayoutSectionFormProps {
  layout: SiteContent["layout"];
  updateSection: UpdateSectionFn;
}

export const LayoutSectionForm = React.memo(function LayoutSectionForm({
  layout,
  updateSection,
}: LayoutSectionFormProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            GLOBAL NAVIGATION BAR &amp; FOOTER LABELS
          </h3>
          <p className="text-xs text-zinc-400">
            Synced across /, /why-us, and /gallery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className={LABEL_CLS}>Nav: Home</label>
          <input
            type="text"
            value={layout.navHomeLabel}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                navHomeLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Nav: Why Us</label>
          <input
            type="text"
            value={layout.navWhyUsLabel}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                navWhyUsLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Nav: Services</label>
          <input
            type="text"
            value={layout.navServicesLabel}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                navServicesLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Nav: Gallery</label>
          <input
            type="text"
            value={layout.navGalleryLabel}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                navGalleryLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Nav: Contact</label>
          <input
            type="text"
            value={layout.navContactLabel}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                navContactLabel: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Header Vault CTA Button</label>
          <input
            type="text"
            value={layout.fullVaultCtaText}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                fullVaultCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Header Brief CTA Button</label>
          <input
            type="text"
            value={layout.briefCtaText}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                briefCtaText: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL_CLS}>Footer Brand Title</label>
          <input
            type="text"
            value={layout.footerBrandTitle}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                footerBrandTitle: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Footer Brand Subtitle</label>
          <input
            type="text"
            value={layout.footerBrandSubtitle}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                footerBrandSubtitle: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Footer Copyright</label>
          <input
            type="text"
            value={layout.footerCopyright}
            onChange={(e) =>
              updateSection("layout", (p) => ({
                ...p,
                footerCopyright: e.target.value,
              }))
            }
            className={INPUT_CLS}
          />
        </div>
      </div>
    </div>
  );
});
