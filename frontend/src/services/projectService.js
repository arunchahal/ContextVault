import { mockProjects, mockProjectHistories, mockQuickNotes } from '../data/mockData';

const PROJECTS_KEY = 'contextvault_projects_v2';
const HISTORIES_KEY = 'contextvault_project_histories_v2';
const QUICK_NOTES_KEY = 'contextvault_quick_notes_v2';

const _getProjects = () => {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
  return mockProjects;
};

const _saveProjects = (projects) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

const _getHistories = () => {
  const stored = localStorage.getItem(HISTORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(HISTORIES_KEY, JSON.stringify(mockProjectHistories));
  return mockProjectHistories;
};

const _saveHistories = (histories) => {
  localStorage.setItem(HISTORIES_KEY, JSON.stringify(histories));
};

const _getQuickNotes = () => {
  const stored = localStorage.getItem(QUICK_NOTES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(QUICK_NOTES_KEY, JSON.stringify(mockQuickNotes));
  return mockQuickNotes;
};

const _saveQuickNotes = (notes) => {
  localStorage.setItem(QUICK_NOTES_KEY, JSON.stringify(notes));
};

export const addHistoryEntry = (projectId, action, description) => {
  const histories = _getHistories();
  if (!histories[projectId]) {
    histories[projectId] = [];
  }
  
  const entry = {
    id: 'h_' + Date.now().toString() + Math.random().toString(36).substring(2, 6),
    projectId,
    action,
    description,
    timestamp: new Date().toISOString()
  };
  
  histories[projectId].unshift(entry);
  _saveHistories(histories);
  return entry;
};

export const getProjects = () => {
  const projects = _getProjects();
  return [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const getProjectById = (id) => {
  const projects = _getProjects();
  return projects.find(p => p.id === id) || null;
};

export const createProject = (data) => {
  const projects = _getProjects();
  const now = new Date().toISOString();
  
  const newProject = {
    ...data,
    id: 'p_' + Date.now().toString(),
    status: data.status || 'planning',
    techStack: data.techStack || [],
    tags: data.tags || [],
    links: {
      github: data.links?.github || '',
      liveDemo: data.links?.liveDemo || '',
      documentation: data.links?.documentation || '',
      figma: data.links?.figma || ''
    },
    team: data.team || ['Arun'],
    pinned: Boolean(data.pinned),
    relatedProjects: data.relatedProjects || [],
    createdAt: now,
    updatedAt: now
  };
  
  projects.unshift(newProject);
  _saveProjects(projects);
  addHistoryEntry(newProject.id, 'created', `Project "${newProject.name}" created`);
  
  return newProject;
};

export const updateProject = (id, data) => {
  const projects = _getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const oldProject = projects[index];
  const updatedProject = {
    ...oldProject,
    ...data,
    links: {
      ...oldProject.links,
      ...(data.links || {})
    },
    updatedAt: new Date().toISOString()
  };
  
  projects[index] = updatedProject;
  _saveProjects(projects);
  addHistoryEntry(id, 'updated', `Project details updated`);
  
  return updatedProject;
};

export const deleteProject = (id) => {
  let projects = _getProjects();
  const projectToDelete = projects.find(p => p.id === id);
  if (!projectToDelete) return false;
  
  // Remove reference from other projects' relatedProjects
  projects = projects.map(p => ({
    ...p,
    relatedProjects: (p.relatedProjects || []).filter(rid => rid !== id)
  }));
  
  const filtered = projects.filter(p => p.id !== id);
  _saveProjects(filtered);
  
  // Clean up histories
  const histories = _getHistories();
  delete histories[id];
  _saveHistories(histories);
  
  return true;
};

export const togglePin = (id) => {
  const projects = _getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return null;
  
  project.pinned = !project.pinned;
  project.updatedAt = new Date().toISOString();
  _saveProjects(projects);
  
  addHistoryEntry(
    id, 
    project.pinned ? 'pinned' : 'unpinned', 
    project.pinned ? 'Project pinned to quick access' : 'Project unpinned'
  );
  
  return project;
};

export const addRelatedProject = (id, relatedId) => {
  const projects = _getProjects();
  const p1 = projects.find(p => p.id === id);
  const p2 = projects.find(p => p.id === relatedId);
  
  if (!p1 || !p2) return null;
  
  if (!p1.relatedProjects) p1.relatedProjects = [];
  if (!p2.relatedProjects) p2.relatedProjects = [];
  
  if (!p1.relatedProjects.includes(relatedId)) {
    p1.relatedProjects.push(relatedId);
    p1.updatedAt = new Date().toISOString();
    addHistoryEntry(id, 'related_added', `Linked related project "${p2.name}"`);
  }
  
  if (!p2.relatedProjects.includes(id)) {
    p2.relatedProjects.push(id);
    p2.updatedAt = new Date().toISOString();
    addHistoryEntry(relatedId, 'related_added', `Linked related project "${p1.name}"`);
  }
  
  _saveProjects(projects);
  return p1;
};

export const removeRelatedProject = (id, relatedId) => {
  const projects = _getProjects();
  const p1 = projects.find(p => p.id === id);
  const p2 = projects.find(p => p.id === relatedId);
  
  if (!p1) return null;
  
  p1.relatedProjects = (p1.relatedProjects || []).filter(rid => rid !== relatedId);
  p1.updatedAt = new Date().toISOString();
  addHistoryEntry(id, 'related_removed', `Removed link to project "${p2 ? p2.name : relatedId}"`);
  
  if (p2) {
    p2.relatedProjects = (p2.relatedProjects || []).filter(rid => rid !== id);
    p2.updatedAt = new Date().toISOString();
    addHistoryEntry(relatedId, 'related_removed', `Removed link to project "${p1.name}"`);
  }
  
  _saveProjects(projects);
  return p1;
};

export const getHistory = (projectId) => {
  const histories = _getHistories();
  const history = histories[projectId] || [];
  return [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getPinnedProjects = () => {
  const projects = _getProjects();
  return projects.filter(p => p.pinned).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const getProjectStats = () => {
  const projects = _getProjects();
  const activeCount = projects.filter(p => p.status === 'in-progress').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const pinnedCount = projects.filter(p => p.pinned).length;
  
  return {
    total: projects.length,
    inProgress: activeCount,
    completed: completedCount,
    pinned: pinnedCount
  };
};

export const getQuickNotes = (projectId = null) => {
  const notes = _getQuickNotes();
  if (projectId) {
    return notes.filter(n => n.projectId === projectId);
  }
  return notes;
};

export const createQuickNote = (data) => {
  const notes = _getQuickNotes();
  const newNote = {
    id: 'qn_' + Date.now().toString(),
    projectId: data.projectId,
    type: data.type || 'note',
    content: data.content,
    createdAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  _saveQuickNotes(notes);
  
  if (data.projectId) {
    addHistoryEntry(data.projectId, 'quick_capture', `Captured note: "${data.content.substring(0, 40)}..."`);
  }
  
  return newNote;
};
