import { useState, useEffect, useCallback } from "react";
import type { SiteContent } from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import { normalizeSiteContent } from "@art-work/database/content/contract";
import type { EditorSectionKey, RevisionItem, UpdateSectionFn } from "../types";

export function useContentEditor() {
  const [content, setContent] = useState<SiteContent>(() =>
    normalizeSiteContent(DEFAULT_SITE_CONTENT)
  );
  const [activeSection, setActiveSection] = useState<EditorSectionKey>("manifesto");
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Revision History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const loadContentFromApi = useCallback(async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeSiteContent(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const normalized = await loadContentFromApi();
        if (!mounted) return;
        setContent(normalized);
      } catch (err) {
        console.error("Failed to load content:", err);
        if (mounted) {
          setErrorMessage(
            "Could not connect to live content API. Showing cached defaults."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadContentFromApi]);

  const refreshContent = useCallback(async () => {
    try {
      const normalized = await loadContentFromApi();
      setContent(normalized);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to refresh content:", err);
    }
  }, [loadContentFromApi]);

  const updateSection: UpdateSectionFn = useCallback((section, updater) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }));
    setIsDirty(true);
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const payload = content[activeSection];

    try {
      const res = await apiFetchWithCsrf(`/api/content/${activeSection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      setIsSaved(true);
      setIsDirty(false);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish changes";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  }, [content, activeSection]);

  const handleOpenHistory = useCallback(async () => {
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/content/history?limit=30");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRevisions(data.revisions || []);
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const handleRollback = useCallback(
    async (revisionId: string) => {
      if (!confirm("Are you sure you want to rollback to this snapshot?")) return;
      setRollingBackId(revisionId);
      try {
        const res = await apiFetchWithCsrf(`/api/content/rollback/${revisionId}`, {
          method: "POST",
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `HTTP ${res.status}`);
        }

        await refreshContent();
        setIsHistoryOpen(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Rollback failed";
        alert(msg);
      } finally {
        setRollingBackId(null);
      }
    },
    [refreshContent]
  );

  return {
    content,
    activeSection,
    setActiveSection,
    isSaved,
    isDirty,
    isLoading,
    isSaving,
    errorMessage,
    isHistoryOpen,
    setIsHistoryOpen,
    revisions,
    isLoadingHistory,
    rollingBackId,
    updateSection,
    handleSave,
    handleOpenHistory,
    handleRollback,
  };
}
