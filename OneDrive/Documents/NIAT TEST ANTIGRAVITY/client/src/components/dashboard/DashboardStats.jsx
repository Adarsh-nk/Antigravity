import React from 'react';
import { Landmark, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';

export function DashboardStats({ farmCount = 0, advisoryCount = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-none shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Registered Farms</span>
            <div className="text-3xl sm:text-4xl font-black">{farmCount}</div>
          </div>
          <div className="p-3 bg-emerald-700/60 rounded-2xl">
            <Landmark className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-700/50 flex justify-between items-center text-xs">
          <Link to="/farms" className="text-emerald-200 hover:text-white font-semibold flex items-center gap-1">
            Manage your farms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800 to-slate-950 text-white border-none shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Advisories</span>
            <div className="text-3xl sm:text-4xl font-black">{advisoryCount}</div>
          </div>
          <div className="p-3 bg-slate-700/60 rounded-2xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
          <Link to="/history" className="text-slate-300 hover:text-white font-semibold flex items-center gap-1">
            View advisory history <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
