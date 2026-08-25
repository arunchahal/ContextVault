import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import ResourceCard from '../components/project/ResourceCard';
import AddResourceModal from '../components/project/AddResourceModal';
import { useToast } from '../components/ui/Toast';
import { getResources, deleteResource } from '../services/resourceService';
import { getProjects } from '../services/projectService';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const { showToast } = useToast();
  const projects = getProjects();
  const projectsMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const fetchResources = useCallback(() => {
    setLoading(true);
    try {
      let results = getResources(projectFilter !== 'all' ? projectFilter : null);

      if (typeFilter !== 'all') {
        results = results.filter(r => r.type === typeFilter);
      }

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        results = results.filter(r =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags?.some(t => t.toLowerCase().includes(q))
        );
      }

      setResources(results);
    } catch (error) {
      showToast('Error loading resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectFilter, typeFilter, query, showToast]);

  useEffect(() => {
    const timer = setTimeout(fetchResources, 200);
    return () => clearTimeout(timer);
  }, [fetchResources]);

  const handleDelete = (id) => {
    deleteResource(id);
    showToast('Resource deleted', 'success');
    fetchResources();
  };

  const projectSelectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.name }))
  ];

  const typeSelectOptions = [
    { value: 'all', label: 'All Resource Types' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'github', label: 'GitHub Repository' },
    { value: 'article', label: 'Article / Blog' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'video', label: 'Video' },
    { value: 'paper', label: 'Research Paper' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <BookOpen className="text-blue-600" size={26} />
            Resources & Documentation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {resources.length} reference links, documentation articles, and research bookmarks across all projects
          </p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Add Resource
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search resources by title, description, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={projectSelectOptions}
          />

          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeSelectOptions}
          />
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading resources...</div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources found"
          description="Try adjusting your filters or search query, or add your first resource."
          action={{ label: 'Add Resource', onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              projectName={projectsMap[resource.projectId]?.name}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddResourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={fetchResources}
      />
    </div>
  );
}
