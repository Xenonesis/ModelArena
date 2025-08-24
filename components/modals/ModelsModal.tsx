"use client";
import { useEffect } from "react";
import { X, Star } from "lucide-react";
import type { AiModel } from "@/lib/types";
import { MODEL_CATALOG } from "@/lib/models";

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
  const staticFavIds = new Set<string>([
    "llama-3.3-70b-instruct",
    "gemini-2.5-pro",
    "openai-gpt-oss-20b-free",
    "glm-4.5-air",
    "moonshot-kimi-k2",
  ]);
  const isFav = (m: AiModel) =>
    selectedIds.includes(m.id) || staticFavIds.has(m.id);
  const pick = (m: AiModel) => {
    if (isFav(m)) return "Favorites";
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
          const disabled = !selected && selectedModels.length >= 5;
          return (
            <button
              key={m.id}
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
                  : disabled
                  ? "Limit reached"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full sm:w-full max-w-none sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-3 sm:mx-auto rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/90 p-4 sm:p-6 md:p-7 lg:p-8 shadow-2xl h-[90vh] sm:max-h-[90vh] overflow-hidden flex flex-col min-h-0"
      >
        <div className="px-4 sm:-mx-6 md:-mx-7 lg:-mx-8 sm:px-6 md:px-7 lg:px-8 pt-1 pb-3 mb-3 flex items-center justify-between bg-zinc-900/95 backdrop-blur border-b border-white/10">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold tracking-wide">
            Select up to 5 models
          </h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="h-8 w-8 md:h-9 md:w-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </div>
        <div className="text-xs md:text-sm text-zinc-300 mb-4">
          Selected: {selectedModels.length}/5
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 scroll-touch safe-inset">
          {customSection}
          {builtInSections}
        </div>
      </div>
    </div>
  );
}
