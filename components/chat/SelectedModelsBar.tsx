"use client";
import { Star } from "lucide-react";
import type { AiModel } from "@/lib/types";

type Props = {
  selectedModels: AiModel[];
  onToggle: (id: string) => void;
};

export default function SelectedModelsBar({ selectedModels, onToggle }: Props) {
  return (
    <div className="mb-3 flex items-start gap-3 min-w-0">
      {/* Chips: no wrap, horizontal scroll */}
      <div className="hidden sm:flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap pr-1 pb-2 min-w-0 scroll-stable-gutter">
        {selectedModels.map((m) => {
          const isFree = /(\(|\s)free\)/i.test(m.label);
          const isUncensored =
            /uncensored/i.test(m.label) || /venice/i.test(m.model);
          return (
            <button
              key={m.id}
              onClick={() => onToggle(m.id)}
              className={`model-chip text-white ${
                m.good
                  ? "model-chip-pro"
                  : isFree
                  ? "model-chip-free"
                  : "border-white/10"
              }`}
              data-selected={true}
              data-type={m.good ? "pro" : isFree ? "free" : "other"}
              title="Click to toggle"
            >
              {m.good && (
                <span className="badge-base badge-pro inline-flex items-center gap-1 px-1.5 py-0.5">
                  <Star size={12} className="shrink-0" />
                  <span className="hidden sm:inline">Pro</span>
                </span>
              )}
              {isFree && (
                <span className="badge-base badge-free inline-flex items-center gap-1 px-1.5 py-0.5">
                  <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                  <span className="hidden sm:inline">Free</span>
                </span>
              )}
              {isUncensored && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-300/30">
                  <span className="h-2 w-2 rounded-full bg-rose-200" />
                  <span className="hidden sm:inline">Uncensored</span>
                </span>
              )}
              <span className="truncate max-w-[180px]">{m.label}</span>
              <span
                className="model-toggle-pill"
                data-type={m.good ? "pro" : "free"}
                data-active={true}
              >
                <span className="model-toggle-thumb" />
              </span>
            </button>
          );
        })}
        {selectedModels.length === 0 && (
          <span className="text-xs text-zinc-400">No models selected</span>
        )}
      </div>
      {/* Actions removed (moved to header) */}
    </div>
  );
}
