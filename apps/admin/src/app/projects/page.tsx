"use client";

import React from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Plus,
  Search,
  AlertTriangle,
  X,
  Star,
} from "lucide-react";
import { ProjectCategory } from "@art-work/types";
import { useProjectsManager } from "./hooks/useProjectsManager";
import { ProjectsTable } from "./components/ProjectsTable";
import { ProjectFormModal } from "./components/ProjectFormModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

export default function GalleryProjectsManager() {
  const {
    projects,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    showHomeStarredOnly,
    setShowHomeStarredOnly,
    editingProject,
    isCreatingNew,
    deleteConfirmId,
    setDeleteConfirmId,
    notification,
    setNotification,
    modalError,
    setModalError,
    isSaving,
    homeStarredCount,
    homeStarredVideosCount,
    filtered,
    handleToggleFeatured,
    handleToggleStatus,
    handleMoveOrder,
    handleSetOrder,
    handleDelete,
    openNewProjectModal,
    openEditProjectModal,
    closeModal,
    handleSaveProject,
  } = useProjectsManager();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Gallery Projects Manager"
        subtitle="Search, add, order, and edit showcase works published on /gallery"
        action={
          <button
            onClick={openNewProjectModal}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Project</span>
          </button>
        }
      />

      <main className="p-8 max-w-6xl space-y-6">
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-all ${
              notification.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                : notification.type === "error"
                ? "bg-rose-950/70 border-rose-500/50 text-rose-200"
                : "bg-amber-950/70 border-amber-500/50 text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
              ) : (
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    notification.type === "error" ? "text-rose-400" : "text-amber-400"
                  }`}
                />
              )}
              <div>
                <h4 className="font-bold text-sm tracking-tight">{notification.title}</h4>
                {notification.detail && (
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed font-sans">
                    {notification.detail}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-zinc-400 hover:text-white cursor-pointer text-sm shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ★ Home Featured Videos & Showcase Status Bar */}
        <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#ffffff]">
              <Star className="w-4 h-4 fill-black text-black" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono uppercase text-yellow-400">
                ★ Home Page Video &amp; Showcase Control ({homeStarredVideosCount} Starred Video
                {homeStarredVideosCount === 1 ? "" : "s"} • {homeStarredCount} Total Starred)
              </div>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                Click <strong>★ On Home</strong> on any YouTube video or project below to feature or swap it on the Home page. Star multiple videos to show a video switcher &amp; playable cards on Home! Use ↑↓ arrows to set #1 priority.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHomeStarredOnly(!showHomeStarredOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
              showHomeStarredOnly
                ? "bg-yellow-400 text-black border-yellow-300"
                : "bg-[#151520] text-yellow-400 border-yellow-400/40 hover:bg-yellow-400/20"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showHomeStarredOnly ? "fill-black" : "fill-yellow-400"}`} />
            <span>{showHomeStarredOnly ? "Showing ★ Home Only" : `Filter ★ Home (${homeStarredCount})`}</span>
          </button>
        </div>

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
            {[
              { key: "all", label: "ALL" },
              { key: "conferences", label: "CONFERENCES & MEDICAL" },
              { key: "booths", label: "EXHIBITION & BOOTHS" },
              { key: "branding", label: "BRANDING & PRINT & GIVEAWAYS" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as ProjectCategory)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-yellow-400 text-black font-bold"
                    : "text-zinc-400 hover:text-white bg-[#0d0d12] border border-[#262638]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modular Projects Table */}
        <ProjectsTable
          projects={filtered}
          totalCount={projects.length}
          onSetOrder={handleSetOrder}
          onMoveOrder={handleMoveOrder}
          onToggleFeatured={handleToggleFeatured}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditProjectModal}
          onDeleteRequest={(id) => setDeleteConfirmId(id)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={Boolean(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        />

        {/* Modular Project Edit / Create Modal */}
        {editingProject && (
          <ProjectFormModal
            project={editingProject}
            isCreatingNew={isCreatingNew}
            isSaving={isSaving}
            modalError={modalError}
            onClose={closeModal}
            onSave={handleSaveProject}
            setModalError={setModalError}
          />
        )}
      </main>
    </div>
  );
}
