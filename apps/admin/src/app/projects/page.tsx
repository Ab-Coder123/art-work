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
  Sparkles,
  Loader2,
  Smartphone,
} from "lucide-react";
import {
  ProjectRecord,
  ProjectCategory,
  resolveSafeYouTubeEmbed,
} from "@art-work/types";
import { AUTH_COOKIES, CSRF_HEADER_NAME } from "@art-work/database/edge";

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIES.CSRF_TOKEN}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
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
    tags: ["Stage, Sound & Lighting", "LED Screens & Audiovisual", "Concept Creation"],
    stats: "⚡ 52,000 Fans / Night",
    statsSub: "0.0s DMX Latency • 100% Custom Rig",
    description:
      "A massive arena tour stage scenography bathed in canary yellow laser arrays, kinetic ceiling hoists, and curved volumetric 8K LED walls.",
    client: "Global Music Collective",
    specs: [
      "40m x 22m Custom Truss Grid",
      "180 DMX Controlled Moving Heads",
      "Notch Real-time Audio-Reactive Shaders",
      "SMPTE Timecode Precision Sync",
    ],
    status: "published",
    order: 1,
    featured: true,
    youtubeVideoId: "dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeTitle: "Neon Horizon Arena Stage — Live Timecode Showreel (4K)",
    youtubeDescription:
      "Full arena rehearsal capture showcasing the 40m parametric truss rig, 180 moving heads, and zero-latency SMPTE timecode laser synchronization.",
    isShort: false,
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
    tags: [
      "Conference & Medical Event Management",
      "Registration & Event Staffing",
      "On-site Logistics",
    ],
    stats: "🏥 14,000 Delegates",
    statsSub: "6 Plenary Stages • 99.8% Sync Score",
    description:
      "Ultra-sleek double-decker medical conference pavilion with interactive digital demo kiosks, glass railings, and precision LED strip illumination.",
    client: "World Medical Technology Forum",
    specs: [
      "6 Simultaneous Plenary Streams",
      "Full RFID Registration Badge Flow",
      "45 Multilingual Host Team",
      "Custom Medical Demo Staging",
    ],
    status: "published",
    order: 2,
    featured: true,
    youtubeVideoId: "aqz-KE-bpKQ",
    youtubeUrl: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
    youtubeTitle: "60-Second Behind-The-Scenes Reel: Geneva MedTech Pavilion Build",
    youtubeDescription:
      "Vertical 9:16 time-lapse Reel capturing our 72-hour rapid structural build and interactive kiosk calibration in Geneva.",
    isShort: true,
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
    tags: [
      "Exhibition Booth Design & Production",
      "Interactive Activities & Engagement",
      "On-site Management",
    ],
    stats: "📐 1,200 m² Footprint",
    statsSub: "72-Hour Rapid Build • German Spec Steel",
    description:
      "Grand geometric trade expo pavilion built from heavy industrial stage trusses, cantilevered VIP mezzanine lounge, and volumetric lighting.",
    client: "Industrial Tech Conglomerate",
    specs: [
      "German-Spec CNC Steel Beams",
      "Cantilevered VIP Hospitality Deck",
      "Interactive Floor Tracking Projections",
      "Full Fire & Wind Safety Compliance",
    ],
    status: "published",
    order: 3,
    featured: true,
  },
  {
    id: "prism-brand-suite",
    title: "Prism Brand Identity & Merch",
    stamp: "SYSTEM_SYS: ID_99",
    metaBadge: "BATCH: LIMITED EDITION",
    cadId: "PANTONE: #FACC15",
    image: "/assets/images/gallery/project_04_prism_merch.jpg",
    altText: "Prism Brand Merch Suite and VIP Credential System",
    category: "branding",
    tags: [
      "Branding, Printing & Event Branding",
      "Promotional Giveaways & Merchandise",
    ],
    stats: "🎨 35 Custom Swatches",
    statsSub: "20k Screenprints • Pantone Canary Yellow",
    description:
      "Tactile event branding system: matte black foil-stamped VIP laminate passes, woven canary yellow lanyards, screenprinted hoodies, and signage.",
    client: "Creative Arts Festival",
    specs: [
      "Embossed Foil Laminate VIP Badges",
      "Heavy-Duty Custom Woven Lanyards",
      "Screenprinted Organic Cotton Merch",
      "Wayfinding Architectural Signage",
    ],
    status: "published",
    order: 4,
    featured: false,
  },
  {
    id: "arena-genesis",
    title: "Arena Genesis Live Broadcast",
    stamp: "BROADCAST: 4K_60FPS",
    metaBadge: "GLOBAL SYNC",
    cadId: "LATENCY: 1.2MS",
    image: "/assets/images/gallery/project_05_arena_genesis.jpg",
    altText: "Arena Genesis Multi-camera Broadcast Arena and Anamorphic Stage",
    category: "tech",
    tags: [
      "Photography & Videography",
      "Stage, Sound & Lighting",
      "Event Planning & Project Management",
    ],
    stats: "🎥 18 Ultra-HD Cameras",
    statsSub: "1.4M Stream Peak • Zero Dropped Frames",
    description:
      "Multi-camera broadcast production studio and stadium stage with anamorphic 3D LED screens and automated robotic spotlight rigs.",
    client: "Global Esports Arena",
    specs: [
      "18 4K HDR Broadcast Cameras",
      "Robotic Jib & Wire-Cam Tracking",
      "Instant Multi-Angle Replay Servers",
      "Worldwide Satellite Relay Sync",
    ],
    status: "published",
    order: 5,
    featured: true,
    youtubeVideoId: "M7lc1UVf-VE",
    youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    youtubeTitle: "Arena Genesis Esports Finals — Multi-Cam Broadcast Highlights",
    youtubeDescription:
      "Anamorphic 3D LED stage reveal and robotic wire-cam tracking during the live Championship opening ceremony.",
    isShort: false,
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
    tags: [
      "Exhibition Booth Design",
      "LED Screens & Audiovisual",
      "Concept Creation & Creative Development",
    ],
    stats: "✨ 880 Interactive Cues",
    statsSub: "4.9/5 Visitor Rating • Viral Social Surge",
    description:
      "Sensorial experiential booth with holographic transparent mesh screens, motion-reactive LED light pillars, and kinetic chandeliers.",
    client: "Next-Gen Telecommunications",
    specs: [
      "Transparent Micro-LED Glass Walls",
      "LiDAR Audience Motion Sensing",
      "Kinetic Ceiling Lighting Matrix",
      "Spatial Surround Sound Arrays",
    ],
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
  const [resolvingYt, setResolvingYt] = useState(false);
  const [ytStatusMessage, setYtStatusMessage] = useState<string | null>(null);

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

  const handleYouTubeInputChange = (rawInput: string) => {
    if (!editingProject) return;
    setYtStatusMessage(null);
    const resolved = resolveSafeYouTubeEmbed(rawInput);
    if (resolved) {
      setEditingProject({
        ...editingProject,
        youtubeUrl: rawInput,
        youtubeVideoId: resolved.videoId,
        isShort: resolved.isShort,
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
      let csrf = readCsrfCookie();
      if (!csrf) {
        const csrfRes = await fetch("/api/auth/csrf");
        if (csrfRes.ok) {
          const data = await csrfRes.json();
          csrf = data.csrfToken;
        }
      }

      const res = await fetch("/api/media/youtube/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrf ? { [CSRF_HEADER_NAME]: csrf } : {}),
        },
        body: JSON.stringify({
          input: editingProject.youtubeUrl,
          fetchMetadata: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
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
              }
            : null
        );
        setYtStatusMessage("✓ Extracted video headline & paragraph from YouTube");
      } else {
        const parsed = resolveSafeYouTubeEmbed(editingProject.youtubeUrl);
        if (parsed) {
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
                }
              : null
          );
          setYtStatusMessage("✓ Validated YouTube ID & populated default metadata");
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const exists = projects.some((p) => p.id === editingProject.id);
    if (exists) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));
    } else {
      setProjects([...projects, editingProject]);
    }
    setEditingProject(null);
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#151520] border border-[#262638] rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {editingProject.id.startsWith("project-")
                    ? "New Showcase Project"
                    : "Edit Project Record"}
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
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={editingProject.client}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, client: e.target.value })
                      }
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
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as ProjectRecord["category"],
                        })
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
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, stamp: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">CAD Blueprint ID</label>
                    <input
                      type="text"
                      value={editingProject.cadId}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, cadId: e.target.value })
                      }
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
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, stats: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Supporting Metric</label>
                    <input
                      type="text"
                      value={editingProject.statsSub}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, statsSub: e.target.value })
                      }
                      className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">
                    Description & Scenography Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                {/* YouTube Video & Reel/Shorts Engine (Safe ID & Headline/Paragraph Extractor) */}
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
                      <span>Fetch Headline &amp; Paragraph</span>
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
