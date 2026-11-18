import { useState, useEffect, useMemo, useCallback } from "react";
import { ProjectRecord, ProjectCategory } from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { AdminNotification, humanizeAdminError, INITIAL_PROJECTS } from "../types";

export function useProjectsManager() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [showHomeStarredOnly, setShowHomeStarredOnly] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<AdminNotification | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial project list from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects?limit=500", { cache: "no-store" });
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

  const homeStarredCount = useMemo(
    () => projects.filter((p) => Boolean(p.featured)).length,
    [projects]
  );

  const homeStarredVideosCount = useMemo(
    () =>
      projects.filter(
        (p) => Boolean(p.featured) && Boolean(p.youtubeVideoId || p.youtubeUrl)
      ).length,
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesStar = !showHomeStarredOnly || Boolean(p.featured);
      const matchesCat = activeCategory === "all" || p.category === activeCategory;
      const matchesQuery =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStar && matchesCat && matchesQuery;
    });
  }, [projects, showHomeStarredOnly, activeCategory, searchQuery]);

  // 1-Click ★ Star Home Video Toggle Dispatcher
  const handleToggleFeatured = useCallback(async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const nextFeatured = !Boolean(target.featured);
    const shouldAutoPublish = nextFeatured && target.status !== "published";

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              featured: nextFeatured,
              status: shouldAutoPublish ? "published" : p.status,
            }
          : p
      )
    );

    try {
      const res = shouldAutoPublish
        ? await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...target,
              featured: true,
              status: "published",
            }),
          })
        : await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ featured: nextFeatured }),
          });

      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? data.project : p))
          );
        }
        setNotification({
          type: "success",
          title: nextFeatured
            ? "★ تمت إضافة الفيديو / المشروع للصفحة الرئيسية (Home)"
            : "تم إزالة المشروع من الصفحة الرئيسية (Home)",
          detail: nextFeatured
            ? `سيظهر "${target.title}" الآن في قسم الفيديو والمشاريع المختارة في الصفحة الرئيسية.`
            : `سيظل "${target.title}" متاحاً في معرض الأعمال الكامل (/gallery).`,
        });
      }
    } catch {
      // Optimistic state kept locally
    }
  }, [projects]);

  const handleToggleStatus = useCallback(async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const nextStatus = target.status === "published" ? "draft" : "published";

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );

    try {
      const res = await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? data.project : p))
          );
          setNotification({
            type: "success",
            title: "تم تحديث حالة العرض بنجاح",
            detail: `تم تغيير حالة المشروع إلى "${nextStatus.toUpperCase()}" بنجاح في قاعدة البيانات.`,
          });
        }
      }
    } catch {
      // Optimistic state kept locally
    }
  }, [projects]);

  const handleMoveOrder = useCallback(async (id: string, direction: "up" | "down") => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
      if (res.ok) {
        setNotification({
          type: "success",
          title: "تم حفظ ترتيب عرض المشاريع بنجاح",
          detail: "تم تحديث ترتيب ظهور الكروت في معرض المشاريع على الموقع.",
        });
      }
    } catch {
      // Optimistic state kept locally
    }
  }, [projects]);

  const handleDelete = useCallback(async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);

    try {
      const res = await apiFetchWithCsrf(`/api/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification({
          type: "success",
          title: "تم حذف المشروع بنجاح",
          detail: "تم مسح بيانات المشروع من قاعدة بيانات الاستوديو نهائياً.",
        });
      }
    } catch {
      // Optimistic state kept locally
    }
  }, []);

  const openNewProjectModal = useCallback(() => {
    const newId = `project-${Date.now()}`;
    setModalError(null);
    setIsCreatingNew(true);
    setEditingProject({
      id: newId,
      slug: newId,
      title: "New Architectural Stage",
      stamp: "2026",
      metaBadge: "2026",
      cadId: "",
      image: "/assets/images/gallery/project_01_neon_horizon.jpg",
      altText: "New Stage Scenography",
      category: "conferences",
      year: new Date().getFullYear(),
      tags: ["Stage Design", "Creative Direction"],
      stats: "",
      statsSub: "",
      description:
        "Describe the spatial scenography, lighting cues, and creative execution.",
      client: "Live Entertainment Global",
      specs: ["30m Truss Frame", "DMX Lighting Matrix"],
      status: "draft",
      featured: false,
      order: projects.length + 1,
      isShort: false,
    });
  }, [projects.length]);

  const openEditProjectModal = useCallback((project: ProjectRecord) => {
    setModalError(null);
    setIsCreatingNew(false);
    setEditingProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setEditingProject(null);
    setIsCreatingNew(false);
    setModalError(null);
  }, []);

  const handleSaveProject = useCallback(async (projectToSave: ProjectRecord) => {
    if (isSaving) return;
    setModalError(null);

    // Client-side pre-validation with clear humanized errors
    if (!projectToSave.title || projectToSave.title.trim().length < 2) {
      const err = humanizeAdminError("title must be at least 2 characters");
      setModalError(`${err.title}: ${err.detail}`);
      return;
    }
    if (!projectToSave.client || projectToSave.client.trim().length < 2) {
      const err = humanizeAdminError("client name is required");
      setModalError(`${err.title}: ${err.detail}`);
      return;
    }
    if (!projectToSave.description || projectToSave.description.trim().length < 10) {
      const err = humanizeAdminError("description must be at least 10 characters");
      setModalError(`${err.title}: ${err.detail}`);
      return;
    }

    setIsSaving(true);
    setNotification(null);

    const exists = !isCreatingNew && projects.some((p) => p.id === projectToSave.id);

    const recordWithDefaults: ProjectRecord = {
      ...projectToSave,
      stamp: projectToSave.stamp || String(projectToSave.year || 2026),
      cadId: projectToSave.cadId || "CAD-REV-01",
      stats: projectToSave.stats || "",
      statsSub: projectToSave.statsSub || "",
    };

    try {
      const endpoint = exists
        ? `/api/projects/${encodeURIComponent(projectToSave.id)}`
        : "/api/projects";
      const method = exists ? "PUT" : "POST";

      const res = await apiFetchWithCsrf(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordWithDefaults),
      });

      if (res.ok) {
        const data = await res.json();
        const saved: ProjectRecord = data.project || recordWithDefaults;
        setProjects((prev) =>
          exists
            ? prev.map((p) => (p.id === projectToSave.id ? saved : p))
            : [...prev, saved]
        );
        setNotification({
          type: "success",
          title: exists ? "تم تحديث المشروع بنجاح" : "تم إنشاء المشروع الجديد بنجاح",
          detail: `تم حفظ ومزامنة بيانات "${saved.title}" بنجاح في قاعدة البيانات.`,
        });
        closeModal();
      } else {
        const errData = await res.json().catch(() => ({}));
        const rawErr = errData.error || "Failed to save project";
        const friendly = humanizeAdminError(rawErr);
        setModalError(`${friendly.title}: ${friendly.detail}`);
        setNotification({
          type: "error",
          title: friendly.title,
          detail: friendly.detail,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      const friendly = humanizeAdminError(msg);
      setModalError(`${friendly.title}: ${friendly.detail}`);
      setNotification({
        type: "warning",
        title: "تم الحفظ في ذاكرة الجلسة المحلية",
        detail: "تعذر الاتصال بالسيرفر، تم حفظ التعديل محلياً مؤقتاً.",
      });
      if (exists) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectToSave.id ? recordWithDefaults : p))
        );
      } else {
        setProjects((prev) => [...prev, recordWithDefaults]);
      }
      closeModal();
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, isCreatingNew, projects, closeModal]);

  return {
    projects,
    setProjects,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    showHomeStarredOnly,
    setShowHomeStarredOnly,
    editingProject,
    setEditingProject,
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
    handleDelete,
    openNewProjectModal,
    openEditProjectModal,
    closeModal,
    handleSaveProject,
  };
}
