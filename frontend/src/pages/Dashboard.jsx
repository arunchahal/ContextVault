import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Briefcase, 
  Activity, 
  CheckCircle2, 
  GitBranch, 
  ArrowRight 
} from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import ProjectCard from '../components/project/ProjectCard';
import DecisionCard from '../components/project/DecisionCard';
import { 
  getProjects, 
  getProjectStats, 
  deleteProject, 
  togglePin 
} from '../services/projectService';
import { getDecisions, deleteDecision } from '../services/decisionService';
import { getGreeting } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Delete Project Confirm Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const loadData = () => {
    try {
      setLoading(true);
      const allProjects = getProjects();
      const dashboardStats = getProjectStats();
      const decisions = getDecisions().slice(0, 4);

      setProjects(allProjects);
      setStats({
        total: dashboardStats.total,
        inProgress: dashboardStats.inProgress,
        completed: dashboardStats.completed
      });
      setRecentDecisions(decisions);
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePinToggle = (id) => {
    try {
      const res = togglePin(id);
      showToast(res.pinned ? 'Project pinned' : 'Project unpinned', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to update pin status', 'error');
    }
  };

  const handleDeleteRequest = (id) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    try {
      deleteProject(projectToDelete);
      showToast('Project deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to delete project', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  const allProjectsMap = getProjects().reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ContextVault • Project Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name || 'Developer'}
          </h1>
          <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-2xl">
            Keep the complete context of your software projects in one place: architecture, decisions, resources, and tasks.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="secondary" 
            icon={Plus} 
            onClick={() => navigate('/projects/new')}
            className="bg-white text-indigo-900 hover:bg-indigo-50 border-transparent font-semibold shadow-xs"
          >
            Add Project
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={Briefcase} 
          label="Total Projects" 
          value={stats.total} 
          bgColor="bg-indigo-50" 
          iconColor="text-indigo-600" 
        />
        <StatCard 
          icon={Activity} 
          label="In Progress" 
          value={stats.inProgress} 
          bgColor="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed" 
          value={stats.completed} 
          bgColor="bg-emerald-50" 
          iconColor="text-emerald-600" 
        />
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
            <p className="text-xs text-gray-500">Active and recently updated software repositories</p>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
            View all ({projects.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPin={handlePinToggle}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start managing your project context by adding your first project.</p>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/projects/new')}>
              Add First Project
            </Button>
          </div>
        )}
      </div>

      {/* Recent Technical Decisions Section */}
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <GitBranch size={18} className="text-purple-600" />
              Recent Technical Decisions
            </h3>
            <p className="text-xs text-gray-500">Architectural rationale and alternatives recorded across projects</p>
          </div>
          <Link to="/decisions" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
            View all decisions <ArrowRight size={12} />
          </Link>
        </div>

        {recentDecisions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                projectName={allProjectsMap[decision.projectId]?.name}
                onDelete={(id) => {
                  deleteDecision(id);
                  showToast('Decision deleted', 'success');
                  loadData();
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">
            No technical decisions recorded yet.
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated resources, decisions, tasks, and history will be permanently deleted."
        confirmLabel="Delete Project"
        confirmVariant="danger"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-2xs">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={iconColor} size={22} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}
