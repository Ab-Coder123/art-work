import { useState, useEffect, useCallback } from "react";
import type { BilingualSiteContent, Locale, SiteContent } from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import { DEFAULT_SITE_CONTENT_AR } from "@art-work/database/content/default-content-ar";
import { normalizeSiteContent } from "@art-work/database/content/contract";
import type { EditorSectionKey, RevisionItem, UpdateSectionFn } from "../types";

export function useContentEditor() {
  const [editingLocale, setEditingLocale] = useState<Locale>("en");
  const [contentByLocale, setContentByLocale] = useState<BilingualSiteContent>(() => ({
    en: normalizeSiteContent(DEFAULT_SITE_CONTENT, "en"),
    ar: normalizeSiteContent(DEFAULT_SITE_CONTENT_AR, "ar"),
  }));
  const [activeSection, setActiveSection] = useState<EditorSectionKey>("manifesto");
  const [isSaved, setIsSaved] = useState(false);
  const [dirtyByLocale, setDirtyByLocale] = useState<{ en: boolean; ar: boolean }>({
    en: false,
    ar: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Revision History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const loadContentFromApi = useCallback(async (): Promise<BilingualSiteContent> => {
    const res = await fetch("/api/content?includeLocales=true", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && typeof data === "object" && ("en" in data || "ar" in data)) {
      return {
        en: normalizeSiteContent(data.en ?? DEFAULT_SITE_CONTENT, "en"),
        ar: normalizeSiteContent(data.ar ?? DEFAULT_SITE_CONTENT_AR, "ar"),
      };
    }
    return {
      en: normalizeSiteContent(data, "en"),
      ar: normalizeSiteContent(DEFAULT_SITE_CONTENT_AR, "ar"),
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const normalized = await loadContentFromApi();
        if (!mounted) return;
        setContentByLocale(normalized);
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
      setContentByLocale(normalized);
      setDirtyByLocale({ en: false, ar: false });
    } catch (err) {
      console.error("Failed to refresh content:", err);
    }
  }, [loadContentFromApi]);

  const updateSection: UpdateSectionFn = useCallback(
    (section, updater) => {
      setContentByLocale((prev) => ({
        ...prev,
        [editingLocale]: {
          ...prev[editingLocale],
          [section]: updater(prev[editingLocale][section]),
        },
      }));
      setDirtyByLocale((prev) => ({ ...prev, [editingLocale]: true }));
      setIsSaved(false);
    },
    [editingLocale]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const payload = contentByLocale[editingLocale][activeSection];

    try {
      const res = await apiFetchWithCsrf(`/api/content/${activeSection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: editingLocale,
          data: payload,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      setIsSaved(true);
      setDirtyByLocale((prev) => ({ ...prev, [editingLocale]: false }));
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish changes";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  }, [contentByLocale, editingLocale, activeSection]);

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

  const content: SiteContent = contentByLocale[editingLocale];
  const isDirty = dirtyByLocale[editingLocale];

  return {
    content,
    contentByLocale,
    editingLocale,
    setEditingLocale,
    dirtyByLocale,
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
