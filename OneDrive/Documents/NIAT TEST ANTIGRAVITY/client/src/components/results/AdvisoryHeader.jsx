import React from 'react';
import { Calendar, Landmark, Languages } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge.jsx';
import { LANGUAGE_NAMES } from '../../config/domain.js';

export function AdvisoryHeader({ advisory }) {
  const formattedDate = new Date(advisory.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
          {advisory.advisory_type.replace(/_/g, ' ')}
        </span>
        <ConfidenceBadge confidence={advisory.confidence} />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
        {advisory.title}
      </h1>

      <p className="text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
        {advisory.output_payload?.summary}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{formattedDate}</span>
        </div>
        {advisory.farm_snapshot?.name && (
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-slate-400" />
            <span>Farm: {advisory.farm_snapshot.name} ({advisory.farm_snapshot.district}, {advisory.farm_snapshot.state})</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-slate-400" />
          <span>Language: {LANGUAGE_NAMES[advisory.language] || advisory.language}</span>
        </div>
      </div>
    </div>
  );
}
