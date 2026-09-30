import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientFertilizerIrrigationSchema } from '../../validators/advisoryInput.js';
import {
  GROWTH_STAGES,
  FARMING_PREFERENCES,
  WATER_AVAILABILITY,
} from '../../config/domain.js';
import { FarmSelect } from '../farms/FarmSelect.jsx';
import { CropPicker } from './CropPicker.jsx';
import { LanguageSegmented } from './LanguageSegmented.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Select } from '../ui/Select.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Toggle } from '../ui/Toggle.jsx';
import { Button } from '../ui/Button.jsx';
import { GeneratingOverlay } from './GeneratingOverlay.jsx';
import { Droplets } from 'lucide-react';

export function FertilizerIrrigationForm({ farms, initialFarmId, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientFertilizerIrrigationSchema),
    defaultValues: {
      advisory_type: 'fertilizer_irrigation',
      farm_id: initialFarmId || (farms[0]?.id ?? ''),
      language: 'en',
      crop: '',
      growth_stage: 'vegetative',
      soil_test_available: true,
      farming_preference: 'conventional',
      water_availability: 'moderate',
      additional_notes: '',
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <Controller
          name="farm_id"
          control={control}
          render={({ field }) => (
            <FarmSelect farms={farms} value={field.value} onChange={field.onChange} error={errors.farm_id?.message} />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="crop"
            control={control}
            render={({ field }) => (
              <CropPicker value={field.value} onChange={field.onChange} error={errors.crop?.message} />
            )}
          />

          <FormField label="Current Growth Stage" htmlFor="growth_stage" required error={errors.growth_stage?.message}>
            <Select id="growth_stage" hasError={!!errors.growth_stage} {...register('growth_stage')}>
              {GROWTH_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Sowing Date (Optional)" htmlFor="sowing_date" error={errors.sowing_date?.message}>
            <Input id="sowing_date" type="date" {...register('sowing_date')} />
          </FormField>

          <FormField label="Farming Preference" htmlFor="farming_preference" required error={errors.farming_preference?.message}>
            <Select id="farming_preference" hasError={!!errors.farming_preference} {...register('farming_preference')}>
              {FARMING_PREFERENCES.map((f) => (
                <option key={f} value={f}>
                  {f.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Water Availability" htmlFor="water_availability" required error={errors.water_availability?.message}>
            <Select id="water_availability" hasError={!!errors.water_availability} {...register('water_availability')}>
              {WATER_AVAILABILITY.map((w) => (
                <option key={w} value={w}>
                  {w.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <Controller
          name="soil_test_available"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={field.onChange}
              label="Include Farm Soil Test Lab Values (If saved)"
              description="When checked, KrishiMitra will calibrate N-P-K nutrient doses to your farm's saved lab soil pH and test figures."
            />
          )}
        />

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageSegmented value={field.value} onChange={field.onChange} />
          )}
        />

        <FormField label="Additional Notes / Context" htmlFor="additional_notes" error={errors.additional_notes?.message}>
          <Textarea id="additional_notes" placeholder="e.g. Drip system installed, organic manure added before sowing..." maxLength={1000} {...register('additional_notes')} />
        </FormField>

        <Button type="submit" variant="primary" icon={Droplets} isLoading={isLoading} className="w-full text-base py-3">
          Generate Fertilizer & Irrigation Plan
        </Button>
      </form>

      <GeneratingOverlay isOpen={isLoading} />
    </>
  );
}
