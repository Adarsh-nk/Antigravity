import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientPestManagementSchema } from '../../validators/advisoryInput.js';
import { GROWTH_STAGES, FARMING_PREFERENCES } from '../../config/domain.js';
import { FarmSelect } from '../farms/FarmSelect.jsx';
import { CropPicker } from './CropPicker.jsx';
import { LanguageSegmented } from './LanguageSegmented.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Select } from '../ui/Select.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';
import { Button } from '../ui/Button.jsx';
import { GeneratingOverlay } from './GeneratingOverlay.jsx';
import { Bug } from 'lucide-react';

export function PestManagementForm({ farms, initialFarmId, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientPestManagementSchema),
    defaultValues: {
      advisory_type: 'pest_management',
      farm_id: initialFarmId || (farms[0]?.id ?? ''),
      language: 'en',
      crop: '',
      growth_stage: 'vegetative',
      pest_description: '',
      infestation_severity: 'moderate',
      farming_preference: 'conventional',
      pesticide_sprayer_experience: 'beginner',
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

          <FormField label="Farming Preference" htmlFor="farming_preference" required error={errors.farming_preference?.message}>
            <Select id="farming_preference" hasError={!!errors.farming_preference} {...register('farming_preference')}>
              {FARMING_PREFERENCES.map((f) => (
                <option key={f} value={f}>
                  {f.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Infestation Severity Level" required error={errors.infestation_severity?.message}>
            <Controller
              name="infestation_severity"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  options={[
                    { value: 'mild', label: 'Mild (Few plants)' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'severe', label: 'Severe (Spreading fast)' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Pest Description & Damage Observed" htmlFor="pest_description" required error={errors.pest_description?.message}>
          <Textarea
            id="pest_description"
            placeholder="e.g. Small green caterpillars eating leaves, leaving holes, or white flies sucking sap under leaves..."
            minLength={10}
            maxLength={1000}
            hasError={!!errors.pest_description}
            {...register('pest_description')}
          />
        </FormField>

        <FormField label="Pesticide Sprayer Experience Level" required error={errors.pesticide_sprayer_experience?.message} hint="Safety instructions and PPE detail will be tailored to sprayer experience.">
          <Controller
            name="pesticide_sprayer_experience"
            control={control}
            render={({ field }) => (
              <SegmentedControl
                options={[
                  { value: 'beginner', label: 'Beginner (Detailed PPE step-by-step)' },
                  { value: 'experienced', label: 'Experienced Sprayer' },
                ]}
                value={field.value}
                onChange={field.onChange}
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

        <FormField label="Additional Notes" htmlFor="additional_notes" error={errors.additional_notes?.message}>
          <Textarea id="additional_notes" placeholder="Any extra information..." maxLength={1000} rows={2} {...register('additional_notes')} />
        </FormField>

        <Button type="submit" variant="primary" icon={Bug} isLoading={isLoading} className="w-full text-base py-3">
          Get IPM Pest Control Advice
        </Button>
      </form>

      <GeneratingOverlay isOpen={isLoading} />
    </>
  );
}
