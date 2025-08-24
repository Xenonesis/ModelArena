"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Globe, Paperclip, Send, Loader2, X, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      )

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

const MIN_HEIGHT = 58;
const MAX_HEIGHT = 197;

const AnimatedPlaceholder = ({ showSearch }: { showSearch: boolean }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={showSearch ? "search" : "ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none w-[150px] text-sm absolute text-black/30 dark:text-white/30 sm:text-black/70 sm:dark:text-white/70 drop-shadow-sm"
    >
      {showSearch ? "Search the web..." : "Ask Anything..."}
    </motion.p>
  </AnimatePresence>
);

export function AiInput({
  onSubmit,
  loading = false,
}: {
  onSubmit: (text: string, imageDataUrl?: string, webSearch?: boolean) => void;
  loading?: boolean;
}) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [showSearch, setShowSearch] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [barVisible, setBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handelClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
    setAttachedFile(null);
  };

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    // Allowed types: images + text/plain + pdf + msword + docx
    const allowed = [
      /^image\//,
      /^text\/plain$/,
      /^application\/pdf$/,
      /^application\/msword$/,
      /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/,
    ];
    const isAllowed = allowed.some((re) => re.test(file.type));
    if (!isAllowed) {
      setErrorMsg("Unsupported file. Allowed: Images, TXT, PDF, DOC, DOCX.");
      setTimeout(() => setErrorMsg(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset so same file can be selected later
      return;
    }

    setAttachedFile(file);
    if (file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    let dataUrl: string | undefined;
    if (attachedFile) {
      dataUrl = await new Promise<string>((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.readAsDataURL(attachedFile);
      });
    }
    onSubmit(value.trim(), dataUrl, showSearch);
    setValue("");
    setAttachedFile(null);
    setImagePreview(null);
    adjustHeight(true);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Hide bar on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastScrollY.current;
      const threshold = 6;
      if (y < 8) {
        setBarVisible(true);
      } else if (delta > threshold) {
        setBarVisible(false);
      } else if (delta < -threshold) {
        setBarVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.div
      className="w-full py-4"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: barVisible ? 0 : 72, opacity: barVisible ? 1 : 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative max-w-xl border rounded-[22px] border-black/5 p-1 w-full mx-auto chat-input-shell">
        <div className="relative rounded-2xl border border-black/5 overflow-hidden">
          <div
            className="ai-grow-area"
            style={
              { "--ai-input-max": `${MAX_HEIGHT}px` } as React.CSSProperties
            }
          >
            {/* Content area (textarea + attachments + messages) gets bottom padding to make room for fixed toolbar */}
            <div className="pb-10">
              {/* 40px toolbar + gap */}
              {imagePreview ? (
                <div className="grid grid-cols-[96px_1fr] gap-3 p-3 pr-4">
                  <div className="relative h-[96px] w-[96px] rounded-xl overflow-hidden border border-white/10 shadow-sm">
                    <Image
                      className="object-cover h-full w-full"
                      src={imagePreview}
                      height={240}
                      width={240}
                      alt="attached image"
                    />
                    <button
                      onClick={handelClose}
                      className="absolute top-1.5 right-1.5 inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/70 text-white hover:bg-black/80 border border-white/20"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="relative rounded-xl bg-black/80 dark:bg-white/15 border border-white/10 backdrop-blur-sm">
                    <Textarea
                      id="ai-input-04"
                      value={value}
                      placeholder=""
                      className="w-full rounded-xl px-4 py-3 bg-transparent border-none text-white resize-none focus-visible:ring-0 leading-[1.2]"
                      ref={textareaRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      onChange={(e) => {
                        setValue(e.target.value);
                        adjustHeight();
                      }}
                    />
                    {!value && (
                      <div className="absolute left-4 top-3">
                        <AnimatedPlaceholder showSearch={showSearch} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Textarea
                    id="ai-input-04"
                    value={value}
                    placeholder=""
                    className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/90 dark:bg-white/15 border-none text-white resize-none focus-visible:ring-0 leading-[1.2]"
                    ref={textareaRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    onChange={(e) => {
                      setValue(e.target.value);
                      adjustHeight();
                    }}
                  />
                  {!value && (
                    <div className="absolute left-4 top-3">
                      <AnimatedPlaceholder showSearch={showSearch} />
                    </div>
                  )}
                </div>
              )}
              {errorMsg && (
                <div className="px-4 py-2 text-[13px] text-rose-200 bg-rose-500/10 border-t border-white/10">
                  {errorMsg}
                </div>
              )}

              {attachedFile && !imagePreview && (
                <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-white/80" />
                    <span
                      className="truncate text-sm text-white/90"
                      title={attachedFile.name}
                    >
                      {attachedFile.name}
                    </span>
                    <span className="text-xs text-white/60 flex-shrink-0">
                      {Math.max(1, Math.round(attachedFile.size / 1024))} KB
                    </span>
                  </div>
                  <button
                    onClick={handelClose}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-black/50 text-white/90 hover:bg-black/60 border border-white/10"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fixed toolbar anchored to bottom; textarea grows upward above it */}
          <div className="absolute inset-x-0 bottom-0 h-10 rounded-b-2xl backdrop-blur-sm flex items-center justify-between px-3 ai-toolbar-bg">
            <div className="flex items-center gap-2">
              <label
                title="Attach file"
                className={cn(
                  "cursor-pointer relative rounded-full p-1.5 bg-black/30 dark:bg-white/10",
                  attachedFile
                    ? "bg-[var(--accent-interactive-primary)]/15 border border-[var(--accent-interactive-primary)] text-[var(--accent-interactive-primary)]"
                    : "text-white/60 hover:text-white"
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handelChange}
                  accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  aria-label="Attach file"
                />
                <Paperclip
                  className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    attachedFile
                      ? "text-[var(--accent-interactive-primary)]"
                      : "text-white/60 hover:text-white"
                  )}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1.5 px-1.5 py-1 h-7 search-toggle"
                )}
                data-active={showSearch}
                aria-pressed={showSearch ? "true" : "false"}
                aria-label={
                  showSearch ? "Disable web search" : "Enable web search"
                }
                title={showSearch ? "Disable web search" : "Enable web search"}
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                  <motion.div
                    animate={{
                      rotate: showSearch ? 180 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: showSearch ? 180 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    <Globe
                      className={cn(
                        "w-3.5 h-3.5",
                        showSearch
                          ? "text-white"
                          : "text-black/60 dark:text-white/50"
                      )}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: "auto",
                        opacity: 1,
                      }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs overflow-hidden whitespace-nowrap search-toggle-label flex-shrink-0"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <div>
              <button
                type="button"
                title={loading ? "Sending..." : "Send message"}
                onClick={handleSubmit}
                className={cn(
                  "rounded-full p-1.5 transition-colors",
                  loading
                    ? "bg-[var(--accent-interactive-primary)]/20 text-[var(--accent-interactive-primary)] cursor-not-allowed"
                    : value
                    ? "bg-[var(--accent-interactive-primary)]/15 text-[var(--accent-interactive-primary)]"
                    : "bg-black/30 dark:bg-white/10 text-white/85 hover:text-white"
                )}
                disabled={loading}
                aria-busy={loading ? "true" : "false"}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
