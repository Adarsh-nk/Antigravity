import React from 'react';
import { Stethoscope, ShieldAlert, CheckCircle, Eye, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function DiseaseDiagnosisView({ result, signedImageUrl }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Image Observations if image provided */}
      {signedImageUrl && (
        <Card className="flex flex-col sm:flex-row gap-4 items-start bg-slate-900 text-white border-slate-800">
          <img
            src={signedImageUrl}
            alt="Diagnosed Crop Photo"
            className="w-full sm:w-48 h-48 object-cover rounded-xl shrink-0 border border-slate-700"
          />
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
              <Eye className="w-3.5 h-3.5" />
              Attached Photo Analysis
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {result.image_observations || 'Photo uploaded and analyzed alongside symptom descriptions.'}
            </p>
          </div>
        </Card>
      )}

      {/* Probable Conditions */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Plausible Causes & Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.possible_conditions?.map((cond, idx) => (
            <Card key={idx} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{cond.name}</h4>
                  <span className="text-xs text-slate-500 capitalize">Category: {cond.category?.replace(/_/g, ' ')}</span>
                </div>
                <Badge variant={cond.likelihood === 'high' ? 'danger' : cond.likelihood === 'medium' ? 'warning' : 'neutral'}>
                  {cond.likelihood.toUpperCase()} LIKELIHOOD
                </Badge>
              </div>

              {cond.matching_symptoms?.length > 0 && (
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Matching Symptoms:</strong> {cond.matching_symptoms.join(', ')}
                </div>
              )}

              {cond.distinguishing_checks?.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-100">
                  <strong className="text-slate-800 block font-bold">Field Checks to Distinguish:</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {cond.distinguishing_checks.map((chk, cIdx) => (
                      <li key={cIdx}>{chk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Immediate Actions */}
      {result.immediate_actions?.length > 0 && (
        <Card className="border-sky-200 bg-sky-50/40 space-y-3">
          <h4 className="text-base font-bold text-sky-950 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-sky-700" />
            Immediate Remedial Steps
          </h4>
          <ul className="list-disc pl-6 text-xs sm:text-sm text-sky-950 space-y-1 font-medium">
            {result.immediate_actions.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Cultural & Organic Controls */}
      {result.cultural_and_organic_controls?.length > 0 && (
        <Card className="space-y-3">
          <h4 className="text-base font-bold text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Cultural, Mechanical & Organic Controls
          </h4>
          <ul className="list-disc pl-6 text-xs sm:text-sm text-slate-700 space-y-1 font-medium">
            {result.cultural_and_organic_controls.map((ctrl, i) => (
              <li key={i}>{ctrl}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Chemical Control (Last Resort Only) */}
      {result.chemical_options_last_resort?.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <h4 className="text-base font-bold text-amber-950">Chemical Options (Last Resort Only)</h4>
          </div>
          <p className="text-xs text-amber-800">
            Apply chemicals only if economic threshold damage is exceeded. Always strictly adhere to product label instructions and local agriculture department recommendations.
          </p>
          <div className="space-y-2">
            {result.chemical_options_last_resort.map((chem, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1 text-xs">
                <span className="font-bold text-amber-950 text-sm block">
                  Active Ingredient / Class: {chem.active_ingredient_or_class}
                </span>
                {chem.target && <span className="text-slate-600 block">Target: {chem.target}</span>}
                {chem.when_to_consider && <span className="text-slate-600 block">When to consider: {chem.when_to_consider}</span>}
                {chem.safety_note && (
                  <span className="text-amber-800 font-semibold block pt-1">
                    Safety & Compliance: {chem.safety_note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Prevention & Monitoring Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.prevention?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Future Disease Prevention</h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.prevention.map((prev, i) => (
                <li key={i}>{prev}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.monitoring_plan && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Field Monitoring Plan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{result.monitoring_plan}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
