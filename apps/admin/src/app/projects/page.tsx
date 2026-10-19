"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { ProjectRecord, ProjectCategory } from "@art-work/types";

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function getYouTubeEmbedUrl(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }
  return null;
}

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "neon-horizon",
    title: "Neon Horizon World Tour",
    stamp: "STAMP_PASS: ARENA_01",
    metaBadge: "OCT 2025",
    cadId: "CAD_ID: NH_TOUR_V4",
    image: "/assets/images/gallery/project_01_neon_horizon.jpg",
    altText: "Neon Horizon World Tour Arena Scenography and Laser Rig",
    category: "stage",
    tags: ["Stage, Sound & Lighting", "LED Screens", "Concept Creation"],
    stats: "⚡ 52,000 Fans / Night",
    statsSub: "0.0s DMX Latency • 100% Custom Rig",
    description: "A massive arena tour stage scenography bathed in canary yellow laser arrays, kinetic ceiling hoists, and curved volumetric 8K LED walls.",
    client: "Global Music Collective",
    specs: ["40m x 22m Custom Truss Grid", "180 DMX Controlled Moving Heads", "Notch Real-time Shaders"],
    status: "published",
    order: 1,
    featured: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "medtech-summit",
    title: "Global MedTech Summit 2025",
    stamp: "SUMMIT_ID: MED_25",
    metaBadge: "VENUE: GENEVA EXPO",
    cadId: "REV: PAVILION_STAGE3",
    image: "/assets/images/gallery/project_02_medtech_summit.jpg",
    altText: "Global MedTech Summit Multi-tier Interactive Conference Pavilion",
    category: "conferences",
    tags: ["Conference Management", "Event Staffing", "On-site Logistics"],
    stats: "🏥 14,000 Delegates",
    statsSub: "6 Plenary Stages • 99.8% Sync Score",
    description: "Ultra-sleek double-decker medical conference pavilion with interactive digital demo kiosks, glass railings, and precision LED strip illumination.",
    client: "World Medical Technology Forum",
    specs: ["6 Simultaneous Plenary Streams", "RFID Registration Badge Flow", "Custom Medical Demo Staging"],
    status: "published",
    order: 2,
    featured: true,
  },
  {
    id: "cybertruss-pavilion",
    title: "CyberTruss Spatial Pavilion",
    stamp: "PATENT_ARCH: EXPO_08",
    metaBadge: "FAB: CNC MILLWORK",
    cadId: "FRAME: 40m x 25m",
    image: "/assets/images/gallery/project_03_cybertruss.jpg",
    altText: "CyberTruss Trade Expo Structural Pavilion Architecture",
    category: "booths",
    tags: ["Exhibition Booth Design", "Interactive Activities", "On-site Management"],
    stats: "📐 1,000 sqm Pavilion",
    statsSub: "72h Quick Deploy • 100% Recyclable Aluminum",
    description: "Architectural exhibition booth constructed from modular custom triangular truss geometry, brushed aircraft-grade aluminum, and integrated projection mapping.",
    client: "AeroSpace Tech Corp",
    specs: ["Parametric Geometry Framework", "Dual Private Meeting Pods", "Sub-floor Wiring Matrix"],
    status: "published",
    order: 3,
    featured: true,
  },
  {
    id: "prism-merch",
    title: "Prism Brand Architecture & Merch",
    stamp: "DROP: CAPSULE_01",
    metaBadge: "LIMITED: 2,500 UNITS",
    cadId: "VECTOR: SUITE_V2",
    image: "/assets/images/gallery/project_04_prism_merch.jpg",
    altText: "Prism Brand Identity Apparel and Merch Design Suite",
    category: "branding",
    tags: ["Branding & Visual Identity", "Content Creation", "Graphic Design"],
    stats: "👕 2,500 Sold Out Units",
    statsSub: "14 Min Drop Velocity • Global Press Coverage",
    description: "Holistic visual identity, typography system, tactile stage pass badges, and embroidered oversized streetwear capsules created for an electronic music icon.",
    client: "Prism Sound Syndicate",
    specs: ["Full Typography & Guideline Deck", "Heavyweight 450GSM Organic Cotton", "High-Density Screen Printing"],
    status: "published",
    order: 4,
    featured: false,
  },
  {
    id: "arena-genesis",
    title: "Genesis Esports Arena Championship",
    stamp: "BROADCAST: 4K_HDR",
    metaBadge: "FPS: 240HZ RIG",
    cadId: "ARENA: ESPORTS_BOWL",
    image: "/assets/images/gallery/project_05_arena_genesis.jpg",
    altText: "Genesis Esports World Championship Stage Lighting and Rig",
    category: "tech",
    tags: ["Stage, Sound & Lighting", "LED Screens & Audiovisual", "On-site Management"],
    stats: "🎮 3.4M Concurrent Viewers",
    statsSub: "10 Player Soundproof Pods • 240Hz Displays",
    description: "A futuristic esports tournament colosseum featuring dynamic player telemetry LEDs, holographic trophy pedestal, and reactive team color triggers.",
    client: "Genesis League Global",
    specs: ["Direct Game Telemetry Integration", "Sub-zero Acoustic Pod Isolation", "Real-time Winner Pyro Cues"],
    status: "published",
    order: 5,
    featured: false,
  },
  {
    id: "sensory-expo",
    title: "Sensory Kinetic Expo Booth",
    stamp: "INTERACTION: SENSOR_V2",
    metaBadge: "MWC BARCELONA",
    cadId: "CUES: 880 SENSOR_TRIG",
    image: "/assets/images/gallery/project_06_sensory_expo.jpg",
    altText: "Sensory Kinetic Expo Booth with Holographic LED Mesh and Sensors",
    category: "led",
    tags: ["Exhibition Booth Design", "LED Screens & Audiovisual", "Concept Creation"],
    stats: "✨ 880 Interactive Cues",
    statsSub: "4.9/5 Visitor Rating • Viral Social Surge",
    description: "Sensorial experiential booth with holographic transparent mesh screens, motion-reactive LED light pillars, and kinetic chandeliers.",
    client: "Next-Gen Telecommunications",
    specs: ["Transparent Micro-LED Glass Walls", "LiDAR Audience Motion Sensing", "Kinetic Ceiling Matrix"],
    status: "published",
    order: 6,
    featured: false,
  },
];

export default function GalleryProjectsManager() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered list
  const filtered = projects.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesQuery =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleToggleStatus = (id: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
      )
    );
  };

  const handleMoveOrder = (id: string, direction: "up" | "down") => {
    const index = projects.findIndex((p) => p.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setProjects(updated.map((p, idx) => ({ ...p, order: idx + 1 })));
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjects(
      projects.map((p) => (p.id === editingProject.id ? editingProject : p))
    );
    setEditingProject(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Gallery Projects Manager"
        subtitle="Search, add, order, and edit showcase works published on /gallery"
        action={
          <button
            onClick={() => {
              const newId = `project-${Date.now()}`;
              setEditingProject({
                id: newId,
                title: "New Architectural Stage",
                stamp: "STAMP_PASS: NEW_01",
                metaBadge: "2026",
                cadId: "CAD_ID: STAGE_NEW",
                image: "/assets/images/gallery/spotlight_blueprint_easel.jpg",
                altText: "New Stage Scenography",
                category: "stage",
                tags: ["Stage Design", "Creative Direction"],
                stats: "⚡ 50,000 Fans",
                statsSub: "Custom Arena Rig",
                description: "Describe the spatial scenography, lighting cues, and creative execution.",
                client: "Live Entertainment Global",
                specs: ["30m Truss Frame", "DMX Lighting Matrix"],
                status: "draft",
                order: projects.length + 1,
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
            {(["all", "stage", "conferences", "booths", "branding", "tech", "led"] as ProjectCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg uppercase transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-yellow-400 text-black font-bold"
                      : "text-zinc-400 hover:text-white bg-[#0d0d12] border border-[#262638]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Projects List / Table Overview */}
        <div className="rounded-2xl bg-[#151520] border border-[#262638] overflow-hidden">
          <div className="p-4 border-b border-[#262638] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>SHOWING {filtered.length} OF {projects.length} PROJECTS</span>
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
                      <h4 className="text-sm font-bold text-white tracking-tight">{project.title}</h4>
                      <span className="text-[10px] font-mono uppercase bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/20">
                        {project.category}
                      </span>
                      {project.youtubeUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">
                          <YouTubeIcon className="w-3 h-3 text-red-500" />
                          <span>YouTube Embedded</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span>{project.client}</span>
                      <span>•</span>
                      <span>{project.stats}</span>
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
                    onClick={() => setEditingProject(project)}
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
                <h3 className="text-base font-bold text-white uppercase font-mono">Confirm Project Deletion</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to delete this project record? This will permanently remove it from both the gallery grid and the interactive modal viewer.
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#151520] border border-[#262638] rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {editingProject.id.startsWith("project-") ? "New Showcase Project" : "Edit Project Record"}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#20202e] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Project Display Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={editingProject.client}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value as ProjectRecord["category"] })
                      }
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
                    <label className="block text-zinc-400 mb-1">Stamp Pass Label</label>
                    <input
                      type="text"
                      value={editingProject.stamp}
                      onChange={(e) => setEditingProject({ ...editingProject, stamp: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">CAD Blueprint ID</label>
                    <input
                      type="text"
                      value={editingProject.cadId}
                      onChange={(e) => setEditingProject({ ...editingProject, cadId: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Primary Stat</label>
                    <input
                      type="text"
                      value={editingProject.stats}
                      onChange={(e) => setEditingProject({ ...editingProject, stats: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Supporting Metric</label>
                    <input
                      type="text"
                      value={editingProject.statsSub}
                      onChange={(e) => setEditingProject({ ...editingProject, statsSub: e.target.value })}
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Description & Scenography Narrative</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                {/* YouTube Video Embed & Channel Stream */}
                <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-bold flex items-center gap-2">
                      <YouTubeIcon className="w-4 h-4 text-red-500" />
                      <span>YouTube Channel / Video Embed Link</span>
                    </label>
                    <span className="text-[10px] text-zinc-500">Supports watch link, youtu.be, or &lt;iframe&gt; code</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or <iframe src='...'></iframe>"
                    value={editingProject.youtubeUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, youtubeUrl: e.target.value })
                    }
                    className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                  />
                  {getYouTubeEmbedUrl(editingProject.youtubeUrl) ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Live Embed Stream Preview</span>
                      </div>
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#262638] bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(editingProject.youtubeUrl)!}
                          title="YouTube Video Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : editingProject.youtubeUrl ? (
                    <p className="text-[10px] text-amber-400/80 font-mono">
                      * Paste a valid YouTube video URL or iframe embed snippet to activate preview.
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#262638]">
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
                      className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0"
                    />
                    <label htmlFor="statusCheck" className="text-zinc-300">
                      Publish to live /gallery view
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white border border-[#2b2b3d] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Project</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
