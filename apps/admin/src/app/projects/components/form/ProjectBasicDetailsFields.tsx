import React from "react";
import { FileText } from "lucide-react";
import type { ProjectRecord } from "@art-work/types";

interface ProjectBasicDetailsFieldsProps {
  project: ProjectRecord;
  onChange: (project: ProjectRecord) => void;
}

const STUDIO_INPUT_CLS =
  "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all";
const STUDIO_LABEL_CLS = "block text-[13px] font-medium text-zinc-300 mb-1.5";

export const ProjectBasicDetailsFields = React.memo(function ProjectBasicDetailsFields({
  project,
  onChange,
}: ProjectBasicDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      {project.category === "booths" && (
        <div className="px-4 py-2.5 bg-amber-400/10 border border-amber-400/25 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-medium">
            <FileText className="w-4 h-4" />
            <span>Exhibition Booth &amp; Pavilion Production</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Headline • Description • 3D Renders • Blueprints
          </span>
        </div>
      )}

      {/* 1. Headline & Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={STUDIO_LABEL_CLS}>
            {project.category === "booths" ? "Booth / Pavilion Headline" : "Project Title"}{" "}
            <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={
              project.category === "booths"
                ? "e.g. Nova MedTech 36m² Custom Pavilion"
                : "e.g. Mindray Annual Summit"
            }
            value={project.title}
            onChange={(e) => onChange({ ...project, title: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>

        <div>
          <label className={STUDIO_LABEL_CLS}>
            {project.category === "booths" ? "Exhibitor / Client Name" : "Client Name"}{" "}
            <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={
              project.category === "booths"
                ? "e.g. Nova MedTech Innovations"
                : "e.g. Mindray Bio-Medical"
            }
            value={project.client}
            onChange={(e) => onChange({ ...project, client: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>
      </div>

      {/* 2. Category, Year, and Meta Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={STUDIO_LABEL_CLS}>Category</label>
          <select
            value={project.category}
            onChange={(e) => {
              const newCat = e.target.value as ProjectRecord["category"];
              const isNowBooth = newCat === "booths";
              onChange({
                ...project,
                category: newCat,
                metaBadge:
                  isNowBooth &&
                  (!project.metaBadge ||
                    project.metaBadge.includes("2026") ||
                    project.metaBadge.includes("GATHERING"))
                    ? "36M² CUSTOM BUILD"
                    : project.metaBadge,
                image:
                  isNowBooth &&
                  (!project.image || project.image.includes("neon_horizon"))
                    ? "/assets/images/gallery/project_06_sensory_expo.jpg"
                    : project.image,
              });
            }}
            className={STUDIO_INPUT_CLS}
          >
            <option value="conferences">Conferences &amp; Medical Events</option>
            <option value="booths">Exhibition Booths</option>
            <option value="branding">Branding &amp; Giveaways</option>
          </select>
        </div>

        <div>
          <label className={STUDIO_LABEL_CLS}>Year</label>
          <input
            type="number"
            min="2000"
            max="2099"
            placeholder="2026"
            value={project.year || 2026}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              const updatedYear = isNaN(val) ? 2026 : val;
              onChange({
                ...project,
                year: updatedYear,
                stamp: String(updatedYear),
              });
            }}
            className={STUDIO_INPUT_CLS}
          />
        </div>

        <div>
          <label className={STUDIO_LABEL_CLS}>
            {project.category === "booths" ? "Footprint Badge" : "Subtitle Badge"}
          </label>
          <input
            type="text"
            placeholder={
              project.category === "booths" ? "36M² CUSTOM BUILD" : "ANNUAL GATHERING"
            }
            value={project.metaBadge ?? ""}
            onChange={(e) => onChange({ ...project, metaBadge: e.target.value })}
            className={STUDIO_INPUT_CLS}
          />
        </div>
      </div>

      {/* 3. Description */}
      <div>
        <label className={STUDIO_LABEL_CLS}>
          {project.category === "booths"
            ? "Booth Description & Spatial Concept"
            : "Project Description"}
        </label>
        <textarea
          rows={3}
          placeholder={
            project.category === "booths"
              ? "Describe the booth layout, spatial architecture, visitor journey, finishes, and integrated AV..."
              : "Describe project highlights and deliverables..."
          }
          value={project.description}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
          className={`${STUDIO_INPUT_CLS} leading-relaxed`}
        />
      </div>
    </div>
  );
});
