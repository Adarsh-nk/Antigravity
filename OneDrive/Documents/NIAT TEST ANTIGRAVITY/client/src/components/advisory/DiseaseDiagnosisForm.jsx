import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientDiseaseDiagnosisSchema } from '../../validators/advisoryInput.js';
import {
  GROWTH_STAGES,
  SYMPTOM_CATEGORIES,
  RECENT_WEATHER_OPTIONS,
} from '../../config/domain.js';
import { FarmSelect } from '../farms/FarmSelect.jsx';
import { CropPicker } from './CropPicker.jsx';
import { LanguageSegmented } from './LanguageSegmented.jsx';
import { ImageUploader } from './ImageUploader.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Select } from '../ui/Select.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Slider } from '../ui/Slider.jsx';
import { ChipMultiSelect } from '../ui/ChipMultiSelect.jsx';
import { Button } from '../ui/Button.jsx';
import { GeneratingOverlay } from './GeneratingOverlay.jsx';
import { Stethoscope } from 'lucide-react';

export function DiseaseDiagnosisForm({ farms, initialFarmId, onSubmit, isLoading }) {
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientDiseaseDiagnosisSchema),
    defaultValues: {
      advisory_type: 'disease_diagnosis',
      farm_id: initialFarmId || (farms[0]?.id ?? ''),
      language: 'en',
      crop: '',
      growth_stage: 'vegetative',
      symptoms: ['leaf_spots'],
      symptom_description: '',
      days_since_first_noticed: 3,
      affected_area_percent: 15,
      recent_weather: 'normal',
      recent_sprays: '',
      additional_notes: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({ payload: data, imageFile });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
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
        </div>

        <FormField label="Visible Symptoms (Select 1 to 6)" required error={errors.symptoms?.message}>
          <Controller
            name="symptoms"
            control={control}
            render={({ field }) => (
              <ChipMultiSelect
                options={SYMPTOM_CATEGORIES.map((s) => ({ value: s, label: s.replace(/_/g, ' ').toUpperCase() }))}
                selected={field.value || []}
                onChange={field.onChange}
                minSelections={1}
                maxSelections={6}
              />
            )}
          />
        </FormField>

        <FormField label="Detailed Symptom Description" htmlFor="symptom_description" required error={errors.symptom_description?.message} hint="Describe color changes, spot patterns, stem rotting, or insect appearance.">
          <Textarea
            id="symptom_description"
            placeholder="e.g. Yellow spots on lower leaves with dark brown centers starting 3 days ago after heavy rain..."
            minLength={10}
            maxLength={1000}
            hasError={!!errors.symptom_description}
            {...register('symptom_description')}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <FormField label="Days Since First Noticed" htmlFor="days_since_first_noticed" error={errors.days_since_first_noticed?.message}>
            <Input id="days_since_first_noticed" type="number" min="0" max="365" placeholder="3" {...register('days_since_first_noticed')} />
          </FormField>

          <FormField label="Recent Weather" htmlFor="recent_weather" error={errors.recent_weather?.message}>
            <Select id="recent_weather" {...register('recent_weather')}>
              {RECENT_WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="sm:col-span-2">
            <Controller
              name="affected_area_percent"
              control={control}
              render={({ field }) => (
                <Slider value={field.value} onChange={field.onChange} min={0} max={100} step={5} />
              )}
            />
          </div>
        </div>

        <FormField label="Recent Sprays Applied (Optional)" htmlFor="recent_sprays" error={errors.recent_sprays?.message}>
          <Textarea
            id="recent_sprays"
            placeholder="What fungicides, insecticides, or tonic sprays have you already applied?"
            maxLength={500}
            rows={2}
            {...register('recent_sprays')}
          />
        </FormField>

        <ImageUploader onImageChange={(file) => setImageFile(file)} />

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageSegmented value={field.value} onChange={field.onChange} />
          )}
        />

        <FormField label="Additional Notes" htmlFor="additional_notes" error={errors.additional_notes?.message}>
          <Textarea id="additional_notes" placeholder="Any extra information..." maxLength={1000} rows={2} {...register('additional_notes')} />
        </FormField>

        <Button type="submit" variant="primary" icon={Stethoscope} isLoading={isLoading} className="w-full text-base py-3">
          Diagnose Crop Problem
        </Button>
      </form>

      <GeneratingOverlay isOpen={isLoading} />
    </>
  );
}
