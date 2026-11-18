import React from "react";
import {
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  FileText,
} from "lucide-react";
import { ProjectRecord } from "@art-work/types";
import { BehanceIcon, FacebookIcon, YouTubeIcon } from "./Icons";

export interface ProjectsTableProps {
  projects: ProjectRecord[];
  totalCount: number;
  onMoveOrder: (id: string, direction: "up" | "down") => void;
  onToggleFeatured: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (project: ProjectRecord) => void;
  onDeleteRequest: (id: string) => void;
}

export function ProjectsTable({
  projects,
  totalCount,
  onMoveOrder,
  onToggleFeatured,
  onToggleStatus,
  onEdit,
  onDeleteRequest,
}: ProjectsTableProps) {
  return (
    <div className="rounded-2xl bg-[#151520] border border-[#262638] overflow-hidden">
      <div className="p-4 border-b border-[#262638] flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>
          SHOWING {projects.length} OF {totalCount} PROJECTS
        </span>
        <span>PUBLISHED TO PUBLIC /gallery</span>
      </div>

      <div className="divide-y divide-[#262638]">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            No projects found matching the active filter criteria.
          </div>
        ) : (
          projects.map((project, idx) => (
            <div
              key={project.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#181824] transition-colors"
            >
              {/* Left: Thumbnail & Core Info */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1 font-mono text-xs text-zinc-500">
                  <button
                    onClick={() => onMoveOrder(project.id, "up")}
                    disabled={idx === 0}
                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                    aria-label="Move project up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-zinc-400">#{project.order}</span>
                  <button
                    onClick={() => onMoveOrder(project.id, "down")}
                    disabled={idx === projects.length - 1}
                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                    aria-label="Move project down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-16 h-12 rounded-xl bg-black/40 border border-[#2b2b3d] overflow-hidden relative shrink-0">
                  {project.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                      IMG
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {project.title}
                    </h4>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-yellow-400 text-black px-1.5 py-0.5 rounded">
                        <Star className="w-2.5 h-2.5 fill-black text-black" />
                        <span>
                          {project.youtubeVideoId || project.youtubeUrl
                            ? "HOME VIDEO"
                            : "ON HOME"}
                        </span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/20">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                      {project.year || 2026}
                    </span>
                    {project.metaBadge && (
                      <span className="text-[10px] font-mono uppercase bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-400/30">
                        {project.metaBadge}
                      </span>
                    )}
                    {project.behanceUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded">
                        <BehanceIcon className="w-3 h-3 text-blue-400" />
                        <span>Behance</span>
                      </span>
                    )}
                    {(project.youtubeVideoId || project.youtubeUrl) && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">
                        <YouTubeIcon className="w-3 h-3 text-red-500" />
                        <span>{project.isShort ? "YouTube Reel (9:16)" : "YouTube Showreel"}</span>
                      </span>
                    )}
                    {project.facebookUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-600/10 border border-blue-500/30 px-1.5 py-0.5 rounded">
                        <FacebookIcon className="w-3 h-3 text-[#1877F2]" />
                        <span>Facebook Video</span>
                      </span>
                    )}
                    {project.pdfUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>{project.category === "branding" ? "Giveaways PDF" : "PDF Specs"}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                    <span>{project.client}</span>
                    {project.youtubeTitle && (
                      <>
                        <span>•</span>
                        <span className="text-zinc-300 truncate max-w-xs">
                          🎬 {project.youtubeTitle}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: ★ Home Star Toggle, Status Toggle & Actions */}
              <div className="flex items-center gap-2.5 self-end md:self-center flex-wrap">
                <button
                  type="button"
                  onClick={() => onToggleFeatured(project.id)}
                  title={
                    project.featured
                      ? "Currently featured on Home Page — Click to remove from Home"
                      : "Click ★ Star to feature this video/project on the Home Page"
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    project.featured
                      ? "bg-yellow-400 text-black border-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.25)]"
                      : "bg-[#20202e] text-zinc-400 border-[#2b2b3d] hover:text-yellow-400 hover:border-yellow-400/50"
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      project.featured ? "fill-black text-black" : ""
                    }`}
                  />
                  <span>{project.featured ? "★ On Home" : "☆ Add to Home"}</span>
                </button>

                <button
                  onClick={() => onToggleStatus(project.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                    project.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                  }`}
                >
                  {project.status}
                </button>

                <button
                  onClick={() => onEdit(project)}
                  className="p-2 rounded-lg bg-[#20202e] hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors border border-[#2b2b3d] cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteRequest(project.id)}
                  className="p-2 rounded-lg bg-[#20202e] hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors border border-[#2b2b3d] cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
