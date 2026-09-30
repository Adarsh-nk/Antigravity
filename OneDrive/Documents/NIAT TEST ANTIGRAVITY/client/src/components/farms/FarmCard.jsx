import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Droplets, FlaskConical, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { useFarms } from '../../hooks/useFarms.js';

export function FarmCard({ farm }) {
  const { deleteFarm, isDeleting } = useFarms();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteFarm(farm.id);
      setShowDeleteConfirm(false);
    } catch {
      // handled by mutation
    }
  };

  return (
    <>
      <Card className="flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                  {farm.name}
                </h3>
                <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  {farm.area} {farm.area_unit}s
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to={`/farms/${farm.id}/edit`}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Farm"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Farm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{farm.district}, {farm.state}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="capitalize truncate">{farm.irrigation_source.replace(/_/g, ' ')}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="capitalize truncate">Soil: {farm.soil_type.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {farm.soil_ph && (
            <div className="mt-2 p-2 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-800 flex flex-wrap gap-x-3 gap-y-1">
              <span>pH: {farm.soil_ph}</span>
              {farm.soil_nitrogen_kg_ha && <span>N: {farm.soil_nitrogen_kg_ha} kg/ha</span>}
              {farm.soil_organic_carbon_percent && <span>OC: {farm.soil_organic_carbon_percent}%</span>}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <Link
            to={`/advisory/new?farmId=${farm.id}`}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Get Advisory for this Farm →
          </Link>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Farm"
        message={`Are you sure you want to delete "${farm.name}"? Past advisories associated with this farm will remain in your history, but the farm record will be deleted.`}
        confirmText="Delete Farm"
        isLoading={isDeleting}
      />
    </>
  );
}
