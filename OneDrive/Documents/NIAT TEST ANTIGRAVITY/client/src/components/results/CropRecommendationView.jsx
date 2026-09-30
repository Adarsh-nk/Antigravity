import React from 'react';
import { Award, AlertCircle, TrendingUp, Droplets, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function CropRecommendationView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Recommended Crops List */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">
          Ranked Crop Recommendations
        </h3>

        {result.recommendations?.map((rec) => (
          <Card key={rec.rank} className="border-emerald-200 hover:border-emerald-400">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center shrink-0">
                    #{rec.rank}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{rec.crop}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Sowing Window: {rec.sowing_window} | Duration: {rec.duration_days}
                    </span>
                  </div>
                </div>
                <Badge variant="success" className="text-sm px-3 py-1">
                  {rec.suitability_score}% Match Score
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  <strong>Why Suitable:</strong> {rec.why_suitable}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Yield Range: {rec.expected_yield_range?.min} - {rec.expected_yield_range?.max} {rec.expected_yield_range?.unit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="capitalize">Water Need: {rec.water_requirement}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="capitalize">Input Cost: {rec.input_cost_level}</span>
                </div>
              </div>

              {rec.key_risks?.length > 0 && (
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Key Risks:</strong> {rec.key_risks.join(', ')}
                </div>
              )}

              {rec.rotation_or_intercrop_note && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <strong>Rotation / Intercropping Note:</strong> {rec.rotation_or_intercrop_note}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Crops to Avoid */}
      {result.crops_to_avoid?.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
            <h4 className="text-lg font-bold text-rose-900">Crops to Avoid for this Field</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.crops_to_avoid.map((avoid, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100 text-xs">
                <span className="font-bold text-rose-900 block text-sm">{avoid.crop}</span>
                <span className="text-slate-600 font-medium">{avoid.reason}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Soil Improvement & Market Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.soil_improvement_notes?.length > 0 && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Soil & Land Improvement Tips</h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {result.soil_improvement_notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.market_guidance && (
          <Card className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Market & Selling Guidance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{result.market_guidance}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
