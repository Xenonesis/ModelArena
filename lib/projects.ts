export interface Project {
  id: string;
  name: string;
  systemPrompt: string;
  createdAt: number;
  updatedAt: number;
  isActive?: boolean;
}

export const DEFAULT_PROJECT: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  systemPrompt: '',
  isActive: false,
};

// Generate UUID for projects
export function generateProjectId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return 'proj-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createProject(
  name: string, 
  systemPrompt: string = ''
): Project {
  const now = Date.now();
  return {
    id: generateProjectId(),
    name: name.trim() || 'Untitled Project',
    systemPrompt: systemPrompt.trim(),
    createdAt: now,
    updatedAt: now,
    isActive: false,
  };
}

export function updateProject(
  project: Project, 
  updates: Partial<Pick<Project, 'name' | 'systemPrompt' | 'isActive'>>
): Project {
  return {
    ...project,
    ...updates,
    name: updates.name?.trim() || project.name,
    systemPrompt: updates.systemPrompt?.trim() ?? project.systemPrompt,
    updatedAt: Date.now(),
  };
}

export function validateProjectName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Project name is required';
  if (trimmed.length > 50) return 'Project name must be 50 characters or less';
  return null;
}

export function validateSystemPrompt(prompt: string): string | null {
  if (prompt.length > 1000) return 'System prompt must be 1000 characters or less';
  return null;
}