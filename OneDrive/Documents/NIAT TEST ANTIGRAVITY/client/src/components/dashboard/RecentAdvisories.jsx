import React from 'react';
import { Link } from 'react-router-dom';
import { AdvisoryListItem } from '../history/AdvisoryListItem.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { FileText, ArrowRight } from 'lucide-react';

export function RecentAdvisories({ advisories = [] }) {
  if (!advisories || advisories.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900">Recent Advisories</h2>
        <EmptyState
          icon={FileText}
          title="No advisories generated yet"
          description="Choose one of the advisory types above to generate your first tailored AI farm guidance."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900">Recent Advisories</h2>
        <Link to="/history" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
          View All History <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-3">
        {advisories.map((advisory) => (
          <AdvisoryListItem key={advisory.id} advisory={advisory} />
        ))}
      </div>
    </div>
  );
}
