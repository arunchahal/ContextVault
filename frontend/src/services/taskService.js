import { mockTasks } from '../data/mockData';
import { addHistoryEntry } from './projectService';

const TASKS_KEY = 'contextvault_tasks_v2';

const _getTasks = () => {
  const stored = localStorage.getItem(TASKS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
  return mockTasks;
};

const _saveTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getTasks = (projectId = null) => {
  const tasks = _getTasks();
  if (projectId) {
    return tasks.filter(t => t.projectId === projectId);
  }
  return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getTaskById = (id) => {
  const tasks = _getTasks();
  return tasks.find(t => t.id === id) || null;
};

export const createTask = (data) => {
  const tasks = _getTasks();
  const newTask = {
    ...data,
    id: 't_' + Date.now().toString(),
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    createdAt: new Date().toISOString()
  };
  
  tasks.unshift(newTask);
  _saveTasks(tasks);
  
  if (newTask.projectId) {
    addHistoryEntry(newTask.projectId, 'task_added', `Added task: "${newTask.title}"`);
  }
  
  return newTask;
};

export const updateTask = (id, data) => {
  const tasks = _getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updated = {
    ...tasks[index],
    ...data
  };
  
  tasks[index] = updated;
  _saveTasks(tasks);
  return updated;
};

export const toggleTaskStatus = (id) => {
  const tasks = _getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  
  // Transition: todo -> in-progress -> completed -> todo
  const nextStatus = {
    'todo': 'in-progress',
    'in-progress': 'completed',
    'completed': 'todo'
  };
  
  task.status = nextStatus[task.status] || 'todo';
  _saveTasks(tasks);
  
  if (task.projectId && task.status === 'completed') {
    addHistoryEntry(task.projectId, 'task_completed', `Completed task: "${task.title}"`);
  }
  
  return task;
};

export const deleteTask = (id) => {
  const tasks = _getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return false;
  
  const filtered = tasks.filter(t => t.id !== id);
  _saveTasks(filtered);
  
  if (task.projectId) {
    addHistoryEntry(task.projectId, 'task_removed', `Removed task: "${task.title}"`);
  }
  
  return true;
};
