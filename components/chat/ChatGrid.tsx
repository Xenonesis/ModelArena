"use client";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import {
  Eye,
  EyeOff,
  Check,
  Loader2,
  Copy as CopyIcon,
  Pencil,
  Save,
  X,
  Star,
} from "lucide-react";
import MarkdownLite from "./MarkdownLite";
import type { AiModel, ChatMessage } from "@/lib/types";
import { formatResponseTime } from "@/lib/utils";



export type ChatGridProps = {
  selectedModels: AiModel[];
  headerTemplate: string;
  collapsedIds: string[];
  setCollapsedIds: (updater: (prev: string[]) => string[]) => void;
  loadingIds: string[];
  pairs: { user: ChatMessage; answers: ChatMessage[] }[];
  copyToClipboard: (text: string) => Promise<void> | void;
  copiedAllIdx: number | null;
  setCopiedAllIdx: (v: number | null) => void;
  copiedKey: string | null;
  setCopiedKey: (
    v: string | null | ((prev: string | null) => string | null)
  ) => void;
  onEditUser: (turnIndex: number, newText: string) => void;
};

// Memoized components for better performance
const ModelHeader = memo(({
  model,
  isCollapsed,
  pairs,
  onToggleCollapse
}: {
  model: AiModel;
  isCollapsed: boolean;
  pairs: { user: ChatMessage; answers: ChatMessage[] }[];
  onToggleCollapse: (modelId: string) => void;
}) => {
  const isFree = /(\(|\s)free\)/i.test(model.label);

  const avgTime = useMemo(() => {
    const modelResponses = pairs.flatMap(pair =>
      pair.answers.filter(ans => ans.modelId === model.id && ans.responseTime)
    );
    if (modelResponses.length === 0) return null;
    return modelResponses.reduce((sum, ans) => sum + (ans.responseTime || 0), 0) / modelResponses.length;
  }, [pairs, model.id]);

  return (
    <div
      className={`px-2 py-1 sm:px-1 sm:py-2 min-h-[40px] border-b flex items-center ${isCollapsed ? "justify-center" : "justify-between"
        } overflow-visible bg-black/70 sm:bg-transparent rounded-md sm:rounded-none ${model.good ? "border-amber-300/40" : "border-white/10"
        }`}
    >
      {!isCollapsed && (
        <div
          className={`text-[13px] leading-normal font-medium pr-2 inline-flex items-center gap-1.5 min-w-0 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)] sm:drop-shadow-none bg-transparent px-0 py-0 sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none ${model.good || isFree
            ? "opacity-100 text-white sm:text-inherit"
            : "opacity-100 text-white sm:opacity-90 sm:text-inherit"
            }`}
        >
          {model.good && (
            <span className="badge-base badge-pro inline-flex items-center gap-1 h-6 self-center">
              <Star size={11} />
              <span className="hidden sm:inline">Pro</span>
            </span>
          )}
          {isFree && (
            <span className="badge-base badge-free inline-flex items-center gap-1 h-6 self-center">
              <span className="h-2 w-2 rounded-full bg-current opacity-80" />
              <span className="hidden sm:inline">Free</span>
            </span>
          )}
          <span className="truncate" title={model.label}>
            {model.label}
          </span>
          {avgTime && (
            <span className="text-[10px] text-zinc-400 ml-1" title={`Average response time: ${formatResponseTime(avgTime)}`}>
              ⚡{formatResponseTime(avgTime)}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        {isCollapsed ? (
          <button
            onClick={() => onToggleCollapse(model.id)}
            className="icon-btn h-7 w-7 accent-focus"
            title={`Expand ${model.label}`}
          >
            <Eye size={13} />
          </button>
        ) : (
          <button
            onClick={() => onToggleCollapse(model.id)}
            className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 accent-focus"
            title={`Collapse ${model.label}`}
          >
            <EyeOff size={12} />
          </button>
        )}
      </div>
    </div>
  );
});

ModelHeader.displayName = 'ModelHeader';

const ChatGrid = memo(function ChatGrid({
  selectedModels,
  headerTemplate,
  collapsedIds,
  setCollapsedIds,
  loadingIds,
  pairs,
  copyToClipboard,
  copiedAllIdx,
  setCopiedAllIdx,
  copiedKey,
  setCopiedKey,
  onEditUser,
}: ChatGridProps) {
  // Sanitize certain provider-specific XML-ish wrappers (e.g., <answer>, <think>)
  const sanitizeContent = useCallback((s: string): string => {
    try {
      let t = String(s ?? "");
      t = t.replace(/<\/?answer[^>]*>/gi, "");
      t = t.replace(/<\/?think[^>]*>/gi, "");
      return t.trim();
    } catch {
      return s;
    }
  }, []);
  const headerCols = useMemo(
    () =>
      headerTemplate || `repeat(${selectedModels.length}, minmax(260px, 1fr))`,
    [headerTemplate, selectedModels.length]
  );

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Optimized scroll effect with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto", // Changed to auto for better performance
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pairs.length]); // Only depend on length, not entire pairs array

  // Memoized handlers
  const handleToggleCollapse = useCallback((modelId: string) => {
    setCollapsedIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  }, [setCollapsedIds]);

  const handleCopyAll = useCallback((rowIndex: number) => {
    const all = selectedModels
      .filter((m) => !collapsedIds.includes(m.id))
      .map((m) => {
        const ans = pairs[rowIndex].answers.find((a) => a.modelId === m.id);
        const header = m.label;
        const body = sanitizeContent(ans?.content ?? "");
        return `## ${header}\n${body}`;
      })
      .join("\n\n");
    copyToClipboard(all);
    setCopiedAllIdx(rowIndex);
    setTimeout(() => setCopiedAllIdx(null), 1200);
  }, [selectedModels, collapsedIds, pairs, sanitizeContent, copyToClipboard, setCopiedAllIdx]);

  const handleCopyResponse = useCallback((content: string, rowIndex: number, modelId: string) => {
    copyToClipboard(sanitizeContent(content));
    const key = `${rowIndex}:${modelId}`;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((prev) => prev === key ? null : prev), 1200);
  }, [copyToClipboard, sanitizeContent, setCopiedKey]);

  const handleEditUser = useCallback((index: number, newText: string) => {
    onEditUser(index, newText.trim());
    setEditingIdx(null);
    setDraft("");
  }, [onEditUser]);

  const handleStartEdit = useCallback((index: number, content: string) => {
    setEditingIdx(index);
    setDraft(content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingIdx(null);
    setDraft("");
  }, []);

  return (
    <div
      ref={scrollRef}
      className="relative rounded-lg border border-white/5 bg-white/5 px-3 lg:px-4 pt-2 overflow-x-auto flex-1 overflow-y-auto pb-28 sm:scroll-stable-gutter">
      {selectedModels.length === 0 ? (
        <div className="p-4 text-zinc-400">
          Select models to compare.
        </div>
      ) : (
        <div className="min-w-full space-y-3">
          {/* Header row: model labels */}
          <div
            className="relative grid min-w-full gap-3 items-center overflow-visible mt-0 sticky top-0 left-0 right-0 z-30 -mx-3 px-3 lg:-mx-4 lg:px-4 py-1 rounded-t-lg shadow-[0_1px_0_rgba(0,0,0,0.4)] bg-transparent border-0 sm:bg-black/40 sm:backdrop-blur-sm sm:border-b sm:border-white/10"
            style={{ gridTemplateColumns: headerCols }}
          >
            {selectedModels.map((m) => (
              <ModelHeader
                key={m.id}
                model={m}
                isCollapsed={collapsedIds.includes(m.id)}
                pairs={pairs}
                onToggleCollapse={handleToggleCollapse}
              />
            ))}
          </div>

          {pairs.map((row, i) => (
            <div key={i} className="space-y-3">
              {/* Prompt callout */}
              <div className="relative flex items-start justify-between gap-3 px-3 py-2 rounded-lg ring-1 ring-white/10 chat-prompt-accent">
                <div className="chat-prompt-side" />
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold text-white bg-black/60 ring-1 ring-white/15 border border-white/15 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.45)] shrink-0">
                    <span className="h-2 w-2 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                    You
                  </span>
                  <div className="min-w-0 flex-1">
                    {editingIdx === i ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          autoFocus
                          aria-label="Edit your prompt"
                          placeholder="Edit your prompt"
                        />
                        <button
                          onClick={() => handleEditUser(i, draft)}
                          className="icon-btn h-7 w-7 accent-focus"
                          title="Save"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="icon-btn h-7 w-7 accent-focus"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="text-[13.5px] sm:text-sm text-zinc-100 leading-relaxed truncate drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]"
                        title={row.user.content}
                      >
                        {row.user.content}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {editingIdx !== i && (
                    <button
                      onClick={() => handleStartEdit(i, row.user.content)}
                      className="icon-btn h-7 w-7 accent-focus"
                      title="Edit prompt"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyAll(i)}
                    className={`icon-btn h-7 w-7 transition-all ${copiedAllIdx === i
                      ? "bg-emerald-500/15 border-emerald-300/30 text-emerald-100"
                      : ""
                      } accent-focus`}
                    title="Copy all model responses for this prompt"
                  >
                    {copiedAllIdx === i ? (
                      <Check size={12} />
                    ) : (
                      <CopyIcon size={12} />
                    )}
                  </button>
                </div>
              </div>
              <div
                className="grid gap-3 items-stretch"
                style={{ gridTemplateColumns: headerCols }}
              >
                {selectedModels.map((m) => {
                  const ans = row.answers.find((a) => a.modelId === m.id);
                  const isCollapsed = collapsedIds.includes(m.id);

                  return (
                    <div key={m.id} className="h-full">
                      <div
                        className={`group relative rounded-lg ${isCollapsed ? "p-2.5" : "p-3"
                          } h-full min-h-[140px] flex overflow-hidden ring-1 transition-shadow bg-gradient-to-b from-black/40 to-black/20 ring-white/10 backdrop-blur-[2px] ${isCollapsed ? "cursor-pointer" : "hover:ring-white/20"
                          }`}
                        onClick={() => {
                          if (isCollapsed) handleToggleCollapse(m.id);
                        }}
                        title={isCollapsed ? "Click to expand" : undefined}
                      >
                        {/* decorative overlay removed for cleaner look */}
                        {ans && String(ans.content || "").length > 0 && (
                          <button
                            onClick={() => handleCopyResponse(ans.content, i, m.id)}
                            className={`absolute top-2 right-2 z-10 icon-btn h-7 w-7 ${isCollapsed
                              ? "opacity-0 pointer-events-none"
                              : "opacity-0 group-hover:opacity-100"
                              } transition-all ${copiedKey === `${i}:${m.id}`
                                ? "bg-emerald-500/15 border-emerald-300/30 text-emerald-100"
                                : ""
                              } accent-focus`}
                            title={`Copy ${m.label} response`}
                          >
                            {copiedKey === `${i}:${m.id}` ? (
                              <Check size={12} />
                            ) : (
                              <CopyIcon size={12} />
                            )}
                          </button>
                        )}
                        <div
                          className={`text-sm leading-relaxed w-full pr-8 ${isCollapsed
                            ? "overflow-hidden max-h-20 opacity-70"
                            : "space-y-2"
                            } ${!isCollapsed
                              ? "max-h-[40vh] md:max-h-[400px] overflow-y-auto custom-scrollbar"
                              : ""
                            }`}
                          style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                          {ans && String(ans.content || "").length > 0 && !["Thinking…", "Typing…"].includes(String(ans.content)) ? (
                            <>
                              <div className="max-w-[72ch]">
                                <MarkdownLite text={sanitizeContent(ans.content)} />
                              </div>
                              {ans.responseTime && (
                                <div className="mt-2 text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/30 border border-white/10">
                                    ⚡ {formatResponseTime(ans.responseTime)}
                                  </span>
                                  {ans.provider && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/30 border border-white/10">
                                      🔗 {ans.provider}
                                    </span>
                                  )}
                                  {ans.usedKeyType && ans.usedKeyType !== 'none' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/30 border border-white/10">
                                      🔑 {ans.usedKeyType}
                                    </span>
                                  )}
                                </div>
                              )}
                              {ans.code === 503 &&
                                ans.provider === "openrouter" && (
                                  <div className="mt-2 inline-flex items-center gap-2 text-xs text-amber-200/90 bg-amber-500/15 ring-1 ring-amber-300/30 px-2.5 py-1.5 rounded">
                                    <span>
                                      Free pool temporarily unavailable (503).
                                      Try again soon, switch model, or add your
                                      own OpenRouter API key for higher limits.
                                    </span>
                                    <button
                                      onClick={() =>
                                        window.dispatchEvent(
                                          new Event("open-settings")
                                        )
                                      }
                                      className="ml-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    >
                                      Add key
                                    </button>
                                  </div>
                                )}
                              {(() => {
                                try {
                                  const txt = String(ans.content || "");
                                  const show =
                                    /add your own\s+(?:openrouter|gemini)\s+api key/i.test(
                                      txt
                                    );
                                  return show;
                                } catch {
                                  return false;
                                }
                              })() && (
                                  <div className="mt-2">
                                    <button
                                      onClick={() =>
                                        window.dispatchEvent(
                                          new Event("open-settings")
                                        )
                                      }
                                      className="text-xs px-2.5 py-1 rounded text-white border border-white/10 accent-action-fill"
                                    >
                                      Add keys
                                    </button>
                                  </div>
                                )}
                            </>
                          ) : (loadingIds.includes(m.id) || (ans && ["Thinking…", "Typing…"].includes(String(ans.content)))) ? (
                            <div className="w-full self-stretch space-y-3">
                              <div className="inline-flex items-center gap-2 text-[12px] font-medium text-rose-100">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 ring-1 ring-rose-300/30">
                                  <Loader2 className="animate-spin" size={13} />
                                  Thinking…
                                </span>
                              </div>
                              <div className="animate-pulse space-y-2">
                                <div className="h-2.5 w-1/3 rounded accent-bar-faint" />
                                <div className="h-2 rounded bg-white/10" />
                                <div className="h-2 rounded bg-white/10 w-5/6" />
                                <div className="h-2 rounded bg-white/10 w-2/3" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-sm">
                              No response
                            </span>
                          )}
                        </div>
                        {isCollapsed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-2 py-1 rounded-full border border-white/10 bg-black/50 inline-flex items-center gap-1">
                              <Eye size={12} /> Expand
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default ChatGrid;
