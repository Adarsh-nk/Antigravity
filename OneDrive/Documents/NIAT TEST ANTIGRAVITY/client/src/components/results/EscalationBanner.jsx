import React from 'react';
import { AlertOctagon, UserCheck } from 'lucide-react';

export function EscalationBanner({ escalation }) {
  if (!escalation || !escalation.needed) return null;

  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-rose-900 leading-snug">
            Expert Escalation Recommended
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-rose-700">
            Recommended Officer / Contact: {escalation.who || 'Local Agriculture Extension Officer / KVK Agronomist'}
          </p>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-rose-800 leading-relaxed pl-12">
        <strong>Reason for Escalation:</strong> {escalation.reason || 'High economic loss risk or ambiguous disease symptoms require physical inspection by a qualified agricultural officer.'}
      </p>

      <div className="pl-12 pt-2 flex items-center gap-2 text-xs font-bold text-rose-900">
        <UserCheck className="w-4 h-4 text-rose-700 shrink-0" />
        <span>Contact your nearest Krishi Vigyan Kendra (KVK) or Block Agriculture Office immediately.</span>
      </div>
    </div>
  );
}
