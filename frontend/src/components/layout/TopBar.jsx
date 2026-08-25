import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Zap, 
  Search, 
  Plus, 
  Briefcase, 
  BookOpen, 
  GitBranch, 
  CheckSquare, 
  ChevronDown 
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { getProjects, createQuickNote } from '../../services/projectService';
import { createResource } from '../../services/resourceService';
import { createDecision } from '../../services/decisionService';
import { createTask } from '../../services/taskService';
import AddResourceModal from '../project/AddResourceModal';
import AddDecisionModal from '../project/AddDecisionModal';
import AddTaskModal from '../project/AddTaskModal';

export default function TopBar({ title, setSidebarOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef(null);

  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [qcContent, setQcContent] = useState('');
  const [qcProject, setQcProject] = useState('');
  const [qcType, setQcType] = useState('note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const projects = getProjects();

  useEffect(() => {
    if (projects.length > 0 && !qcProject) {
      setQcProject(projects[0].id);
    }
  }, [projects, qcProject]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setAddMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickCapture = async (e) => {
    e.preventDefault();
    if (!qcContent.trim()) {
      showToast('Please type something to capture', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (qcType === 'resource') {
        createResource({
          projectId: qcProject || projects[0]?.id,
          title: qcContent.substring(0, 60),
          url: qcContent.startsWith('http') ? qcContent.split(' ')[0] : 'https://google.com',
          type: 'other',
          description: qcContent
        });
      } else if (qcType === 'decision') {
        createDecision({
          projectId: qcProject || projects[0]?.id,
          title: qcContent.substring(0, 60),
          description: qcContent,
          reason: 'Captured from Quick Capture',
          finalChoice: 'To be formalized'
        });
      } else if (qcType === 'task') {
        createTask({
          projectId: qcProject || projects[0]?.id,
          title: qcContent,
          priority: 'medium',
          status: 'todo'
        });
      } else {
        createQuickNote({
          projectId: qcProject || projects[0]?.id,
          type: 'note',
          content: qcContent
        });
      }

      showToast('Captured context saved to project!', 'success');
      setQuickCaptureOpen(false);
      setQcContent('');
    } catch (error) {
      showToast('Failed to save quick capture', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
  const captureTypeOptions = [
    { value: 'note', label: 'Quick Note / Idea' },
    { value: 'task', label: 'Action Item / Task' },
    { value: 'resource', label: 'Resource / Documentation Link' },
    { value: 'decision', label: 'Architecture Decision' }
  ];

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-6 sticky top-0 z-20">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          className="p-1 -ml-1 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Capture Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={Zap}
          onClick={() => setQuickCaptureOpen(true)}
          className="text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
        >
          <span className="hidden sm:inline">Quick Capture</span>
        </Button>

        {/* Global "+ Add" Dropdown */}
        <div className="relative" ref={addMenuRef}>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddMenuOpen(!addMenuOpen)}
          >
            <span>Add</span>
            <ChevronDown size={14} className="ml-1" />
          </Button>

          {addMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-30">
              <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Add to ContextVault
              </div>
              <button
                onClick={() => {
                  setAddMenuOpen(false);
                  navigate('/projects/new');
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md">
                  <Briefcase size={14} />
                </div>
                <span>New Project</span>
              </button>

              <button
                onClick={() => {
                  setAddMenuOpen(false);
                  setResourceModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                  <BookOpen size={14} />
                </div>
                <span>Resource / Bookmark</span>
              </button>

              <button
                onClick={() => {
                  setAddMenuOpen(false);
                  setDecisionModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 bg-purple-50 text-purple-600 rounded-md">
                  <GitBranch size={14} />
                </div>
                <span>Technical Decision</span>
              </button>

              <button
                onClick={() => {
                  setAddMenuOpen(false);
                  setTaskModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
                  <CheckSquare size={14} />
                </div>
                <span>Project Task</span>
              </button>
            </div>
          )}
        </div>

        {/* User avatar circle */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs select-none ml-1"
          title={`Logged in as ${user?.name || 'User'}`}
        >
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>

      {/* Quick Capture Modal (Attached to Project) */}
      <Modal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        title="Quick Capture Project Context"
      >
        <form onSubmit={handleQuickCapture} className="space-y-4">
          <p className="text-xs text-gray-500">
            Quickly jot down ideas, links, or tasks. Context will be saved directly into the selected project.
          </p>

          <Textarea
            label="What do you want to remember?"
            rows={4}
            value={qcContent}
            onChange={(e) => setQcContent(e.target.value)}
            placeholder="e.g. Need to investigate Redis Redlock algorithm for distributed lock consensus..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Related Project *"
              options={projectOptions}
              value={qcProject}
              onChange={(e) => setQcProject(e.target.value)}
            />

            <Select
              label="Context Type"
              options={captureTypeOptions}
              value={qcType}
              onChange={(e) => setQcType(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setQuickCaptureOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={isSubmitting}
              icon={Zap}
            >
              Save Context
            </Button>
          </div>
        </form>
      </Modal>

      {/* Direct Add Entity Modals */}
      <AddResourceModal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={() => navigate('/resources')}
      />

      <AddDecisionModal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={() => navigate('/decisions')}
      />

      <AddTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projectId={projects[0]?.id}
        onCreated={() => navigate('/tasks')}
      />
    </header>
  );
}
