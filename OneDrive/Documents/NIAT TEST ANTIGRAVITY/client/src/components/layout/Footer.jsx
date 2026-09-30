import React from 'react';
import { Sprout } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-slate-200 text-sm">KrishiMitra</span>
            <span>— AI Agriculture Advisor for Indian Farmers</span>
          </div>
          <p className="text-center md:text-right">
            Designed for decision support only. Consult local KVK / Agronomist for final inputs.
          </p>
        </div>
      </div>
    </footer>
  );
}
