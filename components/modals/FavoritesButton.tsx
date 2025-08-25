"use client";
import { useState } from 'react';
import { Star, Sparkles } from "lucide-react";
import FavoritesModal from "@/components/modals/FavoritesModal";
import { useFavorites } from "@/lib/useFavorites";

type FavoritesButtonProps = {
  compact?: boolean;
};

export default function FavoritesButton({ compact }: FavoritesButtonProps) {
  const [open, setOpen] = useState(false);
  const { favoriteIds } = useFavorites();
  const favoritesCount = favoriteIds.length;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (compact) {
    return (
      <>
        <button
          onClick={handleOpen}
          className="group relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 hover:border-white/30 shadow-lg hover:shadow-xl accent-focus transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm"
          title={`Manage Favorites (${favoritesCount})`}
          aria-label={`Manage Favorites (${favoritesCount})`}
        >
          <div className="relative">
            <Star 
              size={16} 
              className="transition-all duration-300 group-hover:scale-110 text-yellow-400 group-hover:text-yellow-300" 
              fill={favoritesCount > 0 ? "currentColor" : "none"}
            />
            {favoritesCount > 0 && (
              <>
                {/* Count Badge */}
                <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-yellow-400/50 shadow-lg">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse" />
              </>
            )}
          </div>
          {/* Sparkle Animation */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles size={8} className="text-yellow-300 animate-pulse" />
          </div>
        </button>
        <FavoritesModal open={open} onClose={handleClose} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="group relative inline-flex items-center gap-3 text-sm h-10 px-5 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 hover:border-white/30 shadow-lg hover:shadow-xl accent-focus transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm"
        title={`Manage Favorites (${favoritesCount})`}
        aria-label={`Manage Favorites (${favoritesCount})`}
      >
        <div className="relative">
          <Star 
            size={16} 
            className="transition-all duration-300 group-hover:scale-110 text-yellow-400 group-hover:text-yellow-300" 
            fill={favoritesCount > 0 ? "currentColor" : "none"}
          />
          {favoritesCount > 0 && (
            <>
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse" />
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-white/90 group-hover:text-white transition-colors">Favorites</span>
          {favoritesCount > 0 && (
            <div className="min-w-[20px] h-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-yellow-400/50 shadow-md group-hover:scale-110 transition-transform">
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </div>
          )}
        </div>
        
        {/* Sparkle Animation */}
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles size={10} className="text-yellow-300 animate-pulse" />
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      <FavoritesModal open={open} onClose={handleClose} />
    </>
  );
}