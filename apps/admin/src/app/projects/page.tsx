"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  X,
  Save,
  Video,
  Sparkles,
  Loader2,
  Smartphone,
  FileText,
} from "lucide-react";
import {
  ProjectRecord,
  ProjectCategory,
  resolveSafeYouTubeEmbed,
} from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "rameda-event",
    title: "Rameda Event",
    stamp: "EVENT_PASS: RAMEDA_01",
    metaBadge: "ANNUAL GATHERING",
    cadId: "PROD_ID: RAMEDA_EVENT",
    image: "/assets/images/gallery/rameda_event.jpg",
    altText: "Rameda Annual Company Gathering & Event Production",
    category: "conferences",
    tags: [
      "Corporate Gathering",
      "Annual Event",
      "Stage & Production",
      "Event Management",
    ],
    stats: "✨ 1,000+ Guests",
    statsSub: "Annual Gathering • 100% Custom Stage",
    description:
      "Relive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.",
    client: "Rameda Pharmaceuticals",
    specs: [
      "Custom Branded Stage & Lighting Rig",
      "High-Definition LED Screen Choreography",
      "Multi-Camera Live Broadcast & Showreel",
      "Seamless On-site Event Logistics",
    ],
    status: "published",
    order: 1,
    featured: true,
    youtubeVideoId: "7SkcdZ7CcGI",
    youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
    youtubeTitle: "Rameda Event",
    youtubeDescription:
      "A day filled with unforgettable moments, positive energy, and team spirit! 🎉\n\nRelive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.\n\nFrom memorable moments to the smiles and energy of our people, this event reflects the strong culture, teamwork, and passion that drive us forward every day.",
    isShort: false,
  },
  {
    id: "nova-medtech-booth",
    title: "Nova MedTech Custom Pavilion",
    stamp: "BOOTH_PASS: MED_EXPO_25",
    metaBadge: "36M² CUSTOM BUILD",
    cadId: "CAD_ID: BOOTH_NOVA_V3",
    image: "/assets/images/gallery/project_06_sensory_expo.jpg",
    altText: "Nova MedTech Custom Exhibition Booth & Pavilion Fabrication",
    category: "booths",
    tags: [
      "Exhibition Booth",
      "Custom Fabrication",
      "3D Spatial Design",
      "On-Site Build",
    ],
    stats: "🏛️ 36m² Island Stand",
    statsSub: "Custom CNC Woodwork • Integrated LED Kiosks",
    description:
      "Turnkey custom exhibition booth featuring architectural archways, integrated interactive touchscreens, and bespoke backlit brand displays for medical expo showcase.",
    client: "Nova MedTech Innovations",
    specs: [
      "Precision CNC Curved Woodwork & Matte Lacquer",
      "Integrated 65-inch Interactive Product Kiosks",
      "Engineered Overhead Hanging Signage & Truss Rigging",
      "Complete 48-Hour On-Site Assembly & Handover",
    ],
    status: "published",
    order: 2,
    featured: true,
    images: [
      "/assets/images/gallery/project_06_sensory_expo.jpg",
      "/assets/images/gallery/spotlight_blueprint_easel.jpg",
    ],
    pdfUrl: "/assets/docs/booth_spec_proposal.pdf",
    pdfTitle: "Nova MedTech 36m² Architectural Blueprint & 3D Spec Sheet (PDF)",
    youtubeVideoId: null,
    youtubeUrl: null,
    youtubeTitle: null,
    youtubeDescription: null,
    isShort: false,
  },
  {
    id: "pharmapack-expo-booth",
    title: "Pharmapack Discovery Stand",
    stamp: "BOOTH_PASS: PHARMA_02",
    metaBadge: "54M² ISLAND BOOTH",
    cadId: "CAD_ID: BOOTH_PHARMA_V2",
    image: "/assets/images/gallery/project_03_cybertruss.jpg",
    altText: "Pharmapack Discovery Stand Exhibition Booth Design & Build",
    category: "booths",
    tags: [
      "Exhibition Booth",
      "Modular Truss",
      "Brand Experience",
      "Turnkey Production",
    ],
    stats: "📐 54m² Double-Frontage",
    statsSub: "Modular Aluminum Core • Ambient Edge Lighting",
    description:
      "High-impact exhibition stand engineered for maximum visitor engagement, featuring private meeting lounges, elevated branding banners, and seamless logistics.",
    client: "Pharmapack Regional Group",
    specs: [
      "Modular Aluminum Structure with Seamless Fabric Graphics",
      "Private Glass-Partitioned VIP Meeting Lounge",
      "Dynamic Ambient LED Floor Perimeter Illumination",
      "Full Dismantling, Packing & Storage Logistics",
    ],
    status: "published",
    order: 3,
    featured: true,
    images: [
      "/assets/images/gallery/project_03_cybertruss.jpg",
      "/assets/images/gallery/project_06_sensory_expo.jpg",
    ],
    pdfUrl: "/assets/docs/booth_spec_proposal.pdf",
    pdfTitle: "Pharmapack 54m² Modular Structural Elevation & Floorplan (PDF)",
    youtubeVideoId: null,
    youtubeUrl: null,
    youtubeTitle: null,
    youtubeDescription: null,
    isShort: false,
  },
];

export default function GalleryProjectsManager() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resolvingYt, setResolvingYt] = useState(false);
  const [ytStatusMessage, setYtStatusMessage] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newBoothImageUrl, setNewBoothImageUrl] = useState("");
  const [showBoothYouTube, setShowBoothYouTube] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects?limit=50", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.items) && data.items.length > 0) {
            setProjects(data.items);
          }
        }
      } catch {
        // Fallback to INITIAL_PROJECTS if offline
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = projects.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesQuery =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleToggleStatus = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const nextStatus = target.status === "published" ? "draft" : "published";

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );

    try {
      const res = await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...target, status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? data.project : p))
          );
          setSyncMessage(`✓ Status updated to '${nextStatus.toUpperCase()}' in Supabase`);
        }
      }
    } catch {
      // Optimistic state kept locally
    }
  };

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const index = projects.findIndex((p) => p.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);

    try {
      const res = await apiFetchWithCsrf("/api/projects/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: reordered.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
      if (res.ok) {
        setSyncMessage("✓ Project display order synced to Supabase");
      }
    } catch {
      // Optimistic state kept locally
    }
  };

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);

    try {
      const res = await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSyncMessage(`✓ Deleted project '${id}' from Supabase`);
      }
    } catch {
      // Optimistic state kept locally
    }
  };

  const handleYouTubeInputChange = (rawInput: string) => {
    if (!editingProject) return;
    setYtStatusMessage(null);
    const resolved = resolveSafeYouTubeEmbed(rawInput);
    if (resolved) {
      const isGeneric =
        !editingProject.image ||
        editingProject.image.includes("project_01_neon_horizon.jpg") ||
        editingProject.image.includes("placeholder");
      const ytThumbnail = `https://img.youtube.com/vi/${resolved.videoId}/hqdefault.jpg`;

      setEditingProject({
        ...editingProject,
        youtubeUrl: rawInput,
        youtubeVideoId: resolved.videoId,
        isShort: resolved.isShort,
        image: isGeneric ? ytThumbnail : editingProject.image,
      });
    } else {
      setEditingProject({
        ...editingProject,
        youtubeUrl: rawInput,
        youtubeVideoId: null,
      });
    }
  };

  const handleFetchYouTubeMetadata = async () => {
    if (!editingProject?.youtubeUrl) return;
    setResolvingYt(true);
    setYtStatusMessage(null);

    try {
      const res = await apiFetchWithCsrf("/api/media/youtube/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: editingProject.youtubeUrl,
          fetchMetadata: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const posterUrl =
          data.thumbnailUrl ||
          (data.posterCandidates && data.posterCandidates[0]) ||
          `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;

        setEditingProject((prev) =>
          prev
            ? {
                ...prev,
                youtubeVideoId: data.videoId,
                youtubeUrl: data.canonicalUrl,
                youtubeTitle: data.headline || prev.youtubeTitle || prev.title,
                youtubeDescription:
                  data.paragraph || prev.youtubeDescription || prev.description,
                isShort: Boolean(data.isShort),
                image: posterUrl || prev.image,
              }
            : null
        );
        setYtStatusMessage("✓ Extracted video thumbnail, headline & paragraph from YouTube");
      } else {
        const parsed = resolveSafeYouTubeEmbed(editingProject.youtubeUrl);
        if (parsed) {
          const fallbackThumb = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
          setEditingProject((prev) =>
            prev
              ? {
                  ...prev,
                  youtubeVideoId: parsed.videoId,
                  youtubeUrl: parsed.canonicalUrl,
                  isShort: parsed.isShort,
                  youtubeTitle: prev.youtubeTitle || `${prev.title} — Official Showreel`,
                  youtubeDescription:
                    prev.youtubeDescription || prev.description,
                  image:
                    !prev.image || prev.image.includes("project_01_neon_horizon.jpg")
                      ? fallbackThumb
                      : prev.image,
                }
              : null
          );
          setYtStatusMessage("✓ Validated YouTube ID & synced video thumbnail");
        } else {
          setYtStatusMessage("Invalid YouTube link. Raw <iframe> HTML is prohibited.");
        }
      }
    } catch {
      setYtStatusMessage("Could not reach metadata resolver.");
    } finally {
      setResolvingYt(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || isSaving) return;
    setIsSaving(true);
    setSyncMessage(null);

    const exists = !isCreatingNew && projects.some((p) => p.id === editingProject.id);

    try {
      const endpoint = exists
        ? `/api/projects/${encodeURIComponent(editingProject.id)}`
        : "/api/projects";
      const method = exists ? "PUT" : "POST";

      const res = await apiFetchWithCsrf(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        const data = await res.json();
        const saved: ProjectRecord = data.project || editingProject;
        setProjects((prev) =>
          exists
            ? prev.map((p) => (p.id === editingProject.id ? saved : p))
            : [...prev, saved]
        );
        setSyncMessage(
          exists
            ? `✓ Project "${saved.title}" updated in Supabase PostgreSQL`
            : `✓ Project "${saved.title}" created in Supabase PostgreSQL`
        );
        setEditingProject(null);
        setIsCreatingNew(false);
        return;
      } else {
        const errData = await res.json().catch(() => ({}));
        setSyncMessage(`⚠ ${errData.error || "Saved locally (API validation warning)"}`);
      }
    } catch {
      setSyncMessage("✓ Saved in local studio state");
    } finally {
      setIsSaving(false);
    }

    if (exists) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? editingProject : p))
      );
    } else {
      setProjects((prev) => [...prev, editingProject]);
    }
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const resolvedPreview = editingProject
    ? resolveSafeYouTubeEmbed(editingProject.youtubeVideoId || editingProject.youtubeUrl)
    : null;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Gallery Projects Manager"
        subtitle="Search, add, order, and edit showcase works published on /gallery"
        action={
          <button
            onClick={() => {
              const newId = `project-${Date.now()}`;
              setYtStatusMessage(null);
              setIsCreatingNew(true);
              setEditingProject({
                id: newId,
                slug: newId,
                title: "New Architectural Stage",
                stamp: "STAMP_PASS: NEW_01",
                metaBadge: "2026",
                cadId: "CAD_ID: STAGE_NEW",
                image: "/assets/images/gallery/project_01_neon_horizon.jpg",
                altText: "New Stage Scenography",
                category: "stage",
                tags: ["Stage Design", "Creative Direction"],
                stats: "⚡ 50,000 Fans",
                statsSub: "Custom Arena Rig",
                description:
                  "Describe the spatial scenography, lighting cues, and creative execution.",
                client: "Live Entertainment Global",
                specs: ["30m Truss Frame", "DMX Lighting Matrix"],
                status: "draft",
                order: projects.length + 1,
                isShort: false,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Project</span>
          </button>
        }
      />

      <main className="p-8 max-w-6xl space-y-6">
        {syncMessage && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span>{syncMessage}</span>
            <button
              type="button"
              onClick={() => setSyncMessage(null)}
              className="text-emerald-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {/* Controls Bar: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151520] border border-[#262638]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, client, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            {(
              ["all", "stage", "conferences", "booths", "branding", "tech", "led"] as ProjectCategory[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-yellow-400 text-black font-bold"
                    : "text-zinc-400 hover:text-white bg-[#0d0d12] border border-[#262638]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List / Table Overview */}
        <div className="rounded-2xl bg-[#151520] border border-[#262638] overflow-hidden">
          <div className="p-4 border-b border-[#262638] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>
              SHOWING {filtered.length} OF {projects.length} PROJECTS
            </span>
            <span>PUBLISHED TO PUBLIC /gallery</span>
          </div>

          <div className="divide-y divide-[#262638]">
            {filtered.map((project, idx) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#181824] transition-colors"
              >
                {/* Left: Thumbnail & Core Info */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1 font-mono text-xs text-zinc-500">
                    <button
                      onClick={() => handleMoveOrder(project.id, "up")}
                      disabled={idx === 0}
                      className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold text-zinc-400">#{project.order}</span>
                    <button
                      onClick={() => handleMoveOrder(project.id, "down")}
                      disabled={idx === filtered.length - 1}
                      className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-16 h-12 rounded-xl bg-black/40 border border-[#2b2b3d] overflow-hidden relative shrink-0">
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                      IMG
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {project.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/20">
                        {project.category}
                      </span>
                      {(project.youtubeVideoId || project.youtubeUrl) && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">
                          <YouTubeIcon className="w-3 h-3 text-red-500" />
                          <span>{project.isShort ? "YouTube Reel (9:16)" : "YouTube Showreel"}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span>{project.client}</span>
                      <span>•</span>
                      <span>{project.stats}</span>
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

                {/* Right: Status Toggle & Actions */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleToggleStatus(project.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                      project.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                    }`}
                  >
                    {project.status}
                  </button>

                  <button
                    onClick={() => {
                      setYtStatusMessage(null);
                      setIsCreatingNew(false);
                      setEditingProject(project);
                    }}
                    className="p-2 rounded-lg bg-[#20202e] hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors border border-[#2b2b3d] cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2 rounded-lg bg-[#20202e] hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors border border-[#2b2b3d] cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151520] border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-bold text-white uppercase font-mono">
                  Confirm Project Deletion
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to delete this project record? This will permanently remove it
                from both the gallery grid and the interactive modal viewer.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-[#20202e] border border-[#2b2b3d] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit / Create Drawer Modal */}
        {editingProject && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <form
              onSubmit={handleSaveEdit}
              className="bg-[#151520] border border-[#2b2b3d] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Sticky Top Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#262638] bg-[#171724] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#ffffff]">
                    AW
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      {editingProject.id.startsWith("project-")
                        ? "New Showcase Project"
                        : "Edit Project Record"}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Scroll Y active • Configuring media, copy & YouTube synchronization
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#20202e] cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body (Dedicated Scroll Y) */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs font-mono overscroll-contain">
                {/* Mode Indicator Banner */}
                {editingProject.category === "booths" ? (
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
                      {editingProject.category === "booths" ? "Booth / Pavilion Headline" : "Project Display Title"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={editingProject.category === "booths" ? "e.g. Nova MedTech 36m² Custom Pavilion" : "e.g. Neon Horizon Tour"}
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {editingProject.category === "booths" ? "Exhibitor / Client Name" : "Client Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={editingProject.category === "booths" ? "e.g. Nova MedTech Innovations" : "e.g. Global Music Group"}
                      value={editingProject.client}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, client: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* 2. Category, Stamp Pass, and CAD ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => {
                        const newCat = e.target.value as ProjectRecord["category"];
                        const isNowBooth = newCat === "booths";
                        setEditingProject({
                          ...editingProject,
                          category: newCat,
                          stamp:
                            isNowBooth &&
                            (!editingProject.stamp ||
                              editingProject.stamp.includes("STAGE") ||
                              editingProject.stamp.includes("EVENT"))
                              ? "BOOTH_PASS: EXPO_25"
                              : editingProject.stamp,
                          cadId:
                            isNowBooth &&
                            (!editingProject.cadId ||
                              editingProject.cadId.includes("STAGE") ||
                              editingProject.cadId.includes("EVENT"))
                              ? "CAD_ID: BOOTH_V2"
                              : editingProject.cadId,
                          stats:
                            isNowBooth &&
                            (!editingProject.stats ||
                              editingProject.stats.includes("Fans") ||
                              editingProject.stats.includes("Guests"))
                              ? "🏛️ 36m² Island Stand"
                              : editingProject.stats,
                          statsSub:
                            isNowBooth &&
                            (!editingProject.statsSub ||
                              editingProject.statsSub.includes("Rig") ||
                              editingProject.statsSub.includes("Stage"))
                              ? "Custom CNC Woodwork • Integrated LED Kiosks"
                              : editingProject.statsSub,
                          image:
                            isNowBooth &&
                            (!editingProject.image ||
                              editingProject.image.includes("neon_horizon"))
                              ? "/assets/images/gallery/project_06_sensory_expo.jpg"
                              : editingProject.image,
                        });
                      }}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="stage">Stage & Lighting</option>
                      <option value="conferences">Conferences</option>
                      <option value="booths">Booths & Pavilions</option>
                      <option value="branding">Branding</option>
                      <option value="tech">Tech & Esports</option>
                      <option value="led">LED Screens</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {editingProject.category === "booths" ? "Exhibition / Stamp Pass" : "Stamp Pass Label"}
                    </label>
                    <input
                      type="text"
                      placeholder={editingProject.category === "booths" ? "BOOTH_PASS: MED_EXPO_25" : "STAMP_PASS: ARENA_01"}
                      value={editingProject.stamp}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, stamp: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {editingProject.category === "booths" ? "CAD / Blueprint ID" : "CAD Blueprint ID"}
                    </label>
                    <input
                      type="text"
                      placeholder={editingProject.category === "booths" ? "CAD_ID: BOOTH_NOVA_V3" : "CAD_ID: STAGE_01"}
                      value={editingProject.cadId}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, cadId: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* 3. Stats & Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {editingProject.category === "booths" ? "Booth Footprint / Area Metric" : "Primary Stat"}
                    </label>
                    <input
                      type="text"
                      placeholder={editingProject.category === "booths" ? "e.g. 🏛️ 36m² Island Stand" : "e.g. ⚡ 52,000 Fans / Night"}
                      value={editingProject.stats}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, stats: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {editingProject.category === "booths" ? "Fabrication & Finish Highlight" : "Supporting Metric"}
                    </label>
                    <input
                      type="text"
                      placeholder={editingProject.category === "booths" ? "e.g. Custom CNC Woodwork • Integrated LED Kiosks" : "e.g. 0.0s DMX Latency"}
                      value={editingProject.statsSub}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, statsSub: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-zinc-400 mb-1">
                    {editingProject.category === "booths"
                      ? "Booth Description & Spatial Concept"
                      : "Description & Scenography Narrative"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      editingProject.category === "booths"
                        ? "Describe the booth layout, spatial architecture, visitor journey, finishes (matte lacquer, acrylic, CNC joinery), and integrated audio-visual..."
                        : "Describe project scenography..."
                    }
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                {/* 5. MEDIA ENGINE: DYNAMIC BASED ON BOOTH VS STANDARD */}
                {editingProject.category === "booths" ? (
                  <div className="space-y-4">
                    {/* A. ATTACH IMAGES (3D Spatial Renders & Photos) */}
                    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-zinc-200 font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span>Attach Booth Images &amp; 3D Spatial Renders</span>
                        </label>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Multiple 3D perspectives, elevation sketches &amp; built photos
                        </span>
                      </div>

                      {/* Add image input row */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBoothImageUrl}
                          onChange={(e) => setNewBoothImageUrl(e.target.value)}
                          placeholder="Paste image URL (e.g. /assets/images/gallery/... or https://...)"
                          className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = newBoothImageUrl.trim();
                            if (!trimmed) return;
                            const currentImages = editingProject.images || (editingProject.image ? [editingProject.image] : []);
                            if (!currentImages.includes(trimmed)) {
                              const updated = [...currentImages, trimmed];
                              setEditingProject({
                                ...editingProject,
                                images: updated,
                                image: editingProject.image || trimmed,
                              });
                            }
                            setNewBoothImageUrl("");
                          }}
                          disabled={!newBoothImageUrl.trim()}
                          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-bold text-xs rounded-xl cursor-pointer transition-colors"
                        >
                          + Add Image
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-zinc-500 self-center mr-1">Quick Presets:</span>
                        {[
                          { label: "+ 3D Sensory Expo", url: "/assets/images/gallery/project_06_sensory_expo.jpg" },
                          { label: "+ CyberTruss Pavilion", url: "/assets/images/gallery/project_03_cybertruss.jpg" },
                          { label: "+ Blueprint Easel", url: "/assets/images/gallery/spotlight_blueprint_easel.jpg" },
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              const currentImages = editingProject.images || (editingProject.image ? [editingProject.image] : []);
                              if (!currentImages.includes(preset.url)) {
                                const updated = [...currentImages, preset.url];
                                setEditingProject({
                                  ...editingProject,
                                  images: updated,
                                  image: editingProject.image || preset.url,
                                });
                              }
                            }}
                            className="text-[10px] px-2 py-1 rounded bg-[#181826] hover:bg-[#222236] text-zinc-300 border border-[#2b2b3d] cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Images Previews Grid */}
                      {(() => {
                        const imagesList =
                          editingProject.images && editingProject.images.length > 0
                            ? editingProject.images
                            : editingProject.image
                            ? [editingProject.image]
                            : [];
                        return imagesList.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                            {imagesList.map((img, idx) => {
                              const isCover = img === editingProject.image;
                              return (
                                <div
                                  key={idx}
                                  className={`relative rounded-xl border p-1.5 bg-[#151520] flex flex-col gap-1.5 ${
                                    isCover ? "border-yellow-400 ring-1 ring-yellow-400" : "border-[#2b2b3d]"
                                  }`}
                                >
                                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Booth preview ${idx + 1}`} className="w-full h-full object-cover" />
                                    {isCover && (
                                      <span className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                                        ★ Cover
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between gap-1 text-[10px]">
                                    {!isCover ? (
                                      <button
                                        type="button"
                                        onClick={() => setEditingProject({ ...editingProject, image: img })}
                                        className="text-yellow-400 hover:underline cursor-pointer"
                                      >
                                        Set as Cover
                                      </button>
                                    ) : (
                                      <span className="text-zinc-400">Primary Cover</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = imagesList.filter((_, i) => i !== idx);
                                        const nextCover = isCover ? filtered[0] || "" : editingProject.image;
                                        setEditingProject({
                                          ...editingProject,
                                          images: filtered,
                                          image: nextCover,
                                        });
                                      }}
                                      className="text-red-400 hover:text-red-300 cursor-pointer p-0.5"
                                      title="Remove image"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-zinc-500 italic">No images attached yet.</p>
                        );
                      })()}
                    </div>

                    {/* B. ATTACH ARCHITECTURAL PDF BLUEPRINT / SPEC SHEET */}
                    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-zinc-200 font-bold flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-400" />
                          <span>Attach Architectural PDF Blueprint / Spec Sheet</span>
                        </label>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          PDF floor plans, 3D technical drawings &amp; spec sheets
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">PDF File URL or Path</label>
                          <input
                            type="text"
                            value={editingProject.pdfUrl || ""}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, pdfUrl: e.target.value })
                            }
                            placeholder="e.g. /assets/docs/booth_spec_proposal.pdf or https://..."
                            className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Document Display Title (Label)</label>
                          <input
                            type="text"
                            value={editingProject.pdfTitle || ""}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, pdfTitle: e.target.value })
                            }
                            placeholder="e.g. Architectural CAD Blueprint & 3D Spec Sheet (PDF)"
                            className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      {/* Quick PDF Preset */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              pdfUrl: "/assets/docs/booth_spec_proposal.pdf",
                              pdfTitle: `${editingProject.title || "Exhibition Booth"} — Architectural Blueprint & 3D Specs (PDF)`,
                            })
                          }
                          className="text-[10px] px-2.5 py-1 rounded bg-[#181826] hover:bg-[#222236] text-yellow-300 border border-yellow-400/30 cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-yellow-400" />
                          <span>+ Attach Sample Architectural Spec Sheet PDF</span>
                        </button>
                      </div>

                      {/* Attached PDF Preview Card */}
                      {editingProject.pdfUrl && (
                        <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center justify-between gap-3 mt-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-xs truncate">
                                {editingProject.pdfTitle || "Architectural Blueprint (PDF)"}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-mono truncate">{editingProject.pdfUrl}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={editingProject.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 text-[10px] bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg flex items-center gap-1"
                            >
                              <span>Test Link ↗</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => setEditingProject({ ...editingProject, pdfUrl: null, pdfTitle: null })}
                              className="p-1 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 cursor-pointer"
                              title="Remove PDF"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Optional YouTube Video toggle for booths */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowBoothYouTube(!showBoothYouTube)}
                        className="text-[10px] text-zinc-400 hover:text-yellow-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showBoothYouTube ? "▾ Hide" : "▸ Show"} Optional YouTube Walkthrough Video</span>
                      </button>
                    </div>

                    {showBoothYouTube && (
                      <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                        <label className="text-zinc-200 font-bold flex items-center gap-2">
                          <YouTubeIcon className="w-4 h-4 text-red-500" />
                          <span>Optional YouTube Walkthrough Link</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={editingProject.youtubeUrl || ""}
                          onChange={(e) => handleYouTubeInputChange(e.target.value)}
                          className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* STANDARD STAGE & CONFERENCES YOUTUBE ENGINE */
                  <div className="space-y-4">
                    {/* Cover & Card Thumbnail Image */}
                    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-zinc-200 font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span>Card Thumbnail &amp; Cover Image (Main Website)</span>
                        </label>
                        {editingProject.youtubeVideoId && (
                          <button
                            type="button"
                            onClick={() => {
                              const ytThumb = `https://img.youtube.com/vi/${editingProject.youtubeVideoId}/hqdefault.jpg`;
                              setEditingProject({ ...editingProject, image: ytThumb });
                              setYtStatusMessage("✓ Synced thumbnail directly from YouTube video");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-[10px] font-bold border border-yellow-400/30 cursor-pointer transition-colors"
                          >
                            Sync Thumbnail from YouTube
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-[#2b2b3d] bg-black shrink-0 relative flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingProject.image || "/assets/images/gallery/project_01_neon_horizon.jpg"}
                            alt="Project Card Thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/assets/images/gallery/project_01_neon_horizon.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 w-full space-y-1">
                          <input
                            type="text"
                            value={editingProject.image || ""}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, image: e.target.value })
                            }
                            placeholder="https://img.youtube.com/vi/... or /assets/images/..."
                            className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                          />
                          <p className="text-[10px] text-zinc-400">
                            When a YouTube video is linked, its thumbnail is automatically extracted and displayed on the card.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* YouTube Video & Reel/Shorts Engine */}
                    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-zinc-200 font-bold flex items-center gap-2">
                          <YouTubeIcon className="w-4 h-4 text-red-500" />
                          <span>YouTube Video / Reel (Shorts) Link</span>
                        </label>
                        <span className="text-[10px] text-zinc-400">
                          Supports youtube.com/watch, youtu.be, and youtube.com/shorts
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=... or https://www.youtube.com/shorts/..."
                          value={editingProject.youtubeUrl || ""}
                          onChange={(e) => handleYouTubeInputChange(e.target.value)}
                          className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                        />
                        <button
                          type="button"
                          onClick={handleFetchYouTubeMetadata}
                          disabled={!editingProject.youtubeUrl || resolvingYt}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/30 font-bold text-[11px] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                        >
                          {resolvingYt ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>Fetch Thumbnail, Headline &amp; Copy</span>
                        </button>
                      </div>

                      {ytStatusMessage && (
                        <div className="text-[11px] text-emerald-400 font-mono">{ytStatusMessage}</div>
                      )}

                      {resolvedPreview ? (
                        <div className="space-y-3 pt-2 border-t border-[#222232]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-zinc-400 mb-1">
                                Video / Reel Headline (Displayed on Website)
                              </label>
                              <input
                                type="text"
                                placeholder="Headline of the YouTube Video or Reel..."
                                value={editingProject.youtubeTitle || ""}
                                onChange={(e) =>
                                  setEditingProject({
                                    ...editingProject,
                                    youtubeTitle: e.target.value,
                                  })
                                }
                                className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400"
                              />
                            </div>

                            <div className="flex flex-col justify-between">
                              <label className="block text-[10px] text-zinc-400 mb-1">
                                Format &amp; Quick Sync
                              </label>
                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 bg-[#151520] border border-[#2b2b3d] px-2.5 py-1.5 rounded-lg cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(editingProject.isShort)}
                                    onChange={(e) =>
                                      setEditingProject({
                                        ...editingProject,
                                        isShort: e.target.checked,
                                      })
                                    }
                                    className="rounded text-yellow-400"
                                  />
                                  <Smartphone className="w-3 h-3 text-yellow-400" />
                                  <span>9:16 Vertical Reel</span>
                                </label>

                                {editingProject.youtubeTitle && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingProject({
                                        ...editingProject,
                                        title: editingProject.youtubeTitle || editingProject.title,
                                        description:
                                          editingProject.youtubeDescription ||
                                          editingProject.description,
                                      })
                                    }
                                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] border border-zinc-700 cursor-pointer"
                                  >
                                    Sync to Card Copy
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-zinc-400 mb-1">
                              Video / Reel Paragraph (Narrative Summary)
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Paragraph describing the YouTube video or Reel..."
                              value={editingProject.youtubeDescription || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  youtubeDescription: e.target.value,
                                })
                              }
                              className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400 font-sans"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>
                                  Sanitized Embed Preview (ID: {resolvedPreview.videoId})
                                </span>
                              </span>
                              <span>
                                {editingProject.isShort ? "9:16 REEL / SHORT" : "16:9 SHOWREEL"}
                              </span>
                            </div>
                            <div
                              className={`${
                                editingProject.isShort
                                  ? "aspect-[9/16] max-w-[240px] mx-auto"
                                  : "aspect-video w-full"
                              } rounded-lg overflow-hidden border border-[#262638] bg-black`}
                            >
                              <iframe
                                src={resolvedPreview.embedUrl}
                                title={editingProject.youtubeTitle || "YouTube Video Preview"}
                                className="w-full h-full"
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>
                      ) : editingProject.youtubeUrl ? (
                        <p className="text-[10px] text-amber-400/90 font-mono">
                          * Enter a valid YouTube watch, share, or shorts URL (raw &lt;iframe&gt; HTML is
                          blocked for security).
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Bottom Actions Footer */}
              <div className="px-6 py-3.5 border-t border-[#262638] bg-[#12121a] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="statusCheck"
                    checked={editingProject.status === "published"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.checked ? "published" : "draft",
                      })
                    }
                    className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="statusCheck" className="text-zinc-300 cursor-pointer select-none">
                    Publish to live /gallery view
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white border border-[#2b2b3d] hover:bg-[#20202e] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#ffffff] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Project</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
