import React from "react";
import { History, RotateCcw, Clock, User, X, Loader2 } from "lucide-react";
import type { RevisionItem } from "../types";

interface ContentRevisionsModalProps {
  isOpen: boolean;
  isLoading: boolean;
  revisions: RevisionItem[];
  rollingBackId: string | null;
  onClose: () => void;
  onRollback: (revisionId: string) => void;
}

export const ContentRevisionsModal = React.memo(function ContentRevisionsModal({
  isOpen,
  isLoading,
  revisions,
  rollingBackId,
  onClose,
  onRollback,
}: ContentRevisionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121318] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.75)]"
      >
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#16171e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Content Revision History
              </h3>
              <p className="text-xs text-zinc-400">
                Restore any previous published snapshot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-3">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading audit snapshots...</span>
            </div>
          ) : revisions.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No revisions recorded yet. Revisions are created automatically when publishing changes.
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-[#0b0c10] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 text-[11px] font-medium border border-amber-400/20">
                      {rev.sectionKey}
                    </span>
                    <span className="text-xs text-zinc-400 capitalize">
                      {rev.action}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{rev.actorEmail}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{new Date(rev.createdAt).toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRollback(rev.id)}
                  disabled={rollingBackId === rev.id || !rev.beforeState}
                  className="px-3.5 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 border border-amber-400/25 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shrink-0"
                >
                  {rollingBackId === rev.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  <span>Restore Snapshot</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
