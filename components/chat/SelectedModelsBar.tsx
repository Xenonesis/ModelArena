"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import type { AiModel } from "@/lib/types";

type Props = {
  selectedModels: AiModel[];
  onToggle: (id: string) => void;
};

export default function SelectedModelsBar({ selectedModels, onToggle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-3 flex items-start gap-3 min-w-0"
    >
      {/* Mobile-first horizontal scroll with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap pr-1 pb-2 min-w-0 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}
      >
        <AnimatePresence mode="popLayout">
          {selectedModels.map((m, index) => {
            const isFree = /(\(|\s)free\)/i.test(m.label);
            const isUncensored =
              /uncensored/i.test(m.label) || /venice/i.test(m.model);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                layout
                className={`model-chip text-white relative group transition-all duration-200 hover:scale-105 ${
                  m.good
                    ? "model-chip-pro shadow-lg shadow-purple-500/20"
                    : isFree
                    ? "model-chip-free shadow-lg shadow-green-500/20"
                    : "border-white/10 shadow-lg shadow-black/20"
                }`}
                data-selected={true}
                data-type={m.good ? "pro" : isFree ? "free" : "other"}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {m.good && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="badge-base badge-pro inline-flex items-center gap-1 px-1.5 py-0.5"
                  >
                    <Star size={12} className="shrink-0" />
                    <span className="hidden sm:inline">Pro</span>
                  </motion.span>
                )}
                {isFree && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="badge-base badge-free inline-flex items-center gap-1 px-1.5 py-0.5"
                  >
                    <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                    <span className="hidden sm:inline">Free</span>
                  </motion.span>
                )}
                {isUncensored && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-300/30"
                  >
                    <span className="h-2 w-2 rounded-full bg-rose-200" />
                    <span className="hidden sm:inline">Uncensored</span>
                  </motion.span>
                )}
                <span className="truncate max-w-[120px] sm:max-w-[140px] lg:max-w-[180px]">{m.label}</span>
                <span
                  className="model-toggle-pill"
                  data-type={m.good ? "pro" : "free"}
                  data-active={true}
                >
                  <span className="model-toggle-thumb" />
                </span>
                
                {/* Enhanced mobile-friendly delete button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(m.id);
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 border border-red-400 shadow-lg z-10 touch-manipulation"
                  title={`Remove ${m.label}`}
                  aria-label={`Remove ${m.label} from selection`}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={12} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {selectedModels.length === 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-zinc-400 px-3 py-2 bg-white/5 rounded-full border border-white/10"
          >
            No models selected
          </motion.span>
        )}
      </motion.div>
      {/* Actions removed (moved to header) */}
    </motion.div>
  );
}