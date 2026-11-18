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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#151520] border-2 border-[#2b2b3d] rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#2b2b3d]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-yellow-400" />
            <h3 className="font-mono font-bold text-sm text-white uppercase">
              Content Revision History &amp; Rollback
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-lg bg-[#222234] hover:bg-yellow-400 hover:text-black text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2 font-mono text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
            <span>Loading PostgreSQL audit logs...</span>
          </div>
        ) : revisions.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 font-mono text-xs">
            No revisions recorded yet. Revisions are created automatically upon saving changes.
          </div>
        ) : (
          <div className="space-y-3">
            {revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl bg-[#0e0e16] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-mono text-[10px] uppercase font-bold border border-yellow-400/20">
                      {rev.sectionKey}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      Action: {rev.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>{rev.actorEmail}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{new Date(rev.createdAt).toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRollback(rev.id)}
                  disabled={rollingBackId === rev.id || !rev.beforeState}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-black border border-yellow-400/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shrink-0"
                >
                  {rollingBackId === rev.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3 h-3" />
                  )}
                  <span>Restore Snapshot</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
