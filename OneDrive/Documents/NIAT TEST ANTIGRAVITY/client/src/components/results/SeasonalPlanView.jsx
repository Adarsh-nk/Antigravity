import React from 'react';
import { CalendarDays, Clock, DollarSign, PackageCheck, ShoppingBag } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function SeasonalPlanView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Duration Banner */}
      <Card className="bg-emerald-900 text-white flex items-center justify-between p-5 border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800 rounded-2xl">
            <CalendarDays className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Total Crop Duration</h3>
            <span className="text-xs text-emerald-200">From land preparation to post-harvest storage</span>
          </div>
        </div>
        <span className="text-xl font-black text-emerald-300 bg-emerald-950 px-4 py-2 rounded-xl border border-emerald-800">
          {result.total_duration_days}
        </span>
      </Card>

      {/* Week-by-Week Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Week-by-Week Field Calendar</h3>

        <div className="relative border-l-2 border-emerald-500 ml-4 space-y-6 pl-6 py-2">
          {result.timeline?.map((phaseItem, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-md group-hover:scale-125 transition-transform" />

              <Card className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-base text-slate-900">{phaseItem.phase}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                      {phaseItem.week_range}
                    </span>
                    {phaseItem.approx_dates && (
                      <span className="text-xs text-slate-500 font-medium">({phaseItem.approx_dates})</span>
                    )}
                  </div>
                </div>

                {phaseItem.tasks?.length > 0 && (
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-slate-900 block">Required Field Tasks:</strong>
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-0.5">
                      {phaseItem.tasks.map((task, tIdx) => (
                        <li key={tIdx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  {phaseItem.inputs_needed?.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-lg text-slate-700">
                      <strong className="text-slate-900 block font-bold">Inputs Needed:</strong>
                      <span>{phaseItem.inputs_needed.join(', ')}</span>
                    </div>
                  )}

                  {phaseItem.risks_to_watch?.length > 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-lg text-amber-900">
                      <strong className="text-amber-950 block font-bold">Risks to Watch:</strong>
                      <span>{phaseItem.risks_to_watch.join(', ')}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Relative Budget Outline */}
      {result.budget_outline?.length > 0 && (
        <Card className="space-y-3">
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Relative Expense Outline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.budget_outline.map((bgt, bIdx) => (
              <div key={bIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{bgt.category}</span>
                  <Badge variant={bgt.relative_cost === 'high' ? 'danger' : bgt.relative_cost === 'medium' ? 'warning' : 'success'}>
                    {bgt.relative_cost.toUpperCase()} COST
                  </Badge>
                </div>
                {bgt.note && <span className="text-slate-600 block">{bgt.note}</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Harvest & Marketing Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.harvest_indicators?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Harvest Maturity Indicators
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.harvest_indicators.map((ind, i) => (
                <li key={i}>{ind}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.marketing_tips?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-sky-600" />
              Post-Harvest & Marketing Guidance
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.marketing_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
