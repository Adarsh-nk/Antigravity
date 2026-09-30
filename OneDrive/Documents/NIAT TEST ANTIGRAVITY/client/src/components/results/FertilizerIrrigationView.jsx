import React from 'react';
import { Droplets, FlaskConical, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card.jsx';

export function FertilizerIrrigationView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Soil Test Note Banner */}
      {result.soil_test_note && (
        <Card className="bg-emerald-50 border-emerald-200 flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-emerald-900 font-semibold leading-relaxed">
            {result.soil_test_note}
          </p>
        </Card>
      )}

      {/* Stage-wise Nutrient Plan */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Stage-Wise Nutrient Schedule</h3>
        <div className="space-y-3">
          {result.nutrient_plan?.map((stageItem, idx) => (
            <Card key={idx} className="border-slate-200">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-base text-slate-900">{stageItem.stage}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    Timing: {stageItem.timing}
                  </span>
                </div>

                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900">Nutrient Focus:</strong> {stageItem.nutrient_focus}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {stageItem.organic_options?.length > 0 && (
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 block font-bold">Organic Options:</strong>
                      <ul className="list-disc pl-4 text-emerald-800 space-y-0.5">
                        {stageItem.organic_options.map((org, oIdx) => (
                          <li key={oIdx}>{org}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stageItem.mineral_options?.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block font-bold">Mineral Fertilizer Options:</strong>
                      <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                        {stageItem.mineral_options.map((min, mIdx) => (
                          <li key={mIdx}>{min}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {stageItem.indicative_quantity_per_acre && (
                  <div className="text-xs font-semibold text-slate-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    Indicative Dosing per Acre: {stageItem.indicative_quantity_per_acre} (Lab soil test verification advised)
                  </div>
                )}

                {stageItem.application_method && (
                  <div className="text-xs text-slate-600">
                    <strong>Method:</strong> {stageItem.application_method}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Irrigation Schedule */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-sky-600" />
          Stage-Wise Irrigation Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.irrigation_schedule?.map((irr, idx) => (
            <Card key={idx} className={`space-y-2 ${irr.critical_stage ? 'border-sky-300 bg-sky-50/40' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{irr.stage}</span>
                {irr.critical_stage && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-600 text-white rounded-md uppercase">
                    Critical Stage
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700"><strong>Frequency & Duration:</strong> {irr.frequency}</p>
              <p className="text-xs text-slate-700"><strong>Method:</strong> {irr.method}</p>
              {irr.water_saving_tip && (
                <p className="text-xs text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100">
                  💡 <strong>Water Saving Tip:</strong> {irr.water_saving_tip}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Micronutrients & Mistakes to Avoid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.micronutrient_notes?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Micronutrient Watch-outs</h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.micronutrient_notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.mistakes_to_avoid?.length > 0 && (
          <Card className="border-rose-100 bg-rose-50/30 space-y-2">
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Nutrient & Irrigation Mistakes to Avoid
            </h4>
            <ul className="list-disc pl-5 text-xs text-rose-900 space-y-1">
              {result.mistakes_to_avoid.map((errItem, i) => (
                <li key={i}>{errItem}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
