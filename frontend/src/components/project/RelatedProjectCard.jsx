import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, X } from 'lucide-react';

export default function RelatedProjectCard({ project, onRemove }) {
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white hover:bg-indigo-50/40 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Briefcase size={16} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h4>
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(project.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            title="Unlink project"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
        <span className="text-gray-400 capitalize font-medium">
          {project.status?.replace('-', ' ')}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform">
          Open Project <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
