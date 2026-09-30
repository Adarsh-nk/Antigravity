import React from 'react';
import { Bug, ShieldCheck, ShieldAlert, HeartHandshake, Eye, AlertOctagon } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function PestManagementView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Likely Pests */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Target Pest Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.likely_pests?.map((pest, idx) => (
            <Card key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bug className="w-4 h-4 text-amber-600" />
                  {pest.name}
                </h4>
                <Badge variant={pest.likelihood === 'high' ? 'danger' : 'warning'}>
                  {pest.likelihood.toUpperCase()} LIKELIHOOD
                </Badge>
              </div>
              {pest.damage_signs?.length > 0 && (
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Damage Signs:</strong> {pest.damage_signs.join(', ')}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Scouting & Thresholds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.scouting_guide && (
          <Card className="space-y-2 bg-sky-50/50 border-sky-200">
            <h4 className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-700" />
              Field Scouting Guide
            </h4>
            <p className="text-xs text-sky-900 leading-relaxed">{result.scouting_guide}</p>
          </Card>
        )}

        {result.action_threshold_note && (
          <Card className="space-y-2 bg-amber-50/50 border-amber-200">
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-amber-700" />
              Economic Action Threshold (ETL)
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">{result.action_threshold_note}</p>
          </Card>
        )}
      </div>

      {/* Tiered IPM Plan */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          Tiered Integrated Pest Management (IPM) Plan
        </h3>

        <div className="space-y-3">
          {/* Cultural */}
          {result.ipm_tiers?.cultural?.length > 0 && (
            <Card className="border-emerald-200 space-y-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold uppercase">
                Tier 1: Cultural Controls
              </span>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {result.ipm_tiers.cultural.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Mechanical */}
          {result.ipm_tiers?.mechanical?.length > 0 && (
            <Card className="border-slate-200 space-y-2">
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-md text-xs font-bold uppercase">
                Tier 2: Mechanical Controls
              </span>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {result.ipm_tiers.mechanical.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Biological */}
          {result.ipm_tiers?.biological?.length > 0 && (
            <Card className="border-sky-200 space-y-2">
              <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-md text-xs font-bold uppercase">
                Tier 3: Biological Controls
              </span>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {result.ipm_tiers.biological.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Chemical Last Resort */}
          {result.ipm_tiers?.chemical_last_resort?.length > 0 && (
            <Card className="border-amber-300 bg-amber-50/40 space-y-3">
              <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded-md text-xs font-bold uppercase">
                Tier 4: Chemical Controls (Last Resort Only)
              </span>
              <div className="space-y-2">
                {result.ipm_tiers.chemical_last_resort.map((chem, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                    <strong className="text-slate-900 block text-sm">
                      Active Ingredient Class: {chem.active_ingredient_or_class}
                    </strong>
                    {chem.when_to_consider && <span className="text-slate-600 block">When: {chem.when_to_consider}</span>}
                    {chem.resistance_management_note && (
                      <span className="text-amber-800 block">Resistance Note: {chem.resistance_management_note}</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Beneficial Insects & Safety/PPE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.beneficial_insects_to_protect?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              Beneficial Insects to Protect
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.beneficial_insects_to_protect.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.safety_and_ppe?.length > 0 && (
          <Card className="bg-slate-900 text-white space-y-2 border-slate-800">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Mandatory Sprayer Safety & PPE
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
              {result.safety_and_ppe.map((safe, i) => (
                <li key={i}>{safe}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {result.pre_harvest_interval_note && (
        <Card className="bg-rose-50 border-rose-200 text-xs text-rose-900 font-semibold">
          ⏱️ <strong>Pre-Harvest Interval (PHI):</strong> {result.pre_harvest_interval_note}
        </Card>
      )}
    </div>
  );
}
