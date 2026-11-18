import React from "react";
import { AlertTriangle, X } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121318] border border-rose-500/30 rounded-2xl max-w-md w-full overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.75)]"
      >
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#16171e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">
              Confirm Project Deletion
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-zinc-300 leading-relaxed">
            Are you sure you want to delete this project record? This will permanently
            remove it from both the gallery grid and the website showcase.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#16171e] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
