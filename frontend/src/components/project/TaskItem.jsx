import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">High Priority</span>;
    case 'medium':
      return <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">Medium</span>;
    default:
      return <span className="text-[11px] font-normal text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">Low</span>;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>;
    case 'in-progress':
      return <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">In Progress</span>;
    default:
      return <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">To Do</span>;
  }
};

export default function TaskItem({ task, projectName, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  return (
    <div className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
      isCompleted 
        ? 'bg-gray-50/70 border-gray-200 opacity-80' 
        : 'bg-white border-gray-200 shadow-2xs hover:border-indigo-200'
    }`}>
      <button
        type="button"
        onClick={() => onToggle && onToggle(task.id)}
        className="mt-0.5 text-gray-400 hover:text-indigo-600 focus:outline-hidden transition-colors shrink-0"
        title="Toggle task status"
      >
        {isCompleted ? (
          <CheckCircle2 size={19} className="text-emerald-600 fill-emerald-100" />
        ) : isInProgress ? (
          <Clock size={19} className="text-blue-600 animate-pulse" />
        ) : (
          <Circle size={19} className="hover:text-indigo-500" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
            {projectName && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                {projectName}
              </span>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {task.description && (
          <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
