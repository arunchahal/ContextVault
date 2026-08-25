import React from 'react';
import { 
  Plus, 
  Pencil, 
  Pin, 
  PinOff, 
  Link as LinkIcon, 
  Unlink, 
  CheckCircle2, 
  GitBranch, 
  BookOpen, 
  Zap 
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

const getActionConfig = (action) => {
  switch (action) {
    case 'created':
      return { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Project Created' };
    case 'updated':
      return { icon: Pencil, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Project Updated' };
    case 'pinned':
      return { icon: Pin, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Project Pinned' };
    case 'unpinned':
      return { icon: PinOff, color: 'text-gray-500', bg: 'bg-gray-100', title: 'Project Unpinned' };
    case 'decision_added':
      return { icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Technical Decision Added' };
    case 'resource_added':
      return { icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', title: 'Resource Added' };
    case 'task_completed':
      return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Task Completed' };
    case 'link_added':
    case 'related_added':
      return { icon: LinkIcon, color: 'text-cyan-600', bg: 'bg-cyan-50', title: 'Link / Relation Added' };
    case 'related_removed':
      return { icon: Unlink, color: 'text-gray-500', bg: 'bg-gray-100', title: 'Relation Removed' };
    case 'quick_capture':
      return { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Quick Capture Note' };
    default:
      return { icon: Pencil, color: 'text-gray-600', bg: 'bg-gray-100', title: 'Project Update' };
  }
};

export default function HistoryItem({ entry, isLast }) {
  const config = getActionConfig(entry.action);
  const Icon = config.icon;

  return (
    <div className={`relative pl-7 pb-5 ${!isLast ? 'border-l-2 border-gray-200 ml-3' : 'ml-3'}`}>
      <div className={`absolute -left-3 top-0 p-1.5 rounded-full border-2 border-white shadow-xs ${config.bg}`}>
        <Icon size={13} className={config.color} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">{config.title}</h4>
          <span className="text-xs text-gray-400">• {formatRelativeTime(entry.timestamp)}</span>
        </div>
        {entry.description && (
          <p className="text-sm text-gray-600 mt-0.5">{entry.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{formatDate(entry.timestamp)}</p>
      </div>
    </div>
  );
}
