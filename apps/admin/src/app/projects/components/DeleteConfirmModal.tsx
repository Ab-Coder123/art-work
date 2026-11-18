import React from "react";
import { AlertTriangle } from "lucide-react";

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
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-[#20202e] border border-[#2b2b3d] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
