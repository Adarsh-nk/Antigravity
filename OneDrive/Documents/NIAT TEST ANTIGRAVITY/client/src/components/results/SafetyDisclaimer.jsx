import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function SafetyDisclaimer() {
  return (
    <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
      <div className="flex items-center gap-1.5 font-bold text-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Official Agronomy Safety Disclaimer
      </div>
      <p className="leading-relaxed">
        KrishiMitra provides automated AI first-line decision support based on Indian agronomic practices (ICAR style). It does not replace a physical field visit by a certified local agriculture extension officer or KVK agronomist. Always check local pesticide registrations, observe pre-harvest intervals, use required PPE, and verify nutrient dosing against a laboratory soil test report.
      </p>
    </div>
  );
}
