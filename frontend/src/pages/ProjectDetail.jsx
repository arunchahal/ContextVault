import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Pin, 
  PinOff, 
  Plus, 
  Code2, 
  Globe, 
  BookOpen, 
  Layers, 
  ExternalLink, 
  GitBranch, 
  CheckSquare, 
  Clock, 
  Users, 
  Send, 
  Briefcase 
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ResourceCard from '../components/project/ResourceCard';
import DecisionCard from '../components/project/DecisionCard';
import TaskItem from '../components/project/TaskItem';
import RelatedProjectCard from '../components/project/RelatedProjectCard';
import HistoryItem from '../components/project/HistoryItem';
import AddResourceModal from '../components/project/AddResourceModal';
import AddDecisionModal from '../components/project/AddDecisionModal';
import AddTaskModal from '../components/project/AddTaskModal';
import { useToast } from '../components/ui/Toast';
import { formatDate } from '../utils/formatDate';
import { 
  getProjectById, 
  getProjects, 
  deleteProject, 
  togglePin, 
  addRelatedProject, 
  removeRelatedProject, 
  getHistory,
  getQuickNotes,
  createQuickNote
} from '../../src/services/projectService';
import { getResources, deleteResource } from '../../src/services/resourceService';
import { getDecisions, deleteDecision } from '../../src/services/decisionService';
import { getTasks, toggleTaskStatus, deleteTask } from '../../src/services/taskService';

const getStatusBadge = (status) => {
  switch (status) {
    case 'in-progress':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>In Progress</span>;
    case 'completed':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-2 h-2 rounded-full bg-emerald-600"></span>Completed</span>;
    case 'planning':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"><span className="w-2 h-2 rounded-full bg-purple-600"></span>Planning</span>;
    case 'on-hold':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><span className="w-2 h-2 rounded-full bg-amber-600"></span>On Hold</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200"><span className="w-2 h-2 rounded-full bg-gray-500"></span>Archived</span>;
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [resources, setResources] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [relatedModalOpen, setRelatedModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Quick note input
  const [newNoteContent, setNewNoteContent] = useState('');

  // Related project picker search
  const [relSearchQuery, setRelSearchQuery] = useState('');
  const [selectedRelIds, setSelectedRelIds] = useState(new Set());

  const fetchProjectData = useCallback(() => {
    setLoading(true);
    try {
      const p = getProjectById(id);
      if (!p) {
        setProject(null);
      } else {
        setProject(p);
        setResources(getResources(id));
        setDecisions(getDecisions(id));
        setTasks(getTasks(id));
        setHistory(getHistory(id));
        setNotes(getQuickNotes(id));
      }
    } catch (error) {
      showToast('Error loading project details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handlePinToggle = () => {
    try {
      const res = togglePin(id);
      showToast(res.pinned ? 'Project pinned' : 'Project unpinned', 'success');
      fetchProjectData();
    } catch (error) {
      showToast('Error updating pin status', 'error');
    }
  };

  const handleDeleteProject = () => {
    try {
      deleteProject(id);
      showToast('Project deleted', 'success');
      navigate('/projects');
    } catch (error) {
      showToast('Error deleting project', 'error');
    }
  };

  const handleToggleTask = (taskId) => {
    toggleTaskStatus(taskId);
    fetchProjectData();
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    showToast('Task removed', 'success');
    fetchProjectData();
  };

  const handleDeleteResource = (resId) => {
    deleteResource(resId);
    showToast('Resource removed', 'success');
    fetchProjectData();
  };

  const handleDeleteDecision = (decId) => {
    deleteDecision(decId);
    showToast('Decision removed', 'success');
    fetchProjectData();
  };

  const handleAddQuickNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    createQuickNote({
      projectId: id,
      type: 'note',
      content: newNoteContent.trim()
    });
    setNewNoteContent('');
    showToast('Note added to project', 'success');
    fetchProjectData();
  };

  const handleRemoveRelated = (relatedId) => {
    removeRelatedProject(id, relatedId);
    showToast('Removed related project link', 'success');
    fetchProjectData();
  };

  const handleAddSelectedRelated = () => {
    selectedRelIds.forEach(relId => {
      addRelatedProject(id, relId);
    });
    showToast('Linked related projects', 'success');
    setRelatedModalOpen(false);
    setSelectedRelIds(new Set());
    fetchProjectData();
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading project context...</div>;
  }

  if (!project) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Project Not Found"
        description="The project you are looking for does not exist or has been deleted."
        action={{ label: 'Back to Projects', onClick: () => navigate('/projects') }}
      />
    );
  }

  const allProjects = getProjects();
  const allProjectsMap = allProjects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const availableRelatedToLink = allProjects.filter(p => 
    p.id !== id && 
    !(project.relatedProjects || []).includes(p.id) &&
    (p.name.toLowerCase().includes(relSearchQuery.toLowerCase()) ||
     p.description.toLowerCase().includes(relSearchQuery.toLowerCase()))
  );

  const completedTaskCount = tasks.filter(t => t.status === 'completed').length;
  const taskProgressPercent = tasks.length > 0 ? Math.round((completedTaskCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Bar: Back link and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Projects
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            icon={project.pinned ? PinOff : Pin}
            onClick={handlePinToggle}
            size="sm"
          >
            {project.pinned ? 'Unpin' : 'Pin Project'}
          </Button>
          <Button
            variant="secondary"
            icon={Pencil}
            onClick={() => navigate(`/projects/${id}/edit`)}
            size="sm"
          >
            Edit Project
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => setDeleteConfirmOpen(true)}
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Project Overview Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {project.name}
              </h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Project Links Ribbon */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-gray-100">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Code2 size={14} />
              GitHub Repository
              <ExternalLink size={11} className="opacity-70" />
            </a>
          )}

          {project.links?.liveDemo && (
            <a
              href={project.links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Globe size={14} />
              Live Demo
              <ExternalLink size={11} className="opacity-70" />
            </a>
          )}

          {project.links?.documentation && (
            <a
              href={project.links.documentation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
            >
              <BookOpen size={14} />
              Documentation
              <ExternalLink size={11} />
            </a>
          )}

          {project.links?.figma && (
            <a
              href={project.links.figma}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors"
            >
              <Layers size={14} />
              Figma Design
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Tech Stack and Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Technology Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack?.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Project Tags & Team
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  #{tag}
                </span>
              ))}
              {project.team?.map((member) => (
                <span key={member} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <Users size={12} /> {member}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Context / Problem / Solution */}
        {project.detailedDescription && (
          <div className="pt-5 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              Architecture & Project Context
            </h3>
            <div className="prose prose-indigo max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              {project.detailedDescription}
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>Created: {formatDate(project.createdAt)}</span>
          <span>•</span>
          <span>Last Updated: {formatDate(project.updatedAt)}</span>
        </div>
      </div>

      {/* 2. Resources Section */}
      <section className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Resources & Documentation
            </h2>
            <p className="text-xs text-gray-500">API docs, articles, research papers, and reference tutorials</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Plus} 
            onClick={() => setResourceModalOpen(true)}
          >
            Add Resource
          </Button>
        </div>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <BookOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">No resources added yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Save documentation links and research papers relevant to this project.</p>
          </div>
        )}
      </section>

      {/* 3. Technical Decisions Section */}
      <section className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <GitBranch size={20} className="text-purple-600" />
              Technical Decisions & Architecture Rationale
            </h2>
            <p className="text-xs text-gray-500">Why specific frameworks, algorithms, or databases were selected over alternatives</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Plus} 
            onClick={() => setDecisionModalOpen(true)}
          >
            Record Decision
          </Button>
        </div>

        {decisions.length > 0 ? (
          <div className="space-y-4 pt-2">
            {decisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onDelete={handleDeleteDecision}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <GitBranch className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">No technical decisions recorded yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Document why choices like Redis vs SQL or Token Bucket were made so you never forget.</p>
          </div>
        )}
      </section>

      {/* 4. Tasks Section */}
      <section className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare size={20} className="text-emerald-600" />
              Action Items & Project Tasks
            </h2>
            <p className="text-xs text-gray-500">
              {completedTaskCount} of {tasks.length} tasks completed ({taskProgressPercent}%)
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Plus} 
            onClick={() => setTaskModalOpen(true)}
          >
            Add Task
          </Button>
        </div>

        {/* Task progress bar */}
        {tasks.length > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${taskProgressPercent}%` }}
            ></div>
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="space-y-2 pt-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <CheckSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">No tasks created yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Track what needs to be implemented next.</p>
          </div>
        )}
      </section>

      {/* 5. Quick Project Notes */}
      <section className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock size={18} className="text-amber-600" />
          Quick Scratchpad Notes
        </h2>

        <form onSubmit={handleAddQuickNote} className="flex gap-2">
          <Input
            placeholder="Type a quick thought or reminder for this project..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
          />
          <Button type="submit" variant="secondary" icon={Send}>
            Add Note
          </Button>
        </form>

        {notes.length > 0 ? (
          <div className="space-y-2 pt-2">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-900 flex items-start justify-between">
                <span>{note.content}</span>
                <span className="text-[10px] text-amber-700 shrink-0 ml-2">{formatDate(note.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No quick scratchpad notes for this project.</p>
        )}
      </section>

      {/* 6. Related Projects Section */}
      <section className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" />
              Related Projects
            </h2>
            <p className="text-xs text-gray-500">Connected repositories and microservices</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Plus} 
            onClick={() => {
              setRelSearchQuery('');
              setSelectedRelIds(new Set());
              setRelatedModalOpen(true);
            }}
          >
            Link Project
          </Button>
        </div>

        {project.relatedProjects && project.relatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {project.relatedProjects.map((relId) => {
              const relProj = allProjectsMap[relId];
              return (
                <RelatedProjectCard
                  key={relId}
                  project={relProj || { id: relId, name: 'Project ' + relId }}
                  onRemove={handleRemoveRelated}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500">
            No related projects linked yet.
          </div>
        )}
      </section>

      {/* 7. Project History Timeline */}
      {history && history.length > 0 && (
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Project History & Evolution
          </h2>
          <div className="space-y-1">
            {history.map((entry, idx) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                isLast={idx === history.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <AddResourceModal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        projectId={id}
        onCreated={fetchProjectData}
      />

      <AddDecisionModal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        projectId={id}
        onCreated={fetchProjectData}
      />

      <AddTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projectId={id}
        onCreated={fetchProjectData}
      />

      {/* Link Related Project Modal */}
      <Modal
        isOpen={relatedModalOpen}
        onClose={() => setRelatedModalOpen(false)}
        title="Link Related Project"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search projects..."
            value={relSearchQuery}
            onChange={(e) => setRelSearchQuery(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {availableRelatedToLink.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-4">
                No other projects available to link.
              </div>
            ) : (
              availableRelatedToLink.map((p) => {
                const isSelected = selectedRelIds.has(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      const next = new Set(selectedRelIds);
                      if (next.has(p.id)) next.delete(p.id);
                      else next.add(p.id);
                      setSelectedRelIds(next);
                    }}
                    className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold text-indigo-600">✓ Selected</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setRelatedModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSelectedRelated}
              disabled={selectedRelIds.size === 0}
            >
              Add Selected ({selectedRelIds.size})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmLabel="Delete Project"
        confirmVariant="danger"
      />
    </div>
  );
}
