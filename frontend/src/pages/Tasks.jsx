import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import TaskItem from '../components/project/TaskItem';
import AddTaskModal from '../components/project/AddTaskModal';
import { useToast } from '../components/ui/Toast';
import { getTasks, toggleTaskStatus, deleteTask } from '../services/taskService';
import { getProjects } from '../services/projectService';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const { showToast } = useToast();
  const projects = getProjects();
  const projectsMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const fetchTasks = useCallback(() => {
    setLoading(true);
    try {
      let results = getTasks(projectFilter !== 'all' ? projectFilter : null);

      if (statusFilter !== 'all') {
        results = results.filter(t => t.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
        results = results.filter(t => t.priority === priorityFilter);
      }

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        results = results.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
        );
      }

      setTasks(results);
    } catch (error) {
      showToast('Error loading project tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectFilter, statusFilter, priorityFilter, query, showToast]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 200);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleToggle = (id) => {
    toggleTaskStatus(id);
    fetchTasks();
  };

  const handleDelete = (id) => {
    deleteTask(id);
    showToast('Task removed', 'success');
    fetchTasks();
  };

  const projectSelectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.name }))
  ];

  const statusSelectOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const prioritySelectOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <CheckSquare className="text-emerald-600" size={26} />
            Project Action Items & Tasks
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {completedCount} of {tasks.length} tasks completed across your projects
          </p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Add Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search tasks by title or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={projectSelectOptions}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusSelectOptions}
          />

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={prioritySelectOptions}
          />
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Keep track of action items, backlog features, and bug fixes."
          action={{ label: 'Add Task', onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectName={projectsMap[task.projectId]?.name}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={fetchTasks}
      />
    </div>
  );
}
