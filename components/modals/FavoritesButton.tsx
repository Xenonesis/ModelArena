"use client";
import { useState } from 'react';
import { Star } from "lucide-react";
import FavoritesModal from "@/components/modals/FavoritesModal";

type FavoritesButtonProps = {
  compact?: boolean;
};

export default function FavoritesButton({ compact }: FavoritesButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (compact) {
    return (
      <>
        <button
          onClick={handleOpen}
          className="group inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
          title="Manage Favorites"
          aria-label="Manage Favorites"
        >
          <Star size={14} className="transition-transform duration-200 group-hover:scale-110 text-yellow-400" />
        </button>
        <FavoritesModal open={open} onClose={handleClose} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="group inline-flex items-center gap-2 text-xs h-9 px-3 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
        title="Manage Favorites"
        aria-label="Manage Favorites"
      >
        <Star size={14} className="transition-transform duration-200 group-hover:scale-110 text-yellow-400" />
        <span className="font-medium text-white/90">Favorites</span>
      </button>
      <FavoritesModal open={open} onClose={handleClose} />
    </>
  );
}