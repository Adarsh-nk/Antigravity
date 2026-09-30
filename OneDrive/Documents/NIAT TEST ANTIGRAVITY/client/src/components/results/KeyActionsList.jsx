import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../ui/Card.jsx';

export function KeyActionsList({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <Card className="space-y-4 border-emerald-200 bg-emerald-50/40">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-600 text-white rounded-xl">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Priority Key Actions</h3>
      </div>

      <div className="space-y-3">
        {actions.map((item, index) => (
          <div key={index} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs shrink-0 mt-0.5">
              {item.priority || index + 1}
            </span>
            <div className="space-y-1 flex-1">
              <p className="text-sm font-bold text-slate-900 leading-snug">{item.action}</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Timeframe: {item.timeframe}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
