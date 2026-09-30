import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientCropRecommendationSchema } from '../../validators/advisoryInput.js';
import {
  SEASONS,
  WATER_AVAILABILITY,
  FARMING_PREFERENCES,
  BUDGET_LEVELS,
  GOALS_OPTIONS,
} from '../../config/domain.js';
import { FarmSelect } from '../farms/FarmSelect.jsx';
import { LanguageSegmented } from './LanguageSegmented.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Select } from '../ui/Select.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';
import { ChipMultiSelect } from '../ui/ChipMultiSelect.jsx';
import { Button } from '../ui/Button.jsx';
import { GeneratingOverlay } from './GeneratingOverlay.jsx';
import { Sparkles } from 'lucide-react';

export function CropRecommendationForm({ farms, initialFarmId, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientCropRecommendationSchema),
    defaultValues: {
      advisory_type: 'crop_recommendation',
      farm_id: initialFarmId || (farms[0]?.id ?? ''),
      language: 'en',
      season: 'kharif',
      water_availability: 'moderate',
      farming_preference: 'conventional',
      budget_level: 'medium',
      goals: ['max_profit'],
      additional_notes: '',
    },
  });

  const languageValue = watch('language');

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
          <FormField label="Target Season" htmlFor="season" required error={errors.season?.message}>
            <Select id="season" hasError={!!errors.season} {...register('season')}>
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase().replace('_', ' ')}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Planned Sowing Month (Optional)" htmlFor="sowing_month" error={errors.sowing_month?.message}>
            <Select id="sowing_month" {...register('sowing_month')}>
              <option value="">-- Any Month in Season --</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Month {m} ({new Date(0, m - 1).toLocaleString('default', { month: 'long' })})
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

          <FormField label="Farming Preference" htmlFor="farming_preference" required error={errors.farming_preference?.message}>
            <Select id="farming_preference" hasError={!!errors.farming_preference} {...register('farming_preference')}>
              {FARMING_PREFERENCES.map((f) => (
                <option key={f} value={f}>
                  {f.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Previous Crop (Optional)" htmlFor="previous_crop" error={errors.previous_crop?.message}>
            <Input id="previous_crop" placeholder="e.g. Wheat, Paddy, Tur" maxLength={60} {...register('previous_crop')} />
          </FormField>

          <FormField label="Investment Budget Level" required error={errors.budget_level?.message}>
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

        <FormField label="Primary Farmer Goals (Select 1 to 3)" required error={errors.goals?.message}>
          <Controller
            name="goals"
            control={control}
            render={({ field }) => (
              <ChipMultiSelect
                options={GOALS_OPTIONS.map((g) => ({ value: g, label: g.replace(/_/g, ' ').toUpperCase() }))}
                selected={field.value || []}
                onChange={field.onChange}
                minSelections={1}
                maxSelections={3}
              />
            )}
          />
        </FormField>

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageSegmented value={field.value} onChange={field.onChange} />
          )}
        />

        <FormField label="Additional Field Notes / Context" htmlFor="additional_notes" error={errors.additional_notes?.message}>
          <Textarea
            id="additional_notes"
            placeholder="Mention any specific field constraints, labor availability, or market preferences..."
            maxLength={1000}
            {...register('additional_notes')}
          />
        </FormField>

        <Button type="submit" variant="primary" icon={Sparkles} isLoading={isLoading} className="w-full text-base py-3">
          Get AI Crop Recommendations
        </Button>
      </form>

      <GeneratingOverlay isOpen={isLoading} />
    </>
  );
}
