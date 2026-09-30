import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Image as ImageIcon, AlertOctagon } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { ConfidenceBadge } from '../results/ConfidenceBadge.jsx';

export function AdvisoryListItem({ advisory }) {
  const formattedDate = new Date(advisory.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link to={`/advisory/${advisory.id}`}>
      <Card hover className="flex items-center justify-between gap-4 p-4 sm:p-5 group">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">
              {advisory.advisory_type.replace(/_/g, ' ')}
            </span>
            <ConfidenceBadge confidence={advisory.confidence} />
            {advisory.escalate_to_expert && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-bold flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> Expert Escalation
              </span>
            )}
            {advisory.image_path && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Photo
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
            {advisory.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
      </Card>
    </Link>
  );
}
