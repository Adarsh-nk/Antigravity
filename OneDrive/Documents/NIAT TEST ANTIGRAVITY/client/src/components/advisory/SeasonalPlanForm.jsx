import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSeasonalPlanSchema } from '../../validators/advisoryInput.js';
import {
  SEASONS,
  WATER_AVAILABILITY,
  FARMING_PREFERENCES,
  BUDGET_LEVELS,
} from '../../config/domain.js';
import { FarmSelect } from '../farms/FarmSelect.jsx';
import { CropPicker } from './CropPicker.jsx';
import { LanguageSegmented } from './LanguageSegmented.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Select } from '../ui/Select.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';
import { Button } from '../ui/Button.jsx';
import { GeneratingOverlay } from './GeneratingOverlay.jsx';
import { CalendarDays } from 'lucide-react';

export function SeasonalPlanForm({ farms, initialFarmId, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSeasonalPlanSchema),
    defaultValues: {
      advisory_type: 'seasonal_plan',
      farm_id: initialFarmId || (farms[0]?.id ?? ''),
      language: 'en',
      crop: '',
      season: 'kharif',
      planned_sowing_date: new Date().toISOString().split('T')[0],
      water_availability: 'moderate',
      farming_preference: 'conventional',
      budget_level: 'medium',
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

          <FormField label="Season" htmlFor="season" required error={errors.season?.message}>
            <Select id="season" hasError={!!errors.season} {...register('season')}>
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase().replace('_', ' ')}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Planned Sowing Date" htmlFor="planned_sowing_date" required error={errors.planned_sowing_date?.message}>
            <Input id="planned_sowing_date" type="date" hasError={!!errors.planned_sowing_date} {...register('planned_sowing_date')} />
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

          <FormField label="Farming Preference" htmlFor="farming_preference" required error={errors.farming_preference?.message}>
            <Select id="farming_preference" hasError={!!errors.farming_preference} {...register('farming_preference')}>
              {FARMING_PREFERENCES.map((f) => (
                <option key={f} value={f}>
                  {f.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Budget Level" required error={errors.budget_level?.message}>
            <Controller
              name="budget_level"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  options={BUDGET_LEVELS.map((b) => ({ value: b, label: b.toUpperCase() }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </div>

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageSegmented value={field.value} onChange={field.onChange} />
          )}
        />

        <FormField label="Additional Notes" htmlFor="additional_notes" error={errors.additional_notes?.message}>
          <Textarea id="additional_notes" placeholder="e.g. Intend to intercrop or rotate field next season..." maxLength={1000} {...register('additional_notes')} />
        </FormField>

        <Button type="submit" variant="primary" icon={CalendarDays} isLoading={isLoading} className="w-full text-base py-3">
          Build Week-by-Week Season Calendar
        </Button>
      </form>

      <GeneratingOverlay isOpen={isLoading} />
    </>
  );
}
