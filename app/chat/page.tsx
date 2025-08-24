"use client";
import { useEffect, useMemo, useState } from "react";


import HeaderBar from "@/components/app/HeaderBar";
import SelectedModelsBar from "@/components/chat/SelectedModelsBar";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { mergeModels, useCustomModels } from "@/lib/customModels";
import { ChatMessage, ApiKeys, ChatThread } from "@/lib/types";
import { createChatActions } from "@/lib/chatActions";
import { useProjects } from "@/lib/useProjects";
import ModelsModal from "@/components/modals/ModelsModal";
import FirstVisitNote from "@/components/app/FirstVisitNote";
import FixedInputBar from "@/components/chat/FixedInputBar";
import ThreadSidebar from "@/components/chat/ThreadSidebar";
import ChatGrid from "@/components/chat/ChatGrid";
import { useTheme } from "@/lib/themeContext";
import { BACKGROUND_STYLES } from "@/lib/themes";
import { safeUUID } from "@/lib/uuid";
import LaunchScreen from "@/components/ui/LaunchScreen";

export default function ChatPage() {
  const { theme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const backgroundClass = BACKGROUND_STYLES[theme.background].className;

  const [selectedIds, setSelectedIds] = useLocalStorage<string[]>(
    "ai-fiesta:selected-models",
    [
      "gemini-2.5-flash",
      "llama-3.3-70b-instruct",
      "qwen-2.5-72b-instruct",
      "openai-gpt-oss-20b-free",
      "glm-4.5-air",
    ]
  );
  const [keys] = useLocalStorage<ApiKeys>("ai-fiesta:keys", {});
  const [threads, setThreads] = useLocalStorage<ChatThread[]>(
    "ai-fiesta:threads",
    []
  );
  const [activeId, setActiveId] = useLocalStorage<string | null>(
    "ai-fiesta:active-thread",
    null
  );
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>(
    "ai-fiesta:sidebar-open",
    true
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modelsModalOpen, setModelsModalOpen] = useState(false);

  const [customModels] = useCustomModels();
  const allModels = useMemo(() => mergeModels(customModels), [customModels]);

  // Projects hook from main
  const {
    projects,
    activeProjectId,
    activeProject,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
  } = useProjects();

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );
  // Only show chats for the active project (or all if none selected)
  const visibleThreads = useMemo(
    () => (activeProjectId ? threads.filter((t) => t.projectId === activeProjectId) : threads),
    [threads, activeProjectId]
  );
  const messages = useMemo(() => activeThread?.messages ?? [], [activeThread]);

  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  // Allow collapsing a model column without unselecting it
  const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
  const selectedModels = useMemo(
    () => allModels.filter((m) => selectedIds.includes(m.id)),
    [selectedIds, allModels]
  );
  // Build grid template: collapsed => fixed narrow, expanded => normal
  const headerTemplate = useMemo(() => {
    if (selectedModels.length === 0) return "";
    const parts = selectedModels.map((m) =>
      collapsedIds.includes(m.id) ? "72px" : "minmax(280px, 1fr)"
    );
    return parts.join(" ");
  }, [selectedModels, collapsedIds]);

  const anyLoading = loadingIds.length > 0;
  const [copiedAllIdx, setCopiedAllIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [firstNoteDismissed, setFirstNoteDismissed] = useLocalStorage<boolean>(
    "ai-fiesta:first-visit-note-dismissed",
    false
  );
  const showFirstVisitNote =
    !firstNoteDismissed && (!keys?.openrouter || !keys?.gemini);

  // Copy helper with fallback when navigator.clipboard is unavailable
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        // ignore
      }
    }
  };

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const valid = new Set(allModels.map((m) => m.id));
      const currentValidCount = prev.filter((x) => valid.has(x)).length;
      if (currentValidCount >= 5) return prev;
      return [...prev, id];
    });
  };

  // Chat actions (send and onEditUser) moved to lib/chatActions.ts to avoid state races
  const { send, onEditUser } = useMemo(
    () =>
      createChatActions({
        selectedModels,
        keys,
        threads,
        activeThread,
        setThreads,
        setActiveId,
        setLoadingIds: (updater) => setLoadingIds(updater),
        setLoadingIdsInit: (ids) => setLoadingIds(ids),
        activeProject, // include project system prompt/context
      }),
    [
      selectedModels,
      keys,
      threads,
      activeThread,
      setThreads,
      setActiveId,
      activeProject,
    ]
  );

  // group assistant messages by turn for simple compare view
  const pairs = useMemo(() => {
    const rows: { user: ChatMessage; answers: ChatMessage[] }[] = [];
    let currentUser: ChatMessage | null = null;
    for (const m of messages) {
      if (m.role === "user") {
        currentUser = m;
        rows.push({ user: m, answers: [] });
      } else if (m.role === "assistant" && currentUser) {
        rows[rows.length - 1]?.answers.push(m);
      }
    }
    return rows;
  }, [messages]);

  useEffect(() => {
    setIsHydrated(true);
    const t = setTimeout(() => setShowSplash(false), 350); // fade-out duration match
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`min-h-screen w-full ${backgroundClass} relative text-white`}>
      {/* Fixed Header */}
      <HeaderBar
        onOpenMenu={() => setMobileSidebarOpen(true)}
        title="ModelArena"
        authorName="Xenonesis"
        authorImageSrc="https://github.com/Xenonesis.png"
        authorLink="https://github.com/Xenonesis"
        githubOwner="Xenonesis"
        githubRepo="ModelArena"
        onOpenModelsModal={() => setModelsModalOpen(true)}
      />

      {showSplash && (
        <div className="fixed inset-0 z-[9999]">
          <LaunchScreen backgroundClass={backgroundClass} dismissed={isHydrated} />
        </div>
      )}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-95" />

      <div className="relative z-10 px-3 lg:px-4 py-4 lg:py-6 pt-20">
        <div className="flex gap-3 lg:gap-4">
          {/* Sidebar */}
          <ThreadSidebar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            threads={visibleThreads}
            activeId={activeId}
            onSelectThread={(id) => setActiveId(id)}
            onNewChat={() => {
              const t: ChatThread = {
                id: safeUUID(),
                title: "New Chat",
                messages: [],
                createdAt: Date.now(),
                projectId: activeProjectId || undefined,
              };
              setThreads((prev) => [t, ...prev]);
              setActiveId(t.id);
            }}
            mobileSidebarOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onOpenMobile={() => setMobileSidebarOpen(true)}
            onDeleteThread={(id) => {
              setThreads((prev) => {
                const next = prev.filter((t) => t.id !== id);
                if (activeId === id) {
                  const nextInScope = (activeProjectId
                    ? next.find((t) => t.projectId === activeProjectId)
                    : next[0])?.id ?? null;
                  setActiveId(nextInScope);
                }
                return next;
              });
            }}
            // Projects (from main)
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={selectProject}
            onCreateProject={createProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] overflow-hidden">
            {/* Selected models row + actions */}
            <SelectedModelsBar selectedModels={selectedModels} onToggle={toggle} />

            <ModelsModal
              open={modelsModalOpen}
              onClose={() => setModelsModalOpen(false)}
              selectedIds={selectedIds}
              selectedModels={selectedModels}
              customModels={customModels}
              onToggle={toggle}
            />

            <FirstVisitNote
              open={showFirstVisitNote}
              onClose={() => setFirstNoteDismissed(true)}
            />

            <ChatGrid
              selectedModels={selectedModels}
              headerTemplate={headerTemplate}
              collapsedIds={collapsedIds}
              setCollapsedIds={setCollapsedIds}
              loadingIds={loadingIds}
              pairs={pairs}
              copyToClipboard={copyToClipboard}
              copiedAllIdx={copiedAllIdx}
              setCopiedAllIdx={setCopiedAllIdx}
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
              onEditUser={onEditUser}
            />

            <FixedInputBar onSubmit={send} loading={anyLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
