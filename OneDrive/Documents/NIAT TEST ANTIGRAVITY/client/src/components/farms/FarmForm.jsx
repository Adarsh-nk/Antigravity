import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { farmFormSchema } from '../../validators/farm.js';
import {
  SOIL_TYPES,
  IRRIGATION_SOURCES,
  INDIAN_STATES,
  LAND_UNITS,
} from '../../config/domain.js';
import { FormField } from '../ui/FormField.jsx';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { FlaskConical, ChevronDown, ChevronUp, Save } from 'lucide-react';

export function FarmForm({ initialData = null, onSubmit, isLoading = false }) {
  const [showSoilTest, setShowSoilTest] = useState(() => {
    return !!(initialData?.soil_ph || initialData?.soil_nitrogen_kg_ha);
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(farmFormSchema),
    defaultValues: initialData || {
      area_unit: 'acre',
      state: 'Maharashtra',
      soil_type: 'black_cotton_regur',
      irrigation_source: 'borewell_tubewell',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Farm Name" htmlFor="name" required error={errors.name?.message} className="sm:col-span-2">
          <Input id="name" placeholder="e.g. Riverbank Plot" hasError={!!errors.name} {...register('name')} />
        </FormField>

        <FormField label="Farm Area" htmlFor="area" required error={errors.area?.message}>
          <Input id="area" type="number" step="0.1" placeholder="e.g. 5.5" hasError={!!errors.area} {...register('area')} />
        </FormField>

        <FormField label="Area Unit" htmlFor="area_unit" required error={errors.area_unit?.message}>
          <Select id="area_unit" hasError={!!errors.area_unit} {...register('area_unit')}>
            {LAND_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit === 'acre' ? 'Acres' : 'Hectares'}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="State" htmlFor="state" required error={errors.state?.message}>
          <Select id="state" hasError={!!errors.state} {...register('state')}>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="District" htmlFor="district" required error={errors.district?.message}>
          <Input id="district" placeholder="e.g. Nashik" hasError={!!errors.district} {...register('district')} />
        </FormField>

        <FormField label="Primary Soil Type" htmlFor="soil_type" required error={errors.soil_type?.message}>
          <Select id="soil_type" hasError={!!errors.soil_type} {...register('soil_type')}>
            {SOIL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Primary Irrigation Source" htmlFor="irrigation_source" required error={errors.irrigation_source?.message}>
          <Select id="irrigation_source" hasError={!!errors.irrigation_source} {...register('irrigation_source')}>
            {IRRIGATION_SOURCES.map((src) => (
              <option key={src} value={src}>
                {src.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {/* Collapsible Soil Test Values */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowSoilTest((prev) => !prev)}
          className="w-[#100%] p-4 flex items-center justify-between text-left font-semibold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Optional Soil Test Lab Values</span>
            <span className="text-xs font-normal text-slate-500">(pH, N, P, K, Organic Carbon)</span>
          </div>
          {showSoilTest ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showSoilTest && (
          <div className="p-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
            <FormField label="Soil pH (3 to 10)" htmlFor="soil_ph" error={errors.soil_ph?.message}>
              <Input id="soil_ph" type="number" step="0.1" placeholder="6.5" {...register('soil_ph')} />
            </FormField>

            <FormField label="Nitrogen N (kg/ha)" htmlFor="soil_nitrogen_kg_ha" error={errors.soil_nitrogen_kg_ha?.message}>
              <Input id="soil_nitrogen_kg_ha" type="number" step="1" placeholder="240" {...register('soil_nitrogen_kg_ha')} />
            </FormField>

            <FormField label="Phosphorus P (kg/ha)" htmlFor="soil_phosphorus_kg_ha" error={errors.soil_phosphorus_kg_ha?.message}>
              <Input id="soil_phosphorus_kg_ha" type="number" step="1" placeholder="18" {...register('soil_phosphorus_kg_ha')} />
            </FormField>

            <FormField label="Potassium K (kg/ha)" htmlFor="soil_potassium_kg_ha" error={errors.soil_potassium_kg_ha?.message}>
              <Input id="soil_potassium_kg_ha" type="number" step="1" placeholder="280" {...register('soil_potassium_kg_ha')} />
            </FormField>

            <FormField label="Organic Carbon (%)" htmlFor="soil_organic_carbon_percent" error={errors.soil_organic_carbon_percent?.message}>
              <Input id="soil_organic_carbon_percent" type="number" step="0.01" placeholder="0.65" {...register('soil_organic_carbon_percent')} />
            </FormField>

            <FormField label="Electrical Cond. EC (dS/m)" htmlFor="soil_ec_ds_m" error={errors.soil_ec_ds_m?.message}>
              <Input id="soil_ec_ds_m" type="number" step="0.01" placeholder="0.4" {...register('soil_ec_ds_m')} />
            </FormField>

            <FormField label="Soil Test Date" htmlFor="soil_test_date" error={errors.soil_test_date?.message} className="sm:col-span-3">
              <Input id="soil_test_date" type="date" {...register('soil_test_date')} />
            </FormField>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="primary" icon={Save} isLoading={isLoading}>
          {initialData ? 'Update Farm' : 'Save Farm'}
        </Button>
      </div>
    </form>
  );
}
