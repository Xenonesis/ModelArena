"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import type { AiModel } from "@/lib/types";
import { MODEL_CATALOG } from "@/lib/models";
import { useFavorites } from "@/lib/useFavorites";

export type ModelsModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  selectedModels: AiModel[];
  customModels: AiModel[];
  onToggle: (id: string) => void;
};

export default function ModelsModal({
  open,
  onClose,
  selectedIds,
  selectedModels,
  customModels,
  onToggle,
}: ModelsModalProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Lock background scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open]);

  if (!open) return null;

  const buckets: Record<string, AiModel[]> = {
    Favorites: [],
    Uncensored: [],
    Free: [],
    Good: [],
    Others: [],
  };
  const seen = new Set<string>();
  const isFree = (m: AiModel) => {
    const maybe = m as Partial<{ free: boolean }>;
    return /(\(|\s)free\)/i.test(m.label) || !!maybe.free;
  };
  const isUnc = (m: AiModel) =>
    /uncensored/i.test(m.label) || /venice/i.test(m.model);
  
  const isModelFavorite = (m: AiModel) => isFavorite(m.id);
  
  const pick = (m: AiModel) => {
    if (isModelFavorite(m)) return "Favorites";
    if (isUnc(m)) return "Uncensored";
    if (isFree(m)) return "Free";
    if (m.good) return "Good";
    return "Others";
  };

  MODEL_CATALOG.forEach((m) => {
    const key = pick(m as AiModel);
    if (!seen.has(m.id)) {
      buckets[key].push(m as AiModel);
      seen.add(m.id);
    }
  });

  const Section = ({
    title,
    models,
    showBadges = true,
  }: {
    title: string;
    models: AiModel[];
    showBadges?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="text-sm md:text-base font-semibold uppercase tracking-wide text-zinc-200">
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {models.map((m) => {
          const free = isFree(m);
          const unc = isUnc(m);
          const selected = selectedIds.includes(m.id);
          const favorite = isModelFavorite(m);
          const disabled = false; // Remove 5-model limit
          return (
            <div key={m.id} className="relative group">
              <button
                onClick={() => !disabled && onToggle(m.id)}
                className={`model-chip flex items-center justify-between gap-2 w-full h-10 sm:h-9 md:h-9 px-3 sm:px-3 md:px-3 text-xs sm:text-[11px] md:text-sm ${
                  disabled ? "opacity-60 cursor-not-allowed text-zinc-500" : ""
                } ${
                  selected
                    ? m.good
                      ? "model-chip-pro"
                      : free
                      ? "model-chip-free"
                      : "border-white/20 bg-white/10"
                    : m.good
                    ? "model-chip-pro"
                    : free
                    ? "model-chip-free"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                data-selected={selected || undefined}
                data-type={m.good ? "pro" : free ? "free" : unc ? "unc" : "other"}
                {...(disabled ? { "aria-disabled": "true" } : {})}
                title={
                  selected
                    ? "Click to unselect"
                    : "Click to select"
                }
              >
                <span className="pr-1 inline-flex items-center gap-1.5 min-w-0">
                  {showBadges && m.good && (
                    <span className="badge-base badge-pro inline-flex items-center gap-1 px-1.5 py-0.5">
                      <Star size={12} className="shrink-0" />
                      <span className="hidden sm:inline">Pro</span>
                    </span>
                  )}
                  {showBadges && free && (
                    <span className="badge-base badge-free inline-flex items-center gap-1 px-1.5 py-0.5">
                      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                      <span className="hidden sm:inline">Free</span>
                    </span>
                  )}
                  {showBadges && unc && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-300/30">
                      <span className="h-2 w-2 rounded-full bg-rose-200" />
                      <span className="hidden sm:inline">Uncensored</span>
                    </span>
                  )}
                  <span className="truncate max-w-full">
                    {m.label}
                  </span>
                </span>
                <span
                  className="model-toggle-pill"
                  data-type={m.good ? "pro" : free ? "free" : "other"}
                  data-active={selected || undefined}
                >
                  <span className="model-toggle-thumb" />
                </span>
              </button>
              
              {/* Favorite Star Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(m.id);
                }}
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center ${
                  favorite
                    ? "bg-yellow-500 border-yellow-400 text-yellow-900 hover:bg-yellow-400"
                    : "bg-black/50 border-white/20 text-white/60 hover:bg-black/70 hover:border-white/30 hover:text-white/80"
                } opacity-0 group-hover:opacity-100 hover:!opacity-100`}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star 
                  size={12} 
                  className={favorite ? "fill-current" : ""} 
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const order: Array<keyof typeof buckets> = [
    "Favorites",
    "Uncensored",
    "Free",
    "Good",
    "Others",
  ];
  const builtInSections = order
    .filter((k) => buckets[k].length > 0)
    .map((k) => <Section key={k} title={k} models={buckets[k]} />);

  const customSection = (
    <Section
      key="Custom models"
      title="Custom models"
      models={customModels}
      showBadges={false}
    />
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3
            }}
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:w-full max-w-none sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-3 sm:mx-auto rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-lg p-4 sm:p-6 md:p-7 lg:p-8 shadow-2xl h-[90vh] sm:max-h-[90vh] overflow-hidden flex flex-col min-h-0"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="px-4 sm:-mx-6 md:-mx-7 lg:-mx-8 sm:px-6 md:px-7 lg:px-8 pt-1 pb-3 mb-3 flex items-center justify-between bg-zinc-900/95 backdrop-blur border-b border-white/10"
            >
              <h3 className="text-base md:text-lg lg:text-xl font-semibold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Select models
              </h3>
              <motion.button
                aria-label="Close"
                onClick={onClose}
                className="h-8 w-8 md:h-9 md:w-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-xs md:text-sm text-zinc-300 mb-4"
            >
              Selected: <span className="font-semibold text-purple-400">{selectedModels.length}</span> models
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-4 flex-1 overflow-y-auto pr-1 scroll-touch safe-inset"
            >
              {customSection}
              {builtInSections}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
