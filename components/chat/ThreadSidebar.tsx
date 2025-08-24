"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import type { ChatThread } from "@/lib/types";
import type { Project } from "@/lib/projects";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import ProjectsSection from "@/components/app/ProjectsSection";

type Props = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  threads: ChatThread[];
  activeId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  mobileSidebarOpen: boolean;
  onCloseMobile: () => void;
  onOpenMobile: () => void;
  onDeleteThread: (id: string) => void;
  // Projects props
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
};

export default function ThreadSidebar({
  sidebarOpen,
  onToggleSidebar,
  threads,
  activeId,
  onSelectThread,
  onNewChat,
  mobileSidebarOpen,
  onCloseMobile,
  onDeleteThread,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: Props) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`relative hidden lg:flex shrink-0 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] rounded-lg border border-white/10 bg-white/5 p-3 flex-col transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-14"
        }`}
      >
        {/* Collapse/Expand toggle */}
        <button
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={onToggleSidebar}
          className="absolute -right-3 top-5 z-10 h-6 w-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div
          className={`flex items-center justify-between mb-2 ${
            sidebarOpen ? "" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full accent-dot accent-beacon accent-dot-pulse" />
            <h2 className="text-sm font-semibold">ModelArena</h2>
          </div>
        </div>

        {sidebarOpen ? (
          <>
            {/* Projects Section */}
            <div className="mb-4">
              <ProjectsSection
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={onSelectProject}
                onCreateProject={onCreateProject}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
                collapsed={false}
              />
            </div>

            <button
              onClick={onNewChat}
              className="mb-3 text-sm px-3 py-2 rounded-md text-white shadow transition-colors accent-action-fill accent-focus"
            >
              + New Chat
            </button>
            <div className="text-xs uppercase tracking-wide opacity-60 mb-2">
              Chats
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {threads.length === 0 && (
                <div className="text-xs opacity-60">No chats yet</div>
              )}
              {threads.map((t) => (
                <div
                  key={t.id}
                  className={`w-full px-2 py-2 rounded-md text-sm border flex items-center justify-between gap-2 group ${
                    t.id === activeId
                      ? "bg-white/15 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => onSelectThread(t.id)}
                    className="min-w-0 text-left flex-1 truncate"
                    title={t.title || "Untitled"}
                  >
                    {t.title || "Untitled"}
                  </button>
                  <button
                    aria-label="Delete chat"
                    title="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(t.id);
                    }}
                    className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-300/30 text-zinc-300 hover:text-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-6">
            {/* Projects Section (Collapsed) */}
            <div className="mb-4 w-full">
              <ProjectsSection
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={onSelectProject}
                onCreateProject={onCreateProject}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
                collapsed={true}
              />
            </div>

            {/* New chat button */}
            <button
              title="New Chat"
              onClick={onNewChat}
              className="h-8 w-8 rounded-full flex items-center justify-center mb-4 mx-auto shrink-0 text-white transition-colors accent-action-fill accent-focus"
            >
              <Plus size={14} />
            </button>

            {/* Mini chat boxes list */}
            <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-2 pt-1 pb-2">
              {threads.map((t) => {
                const isActive = t.id === activeId;
                const letter =
                  (t.title || "Untitled").trim()[0]?.toUpperCase() || "N";
                return (
                  <button
                    key={t.id}
                    title={t.title || "Untitled"}
                    onClick={() => onSelectThread(t.id)}
                    className={`h-6 w-6 aspect-square rounded-full flex items-center justify-center transition-colors focus-visible:outline-none mx-auto shrink-0 
                      ${
                        isActive
                          ? "bg-white/20 ring-1 ring-white/30 ring-offset-1 ring-offset-black"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <span className="text-[10px] font-semibold leading-none">
                      {letter}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-zinc-900/90 border-r border-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full accent-dot accent-beacon accent-dot-pulse" />
                <h2 className="text-sm font-semibold">ModelArena</h2>
              </div>
              <button
                aria-label="Close"
                onClick={onCloseMobile}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </div>

            {/* Projects Section (Mobile) */}
            <div className="mb-4">
              <ProjectsSection
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={(id) => {
                  onSelectProject(id);
                  // Don't close mobile sidebar for project selection
                }}
                onCreateProject={onCreateProject}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
                collapsed={false}
              />
            </div>

            <button
              onClick={() => {
                onNewChat();
                onCloseMobile();
              }}
              className="mb-3 text-sm px-3 py-2 w-full rounded-md text-white transition-colors accent-action-fill accent-focus"
            >
              + New Chat
            </button>
            <div className="text-xs uppercase tracking-wide opacity-60 mb-2">
              Chats
            </div>
            <div className="h-[70vh] overflow-y-auto space-y-1 pr-1">
              {threads.length === 0 && (
                <div className="text-xs opacity-60">No chats yet</div>
              )}
              {threads.map((t) => (
                <div
                  key={t.id}
                  className={`w-full px-2 py-2 rounded-md text-sm border flex items-center justify-between gap-2 group ${
                    t.id === activeId
                      ? "bg-white/15 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectThread(t.id);
                      onCloseMobile();
                    }}
                    className="min-w-0 text-left flex-1 truncate"
                    title={t.title || "Untitled"}
                  >
                    {t.title || "Untitled"}
                  </button>
                  <button
                    aria-label="Delete chat"
                    title="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(t.id);
                    }}
                    className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-300/30 text-zinc-300 hover:text-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete this chat?"
        message="This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            onDeleteThread(confirmDeleteId);
          }
          setConfirmDeleteId(null);
        }}
      />
    </>
  );
}
