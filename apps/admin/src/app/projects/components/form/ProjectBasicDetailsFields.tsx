import React from "react";
import { FileText } from "lucide-react";
import type { ProjectRecord } from "@art-work/types";

interface ProjectBasicDetailsFieldsProps {
  project: ProjectRecord;
  onChange: (project: ProjectRecord) => void;
}

export const ProjectBasicDetailsFields = React.memo(function ProjectBasicDetailsFields({
  project,
  onChange,
}: ProjectBasicDetailsFieldsProps) {
  return (
    <>
      {/* Mode Indicator Banner */}
      {project.category === "booths" ? (
        <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-300">
            <FileText className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Exhibition Booth &amp; Pavilion Production Mode
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Headline • Description • 3D Renders • PDF Blueprints
          </span>
        </div>
      ) : null}

      {/* 1. Headline & Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 mb-1">
            {project.category === "booths" ? "Booth / Pavilion Headline" : "Project Display Title"}
          </label>
          <input
            type="text"
            required
            placeholder={
              project.category === "booths"
                ? "e.g. Nova MedTech 36m² Custom Pavilion"
                : "e.g. Neon Horizon Tour"
            }
            value={project.title}
            onChange={(e) => onChange({ ...project, title: e.target.value })}
            className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">
            {project.category === "booths" ? "Exhibitor / Client Name" : "Client Name"}
          </label>
          <input
            type="text"
            required
            placeholder={
              project.category === "booths"
                ? "e.g. Nova MedTech Innovations"
                : "e.g. Global Music Group"
            }
            value={project.client}
            onChange={(e) => onChange({ ...project, client: e.target.value })}
            className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* 2. Category, Year, and Meta Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-zinc-400 mb-1">Category</label>
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
            className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
          >
            <option value="conferences">Conferences &amp; Medical Events</option>
            <option value="booths">Exhibition Booths</option>
            <option value="branding">Branding &amp; Print &amp; Giveaways</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Year / التاريخ السنوي</label>
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
            className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 font-mono"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">
            {project.category === "booths" ? "Footprint Badge" : "Tagline / Badge (Right)"}
          </label>
          <input
            type="text"
            placeholder={
              project.category === "booths" ? "36M² CUSTOM BUILD" : "ANNUAL GATHERING"
            }
            value={project.metaBadge ?? ""}
            onChange={(e) => onChange({ ...project, metaBadge: e.target.value })}
            className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* 3. Description */}
      <div>
        <label className="block text-zinc-400 mb-1">
          {project.category === "booths"
            ? "Booth Description & Spatial Concept"
            : "Description & Scenography Narrative"}
        </label>
        <textarea
          rows={3}
          placeholder={
            project.category === "booths"
              ? "Describe the booth layout, spatial architecture, visitor journey, finishes (matte lacquer, acrylic, CNC joinery), and integrated audio-visual..."
              : "Describe project scenography..."
          }
          value={project.description}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
          className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
        />
      </div>

      {/* 4. Tags & Filter Keywords */}
      <div>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <label className="block text-zinc-400">
            Project Tags / Chips (Separated by commas)
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            First tag is highlighted in yellow as primary
          </span>
        </div>
        <input
          type="text"
          placeholder="e.g. Corporate Gathering, Annual Event, Stage & Production, Event Management"
          value={
            Array.isArray(project.tags)
              ? project.tags.join(", ")
              : typeof project.tags === "string"
              ? project.tags
              : ""
          }
          onChange={(e) => {
            const tagsArray = e.target.value.split(",").map((t) => t.trimStart());
            onChange({ ...project, tags: tagsArray });
          }}
          onBlur={(e) => {
            const cleanTags = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            onChange({ ...project, tags: cleanTags });
          }}
          className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 font-mono text-xs"
        />
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                  idx === 0
                    ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
});
