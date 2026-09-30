import React from 'react';
import { HelpCircle } from 'lucide-react';

export function DataGapsList({ dataGaps = [] }) {
  if (!dataGaps || dataGaps.length === 0) return null;

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 space-y-2">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-slate-600 shrink-0" />
        <h4 className="text-sm font-bold text-slate-800">Information Gaps Identified</h4>
      </div>
      <ul className="space-y-1 pl-6 list-disc text-xs text-slate-600 font-medium">
        {dataGaps.map((gap, i) => (
          <li key={i}>{gap}</li>
        ))}
      </ul>
    </div>
  );
}
