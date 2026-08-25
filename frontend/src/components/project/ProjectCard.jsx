import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, 
  Pencil, 
  Pin, 
  Trash2, 
  Code2, 
  ExternalLink, 
  ArrowRight,
  BookOpen,
  GitBranch,
  CheckSquare
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import { getResources } from '../../services/resourceService';
import { getDecisions } from '../../services/decisionService';
import { getTasks } from '../../services/taskService';

const getStatusBadge = (status) => {
  switch (status) {
    case 'in-progress':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>In Progress</span>;
    case 'completed':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>Completed</span>;
    case 'planning':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>Planning</span>;
    case 'on-hold':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>On Hold</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>Archived</span>;
  }
};

export default function ProjectCard({ project, onPin, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Dynamic entity counts
  const resourceCount = getResources(project.id).length;
  const decisionCount = getDecisions(project.id).length;
  const taskCount = getTasks(project.id).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardClick = (e) => {
    if (menuRef.current && menuRef.current.contains(e.target)) return;
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    navigate(`/projects/${project.id}/edit`);
  };

  const handlePin = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onPin) onPin(project.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) onDelete(project.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between h-full group"
    >
      <div>
        {/* Top bar: Title & Pin/Menu */}
        <div className="flex justify-between items-start gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            {project.pinned && (
              <Pin size={16} className="text-amber-500 fill-amber-500 shrink-0" title="Pinned Project" />
            )}
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
              {project.name}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {getStatusBadge(project.status)}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pencil size={13} /> Edit Project
                  </button>
                  <button
                    onClick={handlePin}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pin size={13} /> {project.pinned ? 'Unpin' : 'Pin Project'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Trash2 size={13} /> Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Short description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Tech stack badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-indigo-50/70 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer information */}
      <div>
        {/* Context Stats Summary */}
        <div className="flex items-center gap-3 text-xs text-gray-500 py-2.5 my-2 border-y border-gray-100 bg-gray-50/50 px-2.5 rounded-lg">
          <span className="flex items-center gap-1">
            <BookOpen size={13} className="text-indigo-500" />
            <strong>{resourceCount}</strong> Resources
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <GitBranch size={13} className="text-purple-500" />
            <strong>{decisionCount}</strong> Decisions
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckSquare size={13} className="text-emerald-500" />
            <strong>{taskCount}</strong> Tasks
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium"
                title="View GitHub Repository"
              >
                <Code2 size={13} />
                GitHub <ExternalLink size={10} />
              </a>
            )}
            <span className="text-gray-400">Updated {formatRelativeTime(project.updatedAt)}</span>
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            Open <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
