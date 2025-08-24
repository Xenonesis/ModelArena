"use client";
import { useState } from "react";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Project } from "@/lib/projects";
import ProjectModal from "@/components/modals/ProjectModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface ProjectsSectionProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  collapsed: boolean;
}

export default function ProjectsSection({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  collapsed,
}: ProjectsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleSave = (project: Project) => {
    if (editingProject) {
      onUpdateProject(project);
    } else {
      onCreateProject(project);
    }
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDeleteProject(confirmDeleteId);
      // If we're deleting the active project, deselect it
      if (confirmDeleteId === activeProjectId) {
        onSelectProject(null);
      }
    }
    setConfirmDeleteId(null);
  };

  if (collapsed) {
    return (
      <>
        {/* Collapsed view */}
        <div className="flex flex-col items-center gap-2 pt-2">
          {/* Add project button */}
          <button
            title="New Project"
            onClick={handleCreateNew}
            className="h-8 w-8 rounded-full flex items-center justify-center text-white transition-colors accent-action-fill accent-focus"
          >
            <Plus size={14} />
          </button>

          {/* Project indicators */}
          {projects.map((project) => {
            const isActive = project.id === activeProjectId;
            const initial = project.name.trim()[0]?.toUpperCase() || 'P';
            return (
              <button
                key={project.id}
                title={project.name}
                onClick={() => onSelectProject(project.id)}
                className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none 
                  ${
                    isActive
                      ? "bg-[var(--accent-interactive-primary)] ring-1 ring-[var(--accent-interactive-hover)] ring-offset-1 ring-offset-black text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                  }`}
              >
                <span className="text-[10px] font-semibold leading-none">
                  {initial}
                </span>
              </button>
            );
          })}
        </div>

        <ProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          project={editingProject}
        />

        <ConfirmDialog
          open={!!confirmDeleteId}
          title="Delete project?"
          message="This will permanently delete the project and cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </>
    );
  }

  return (
    <>
      {/* Expanded view */}
      <div className="space-y-2">
        {/* Header with add button */}
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide opacity-60">
            Projects
          </div>
          <button
            title="New Project"
            onClick={handleCreateNew}
            className="h-6 w-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* No projects message */}
        {projects.length === 0 && (
          <div className="text-xs opacity-60 py-2">No projects yet</div>
        )}

        {/* None/Default option */}
        <div
          className={`w-full px-2 py-2 rounded-md text-sm border flex items-center justify-between gap-2 group cursor-pointer ${
            activeProjectId === null
              ? "bg-white/15 border-white/20"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
          onClick={() => onSelectProject(null)}
        >
          <div className="min-w-0 text-left flex-1">
            <div className="truncate font-medium">No Project</div>
            <div className="text-xs opacity-60 truncate">Default system behavior</div>
          </div>
        </div>

        {/* Project list */}
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          return (
            <div
              key={project.id}
              className={`w-full px-2 py-2 rounded-md text-sm border flex items-center justify-between gap-2 group ${
                isActive
                  ? "bg-white/15 border-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => onSelectProject(project.id)}
                className="min-w-0 text-left flex-1"
                title={`${project.name}${project.systemPrompt ? `\n\nSystem prompt: ${project.systemPrompt}` : ''}`}
              >
                <div className="truncate font-medium">{project.name}</div>
                {project.systemPrompt && (
                  <div className="text-xs opacity-60 truncate">
                    {project.systemPrompt}
                  </div>
                )}
              </button>
              
              {/* Action buttons */}
              <div className="flex gap-1 shrink-0">
                <button
                  aria-label="Edit project"
                  title="Edit project"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project);
                  }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-blue-500/20 hover:border-blue-300/30 text-zinc-300 hover:text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Settings size={12} />
                </button>
                <button
                  aria-label="Delete project"
                  title="Delete project"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-300/30 text-zinc-300 hover:text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete project?"
        message="This will permanently delete the project and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}