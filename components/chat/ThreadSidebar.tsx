"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 256 : 56,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={`relative hidden lg:flex shrink-0 h-[calc(100vh-13rem)] rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-3 flex-col shadow-xl shadow-black/20`}
      >
        {/* Collapse/Expand toggle */}
        <motion.button
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={onToggleSidebar}
          className="absolute -right-3 top-5 z-10 h-6 w-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={14} />
          </motion.div>
        </motion.button>

        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                />
                <h2 className="text-sm font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ModelArena
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              {/* Projects Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4"
              >
                <ProjectsSection
                  projects={projects}
                  activeProjectId={activeProjectId}
                  onSelectProject={onSelectProject}
                  onCreateProject={onCreateProject}
                  onUpdateProject={onUpdateProject}
                  onDeleteProject={onDeleteProject}
                  collapsed={false}
                />
              </motion.div>

              <motion.button
                onClick={onNewChat}
                className="mb-3 text-sm px-3 py-2 rounded-md text-white shadow transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-white/10"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                + New Chat
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-xs uppercase tracking-wide opacity-60 mb-2"
              >
                Chats
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex-1 overflow-y-auto space-y-1 pr-1"
              >
                {threads.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs opacity-60 text-center py-4"
                  >
                    No chats yet
                  </motion.div>
                )}
                <AnimatePresence>
                  {threads.map((t, index) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className={`w-full px-2 py-2 rounded-md text-sm border flex items-center justify-between gap-2 group transition-all duration-200 backdrop-blur-sm ${
                        t.id === activeId
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 shadow-lg shadow-purple-500/10"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <button
                        onClick={() => onSelectThread(t.id)}
                        className="min-w-0 text-left flex-1 truncate"
                        title={t.title || "Untitled"}
                      >
                        {t.title || "Untitled"}
                      </button>
                      <motion.button
                        aria-label="Delete chat"
                        title="Delete chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(t.id);
                        }}
                        className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-300/30 text-zinc-300 hover:text-rose-100 transition-all duration-200"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center pt-6"
            >
              {/* Projects Section (Collapsed) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4 w-full"
              >
                <ProjectsSection
                  projects={projects}
                  activeProjectId={activeProjectId}
                  onSelectProject={onSelectProject}
                  onCreateProject={onCreateProject}
                  onUpdateProject={onUpdateProject}
                  onDeleteProject={onDeleteProject}
                  collapsed={true}
                />
              </motion.div>

              {/* New chat button */}
              <motion.button
                title="New Chat"
                onClick={onNewChat}
                className="h-8 w-8 rounded-full flex items-center justify-center mb-4 mx-auto shrink-0 text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-white/10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Plus size={14} />
              </motion.button>

              {/* Mini chat boxes list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-2 pt-1 pb-2"
              >
                <AnimatePresence>
                  {threads.map((t, index) => {
                    const isActive = t.id === activeId;
                    const letter =
                      (t.title || "Untitled").trim()[0]?.toUpperCase() || "N";
                    return (
                      <motion.button
                        key={t.id}
                        title={t.title || "Untitled"}
                        onClick={() => onSelectThread(t.id)}
                        className={`h-6 w-6 aspect-square rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none mx-auto shrink-0 backdrop-blur-sm
                          ${
                            isActive
                              ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 ring-2 ring-purple-400/50 ring-offset-1 ring-offset-black shadow-lg shadow-purple-500/20"
                              : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                          }`}
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <span className="text-[10px] font-semibold leading-none">
                          {letter}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 pt-20"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: -288, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -288, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-72 bg-zinc-900/90 backdrop-blur-lg border-r border-white/10 p-3 pt-6 shadow-2xl"
            >
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
            <div className="h-[calc(100vh-16rem)] overflow-y-auto space-y-1 pr-1">
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
              ))}            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
