"use client";
import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { X, ExternalLink, Cog } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ApiKeys } from "@/lib/types";

type SettingsProps = { compact?: boolean };

export default function Settings({ compact }: SettingsProps) {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useLocalStorage<ApiKeys>("ai-fiesta:keys", {});
  const [gemini, setGemini] = useState(keys.gemini || "");
  const [openrouter, setOpenrouter] = useState(keys.openrouter || "");

  const save = () => {
    const next = {
      gemini: gemini.trim() || undefined,
      openrouter: openrouter.trim() || undefined,
    };
    setKeys(next);
    setOpen(false);
    // Force a reload so clients pick up the new keys immediately
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Allow programmatic open from anywhere (e.g., rate-limit CTA)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-settings", handler as EventListener);
    return () =>
      window.removeEventListener("open-settings", handler as EventListener);
  }, []);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs ${
          compact ? "h-9 w-9 justify-center px-0" : "px-3 py-2"
        } rounded-md border border-white/15 bg-white/5 hover:bg-white/10 shadow accent-focus`}
        title="Settings"
        aria-label="Settings"
      >
        <Cog size={14} />
        {!compact && <span>Settings</span>}
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full mx-3 sm:mx-6 max-w-2xl lg:max-w-3xl rounded-2xl border border-white/10 bg-zinc-900/95 text-white p-5 md:p-6 lg:p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg md:text-xl font-semibold">API Keys</h2>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs md:text-sm text-zinc-300 mb-5">
                Keys are stored locally in your browser via localStorage and
                sent only with your requests. Do not hardcode keys in code.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm md:text-base font-medium">
                      Gemini API Key
                    </label>
                    <a
                      href="https://aistudio.google.com/app/u/5/apikey?pli=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 border border-white/15"
                    >
                      <ExternalLink size={12} /> Get API key
                    </a>
                  </div>
                  <input
                    value={gemini}
                    onChange={(e) => setGemini(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2.5 text-sm font-mono tracking-wide placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm md:text-base font-medium">
                      OpenRouter API Key
                    </label>
                    <a
                      href="https://openrouter.ai/sign-in?redirect_url=https%3A%2F%2Fopenrouter.ai%2Fsettings%2Fkeys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 border border-white/15"
                    >
                      <ExternalLink size={12} /> Get API key
                    </a>
                  </div>
                  <input
                    value={openrouter}
                    onChange={(e) => setOpenrouter(e.target.value)}
                    placeholder="sk-or-..."
                    className="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2.5 text-sm font-mono tracking-wide placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-4 py-2 rounded-md text-sm font-medium accent-action-fill accent-focus"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
