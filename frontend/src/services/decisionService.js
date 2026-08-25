import { mockDecisions } from '../data/mockData';
import { addHistoryEntry } from './projectService';

const DECISIONS_KEY = 'contextvault_decisions_v2';

const _getDecisions = () => {
  const stored = localStorage.getItem(DECISIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(mockDecisions));
  return mockDecisions;
};

const _saveDecisions = (decisions) => {
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
};

export const getDecisions = (projectId = null) => {
  const decisions = _getDecisions();
  if (projectId) {
    return decisions.filter(d => d.projectId === projectId);
  }
  return [...decisions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getDecisionById = (id) => {
  const decisions = _getDecisions();
  return decisions.find(d => d.id === id) || null;
};

export const createDecision = (data) => {
  const decisions = _getDecisions();
  const newDecision = {
    ...data,
    id: 'd_' + Date.now().toString(),
    alternatives: data.alternatives || [],
    createdAt: new Date().toISOString()
  };
  
  decisions.unshift(newDecision);
  _saveDecisions(decisions);
  
  if (newDecision.projectId) {
    addHistoryEntry(newDecision.projectId, 'decision_added', `Added technical decision: "${newDecision.title}"`);
  }
  
  return newDecision;
};

export const updateDecision = (id, data) => {
  const decisions = _getDecisions();
  const index = decisions.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  const updated = {
    ...decisions[index],
    ...data
  };
  
  decisions[index] = updated;
  _saveDecisions(decisions);
  return updated;
};

export const deleteDecision = (id) => {
  const decisions = _getDecisions();
  const decision = decisions.find(d => d.id === id);
  if (!decision) return false;
  
  const filtered = decisions.filter(d => d.id !== id);
  _saveDecisions(filtered);
  
  if (decision.projectId) {
    addHistoryEntry(decision.projectId, 'decision_removed', `Removed decision: "${decision.title}"`);
  }
  
  return true;
};
