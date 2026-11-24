import React from "react";
import { Languages } from "lucide-react";
import type { ProjectRecord, ProjectTranslationFields } from "@art-work/types";

interface ProjectArabicFieldsCardProps {
  project: ProjectRecord;
  onChange: (project: ProjectRecord) => void;
}

const STUDIO_INPUT_CLS =
  "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all";
const STUDIO_LABEL_CLS = "block text-[13px] font-medium text-zinc-300 mb-1.5";

export const ProjectArabicFieldsCard = React.memo(function ProjectArabicFieldsCard({
  project,
  onChange,
}: ProjectArabicFieldsCardProps) {
  const ar: ProjectTranslationFields = project.translations?.ar || {};

  const updateAr = (patch: Partial<ProjectTranslationFields>) => {
    onChange({
      ...project,
      translations: {
        ...(project.translations || {}),
        ar: {
          ...ar,
          ...patch,
        },
      },
    });
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div className="px-4 py-2.5 bg-amber-400/10 border border-amber-400/25 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-medium">
          <Languages className="w-4 h-4 shrink-0" />
          <span>الترجمة العربية للمشروع (تظهر تلقائياً عند اختيار اللغة العربية في الموقع)</span>
        </div>
      </div>

      {/* 1. Arabic Title & Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={STUDIO_LABEL_CLS}>
            اسم المشروع بالعربي
          </label>
          <input
            type="text"
            placeholder={project.title || "مثال: المؤتمر السنوي لشركة ..."}
            value={ar.title ?? ""}
            onChange={(e) => updateAr({ title: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
          {project.title && (
            <p dir="ltr" className="text-[11px] text-zinc-500 mt-1 truncate text-start">
              EN: {project.title}
            </p>
          )}
        </div>

        <div>
          <label className={STUDIO_LABEL_CLS}>
            اسم العميل بالعربي
          </label>
          <input
            type="text"
            placeholder={project.client || "مثال: شركة ..."}
            value={ar.client ?? ""}
            onChange={(e) => updateAr({ client: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
          {project.client && (
            <p dir="ltr" className="text-[11px] text-zinc-500 mt-1 truncate text-start">
              EN: {project.client}
            </p>
          )}
        </div>
      </div>

      {/* 2. Arabic Meta Badge & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={STUDIO_LABEL_CLS}>
            {project.category === "booths" ? "شارة المساحة / النوع بالعربي" : "الشارة الفرعية بالعربي"}
          </label>
          <input
            type="text"
            placeholder={project.metaBadge || "مثال: جناح 36م² مخصص"}
            value={ar.metaBadge ?? ""}
            onChange={(e) => updateAr({ metaBadge: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>

        <div>
          <label className={STUDIO_LABEL_CLS}>إحصائية رئيسية بالعربي (اختياري)</label>
          <input
            type="text"
            placeholder={project.stats || "مثال: +5,000 مشارك"}
            value={ar.stats ?? ""}
            onChange={(e) => updateAr({ stats: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>
      </div>

      {/* 3. Arabic Description */}
      <div>
        <label className={STUDIO_LABEL_CLS}>وصف المشروع بالعربي</label>
        <textarea
          rows={3}
          placeholder="اكتب وصفاً احترافياً للمشروع وأبرز تفاصيل التنفيذ بالعربية..."
          value={ar.description ?? ""}
          onChange={(e) => updateAr({ description: e.target.value })}
          className={`${STUDIO_INPUT_CLS} leading-relaxed`}
        />
      </div>

      {/* 4. Arabic Video & PDF Titles */}
      {(project.youtubeUrl || project.youtubeVideoId || project.facebookUrl) && (
        <div className="p-4 bg-[#0b0c10] border border-white/10 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-amber-300">
            عناوين ووصف الفيديو بالعربي (YouTube / Facebook)
          </div>
          <div>
            <label className={STUDIO_LABEL_CLS}>عنوان الفيديو بالعربي</label>
            <input
              type="text"
              placeholder={project.youtubeTitle || "عنوان مختصر للفيديو بالعربي..."}
              value={ar.youtubeTitle ?? ""}
              onChange={(e) => updateAr({ youtubeTitle: e.target.value })}
              className={STUDIO_INPUT_CLS}
            />
          </div>
          <div>
            <label className={STUDIO_LABEL_CLS}>وصف الفيديو بالعربي</label>
            <textarea
              rows={2}
              placeholder="نبذة عن محتوى الفيديو بالعربي..."
              value={ar.youtubeDescription ?? ""}
              onChange={(e) => updateAr({ youtubeDescription: e.target.value })}
              className={STUDIO_INPUT_CLS}
            />
          </div>
        </div>
      )}

      {project.pdfUrl && (
        <div>
          <label className={STUDIO_LABEL_CLS}>عنوان ملف الـ PDF بالعربي</label>
          <input
            type="text"
            placeholder={project.pdfTitle || "مثال: كتالوج الهدايا الترويجية والمواصفات"}
            value={ar.pdfTitle ?? ""}
            onChange={(e) => updateAr({ pdfTitle: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>
      )}

      {/* 5. Arabic Specs */}
      <div>
        <label className={STUDIO_LABEL_CLS}>
          مواصفات التنفيذ بالعربي (افصل بين كل عنصر بفاصلة ، أو ,)
        </label>
        <input
          type="text"
          placeholder="تصميم ثلاثي الأبعاد، إضاءة مسرحية، تنفيذ ميداني كامل"
          value={Array.isArray(ar.specs) ? ar.specs.join("، ") : ""}
          onChange={(e) =>
            updateAr({
              specs: e.target.value
                .split(/[،,]/)
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className={STUDIO_INPUT_CLS}
        />
      </div>
    </div>
  );
});
