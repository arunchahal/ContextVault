import { mockResources } from '../data/mockData';
import { addHistoryEntry } from './projectService';

const RESOURCES_KEY = 'contextvault_resources_v2';

const _getResources = () => {
  const stored = localStorage.getItem(RESOURCES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(mockResources));
  return mockResources;
};

const _saveResources = (resources) => {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
};

export const getResources = (projectId = null) => {
  const resources = _getResources();
  if (projectId) {
    return resources.filter(r => r.projectId === projectId);
  }
  return [...resources].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getResourceById = (id) => {
  const resources = _getResources();
  return resources.find(r => r.id === id) || null;
};

export const createResource = (data) => {
  const resources = _getResources();
  const newResource = {
    ...data,
    id: 'r_' + Date.now().toString(),
    tags: data.tags || [],
    createdAt: new Date().toISOString()
  };
  
  resources.unshift(newResource);
  _saveResources(resources);
  
  if (newResource.projectId) {
    addHistoryEntry(newResource.projectId, 'resource_added', `Added resource: "${newResource.title}"`);
  }
  
  return newResource;
};

export const updateResource = (id, data) => {
  const resources = _getResources();
  const index = resources.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  const updated = {
    ...resources[index],
    ...data
  };
  
  resources[index] = updated;
  _saveResources(resources);
  return updated;
};

export const deleteResource = (id) => {
  const resources = _getResources();
  const resource = resources.find(r => r.id === id);
  if (!resource) return false;
  
  const filtered = resources.filter(r => r.id !== id);
  _saveResources(filtered);
  
  if (resource.projectId) {
    addHistoryEntry(resource.projectId, 'resource_removed', `Removed resource: "${resource.title}"`);
  }
  
  return true;
};
