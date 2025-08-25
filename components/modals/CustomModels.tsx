"use client";
import { useState } from 'react';
import { createPortal } from "react-dom";
import { Wrench } from "lucide-react";
import { useCustomModels, makeCustomModel } from "@/lib/customModels";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { ApiKeys } from "@/lib/types";
import { X, Check, Copy, Loader2, AlertCircle, Trash2 } from "lucide-react";

type CustomModelsProps = { compact?: boolean };

export default function CustomModels({ compact }: CustomModelsProps) {
  const [open, setOpen] = useState(false);
  const [customModels, setCustomModels] = useCustomModels();
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [validMsg, setValidMsg] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [validState, setValidState] = useState<null | "ok" | "fail" | "error">(
    null
  );
  const [keys] = useLocalStorage<ApiKeys>("ai-fiesta:keys", {});

  const addCustom = () => {
    setErr(null);
    setValidMsg(null);
    setValidState(null);
    const l = label.trim();
    const s = slug.trim();
    if (!l || !s) {
      setErr("Please enter both Label and Model ID.");
      return;
    }
    if (customModels.some((m) => m.id === s)) {
      setErr("A custom model with this Model ID already exists.");
      return;
    }
    // Require successful validation before adding
    if (validState !== "ok") {
      setErr("Please validate the Model ID before adding.");
      return;
    }
    const model = makeCustomModel(l, s);
    setCustomModels([...customModels, model]);
    setLabel("");
    setSlug("");
    // Ensure UI picks up new models consistently
    if (typeof window !== "undefined") {
      setTimeout(() => window.location.reload(), 10);
    }
  };

  const removeCustom = (id: string) => {
    setCustomModels(customModels.filter((m) => m.id !== id));
  };

  const validate = async () => {
    setErr(null);
    setValidMsg(null);
    setValidState(null);
    const s = slug.trim();
    if (!s) {
      setErr("Enter a Model ID to validate.");
      return;
    }
    try {
      setValidating(true);
      const res = await fetch("/api/openrouter/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: s, apiKey: keys?.openrouter }),
      });
      const data = await res.json();
      if (!data?.ok) {
        setValidMsg(
          `Validation error${data?.status ? ` (status ${data.status})` : ""}.`
        );
        setValidState("error");
        return;
      }
      if (data.exists) {
        setValidMsg("Model found.");
        setValidState("ok");
      } else {
        setValidMsg("Model not found. Check the exact slug on OpenRouter.");
        setValidState("fail");
      }
    } catch {
      setValidMsg("Could not validate right now.");
      setValidState("error");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs h-9 ${
          compact ? "w-9 justify-center px-0" : "px-3 py-2"
        } rounded-md border border-white/15 bg-white/5 hover:bg-white/10 shadow accent-focus`}
        title="Custom models"
        aria-label="Custom models"
      >
        <Wrench size={14} />
        {!compact && <span>Custom models</span>}
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/95 p-6 md:p-7 lg:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold tracking-wide">
                    Add custom OpenRouter models
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 mt-1">
                    Add any model slug from OpenRouter.
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 md:h-10 md:w-10 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] md:text-xs text-zinc-400">
                    Label
                  </label>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="DeepSeek: R1 Distill Qwen 14B (free)"
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2.5 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] md:text-xs text-zinc-400">
                    Model ID (slug)
                  </label>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setValidState(null);
                      setValidMsg(null);
                    }}
                    placeholder="provider/model:variant (e.g., deepseek/deepseek-r1:free)"
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2.5 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="text-[12px] md:text-sm text-zinc-400">
                  Tip: Only use &quot;:free&quot; if the model page lists a free
                  variant.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={validate}
                    disabled={validating}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-60 text-sm md:text-base"
                  >
                    {validating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    <span>{validating ? "Validating…" : "Validate"}</span>
                  </button>
                  <button
                    onClick={addCustom}
                    disabled={validState !== "ok"}
                    className="px-3.5 py-2 rounded-md accent-action-fill accent-focus disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm md:text-base"
                  >
                    Add Model
                  </button>
                </div>
              </div>
              {err && (
                <div className="mb-2 text-xs text-rose-300 inline-flex items-center gap-2">
                  <AlertCircle size={14} /> {err}
                </div>
              )}
              {validMsg && (
                <div
                  className={`mb-2 text-xs inline-flex items-center gap-2 px-2 py-1 rounded-md border ${
                    validState === "ok"
                      ? "text-emerald-300 border-emerald-300/30 bg-emerald-400/10"
                      : validState === "fail"
                      ? "text-rose-300 border-rose-300/30 bg-rose-400/10"
                      : "text-amber-300 border-amber-300/30 bg-amber-400/10"
                  }`}
                >
                  {validState === "ok" ? (
                    <Check size={14} />
                  ) : validState === "fail" ? (
                    <AlertCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <span>{validMsg}</span>
                </div>
              )}
              {customModels.length > 0 && (
                <div className="max-h-[65vh] overflow-auto rounded-md border border-white/10 mt-3">
                  <table className="w-full text-sm md:text-base">
                    <thead className="bg-white/5 sticky top-0 z-10">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-medium">Label</th>
                        <th className="px-3 py-2 font-medium">Model ID</th>
                        <th className="px-3 py-2 w-32 md:w-40 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customModels.map((m) => (
                        <tr
                          key={m.id}
                          className="border-t border-white/10 hover:bg-white/5"
                        >
                          <td className="px-3 py-2 align-top">
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[260px] lg:max-w-[360px]">
                                {m.label}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                                custom
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex items-center gap-2 text-xs text-white/85">
                              <span
                                className="truncate max-w-[360px] lg:max-w-[520px]"
                                title={m.model}
                              >
                                {m.model}
                              </span>
                              <button
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white/10 border border-white/10 hover:bg-white/20"
                                onClick={() =>
                                  navigator.clipboard.writeText(m.model)
                                }
                                title="Copy model ID"
                              >
                                <Copy size={12} /> Copy
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <button
                              onClick={() => removeCustom(m.id)}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10 hover:bg-white/20"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
