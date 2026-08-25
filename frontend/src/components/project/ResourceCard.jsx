import React from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Code2, 
  FileText, 
  Video, 
  Globe, 
  GraduationCap, 
  Trash2 
} from 'lucide-react';
import Badge from '../ui/Badge';

const getTypeIcon = (type) => {
  switch (type) {
    case 'github':
      return <Code2 size={14} className="text-gray-700" />;
    case 'documentation':
      return <BookOpen size={14} className="text-blue-600" />;
    case 'article':
    case 'paper':
      return <FileText size={14} className="text-purple-600" />;
    case 'video':
      return <Video size={14} className="text-red-600" />;
    case 'tutorial':
      return <GraduationCap size={14} className="text-emerald-600" />;
    default:
      return <Globe size={14} className="text-indigo-600" />;
  }
};

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'github':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'documentation':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'article':
    case 'paper':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'video':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'tutorial':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
};

export default function ResourceCard({ resource, projectName, onDelete }) {
  const formatUrlDisplay = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeClass(resource.type)}`}>
              {getTypeIcon(resource.type)}
              <span className="capitalize">{resource.type || 'Resource'}</span>
            </span>
            {projectName && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                {projectName}
              </span>
            )}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="text-gray-400 hover:text-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete resource"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {resource.description}
          </p>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 mt-1 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 truncate max-w-[200px]" title={resource.url}>
          {formatUrlDisplay(resource.url)}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
        >
          Open Resource
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
