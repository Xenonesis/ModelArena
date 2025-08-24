"use client";
import { useState, useEffect } from 'react';
import { Project } from '@/lib/projects';

const STORAGE_KEY = 'ai-fiesta:projects';
const ACTIVE_PROJECT_KEY = 'ai-fiesta:active-project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved) as Project[];
        setProjects(Array.isArray(parsed) ? parsed : []);
      }
      
      if (activeId && activeId !== 'null') {
        setActiveProjectId(activeId);
      }
    } catch (error) {
      console.warn('Failed to load projects from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.warn('Failed to save projects to localStorage:', error);
      }
    }
  }, [projects, isLoaded]);

  // Save active project ID to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (activeProjectId) {
          localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
        } else {
          localStorage.removeItem(ACTIVE_PROJECT_KEY);
        }
      } catch (error) {
        console.warn('Failed to save active project to localStorage:', error);
      }
    }
  }, [activeProjectId, isLoaded]);

  const createProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // If deleting the active project, clear active selection
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  };

  const selectProject = (id: string | null) => {
    setActiveProjectId(id);
  };

  const getActiveProject = (): Project | null => {
    if (!activeProjectId) return null;
    return projects.find(p => p.id === activeProjectId) || null;
  };

  const getProjectById = (id: string): Project | null => {
    return projects.find(p => p.id === id) || null;
  };

  return {
    projects,
    activeProjectId,
    activeProject: getActiveProject(),
    isLoaded,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    getProjectById,
  };
}