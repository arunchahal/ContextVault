import React from 'react';
import { GitBranch, CheckCircle2, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export default function DecisionCard({ decision, projectName, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <GitBranch size={16} />
          </div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Technical Decision
          </span>
          {projectName && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
              {projectName}
            </span>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(decision.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete decision"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-2">
        {decision.title}
      </h3>

      {decision.description && (
        <p className="text-sm text-gray-600 mb-3">
          {decision.description}
        </p>
      )}

      {/* Rationale / Context */}
      {decision.reason && (
        <div className="mb-3 bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Why this decision was made:
          </p>
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
            {decision.reason}
          </p>
        </div>
      )}

      {/* Alternatives Considered */}
      {decision.alternatives && decision.alternatives.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Alternatives Considered:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
            {decision.alternatives.map((alt, idx) => (
              <li key={idx} className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span>{alt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Choice */}
      {decision.finalChoice && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>Final Choice: <strong>{decision.finalChoice}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{formatDate(decision.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
