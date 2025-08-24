"use client";
import { X } from "lucide-react";
import React from "react";

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm mx-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold tracking-wide">{title}</h3>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </div>
        <div className="text-sm text-zinc-300 mb-4">{message}</div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 text-sm rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 text-sm rounded-md text-rose-100 border border-rose-300/30 bg-rose-500/20 hover:bg-rose-500/30"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
