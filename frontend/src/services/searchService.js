import { getProjects } from './projectService';
import { getResources } from './resourceService';
import { getDecisions } from './decisionService';
import { getTasks } from './taskService';

export const searchProjects = (query = '', filters = {}) => {
  let results = getProjects();
  
  // Text query match
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    results = results.filter(project => {
      const matchName = project.name?.toLowerCase().includes(q);
      const matchDesc = project.description?.toLowerCase().includes(q);
      const matchDetail = project.detailedDescription?.toLowerCase().includes(q);
      const matchTech = project.techStack?.some(t => t.toLowerCase().includes(q));
      const matchTags = project.tags?.some(tag => tag.toLowerCase().includes(q));
      
      return matchName || matchDesc || matchDetail || matchTech || matchTags;
    });
  }
  
  // Status filter
  if (filters.status && filters.status !== 'all') {
    results = results.filter(project => project.status === filters.status);
  }
  
  // Pinned filter
  if (filters.pinned !== undefined && filters.pinned !== null) {
    results = results.filter(project => project.pinned === filters.pinned);
  }
  
  // Tech filter
  if (filters.tech && filters.tech !== 'all') {
    results = results.filter(project => 
      project.techStack?.some(t => t.toLowerCase() === filters.tech.toLowerCase())
    );
  }
  
  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(project => 
      project.tags?.some(tag => filters.tags.includes(tag))
    );
  }
  
  // Sorting
  const sortBy = filters.sortBy || 'updated';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'updated':
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });
  
  return results;
};

export const globalSearch = (query = '') => {
  if (!query || query.trim() === '') {
    return { projects: [], resources: [], decisions: [], tasks: [] };
  }
  
  const q = query.toLowerCase().trim();
  const allProjects = getProjects();
  const allResources = getResources();
  const allDecisions = getDecisions();
  const allTasks = getTasks();
  
  const projects = allProjects.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.techStack.some(t => t.toLowerCase().includes(q)) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
  
  const resources = allResources.filter(r => 
    r.title.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q))
  );
  
  const decisions = allDecisions.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.reason.toLowerCase().includes(q) ||
    d.finalChoice.toLowerCase().includes(q)
  );
  
  const tasks = allTasks.filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q)
  );
  
  return {
    projects,
    resources,
    decisions,
    tasks
  };
};
