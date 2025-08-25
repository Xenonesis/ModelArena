"use client";
import { useMemo } from 'react';
import { AiModel } from '@/lib/types';
import { mergeModels, useCustomModels } from '@/lib/customModels';

export default function ModelSelector({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [customModels] = useCustomModels();
  const allModels: AiModel[] = useMemo(() => mergeModels(customModels), [customModels]);
  const disabledIds = new Set<string>(); // Remove model limit

  // Filter out disabled models unless they're already selected
  const availableModels = allModels.filter(m => 
    !m.disabled || selectedIds.includes(m.id)
  );

  return (
    <div className="flex flex-wrap gap-2">
      {availableModels.map((m: AiModel) => {
        const selected = selectedIds.includes(m.id);
        const disabled = disabledIds.has(m.id);
        return (
          <button
            key={m.id}
            onClick={() => onToggle(m.id)}
            disabled={!selected && disabled}
            className={`px-3 py-1.5 rounded-md border text-sm tracking-tight transition-colors accent-focus ${
              selected
                ? "accent-selected"
                : "bg-white/10 border-white/15 text-white hover:bg-white/20"
            } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            title={""}
          >
            {selected ? "✓ " : ""}
            {m.label}
            {"custom" in m ? (
              <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-white/10 border border-white/15">
                custom
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
