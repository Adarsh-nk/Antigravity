import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function WarningsList({ warnings = [] }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
        <h4 className="text-base font-bold text-amber-900">Safety Warnings & Caution Notes</h4>
      </div>
      <ul className="space-y-1.5 pl-6 list-disc text-xs sm:text-sm text-amber-900 font-medium">
        {warnings.map((warn, i) => (
          <li key={i}>{warn}</li>
        ))}
      </ul>
    </div>
  );
}
