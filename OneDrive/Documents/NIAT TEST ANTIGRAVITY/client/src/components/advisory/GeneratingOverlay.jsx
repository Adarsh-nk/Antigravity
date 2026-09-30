import React, { useState, useEffect } from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import { Spinner } from '../ui/Spinner.jsx';

const progressMessages = [
  'Analysing your field details and soil parameters...',
  'Checking Integrated Pest Management and safety rules...',
  'Evaluating ICAR and state university agronomy guidelines...',
  'Structuring actionable recommendations for your farm...',
  'Finalizing safety warnings and expert escalation criteria...',
];

export function GeneratingOverlay({ isOpen }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % progressMessages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-emerald-100 space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center shadow-inner animate-bounce">
            <Sprout className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
            <Spinner size="md" className="text-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Generating KrishiMitra Advisory
          </h3>
          <p className="text-sm font-medium text-emerald-700 min-h-[40px] flex items-center justify-center px-4 animate-fadeIn">
            {progressMessages[msgIndex]}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Strict chemical safety & label-compliance enforced</span>
        </div>
      </div>
    </div>
  );
}
