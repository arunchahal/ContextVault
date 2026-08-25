import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Briefcase, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProjectCard from '../components/project/ProjectCard';
import { useToast } from '../components/ui/Toast';
import { getProjects, deleteProject, togglePin } from '../services/projectService';
import { searchProjects } from '../services/searchService';
import { mockStatusOptions, mockTechList } from '../data/mockData';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [pinnedFilter, setPinnedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchProjects = useCallback(() => {
    setLoading(true);
    try {
      const results = searchProjects(query, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        tech: techFilter !== 'all' ? techFilter : undefined,
        pinned: pinnedFilter === 'pinned' ? true : undefined,
        sortBy
      });
      setProjects(results);
    } catch (error) {
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter, techFilter, pinnedFilter, sortBy, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  const handlePin = (id) => {
    try {
      const res = togglePin(id);
      showToast(res.pinned ? 'Project pinned' : 'Project unpinned', 'success');
      fetchProjects();
    } catch (error) {
      showToast('Failed to update pin status', 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    try {
      deleteProject(projectToDelete);
      showToast('Project deleted successfully', 'success');
      setDeleteConfirmOpen(false);
      fetchProjects();
    } catch (error) {
      showToast('Failed to delete project', 'error');
    }
  };

  const statusSelectOptions = [
    { value: 'all', label: 'All Statuses' },
    ...mockStatusOptions.map(s => ({ value: s.value, label: s.label }))
  ];

  const techSelectOptions = [
    { value: 'all', label: 'All Technologies' },
    ...mockTechList.map(t => ({ value: t, label: t }))
  ];

  const sortSelectOptions = [
    { value: 'updated', label: 'Recently Updated' },
    { value: 'newest', label: 'Newest Created' },
    { value: 'oldest', label: 'Oldest Created' },
    { value: 'alphabetical', label: 'Alphabetical (A-Z)' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} software {projects.length === 1 ? 'project' : 'projects'} in your vault
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/projects/new')}>
          Add Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search projects by name, description, tech stack, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusSelectOptions}
          />

          <Select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            options={techSelectOptions}
          />

          <Select
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All / Pinned' },
              { value: 'pinned', label: 'Pinned Only' }
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortSelectOptions}
          />
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects found"
          description="Try adjusting your search query, status, or technology filters."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setQuery('');
              setStatusFilter('all');
              setTechFilter('all');
              setPinnedFilter('all');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPin={() => handlePin(project.id)}
              onDelete={() => handleDeleteClick(project.id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will remove all context, decisions, resources, and tasks."
        confirmLabel="Delete Project"
        confirmVariant="danger"
      />
    </div>
  );
}
