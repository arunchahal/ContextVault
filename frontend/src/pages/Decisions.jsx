import React, { useState, useEffect, useCallback } from 'react';
import { GitBranch, Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import DecisionCard from '../components/project/DecisionCard';
import AddDecisionModal from '../components/project/AddDecisionModal';
import { useToast } from '../components/ui/Toast';
import { getDecisions, deleteDecision } from '../services/decisionService';
import { getProjects } from '../services/projectService';

export default function Decisions() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const { showToast } = useToast();
  const projects = getProjects();
  const projectsMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const fetchDecisions = useCallback(() => {
    setLoading(true);
    try {
      let results = getDecisions(projectFilter !== 'all' ? projectFilter : null);

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        results = results.filter(d =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q) ||
          d.finalChoice.toLowerCase().includes(q)
        );
      }

      setDecisions(results);
    } catch (error) {
      showToast('Error loading technical decisions', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectFilter, query, showToast]);

  useEffect(() => {
    const timer = setTimeout(fetchDecisions, 200);
    return () => clearTimeout(timer);
  }, [fetchDecisions]);

  const handleDelete = (id) => {
    deleteDecision(id);
    showToast('Decision removed', 'success');
    fetchDecisions();
  };

  const projectSelectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.name }))
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <GitBranch className="text-purple-600" size={26} />
            Technical Decisions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {decisions.length} recorded architectural trade-offs, rationale, and technology choices
          </p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Record Decision
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search decisions by title, trade-off, rationale, or final choice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <Select
          label="Filter by Project"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          options={projectSelectOptions}
        />
      </div>

      {/* Decisions List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading decisions...</div>
      ) : decisions.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="No technical decisions found"
          description="Document why specific databases, patterns, or tools were chosen for your projects."
          action={{ label: 'Record Decision', onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              projectName={projectsMap[decision.projectId]?.name}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddDecisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={fetchDecisions}
      />
    </div>
  );
}
